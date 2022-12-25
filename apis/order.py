from mysql.connector import pooling, Error
from flask import request,jsonify,make_response,Blueprint,json
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime


import mysql.connector  
import os
from flask_bcrypt import Bcrypt
import re
bcrypt = Bcrypt()


cnx= mysql.connector.connect()
dbconfig = {'user':os.getenv("MYSQL_USER"), 'password':os.getenv("MYSQL_PW"),'database':os.getenv("MYSQL_DB")}
cnxpool = mysql.connector.pooling.MySQLConnectionPool( pool_name = "mypool",pool_size = 30, pool_reset_session=False,host="127.0.0.1", **dbconfig)
connection = cnxpool.get_connection()
mycursor=connection.cursor()


order = Blueprint("order",__name__, url_prefix='/api')




@order.route("/orders", methods=["POST"])
@jwt_required(locations=["headers"])
def checkout__order():
	user_id = get_jwt_identity()
	today=datetime.now()
	datetime_str = datetime.strftime(today,'%Y-%m-%d %H:%M:%S')
	order_id=int(str(user_id)+datetime_str.replace("-","").replace(":","").replace(" ","")[2:]) 
	prime=request.json.get("prime", None)
	totalPrice=request.json.get("totalPrice", None)
	order=request.json.get("order", None)  
	contact_info= request.json.get("contact", None)
	(contact_name,contact_email,contact_phone)=tuple(contact_info.values())  


	frontend_data_str=""
	for order_data in order:		
		frontend_data_str+=order_data["trip"]["attraction"]["id"]+order_data["trip"]["date"]+order_data["trip"]["time"]

	if user_id :
		connection = cnxpool.get_connection()
		mycursor=connection.cursor()
		
		mycursor.execute("select id,attraction_id,booking_date,booking_time,price from bookings  where user_id=%(user_id)s and  payment=0 ",{"user_id":user_id}) 
		search_result=mycursor.fetchall()
		total_price=0
		backend_data_str=""
		for booking in search_result:
			( _,attraction_id,booking_date,booking_time,price)=booking
			total_price+=int(price)
			backend_data_str+=str(attraction_id)+booking_date+booking_time

		if( frontend_data_str ==backend_data_str and total_price==int(totalPrice)):
			try:
				mycursor.execute("update bookings set payment=%(order_id)s  where user_id=%(user_id)s and  payment=0 ",{"user_id":user_id, "order_id":order_id}) 
				connection.commit()
				mycursor.execute("insert into orderInfos(id, name,email,phone,total_price) values(%(order_id)s,%(contact_name)s,%(contact_email)s,%(contact_phone)s,%(total_price)s)",{"order_id":order_id, "contact_name":contact_name,"contact_email":contact_email,"contact_phone":contact_phone,"total_price":total_price}) 
				connection.commit()
				url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
				headers = {"x-api-key": os.getenv("TAPPAY_PARENT_KEY"), "Content-Type": "application/json"}
				order_info_dict={"prime": prime,"partner_key":os.getenv("TAPPAY_PARENT_KEY") ,"merchant_id": "yangun410_TAISHIN","details":"台北一日遊","amount": total_price,"cardholder": {"phone_number": contact_phone,"name":contact_name,"email": contact_email,"zip_code": "","address": "","national_id": ""},"remember": True}
				order_info_dict = json.dumps(order_info_dict) 
				order_info_dict = order_info_dict.encode("utf-8")
				r = requests.post(url, headers=headers, data= order_info_dict)
				# print(r.text)
				status=json.loads(r.text)["status"]
				if status==0 :
					try:
						mycursor.execute("update orderInfos set status='付款成功'  where id=%(order_id)s  ",{"user_id":user_id, "order_id":order_id}) 
						connection.commit()
						data={"number":order_id,"payment":{"status":status,"message":"付款成功"}}
						result={"data": data}
						return result,200

					except Error as e:
						print(e)
						result={"error":True,"message":"500 Internal Server Error"}  
						return result,500
				else:
					result={"error":json.loads(r.text)["msg"]}  
					return result,400
			except Error as e:
				print(e)
				result={"error":True,"message":"500 Internal Server Error"}  
				return result,500
			finally:
				mycursor.close()
				connection.close()
		else:
			result={"error":"請勿竄改資料"}  
			return result,400

			
	else:
		result={"error":True,"message":"403 Forbidden"}  
		return result,403	

@order.route("/order/<number>")
@jwt_required(locations=["headers"])
def get_order_info(number):
	order_id=number
	user_id = get_jwt_identity()
	result={}
	print(user_id)
	if user_id :
		connection = cnxpool.get_connection()
		mycursor=connection.cursor()
		try:
			mycursor.execute("select bookings.price, attractions.id,attractions.name,attractions.address,attractions.images,bookings.booking_date,bookings.booking_time,orderInfos.name,orderInfos.email,orderInfos.phone,orderInfos.status from bookings inner join  orderInfos on bookings.payment=orderInfos.id inner join  attractions on bookings.attraction_id=attractions.id where orderInfos.id=%(order_id)s  and bookings.user_id=%(user_id)s    " , {"user_id":user_id,"order_id":order_id })
			search_result=mycursor.fetchall()
			if(search_result):
				data={"number":order_id}
				attraction_list=[]
				contact={}
				for booking in search_result:
					attraction={}
					(booking_price,attraction_id,attraction_name,attraction_address,images,booking_date,booking_time,contact_name,contact_email,contact_phone,status)=booking
					attraction_image=images.split(",")[:-1][0]
					attraction.update({"id":attraction_id,"name":attraction_name, "address":attraction_address,"image":attraction_image})
					booking={"trip":{"attraction":attraction},"date":booking_date,"time":booking_time,"price":booking_price} 
					contact.update({"name":contact_name,"email":contact_email,"phone":contact_phone})
					attraction_list.append(booking)
					if status=="付款成功":
						status_code=1
					else:
						status_code=-1
				data.update({"orderList":attraction_list})
				data.update({"contact": contact})
				data.update({"status":status_code}) 
				result={"data":data}
				print(status,status_code,result)
				return result,200
			else:
				result={"data":None}
				print(result)  	
				return result,200
		
		except Error as e:
			print(e)
			result={"error":True,"message":"500 Internal Server Error"}  
			return result,500
		finally:
			mycursor.close()
			connection.close()
	
	else:
		result={"error":True,"message":"403 Forbidden"}  
		return result,403
from mysql.connector import pooling, Error
from flask import request,jsonify,make_response,Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector  
import os
from flask_bcrypt import Bcrypt
import re
from datetime import datetime
bcrypt = Bcrypt()


cnx= mysql.connector.connect()
dbconfig = {'user':os.getenv("MYSQL_USER"), 'password':os.getenv("MYSQL_PW"),'database':os.getenv("MYSQL_DB")}
cnxpool = mysql.connector.pooling.MySQLConnectionPool( pool_name = "mypool",pool_size = 30, pool_reset_session=False,host="127.0.0.1", **dbconfig)
connection = cnxpool.get_connection()
mycursor=connection.cursor()


booking = Blueprint("booking",__name__, url_prefix='/api/booking')


@booking.route("/")
@jwt_required(locations=["headers"])

def get_booking_info():
	user_id = get_jwt_identity()
	result={}
	
	if user_id :
		connection = cnxpool.get_connection()
		mycursor=connection.cursor()
		try:
			mycursor.execute("select attractions.id,name,address,images,booking_date,booking_time,price,bookings.id from bookings inner join attractions on bookings.attraction_id = attractions.id where user_id=%(user_id)s and payment=0", {"user_id":user_id}) 
			search_result=mycursor.fetchall()
			if(search_result):
				data=[]
				for booking in search_result:
					attraction={}
					attraction_id=booking[0]
					attraction_name=booking[1]
					attraction_address=booking[2]
					attraction_image=booking[3].split(",")[:-1][0]
					attraction.update({"id":attraction_id,"name":attraction_name, "address":attraction_address,"image":attraction_image})
					booking={"bookingId":booking[-1],"attraction":attraction,"date":booking[-4],"time":booking[-3],"price":booking[-2]}  
					data.append(booking)			
				result.update({"data":data})
				return result,200
			else:
				result={"data":None}  
				
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


@booking.route("/", methods=["POST"])
@jwt_required(locations=["headers"])
def create_booking():
	user_id = get_jwt_identity()
	attraction_id= request.json.get("id", None)
	booking_date = request.json.get("bookingDate", None)
	booking_time = request.json.get("bookingTime", None)
	booking_price = request.json.get("price", None)
	current_time=datetime.now()
	ond_day_per_sec=60*60*24
	booking_datetime=booking_date.split("-")
	bookingdate_check=(datetime(int(booking_datetime[0]),int(booking_datetime[1]),int(booking_datetime[2])) - current_time).total_seconds()

	if user_id and bookingdate_check > ond_day_per_sec  :
		connection = cnxpool.get_connection()
		mycursor=connection.cursor()
		try:

			mycursor.execute("insert into bookings(user_id, attraction_id,booking_date,booking_time,price) values(%(user_id)s,%(attraction_id)s,%(booking_date)s,%(booking_time)s,%(booking_price)s)" ,{"user_id":user_id,"attraction_id":attraction_id,"booking_date":booking_date,"booking_time":booking_time,"booking_price":booking_price })
			result= make_response(jsonify({"ok":True}),200)
			connection.commit()
			print(user_id,3)
			return result
		
		except Error as e:
			print(e)
			result={"error":True,"message":"500 Internal Server Error"}  
			return result,500
		finally:
			mycursor.close()
			connection.close()
	elif  bookingdate_check > ond_day_per_sec:
		result={"error":True,"message":"403 Forbidden"}  
		return result,403
	else:
		result={"error":True,"message":"400 Your booking date doesn't make sense. "}  
		return result,400



@booking.route("/", methods=["DELETE"])
@jwt_required(locations=["headers"])
def cancel_booking():
	user_id = get_jwt_identity()
	booking_id=request.json.get("bookingId", None)
	if user_id:
		connection = cnxpool.get_connection()
		mycursor=connection.cursor()
		mycursor.execute("select  from bookings where user_id=%(user_id)s and payment=0 ", {"user_id":user_id}) 
		try:

			mycursor.execute("delete from bookings where id=%(booking_id)s and payment=0 ",{"booking_id":booking_id,}) 
			print(booking_id)
			connection.commit()
			result={"ok":True}  
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
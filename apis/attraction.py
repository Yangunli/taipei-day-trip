from flask import Blueprint,request,jsonify
from mysql.connector import pooling, Error
import mysql.connector  
import os

attraction = Blueprint("attraction",__name__, url_prefix='/api')

cnx= mysql.connector.connect()
dbconfig = {'user':os.getenv("MYSQL_USER"), 'password':os.getenv("MYSQL_PW"),'database':os.getenv("MYSQL_DB")}
cnxpool = mysql.connector.pooling.MySQLConnectionPool( pool_name = "mypool",pool_size = 30, host="0.0.0.0", **dbconfig)
connection = cnxpool.get_connection()
mycursor=connection.cursor()


@attraction.route("/attractions")
def get_attraction_by_KW():
	data=[]
	current_page=request.args.get("page",0)
	next_page=int(current_page)+1
	offset=int(current_page) * 12
	keyword=request.args.get("keyword","")
	like_keyword=f'%{keyword}%'

	
	connection = cnxpool.get_connection()
	mycursor=connection.cursor()
	try:
		
		mycursor.execute("select attractions.id, name, category, description, address, transport, mrt , lat, lng , images  from categories  inner join  attractions on attractions.category_id = categories.id where category=%(keyword)s or name like %(like_keyword)s  order by attractions.id   limit 13 offset %(offset)s  ", {"keyword":keyword, "offset":offset, "like_keyword":like_keyword}) 
		search_result=mycursor.fetchall()

		if(search_result):
			count=0
			for attraction in search_result:
				(id, name, category, description, address, transport, mrt , lat, lng , images_list)=attraction
				images=images_list.split(",")[:-1]
				result={"id": id,"name":name,"category": category,"description": description,
				"address": address,"transport":transport,"mrt":mrt,"lat": lat,"lng":lng,
				"images": images}
				data.append(result)
				count=count+1
			if count<13:
				return jsonify({"nextPage": None,"data":data}),200
			else:	
				data.pop()
				return jsonify({"nextPage": next_page,"data":data}),200
		else:
			result={"error":True,"message":"Data Not Found"}  
			
			return result,404
	except Error as e:
		print(e)
		result={"error":True,"message":"500 Internal Server Error"}  
		return result,500 
	finally:
		mycursor.close()
		connection.close()

@attraction.route("/attraction/<attractionId>")
def getattractionId(attractionId):
	id=attractionId
	result={}
	connection = cnxpool.get_connection()
	mycursor=connection.cursor()
	try:

		mycursor.execute("select attractions.id, name, category, description, address, transport, mrt , lat, lng , images  from categories  inner join  attractions on attractions.category_id = categories.id  where attractions.id=%(id)s", {"id":id}) 
		attraction= mycursor.fetchone() 
		if(attraction != None):
			images=attraction[-1].split(",")[:-1]
			
			data={
				"id": attraction[0],"name":attraction[1],"category": attraction[2],"description": attraction[3],
				"address": attraction[4],"transport": attraction[5],"mrt":attraction[-4],"lat": attraction[-3],"lng":attraction[-2],
				"images": images
			}
			result.update({"data": data}) 
			return result,200
		else:
			result={"data":"error","message":"Search Not Found"}  
			return result,404

	except Error as e:
		print(e)
		result={"error":True,"message":"與資料庫失聯"}  
		return result
	finally:
		mycursor.close()
		connection.close()
		

@attraction.route("/categories")
def categorise():
	connection = cnxpool.get_connection()
	mycursor=connection.cursor()
	try:

		data=[]
		mycursor.execute("select category from categories")
		result=mycursor.fetchall()
		for item in result:
			str = ''.join(item)
			data.append(str)
		return jsonify({"data":data}) 
	except Error as e:
		print(e)
		result={"error":True,"message":"500 Internal Server Error"}  
		return result,500
	finally:
		mycursor.close()
		connection.close()
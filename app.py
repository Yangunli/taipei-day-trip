from mysql.connector import pooling, Error
import mysql.connector  


from flask import Flask, render_template,request,jsonify


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"]=False



app.config["SECRET_KEY"]="eaf266f88f72894c90"


cnxpool = mysql.connector.pooling.MySQLConnectionPool( pool_name = "mypool",pool_size = 30, pool_reset_session=False ,user='root', password='thu982305',database='tpe_attraction',host="127.0.0.1")
connection = cnxpool.get_connection()
mycursor=connection.cursor()



# Pages
@app.route("/")
def index():
	return render_template("index.html")

@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")

@app.route("/booking")
def booking():
	return render_template("booking.html")

@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")



# APIs

@app.route("/api/attractions")
def getattractionByKW():
	data=[]
	current_page=request.args.get("page",0)
	next_page=int(current_page)+1
	offset=int(current_page) * 12
	keyword=request.args.get("keyword","")
	like_keyword=f'%{keyword}%'

	
	
	try:
		connection = cnxpool.get_connection()
		mycursor=connection.cursor()
		mycursor.execute("select attractions.id, name, category, description, address, transport, mrt , lat, lng , images  from categories  inner join  attractions on attractions.category_id = categories.id where category=%(keyword)s or name like %(like_keyword)s  order by attractions.id   limit 13 offset %(offset)s  ", {"keyword":keyword, "offset":offset, "like_keyword":like_keyword}) 
		search_result=mycursor.fetchall()

		if(search_result):
			count=0
			# print(type(search_result))
			for attraction in search_result:
				images=attraction[-1].split(",")[:-1]
				result={"id": attraction[0],"name":attraction[1],"category": attraction[2],"description": attraction[3],
				"address": attraction[4],"transport": attraction[5],"mrt":attraction[-4],"lat": attraction[-3],"lng":attraction[-2],
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

@app.route("/api/attraction/<attractionId>")
def getattractionId(attractionId):
	id=attractionId
	result={}
	try:
		connection = cnxpool.get_connection()
		mycursor=connection.cursor()
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
			result={"data":"erroe","message":"Search Not Found"}  
			return result,404

	except Error as e:
		print(e)
		result={"error":True,"message":"與資料庫失聯"}  
		return result
	finally:
		mycursor.close()
		connection.close()
		

@app.route("/api/categories")
def categorise():
	
	try:
		connection = cnxpool.get_connection()
		mycursor=connection.cursor()
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

		
if __name__ == "__main__":
    app.run(port=3000)


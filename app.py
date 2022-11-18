from mysql.connector import pooling
import mysql.connector 

from flask import Flask, render_template,request,jsonify


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"]=False



app.config["SECRET_KEY"]="eaf266f88f72894c90"

cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",pool_size = 30, pool_reset_session=True ,user='root', password='thu982305',database='tpe_travel',host="0.0.0.0/0")
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





@app.route("/api/attractions")
def getattractionByKW():
	data=[]
	current_page=request.args.get("page",0)
	next_page=int(current_page)+1
	offset=int(current_page) * 12
	keyword=request.args.get("keyword")
	like_keyword=f'%{keyword}%'

	
	
	try:
		mycursor.execute("select attractions.id, name, category, description, address, transport, mrt , lat, lng , images  from categories  inner join  attractions on attractions.category_id = categories.id where category=%(keyword)s or name like %(like_keyword)s  order by attractions.id   limit 12 offset %(offset)s  ", {"keyword":keyword, "offset":offset, "like_keyword":like_keyword}) 
		search_result=mycursor.fetchall()
		if(search_result):
			count=0
			for attraction in search_result:
				images=attraction[-1].split(",")[:-1]
				result={"id": attraction[0],"name":attraction[1],"category": attraction[2],"description": attraction[3],
				"address": attraction[4],"transport": attraction[5],"mrt":attraction[-4],"lat": attraction[-3],"lng":attraction[-2],
				"images": images}
				data.append(result)
				count=count+1
			if count<12:
				return jsonify({"nextPage": None,"data":data}),200
			else:	
				return jsonify({"nextPage": next_page,"data":data}),200
		else:

			result={"error":True,"message":"Data Not Found"}  
			
			return result,404
	except:
		result={"error":True,"message":"500 Internal Server Error"}  
		return result,500 
	# finally:
	# 	mycursor.close()

@app.route("/api/attraction/<attractionId>")
def getattractionId(attractionId):
	id=attractionId
	result={}
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
			result={"data":"erroe","message":"Search Not Found"}  
			return result,404

	except:
		result={"error":True,"message":"與資料庫失聯"}  
		return result

@app.route("/api/categories")
def categorise():
	# data=["公共藝術","其　　他","單車行蹤","宗教信仰","戶外踏青","春季活動","歷史建築","藍色公路","藝文館所","親子共遊","養生溫泉"]
	# try:
		# data=[]
		
		data=["公共藝術","其　　他","單車行蹤","宗教信仰","戶外踏青","春季活動","歷史建築","藍色公路","藝文館所","親子共遊","養生溫泉"]
		if(data):
			return jsonify({"data":data}) 
		else:
			result={"error":True,"message":"500 Internal Server Error"}  
			return result,500
				

	# 	mycursor.execute("select category from categories")
	# 	result=mycursor.fetchall()
	# 	for item in result:
	# 		str = ''.join(item)
	# 		data.append(str)
	# 	return jsonify({"data":data}) 
	# except:
	# 	result={"error":True,"message":"500 Internal Server Error"}  
	# 	return result,500
if __name__ == "__main__":
    app.run(port=3000,debug=True,host="0.0.0.0")


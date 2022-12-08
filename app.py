from mysql.connector import pooling, Error
import mysql.connector  
from flask import Flask, render_template,request,jsonify,make_response
from flask_jwt_extended import create_access_token, jwt_required,JWTManager, get_jwt_identity,create_refresh_token
from datetime import timedelta
from flask_bcrypt import Bcrypt
import re


app=Flask(__name__)
bcrypt = Bcrypt()
jwt = JWTManager(app)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"]=False
app.config["SECRET_KEY"]="eaf266f88f72894c90"
app.config["JWT_SECRET_KEY"] = "c099522c9feebd8d456f801fe8ba47065a3edd925cff28a5398a7adf07cc13e7" 
app.config["JWT_COOKIE_SECURE"] = False
app.config['PROPAGATE_EXCEPTIONS'] = True  
app.config['JWT_TOKEN_LOCATION'] = ["headers", "cookies"]
app.config['JWT_BLACKLIST_ENABLED'] = True #黑名單管理
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']  #允许将access and refresh tokens加入黑名单
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7) 

cnx= mysql.connector.connect()
cnxpool = mysql.connector.pooling.MySQLConnectionPool( pool_name = "mypool",pool_size = 30, pool_reset_session=False ,user='root', password='thu982305',database='tpe_attraction',host="0.0.0.0")
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
			result={"data":"error","message":"Search Not Found"}  
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


@app.route("/api/user" , methods=["POST"])
def register():
	name= request.json.get("name", None)
	email = request.json.get("email", None)
	password = request.json.get("password", None)
	name_regex =  re.search(r'^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·|\‧|\．)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·\．\．)*$|^[a-zA-Z\s]+$', name)
	email_regex = re.search(r'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$', email)
	password_regex = re.search(r'^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}', password)
	hashed_password=bcrypt.generate_password_hash(password=password)
	if name_regex and email_regex and password_regex:
		try:
			connection = cnxpool.get_connection()
			mycursor=connection.cursor()
			mycursor.execute("insert into member(name,email,password) values(%(name)s,%(email)s,%(hashed_password)s)", {"name":name, "email":email, "hashed_password":hashed_password}) 
			result= make_response(jsonify({"ok":True}),200)
			connection.commit()
			return result
			
		except Error as e:
			print(e)
			result={"error":True,"message":"此信箱已被註冊"}  
			return result,400
		finally:
			mycursor.close()
			connection.close()
	else:
		result={"error":True,"message":"500 Internal Server Error"}  
		return result,500



@app.route("/api/user/auth" , methods=["GET"])
@jwt_required(locations=["headers"])
def member():	
	current_user = get_jwt_identity()
	result = {}
	try:
		connection = cnxpool.get_connection()
		mycursor=connection.cursor()
		mycursor.execute("select id, name ,email from member where id =%(current_user)s", {"current_user":current_user}) 
		user=mycursor.fetchone()
		data={"id":user[0],"name":user[1],"email":user[2]}
		result.update({"data": data}) 
		return result, 200
	except Error as e:
		print(e)
	finally:
		mycursor.close()
		connection.close()
	


	
# 登入成功，使用 JWT 加密資訊並存放到 Cookie 中，保存七天,200
# 登入失敗，帳號或密碼錯誤或其他原因,440
# 伺服器內部錯誤,500

@app.route("/api/user/auth" , methods=["PUT"])
def login():
	email = request.json.get("email", None)
	password = request.json.get("password", None)
	email_regex = re.search(r'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$', email)
	password_regex = re.search(r'^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}', password)
	if email_regex and password_regex:
		try:
			connection = cnxpool.get_connection()
			mycursor=connection.cursor()
			mycursor.execute("select id, password from member where email=%(email)s ",{"email":email,}) 
			search_result=mycursor.fetchone()
			id=search_result[0]
			token = {
				 'Authorization': f'Bearer ${create_access_token(identity=id)}',
				# 'refresh_token': create_refresh_token(identity=id)
				}
			
			check_password = bcrypt.check_password_hash(search_result[1],password)
			if(check_password):
				result= {"ok":True}
				return result,200,token
			else:
				result={"data":"error","message":"Wrong email or password"}  
				return result,400
		except Error as e:
			print(e)
			result={"error":True,"message":"500 Internal Server Error"}  
			return result,500
		finally:
			mycursor.close()
			connection.close()




	
# 登出成功，從 Cookie 中移除 JWT 加密資訊
@app.route("/api/user/auth" , methods=["DELETE"])
def logout():
	res = make_response(jsonify({"ok":True}),200)
	res.set_cookie('authorization', '', expires=0) 
	return res

if __name__ == "__main__":
    app.run(port=3000,host="0.0.0.0")


from mysql.connector import pooling, Error
from flask import request,jsonify,make_response,Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
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


auth = Blueprint("auth",__name__, url_prefix='/api/user')



@auth.route("/" , methods=["POST"])
def user_register():
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



@auth.route("/auth" , methods=["GET"])
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

@auth.route("/auth" , methods=["PUT"])
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
@auth.route("/auth" , methods=["DELETE"])
def logout():
	res = make_response(jsonify({"ok":True}),200)
	res.set_cookie('authorization', '', expires=0) 
	return res

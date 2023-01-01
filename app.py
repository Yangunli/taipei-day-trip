from mysql.connector import pooling, Error
import mysql.connector  
from flask import Flask, render_template,request,jsonify,make_response,Blueprint
from flask_jwt_extended import create_access_token, jwt_required,JWTManager, get_jwt_identity,create_refresh_token
from datetime import timedelta
import os
from dotenv import load_dotenv
load_dotenv()
app=Flask(__name__,instance_relative_config=True)
jwt = JWTManager(app)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"]=False
app.config["SECRET_KEY"]=os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_COOKIE_SECURE"] = False
app.config['PROPAGATE_EXCEPTIONS'] = True  
app.config['JWT_TOKEN_LOCATION'] = ["headers", "cookies"]
app.config['JWT_BLACKLIST_ENABLED'] = True #黑名單管理
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']  #允许将access and refresh tokens加入黑名单
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7) 



from views.view import view
from apis.attraction import attraction
from apis.auth import auth
from apis.booking import booking
from apis.order import order

app.register_blueprint(view)
app.register_blueprint(attraction)
app.register_blueprint(auth)
app.register_blueprint(booking)
app.register_blueprint(order)


if __name__ == "__main__":
    app.run(port=3000, host="0.0.0.0")


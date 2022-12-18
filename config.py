import os
from datetime import timedelta

class Config:
    JSON_AS_ASCII=False
    TEMPLATES_AUTO_RELOAD=True
    JSON_SORT_KEYS=False
    SECRET_KEY=os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_COOKIE_SECURE = False
    PROPAGATE_EXCEPTIONS = True  
    JWT_TOKEN_LOCATION= ["headers", "cookies"]
    JWT_BLACKLIST_ENABLED = True #黑名單管理
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']  #允许将access and refresh tokens加入黑名单
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7) 
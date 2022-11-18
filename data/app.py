import json
import mysql.connector 

mydb = mysql.connector.connect(user='root', password='thu982305',database='tpe_travel',host="127.0.0.1")
mycursor = mydb.cursor(buffered=True)




# data=["公共藝術","其　　他","單車行蹤","宗教信仰","戶外踏青","春季活動","歷史建築","藍色公路","藝文館所","親子共遊","養生溫泉"]
# for id, category in enumerate(data):
#     category_id=id+1
    
#     try:
#         mycursor.execute("insert into categories(id,category) values(%(category_id)s, %(category)s)", {"category_id":category_id, "category":category}) 
#         mydb.commit()
#         print("ok")
#     except:
#         print(category_id)


with open('taipei-attractions.json',"r", encoding="utf-8") as file:
    data = json.load(file)
    

for index, infos in data.items():
    cat=[]
    attractions=infos["results"]
    for attraction in attractions:
    
        if (attraction["MRT"]): 
            mrt=attraction["MRT"]
        else: mrt="無"

        # 把82改成24，使id可以連續下去
        if (attraction["_id"] ==82):
            id=24
        else:
            id=attraction["_id"] 

        name=attraction["name"] 
        
        if (attraction["CAT"]=="其\u3000\u3000他"):
            category_id="2"
        elif(attraction["CAT"]=="公共藝術"):
            category_id="1"
        elif(attraction["CAT"]=="單車行蹤"):
            category_id="3"
        elif(attraction["CAT"]=="宗教信仰"):
            category_id="4"
        elif(attraction["CAT"]=="戶外踏青"):
            category_id="5"
        elif(attraction["CAT"]=="春季活動"):
            category_id="6"
        elif(attraction["CAT"]=="歷史建築"):
            category_id="7"
        elif(attraction["CAT"]=="藍色公路"):
            category_id="8"
        elif(attraction["CAT"]=="藝文館所"):
            category_id="9"
        elif(attraction["CAT"]=="親子共遊"):
            category_id="10"
        elif(attraction["CAT"]=="養生溫泉"):
            category_id="11"
        

        description=attraction["description"]

        # 去除多餘的空白
        address=attraction["address"].split(" ")
        address=address[0]+address[-1]

        # 比較明顯的輸入問題
        transport=attraction["direction"]
        transport=transport.replace("&nbsp"," ")
        transport=transport.replace("捷運站名","捷運")
        
        lat=attraction["latitude"]
        lng=attraction["longitude"]
        
        
        file=attraction["file"].lower().split("htt")
        images=""
        
        for url in file:
            if(url.split(".")[-1]=="jpg" or url.split(".")[-1]=="png"):
                picurl="htt"+url
                images = images+picurl+","

    
        try:
            mycursor.execute("insert into attractions(id, name, category_id, description, address, transport, mrt , lat, lng , images) values(%(id)s,%(name)s,%(category_id)s,%(description)s,%(address)s,%(transport)s,%(mrt)s,%(lat)s,%(lng)s,%(images)s)", {"id":id, "name":name, "category_id":category_id, "description":description, "address":address, "transport":transport, "mrt":mrt , "lat":lat,"lng": lng , "images":images})
            mydb.commit()
        except : 
            print(name)
        

   





        



       

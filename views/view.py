from flask import Flask, Blueprint,render_template

view = Blueprint('view', __name__)

# Pages
@view.route("/")
def index():
	return render_template("index.html")

@view.route("/attraction/<id>")
def api(id):
	return render_template("attraction.html")

@view.route("/booking")
def booking():
	return render_template("booking.html")

@view.route("/thankyou/<order_id>")
def thankyou(order_id):
	return render_template("thankyou.html")
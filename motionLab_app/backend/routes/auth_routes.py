from flask import Blueprint, request
from controllers.user_controller import UserController

# Create a Blueprint for user routes
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login_route():
    return UserController.login(request)

@auth_bp.route("/signup", methods=["POST"])
def signup_route():
    return UserController.sign_up(request)
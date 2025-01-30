from flask import Blueprint, request
from controllers.user_controller import UserController

# Create a Blueprint for user routes
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login_route():
    # Parse JSON data from the request
    data = request.get_json()

    return UserController.authenticate_user(data)

@auth_bp.route("/signup", methods=["POST"])
def signup_route():
    # Parse JSON data from the request
    data = request.get_json()

    return UserController.create_user(data)
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

@auth_bp.route("/request-password-reset", methods=["POST"])
def send_password_reset_route():
    return UserController.send_password_reset_email(request)

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password_route():
    return UserController.reset_password(request)

@auth_bp.route("/send-verification-email", methods=["POST"])
def send_verification_email_route():
    return UserController.send_verification_email(request)

@auth_bp.route("/verify-email", methods=["POST"])
def verify_email_route():
    return UserController.verify_email(request)
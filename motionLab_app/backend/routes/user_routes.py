from flask import Blueprint

# Create a Blueprint for user routes
user_bp = Blueprint("user", __name__)

@user_bp.route("/")
def user_dashboard():
    return "Welcome to the User Dashboard!"

@user_bp.route("/settings")
def user_settings():
    return "User Settings Page"
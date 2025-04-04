from functools import wraps
from flask import request, jsonify
from services.user_service import UserService
from models.user_model import User
import jwt
import os

# Secret key for JWT, should be in environment variables in production
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "development_secret_key")


def get_token_from_request():
    """Extract the JWT token from the Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    return auth_header.split(' ')[1]


def decode_token(token):
    """Decode the JWT token and return the user_id"""
    try:
        decoded = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return decoded.get('user_id')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def requires_auth(f):
    """Decorator to check if the user is authenticated"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({"success": False, "message": "Authentication required"}), 401

        user_id = decode_token(token)
        if not user_id:
            return jsonify({"success": False, "message": "Invalid or expired token"}), 401

        # Check if user exists
        if not UserService.does_user_exist_by_id(user_id):
            return jsonify({"success": False, "message": "User not found"}), 401

        # Add user_id to kwargs so the route can use it
        kwargs['user_id'] = user_id
        return f(*args, **kwargs)

    return decorated


def requires_admin(f):
    """Decorator to check if the user is an admin"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({"success": False, "message": "Authentication required"}), 401

        user_id = decode_token(token)
        if not user_id:
            return jsonify({"success": False, "message": "Invalid or expired token"}), 401

        # Get the user and check if they're an admin
        user = User.get_by_id(user_id)
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 401

        if not user.is_admin:
            return jsonify({"success": False, "message": "Admin access required"}), 403

        # Add user_id to kwargs so the route can use it
        kwargs['user_id'] = user_id
        return f(*args, **kwargs)

    return decorated

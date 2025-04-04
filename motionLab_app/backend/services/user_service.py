from models.user_model import User
from validators.user_validator import UserValidator
import jwt
import os
import datetime

# Secret key for JWT, should be in environment variables in production
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "development_secret_key")
JWT_EXPIRATION = 604800  # 7 days in seconds


class UserService:

    @staticmethod
    def create_user(data):
        errors = UserValidator.validate_signup(data)
        if errors:
            return None, errors

        first_name = data["firstName"]
        last_name = data["lastName"]
        email = data["email"]
        password = data["password"]

        if User.get_by_email(email):
            return None, {"email": "Email already in use"}

        # Explicitly set is_admin to False for regular user sign-ups
        user = User.create(first_name, last_name, email,
                           password, is_admin=False)
        if user:
            user_data = user.to_dict()
            # Generate token for the new user
            token = UserService.generate_auth_token(user.id)
            user_data["token"] = token
            return user_data, None

        return None, {"message": "Error creating user"}

    @staticmethod
    def authenticate_user(data):
        errors = UserValidator.validate_login(data)
        if errors:
            return None, errors

        email = data["email"]
        password = data["password"]

        user = User.get_by_email(email)
        if user and user.check_password(password):
            user_data = user.to_dict()
            # Generate token on successful authentication
            token = UserService.generate_auth_token(user.id)
            user_data["token"] = token
            return user_data, None

        return None, {"message": "Invalid credentials"}

    @staticmethod
    def generate_auth_token(user_id):
        """Generate a JWT token for the user"""
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXPIRATION),
                'iat': datetime.datetime.utcnow(),
                'user_id': user_id
            }
            return jwt.encode(
                payload,
                JWT_SECRET_KEY,
                algorithm='HS256'
            )
        except Exception as e:
            print(f"Error generating token: {e}")
            return None

    @staticmethod
    def does_user_exist_by_id(user_id):
        return User.get_by_id(user_id) is not None

    # @staticmethod
    # def get_user_by_id(user_id):
    #     return User.get_by_id(user_id)

    # @staticmethod
    # def get_user_by_email(email):
    #     return User.get_by_email(email)

    # @staticmethod
    # def get_all_users():
    #     return User.query.all()

    # @staticmethod
    # def update_user(user_id, updated_data):
    #     user = User.get_by_id(user_id)
    #     if not user:
    #         return None

    #     if "email" in updated_data and User.get_by_email(updated_data["email"]):
    #         return {"error": "Email already in use"}, 400

    #     user.update(updated_data)
    #     return user

    # @staticmethod
    # def delete_user(user_id):
    #     user = User.get_by_id(user_id)
    #     if not user:
    #         return False

    #     user.delete()
    #     return True

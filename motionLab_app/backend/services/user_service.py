from models.user_model import User
from validators.user_validator import UserValidator
from flask_mail import Message

from extensions import mail, serializer

import os

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
        
        user = User.create(first_name, last_name, email, password)
        if user:
            return user.to_dict(), None
        
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
            return user.to_dict(), None
        
        return None, {"message": "Invalid credentials"}
    
    @staticmethod
    def does_user_exist_by_id(user_id):
        return User.get_by_id(user_id) is not None
    
    @staticmethod
    def does_user_exist_by_email(email):
        return User.get_by_email(email) is not None
    
    @staticmethod
    def send_password_reset_email(data):
        errors = UserValidator.validate_password_reset(data)
        if errors:
            return errors

        email = data["email"]
        user = User.get_by_email(email)
        if not user:
            return {"message": "User not found"}

        # Generate a secure token for password reset
        token = serializer.dumps(email, salt="password-reset-salt")
        
        reset_url = os.getenv("FRONTEND_URL", "http://localhost:3000") + f"/reset-password?token={token}"

        print(f"Password reset URL: {reset_url}")

        # Compose the email message
        msg = Message("MotionLab Password Reset Request", recipients=[email])
        msg.body = f"""Hi {user.first_name},

To reset your password, visit the following link:
{reset_url}

If you did not make this request then simply ignore this email.
"""
        try:
            mail.send(msg)
            print("Password reset email sent successfully.")
        except Exception as e:
            return {"message": "Failed to send password reset email."}

        return None  # No errors, email sent successfully

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
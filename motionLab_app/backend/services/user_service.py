from models.user_model import User
from validators.user_validator import UserValidator
from extensions import mail, serializer

import jwt
import os
import datetime

from flask_mail import Message
import os


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
    
    @staticmethod
    def does_user_exist_by_email(email):
        return User.get_by_email(email) is not None
    
    @staticmethod
    def check_user_verification(user_id):
        user = User.get_by_id(user_id)
        if not user:
            return {"message": "User not found"}
        
        if not user.is_email_verified:
            return {"message": "User email not verified"}
        
        return None
    
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
    
    @staticmethod
    def reset_password(data):
        errors = UserValidator.validate_reset_password(data)
        if errors:
            return errors
        
        token = data["token"]
        
        try:
            email = serializer.loads(token, salt="password-reset-salt", max_age=3600)
        except Exception as e:
            return {"message": "Invalid or expired token"}
        
        user = User.get_by_email(email)
        if not user:
            return {"message": "User not found"}
        
        data["password"] = data["newPassword"]
        user.update(data)
        
        return None
    
    @staticmethod
    def send_verification_email(email):
        # Generate a secure token for email verification
        token = serializer.dumps(email, salt="email-verification-salt")
    
        verification_url = os.getenv("FRONTEND_URL", "http://localhost:3000") + f"/verify-email?token={token}"

        if (not os.getenv("MAIL_USERNAME") or not os.getenv("MAIL_PASSWORD")):
            print("Mail server not configured: No username or password found in environment variables.")
            return {"message": "Mail server not configured"}

        # Compose the email message
        msg = Message("MotionLab Email Verification", recipients=[email])
        msg.body = f"""Hi,
To verify your email address, visit the following link:
{verification_url}

If you did not make this request then simply ignore this email.
"""
        try:
            mail.send(msg)
            print("Email verification sent successfully.")
        except Exception as e:
            return {"message": "Failed to send email verification."}
        
        return None
    
    @staticmethod
    def verify_email(token):
        try:
            email = serializer.loads(token, salt="email-verification-salt", max_age=3600)
        except Exception as e:
            return {"message": "Invalid or expired token"}
        
        user = User.get_by_email(email)
        if not user:
            return {"message": "User not found"}
        
        user.update({"is_email_verified": True})
        
        return None
    
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

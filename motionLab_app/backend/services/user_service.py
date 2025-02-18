from models.user_model import User
from validators.user_validator import UserValidator

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
        
        return None, {"errors": "Error creating user"}
    
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
        
        return None, {"error": "Invalid credentials"}
    
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
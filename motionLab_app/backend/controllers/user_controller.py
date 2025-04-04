from services import UserService

class UserController:
    
    @staticmethod
    def sign_up(request):
        data = request.get_json()
        user, errors = UserService.create_user(data)
        
        if errors:
            return {"success": False, "errors": errors}, 400
        
        UserService.send_verification_email(user["email"])
        
        return {"success": True, "data": user}, 201
    
    
    
    @staticmethod
    def login(request):
        data = request.get_json()
        user, errors = UserService.authenticate_user(data)
        
        if errors:
            if "message" in errors:
                return {"success": False, "message": f"{errors['message']}"}, 400
            return {"success": False, "errors": errors}, 400
        
        return {"success": True, "data": user}, 200
    
    @staticmethod
    def send_verification_email(request):
        data = request.get_json()
        email = data.get("email")
        
        if not email:
            return {"success": False, "message": "Email is required."}, 400
        
        errors = UserService.send_verification_email(email)
        
        if errors:
            return {"success": False, "message": f"{errors['message']}"}, 400
        
        return {"success": True, "message": "Verification email sent."}, 200
    
    @staticmethod
    def verify_email(request):
        data = request.get_json()
        token = data.get("token")
        
        if not token:
            return {"success": False, "message": "Token is required."}, 400
        
        errors = UserService.verify_email(token)
        
        if errors:
            if "message" in errors:
                return {"success": False, "message": f"{errors['message']}"}, 400
            return {"success": False, "errors": errors}, 400
        
        return {"success": True, "message": "Email verified successfully."}, 200
    
    @staticmethod
    def send_password_reset_email(request):
        data = request.get_json()
        errors = UserService.send_password_reset_email(data)
        
        if errors:
            return {"success": False, "message": f"{errors['message']}"}, 400
        
        return {"success": True, "message": "Password reset email sent."}, 200
    
    def reset_password(request):
        data = request.get_json()
        errors = UserService.reset_password(data)
        
        if errors:
            return {"success": False, "message": f"{errors['message']}"}, 400
        
        return {"success": True, "message": "Password reset successfully."}, 200
        
    
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
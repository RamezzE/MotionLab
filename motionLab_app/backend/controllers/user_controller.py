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
    def login(request):
        data = request.get_json()
        user, errors = UserService.authenticate_user(data)
        
        if errors:
            if "message" in errors:
                return {"success": False, "message": f"{errors['message']}"}, 400
            return {"success": False, "errors": errors}, 400
        
        return {"success": True, "data": user}, 200
    
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
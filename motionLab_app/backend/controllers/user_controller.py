from services import UserService

class UserController:
    
    @staticmethod
    def sign_up(request):
        data = request.get_json()
        user, errors = UserService.create_user(data)
        
        if errors:
            return {"success": False, "errors": errors}, 400
        
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
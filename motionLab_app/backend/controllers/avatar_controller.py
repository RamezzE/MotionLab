from services import AvatarService
from flask import jsonify

class AvatarController:
    
    @staticmethod
    def create_avatar_for_user(request):
        # Reading parameters from the request body (POST data)
        data = request.get_json()

        # Validate the required parameters
        user_id = data.get("userId")
        if not user_id:
            return jsonify({"success": False, "message": "Missing userId parameter"}), 400
        
        avatar_name = data.get("avatarName")
        if not avatar_name:
            return jsonify({"success": False, "message": "Missing avatarName parameter"}), 400
        
        download_url = data.get("downloadUrl")
        if not download_url:
            return jsonify({"success": False, "message": "Missing downloadUrl parameter"}), 400
        
        # Call the AvatarService to create the avatar
        avatar = AvatarService.create_avatar(data)
        
        if avatar:
            return jsonify({"success": True, "avatar": avatar}), 200
        else:
            return jsonify({"success": False, "message": "Failed to create avatar"}), 500

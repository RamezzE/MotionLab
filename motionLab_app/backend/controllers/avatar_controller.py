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
            return jsonify({"success": False, "message": "Missing userId parameter"}), 200
        
        avatar_name = data.get("avatarName")
        if not avatar_name:
            return jsonify({"success": False, "message": "Missing avatarName parameter"}), 200
        
        download_url = data.get("downloadUrl")
        if not download_url:
            return jsonify({"success": False, "message": "Missing downloadUrl parameter"}), 200
        
        # check for duplicate avatar name
        if AvatarService.check_duplicate_avatar_name(avatar_name, user_id):
            return jsonify({"success": False, "message": "Avatar name already exists"}), 200
        
        # Call the AvatarService to create the avatar
        avatar = AvatarService.create_avatar(data)
        
        if avatar:
            return jsonify({"success": True, "avatar": avatar}), 200
        else:
            return jsonify({"success": False, "message": "Failed to create avatar"}), 200

    @staticmethod
    def get_avatars_by_user_id(request):
        # Read the user_id from the query parameters
        user_id = request.args.get("userId")
        
        # Validate the user_id parameter
        if not user_id:
            return jsonify({"success": False, "message": "Missing userId parameter"}), 200
        
        # Call the AvatarService to get avatars by user ID
        avatars = AvatarService.get_avatars_by_user_id(user_id)
        
        print("Avatars fetched from database:")
        print(avatars)
        
        if avatars:
            return jsonify({"success": True, "data": avatars}), 200
        else:
            return jsonify({"success": False, "message": "No avatars found for this user"}), 404

from services import RetargetedAvatarService, AvatarService, ProjectService
from flask import jsonify

class RetargetedAvatarController:
    
    @staticmethod
    def create_retargeted_avatar(request):
        try:
            # Reading parameters from the request body (POST data)
            data = request.get_json()
            
            user_id = data.get("userId")
            if not user_id:
                return jsonify({"success": False, "message": "Missing userId parameter"}), 200
            
            bvh_filename = data.get("bvhFilename")
            if not bvh_filename:
                return jsonify({"success": False, "message": "Missing bvhFilename parameter"}), 200
            
            avatar_id = data.get("avatarId")
            if not avatar_id:
                return jsonify({"success": False, "message": "Missing avatarId parameter"}), 200
            
            project_id = data.get("projectId")
            if not project_id:
                return jsonify({"success": False, "message": "Missing projectId parameter"}), 200
            
            existing_project = ProjectService.get_project_by_id(project_id, user_id)
            if not existing_project:
                return jsonify({"success": False, "message": "Project not found"}), 200
            
            existing_avatar = AvatarService.get_avatar_by_id_and_user_id(avatar_id, user_id)
            if not existing_avatar:
                return jsonify({"success": False, "message": "Avatar not found"}), 200
            
            # Call the RetargetedAvatarService to create the retargeted avatar
            retargeted_avatar = RetargetedAvatarService.retarget_bvh_to_avatar(
                bvh_filename, 
                existing_avatar["filename"], 
                project_id
            )
            
            print("Retargeted avatar created:", retargeted_avatar)
            if retargeted_avatar:
                return jsonify({"success": True, "filename": retargeted_avatar["filename"]}), 200
            else:
                return jsonify({"success": False, "message": "Failed to create retargeted avatar"}), 200
        
        except Exception as e:
            print("Error during avatar retargeting:", e)
            return jsonify({"success": False, "message": f"Internal error: {str(e)}"}), 500

    @staticmethod
    def delete_retargeted_avatar(request):
        try:
            data = request.get_json()
            avatar_id = data.get("avatarId")
            if not avatar_id:
                return jsonify({"success": False, "message": "Missing avatarId parameter"}), 200
            
            success, message = RetargetedAvatarService.delete_retargeted_avatar(avatar_id)
            if success:
                return jsonify({"success": True, "message": message}), 200
            else:
                return jsonify({"success": False, "message": message}), 404 if message == "Avatar not found" else 500
        except Exception as e:
            print("Error during avatar deletion:", e)
            return jsonify({"success": False, "message": f"Internal error: {str(e)}"}), 500

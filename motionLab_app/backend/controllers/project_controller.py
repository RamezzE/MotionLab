from services import ProjectService
from flask import jsonify

class ProjectController:
    
    @staticmethod
    def get_projects_by_user_id(request):
        
        user_id = request.args.get("userId")
        if not user_id:
            return {"success": False, "message": "Missing userId parameter"}
        
        projects = ProjectService.get_projects_by_user_id(user_id)
        if projects:
            return jsonify({"success": True, "projects": projects}), 200
        
        return jsonify({"success": False, "message": "No projects found"}), 404
        
    @staticmethod
    def delete_project(request):
        project_id = request.args.get("projectId")
        user_id = request.args.get("userId")
        
        if not project_id:
            return jsonify({"success": False, "message": "Missing projectId parameter"}), 400
        
        if not user_id:
            return jsonify({"success": False, "message": "Missing userId parameter"}), 400
        
        bool_val, message = ProjectService.delete_project(project_id, user_id)
        
        if bool_val:
            return jsonify({"success": True, "message": message}), 200
        
        return jsonify({"success": False, "message": message}), 400
        
    @staticmethod
    def get_bvh_filenames(request):
        
        project_id = request.args.get("projectId")
        user_id = request.args.get("userId")
        
        if not project_id:
            return jsonify({"success": False, "message": "Missing projectId parameter"}), 400
        
        bvh_filenames, error_message = ProjectService.get_bvh_filenames(project_id, user_id)
        
        if bvh_filenames:
            return jsonify({"success": True, "filenames": bvh_filenames}), 200
        
        return jsonify({"success": False, "message": error_message}), 400
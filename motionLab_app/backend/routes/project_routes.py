from flask import Blueprint, request, jsonify
from controllers.project_controller import ProjectController

# Create a Blueprint for project routes
project_bp = Blueprint("project", __name__)

@project_bp.route("/get-projects", methods=["GET"])
def get_projects_route():
    user_id = request.args.get("userId")
    
    if not user_id:
        return jsonify({"success": False, "message": "Missing userId parameter"}), 400
    
    return ProjectController.get_projects_by_user_id(user_id)

@project_bp.route("/delete-project", methods=["DELETE"])
def delete_project_route():
    project_id = request.args.get("projectId")
    user_id = request.args.get("userId")
    
    if not project_id:
        return jsonify({"success": False, "message": "Missing projectId parameter"}), 400
    
    if not user_id:
        return jsonify({"success": False, "message": "Missing userId parameter"}),
    
    return ProjectController.delete_project(project_id, user_id)
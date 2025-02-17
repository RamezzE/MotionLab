from flask import Blueprint, request, jsonify
from controllers.project_controller import ProjectController

# Create a Blueprint for project routes
project_bp = Blueprint("project", __name__)

@project_bp.route("/get-projects", methods=["GET"])
def get_projects_route():
    print("GET /get-projects")
    user_id = request.args.get("userId")
    
    if not user_id:
        return jsonify({"success": False, "message": "Missing userId parameter"}), 400
    
    return ProjectController.get_projects_by_user_id(user_id)

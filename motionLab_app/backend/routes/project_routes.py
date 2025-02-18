from flask import Blueprint, request, jsonify
from controllers.project_controller import ProjectController

# Create a Blueprint for project routes
project_bp = Blueprint("project", __name__)

@project_bp.route("/get-projects", methods=["GET"])
def get_projects_route():
    return ProjectController.get_projects_by_user_id(request)

@project_bp.route("/delete-project", methods=["DELETE"])
def delete_project_route():
    return ProjectController.delete_project(request)

@project_bp.route("/get-bvh-filenames", methods=["GET"])
def get_bvh_filenames_route():
    return ProjectController.get_bvh_filenames(request)

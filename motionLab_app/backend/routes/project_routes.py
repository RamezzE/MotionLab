from flask import Blueprint, request, jsonify
from controllers.project_controller import ProjectController
from controllers.retargeted_avatar_controller import RetargetedAvatarController
from models.retargeted_avatar_model import RetargetedAvatar
from services.retarget_avatar_service import RetargetedAvatarService

# Create a Blueprint for project routes
project_bp = Blueprint("project", __name__)

@project_bp.route("/get-projects", methods=["GET"])
def get_projects_route():
    return ProjectController.get_projects_by_user_id(request)

@project_bp.route("/get-project", methods=["GET"])
def get_project_route():
    return ProjectController.get_project_by_id(request)

@project_bp.route("/delete-project", methods=["DELETE"])
def delete_project_route():
    return ProjectController.delete_project(request)

@project_bp.route("/get-bvh-filenames", methods=["GET"])
def get_bvh_filenames_route():
    return ProjectController.get_bvh_filenames(request)

@project_bp.route("/create-retargeted-avatar", methods=["POST"])
def create_retargeted_avatar_route():
    return RetargetedAvatarController.create_retargeted_avatar(request)

@project_bp.route('/retargeted-avatars', methods=['DELETE'])
def delete_retargeted_avatar_route():
    return RetargetedAvatarController.delete_retargeted_avatar(request)

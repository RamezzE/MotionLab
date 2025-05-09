from flask import Blueprint, request, jsonify
from controllers.avatar_controller import AvatarController

# Create a Blueprint for project routes
avatar_bp = Blueprint("avatar", __name__)

@avatar_bp.route("/create-avatar", methods=["POST"])
def create_avatar_for_user():
    return AvatarController.create_avatar_for_user(request)

@avatar_bp.route("/avatars", methods=["GET"])
def get_avatars_by_user_id():
    return AvatarController.get_avatars_by_user_id(request)

@avatar_bp.route("/", methods=["GET"])
def get_avatar_by_id_and_user_id():
    return AvatarController.get_avatar_by_id_and_user_id(request)
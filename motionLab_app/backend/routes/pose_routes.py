from flask import Blueprint, request
from controllers.pose_controller import PoseController


pose_bp = Blueprint("pose", __name__)
pose_controller = PoseController()  # Create a single instance of PoseController
    
@pose_bp.route("/process-video", methods=["POST"])
def process_video_route():
    return pose_controller.process_request(request)

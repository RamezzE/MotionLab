from flask import Blueprint, request, jsonify
from controllers.pose_controller import PoseController

pose_bp = Blueprint("pose", __name__)
pose_controller = PoseController()  # Create a single instance of PoseController


@pose_bp.route("/process-video", methods=["POST"])
def process_video_route():
    video = request.files.get("video")

    # Validate the video file
    print("Validating video file...")
    is_valid, error_message = PoseController.validate_video_file(video, request.files)
    if not is_valid:
        return jsonify({"success": False, "error": error_message}), 400

    try:
        # Save the file temporarily
        print("Saving the video file temporarily...")
        temp_video_path = PoseController.save_temp_video(video)

        # Process the video
        print("Processing the video...")
        response = pose_controller.process_video(temp_video_path)

        return response
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

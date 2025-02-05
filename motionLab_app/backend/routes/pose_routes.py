from flask import Blueprint, request, jsonify
from controllers.pose_controller import PoseController
import tempfile

pose_bp = Blueprint("pose", __name__)
pose_controller = PoseController()  # Create a single instance of PoseController
    
def validate_video_file(video, request_files):
    if "video" not in request_files:
        return False, "No video file provided"

    if not video.filename.endswith(('.mp4', '.avi', '.mov', '.mkv')):
        return False, "Unsupported video format"

    return True, None

def save_temp_video(video):
    try:
        temp_video = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        temp_video.write(video.read())
        temp_video_path = temp_video.name  # Get the file path
        temp_video.close()
        return temp_video_path
    except Exception as e:
        raise RuntimeError(f"Error saving temporary video: {e}")
    
@pose_bp.route("/process-video", methods=["POST"])
def process_video_route():
    video = request.files.get("video")

    # Validate the video file
    print("Validating video file...")
    is_valid, error_message = validate_video_file(video, request.files)
    if not is_valid:
        return jsonify({"success": False, "error": error_message}), 400

    try:
        # Save the file temporarily
        print("Saving the video file temporarily...")
        temp_video_path = save_temp_video(video)

        # Process the video
        print("Processing the video...")
        # response = pose_controller.process_video(temp_video_path)
        response = pose_controller.multiple_human_segmentation(temp_video_path)

        return response
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

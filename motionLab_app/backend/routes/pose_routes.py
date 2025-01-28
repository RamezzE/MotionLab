import os
import tempfile
import numpy as np
import cv2
from flask import Blueprint, request, jsonify
from utils.utils import process_video

pose_bp = Blueprint("pose", __name__)

@pose_bp.route("/process-video", methods=["POST"])
def process_video_route():
    if "video" not in request.files:
        return jsonify({"success": False, "error": "No video file provided"}), 400

    video = request.files["video"]
    
    if not video.filename.endswith(('.mp4', '.avi', '.mov', '.mkv')):
        return jsonify({"success": False, "error": "Unsupported video format"}), 400

    try:
        # Save the video to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
            temp_video.write(video.read())
            temp_video_path = temp_video.name  # Get the temporary file path

        # Process the video and get keypoints
        result = process_video(temp_video_path)
        
        # Convert the result to a serializable format (list of lists) for JSON response
        # serializable_keypoints = [kp.tolist() for kp in result]

        return jsonify(
            {
                "success": True,
                "bvh": result,
            }
        ), 200
    except Exception as e:
        print(f"Error encountered: {e}")

        return jsonify(
            {
                "success": False,
                "error": str(e),
            }
        ), 500
    finally:
        # Delete the temporary video file
        os.remove(temp_video_path)

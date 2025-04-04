import tempfile
from utils import VideoUtils
import os
from moviepy import VideoFileClip

class VideoService:
    
    @staticmethod
    def handle_video_upload(video, request_files):
        """Handles the video upload process and returns the temporary video path."""
        # Validating Video File
        is_valid, error_message = VideoService.validate_video_file(video, request_files)
        if not is_valid:
            return None, error_message

        max_size = 150 * 1024 * 1024 # 150MB
        video.seek(0, os.SEEK_END)
        file_size = video.tell()
        video.seek(0)  # Reset the pointer
        if file_size > max_size:
            return None, "Video file is too large. Maximum size is 150MB."

        # Saving Temp Video
        temp_video_path, error_message = VideoService.save_temp_video(video)
        if not temp_video_path:
            return None, error_message
        
        return temp_video_path, None
    
    @staticmethod
    def save_temp_video(video):
        """Saves the uploaded video temporarily and returns its path."""
        try:
            temp_video = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
            temp_video.write(video.read())
            temp_video_path = temp_video.name
            temp_video.close()
            clip = VideoFileClip(temp_video_path)
            duration = clip.duration  # in seconds
            clip.close()
            if duration > 1 * 60:  
                os.remove(temp_video_path)
                return None, "Video duration exceeds 1 minute."
            return temp_video_path
        except Exception as e:
            print(f"Error in save_temp_video: {e}")
            return None, ""

    @staticmethod
    def validate_video_file(video, request_files):
        if "video" not in request_files:
            return False, "No video file provided"

        if not video.filename.endswith(('.mp4')):
            return False, "Unsupported video format"

        return True, None

    @staticmethod
    def get_video_frame_count(video_path):
        """Returns the total number of frames in the video."""
        return VideoUtils.get_video_frame_count(video_path)
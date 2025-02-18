import tempfile
from utils import VideoUtils

class VideoService:
    
    @staticmethod
    def handle_video_upload(video, request_files):
        """Handles the video upload process and returns the temporary video path."""
        # Validating Video File
        is_valid, error_message = VideoService.validate_video_file(video, request_files)
        if not is_valid:
            return None, error_message
            
        # Saving Temp Video
        temp_video_path = VideoService.save_temp_video(video)
        if not temp_video_path:
            return None, "Error saving video"
        
        return temp_video_path, None
    
    @staticmethod
    def save_temp_video(video):
        """Saves the uploaded video temporarily and returns its path."""
        try:
            temp_video = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
            temp_video.write(video.read())
            temp_video_path = temp_video.name
            temp_video.close()
            return temp_video_path
        except Exception as e:
            print(f"Error in save_temp_video: {e}")
            return None

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
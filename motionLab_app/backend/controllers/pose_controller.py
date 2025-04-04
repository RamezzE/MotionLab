import os
import logging
from flask import jsonify

from services import PoseProcessingService, SegmentationService, VideoService, UserService, ProjectService, BVHService

class PoseController:
    def __init__(self):
        self.pose_processing_service = PoseProcessingService()
        self.segmentation_service = SegmentationService()

    def convert_video_to_bvh(self, temp_video_path):
        """
        Processes a single video and converts it to BVH format.
            :param temp_video_path: Path to the video file
            :return: BVH filename if successful, None otherwise
        """
        try:
            bvh_filename = self.pose_processing_service.convert_video_to_bvh(temp_video_path)
            if bvh_filename:
                return bvh_filename
            
            return None
        
        except Exception as e:
            logging.error(f"Error in process_video: {e}")
            return jsonify({"success": False, "error": str(e)}), 500
        
        finally:
            if temp_video_path and os.path.exists(temp_video_path):
                os.remove(temp_video_path)  # Ensure file cleanup

    def segment_people_into_separate_videos(self, video_path):
        """
        Handles segmentation and passes segmented videos for further processing.
        :param video_path: Path to the video file
        :return: List of BVH filenames if successful, None otherwise
        """
        try:
            output_video_paths = self.segmentation_service.segment_video(video_path)
            if not output_video_paths:
                return jsonify({"success": False, "error": "No segmented videos found"}), 500

            # Process segmented videos
            bvh_filenames = self.process_segmented_videos(output_video_paths, video_path)

            return bvh_filenames

        except Exception as e:
            logging.error(f"Error in multiple_human_segmentation: {e}")
            return None

    def process_segmented_videos(self, output_video_paths, original_video_path):
        """
        Processes each segmented video and converts it to BVH if it meets the frame count criteria.
        :param output_video_paths: List of paths to segmented videos
        """
        bvh_filenames = []
        total_frames = VideoService.get_video_frame_count(original_video_path)

        for segmented_video_path in output_video_paths:
            frames_num = VideoService.get_video_frame_count(segmented_video_path)

            if frames_num < 0.4 * total_frames:
                os.remove(segmented_video_path)
                continue

            print("Converting Video to BVH:", segmented_video_path)
            bvh_filename = self.convert_video_to_bvh(segmented_video_path)

            if bvh_filename:  # Ensure only valid BVH files are added
                bvh_filenames.append(bvh_filename)

        return bvh_filenames

    def process_request(self, request):
        """
        Handles API requests (assuming request contains a video path).
        :param request: Flask request object
        :return: JSON response
        """
        try:
            video = request.files.get("video")
            project_name = request.form.get("projectName")
            user_id = request.form.get("userId")   

            if not video or not project_name or not user_id:
                return jsonify({"success": False, "message": "Missing required fields"}), 400
            
            # Check if user exists
            if not UserService.does_user_exist_by_id(user_id):
                return jsonify({"success": False, "message": "User not found"}), 404
            
            # Check for duplicate project name
            existing_project = ProjectService.get_project_by_name_and_user_id(project_name, user_id)
            if existing_project:
                return jsonify({"success": False, "message": "Project name already exists"}), 200
            
            temp_video_path, error_message = VideoService.handle_video_upload(video, request.files)
            if not temp_video_path:
                return jsonify({"success": False, "message": error_message}), 400
            
            # Creating Project
            project = ProjectService.create_project({"projectName": project_name, "userId": user_id})
            if not project:
                return jsonify({"success": False, "message": "Error creating project"}), 500
            
            # Segmenting and Processing Video
            bvh_filenames = self.segment_people_into_separate_videos(temp_video_path)
            
            # Error Handling
            if not bvh_filenames:
                return jsonify({"success": False, "message": "Error processing video"}), 500
            
            # Creating BVH Files
            if BVHService.create_bvhs(bvh_filenames, project["id"]):
                ProjectService.update_project_status(project_name, user_id, False)
                return jsonify({"success": True, "data": {"bvh_filenames": bvh_filenames, "projectId": project["id"]}}), 200
            
            return jsonify({"success": False, "message": "Error processing video"}), 500
        
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

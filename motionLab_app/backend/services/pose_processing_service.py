import os
from flask import jsonify
from utils import VideoUtils, PoseUtils, BVHUtils

class PoseProcessingService:
    @staticmethod
    def convert_video_to_bvh(temp_video_path, pose_model, estimator_3d):        
        try:
            cap = VideoUtils.open_video(temp_video_path)
            fps = VideoUtils.get_video_fps(cap)
            img_width, img_height = VideoUtils.get_video_dimensions(cap)
            
            keypoints, pose_world_keypoints, landmarks_list = PoseUtils.get_keypoints_list(cap, pose_model, img_width, img_height)
                        
            root_keypoints = PoseUtils.get_root_keypoints(landmarks_list)
                        
            points_3d = PoseUtils.estimate_3d_from_2d(keypoints, estimator_3d, img_width, img_height)

            corrected_3d_points = PoseUtils.align_and_scale_3d_pose(points_3d)
                        
            bvh_filename = BVHUtils.convert_3d_to_bvh(corrected_3d_points, root_keypoints, fps)
            
            cap.release()
            
            return bvh_filename
        except Exception as e:
            print(f"Error in process_video: {e}")
            return jsonify({"success": False, "error": str(e)}), 500
        finally:
            if temp_video_path and os.path.exists(temp_video_path):
                os.remove(temp_video_path)  # Ensure file cleanup

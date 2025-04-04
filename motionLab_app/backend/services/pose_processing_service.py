import os
from flask import jsonify
from utils import VideoUtils, PoseUtils, BVHUtils
import mediapipe as mp 

class PoseProcessingService:
    def __init__(self, config_file=None, checkpoint_file=None):
        """Initializes the service with the pose model and estimator."""
        
        # 2D Pose detector initialization
        self.mp_pose = mp.solutions.pose
        self.mp_pose_model = self.mp_pose.Pose()
        
        # Set default paths relative to the current file location
        if config_file is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            config_file = os.path.join(current_dir, '..', 'utils', 'video_pose.yaml')
        
        if checkpoint_file is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            checkpoint_file = os.path.join(current_dir, '..', 'utils', 'best_58.58.pth')
            
        # Ensure paths exist
        if not os.path.exists(config_file):
            raise FileNotFoundError(f"Config file not found at: {config_file}")
        if not os.path.exists(checkpoint_file):
            raise FileNotFoundError(f"Checkpoint file not found at: {checkpoint_file}")
            
        self.estimator_3d = PoseUtils.initialize_3D_pose_estimator(config_file, checkpoint_file)

    def convert_video_to_bvh(self, temp_video_path):        
        try:
            cap = VideoUtils.open_video(temp_video_path)
            fps = VideoUtils.get_video_fps(cap)
            img_width, img_height = VideoUtils.get_video_dimensions(cap)
            
            keypoints, pose_world_keypoints, landmarks_list = PoseUtils.get_keypoints_list(cap, self.mp_pose_model, img_width, img_height)
                        
            root_keypoints = PoseUtils.get_root_keypoints(landmarks_list)
                        
            points_3d = PoseUtils.estimate_3d_from_2d(keypoints, self.estimator_3d, img_width, img_height)

            corrected_3d_points = PoseUtils.align_and_scale_3d_pose(points_3d)
                        
            bvh_filename = BVHUtils.convert_3d_to_bvh(corrected_3d_points, root_keypoints, fps)
            
            cap.release()
            
            return bvh_filename
        except Exception as e:
            print(f"Error in convert_video_to_bvh: {e}")
            return None
        finally:
            VideoUtils.delete_video(temp_video_path)

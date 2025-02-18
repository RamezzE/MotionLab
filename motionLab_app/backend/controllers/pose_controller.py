import os
import numpy as np
import cv2
import pathlib
import mediapipe as mp
from flask import jsonify

from utils import VideoUtils, PoseUtils, BVHUtils, ObjectDetectionUtils, DrawingUtils
from ultralytics import YOLO

class PoseController:
    def __init__(self, config_file='utils/video_pose.yaml', checkpoint_file='utils/best_58.58.pth'):
        
        self.img_width = 0
        self.img_height = 0
        self.fps = 30
        
        # 2D Pose detector initialization
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose()
        
        # 3D Pose Estimator initialization
        self.estimator_3d = PoseUtils.initialize_3D_pose_estimator(config_file, checkpoint_file)

    # Estimate 3D pose from 2D keypoints list
    def _estimate_3d_from_2d(self, keypoints_list):
        try:
            pose2d = np.stack(keypoints_list)[:, :, :2]
            return self.estimator_3d.estimate(pose2d, image_width=self.img_width, image_height=self.img_height)
        except Exception as e:
            raise RuntimeError(f"Error in _estimate_3d_from_2d: {e}")
            
    # Process the video file
    def process_video(self, temp_video_path):        
        try:
            cap = VideoUtils.open_video(temp_video_path)
            self.fps = VideoUtils.get_video_fps(cap)
            self.img_width, self.img_height = VideoUtils.get_video_dimensions(cap)
            
            keypoints, pose_world_keypoints, landmarks_list = PoseUtils.get_keypoints_list(cap, self.pose, self.img_width, self.img_height)
            
            # DrawingUtils.visualize_openpose_keypoints(cap, keypoints, self.img_height)
            
            root_keypoints = PoseUtils.get_root_keypoints(landmarks_list)
                        
            points_3d = self._estimate_3d_from_2d(keypoints)

            corrected_3d_points = PoseUtils.align_and_scale_3d_pose(points_3d)
            
            # DrawingUtils.visualize_3D_points(corrected_3d_points, connections=DrawingUtils.CMU_CONNECTIONS)
            
            bvh_filename =  BVHUtils.convert_3d_to_bvh(corrected_3d_points, root_keypoints, self.fps)
            cap.release()
            # return jsonify({
            #     "success": True,
            #     "bvh_filename": bvh_filename,
            # }), 200
            
            return bvh_filename
        except Exception as e:
            print(f"Error in process_video: {e}")
            return jsonify({"success": False, "error": str(e)}), 500
        finally:
            if temp_video_path and os.path.exists(temp_video_path):
                os.remove(temp_video_path)  # Ensure file cleanup

    def multiple_human_segmentation(self, video_path):
        try:
            # self.yolo_model = YOLO('yolo11m-pose.pt')
            self.yolo_model = YOLO('yolo11s-pose.pt')
            # self.yolo_model = YOLO('yolo11n.pt')
            writers = {}
            self.output_video_paths = []
            # Create an output folder
            output_folder = 'output_videos'
            
            cap = VideoUtils.open_video(video_path)
            self.fps = VideoUtils.get_video_fps(cap)
            
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            pathlib.Path(output_folder).mkdir(parents=True, exist_ok=True)
                        
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                self.img_height, self.img_width = frame.shape[:2]
                
                self._process_YOLO_frame(writers, frame, output_folder, "utils/bytetrack.yaml")
            
            cap.release()
            for writer in writers.values():
                writer.release()
                
            cv2.destroyAllWindows()
            
            bvh_filenames = []
            
            for video_path in self.output_video_paths:
                print("Or is the problem ehre")
                cap = cv2.VideoCapture(video_path)
                frames_num = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                cap.release()

                if frames_num < 0.4 * total_frames:
                    os.remove(video_path)
                    continue

                print("Processing video:", video_path)
                bvh_filename = self.process_video(video_path)
                bvh_filenames.append(bvh_filename)
                print("Is the problem here?")
            
            return True, bvh_filenames
            
        except Exception as e:
            print(f"Error in _multiple_human_segmentation: {e}")
            return jsonify({"success": False, "error": str(e)}), 500
        
    def _process_YOLO_frame(self, writers, frame, output_folder, tracker_path):
        try:
            cropped_people = ObjectDetectionUtils.detect_and_crop_people(
                self.yolo_model, frame, tracker_path, self.img_width, self.img_height
            )

            VideoUtils.write_cropped_people(
                writers, cropped_people, output_folder, self.fps, (self.img_width, self.img_height), self.output_video_paths
            )

        except Exception as e:
            print(f"Error in _process_YOLO_frame: {e}")
            raise RuntimeError(f"Error in _process_YOLO_frame: {e}")

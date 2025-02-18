import os
import numpy as np
import cv2
import pathlib
import mediapipe as mp
from flask import jsonify

from utils import VideoUtils, PoseUtils, BVHUtils, ObjectDetectionUtils, DrawingUtils
from services import PoseProcessingService
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
    
            
    # Process the video file
    def process_video(self, temp_video_path):        
        try:
            bvh_filename = PoseProcessingService.convert_video_to_bvh(temp_video_path, self.pose, self.estimator_3d)
            if bvh_filename:
                return bvh_filename
            
            return None
        
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
                
                # self._process_YOLO_frame(writers, frame, output_folder, "utils/bytetrack.yaml")
                cropped_people = ObjectDetectionUtils.detect_and_crop_people(self.yolo_model, frame, "utils/bytetrack.yaml", self.img_width, self.img_height)
                VideoUtils.write_cropped_people(writers, cropped_people, output_folder, self.fps, (self.img_width, self.img_height), self.output_video_paths)
            
            cap.release()
            for writer in writers.values():
                writer.release()
                
            cv2.destroyAllWindows()
            
            bvh_filenames = []
            
            for video_path in self.output_video_paths:
                cap = cv2.VideoCapture(video_path)
                frames_num = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                cap.release()

                if frames_num < 0.4 * total_frames:
                    os.remove(video_path)
                    continue

                print("Processing video:", video_path)
                bvh_filename = self.process_video(video_path)
                bvh_filenames.append(bvh_filename)
            
            return True, bvh_filenames
            
        except Exception as e:
            print(f"Error in _multiple_human_segmentation: {e}")
            return jsonify({"success": False, "error": str(e)}), 500

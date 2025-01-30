import os
import numpy as np
import cv2
import pathlib
import importlib
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from pathlib import Path
from datetime import datetime
from flask import jsonify
import tempfile

from utils.pose_estimator_3d import estimator_3d
from utils.bvh_skeleton import openpose_skeleton, h36m_skeleton, cmu_skeleton

class PoseController:
    def __init__(self, model_path='utils/pose_landmarker.task', config_file='utils/video_pose.yaml', checkpoint_file='utils/best_58.58.pth'):
        self.mediapipe_to_openpose = {
            0: 0, 13: 5, 14: 2, 15: 6, 16: 3, 17: 7, 18: 4,
            23: 12, 24: 9, 25: 13, 26: 10, 27: 14, 28: 11,
            31: 19, 32: 22, 29: 20, 30: 21, 28: 23, 27: 24,
            1: 16, 2: 15, 3: 18, 4: 17,
        }
        self.img_width = 0
        self.img_height = 0
        self.pose_detector = self._initialize_pose_detector(model_path)
        self.estimator_3d = self._initialize_3D_pose_estimator(config_file, checkpoint_file)

    # MediaPipe 2D Pose detector initialization
    def _initialize_pose_detector(self, model_path):
        try:
            base_options = python.BaseOptions(model_asset_path=model_path)
            options = vision.PoseLandmarkerOptions(base_options=base_options, output_segmentation_masks=True)
            return vision.PoseLandmarker.create_from_options(options)
        except Exception as e:
            raise RuntimeError(f"Error initializing pose detector: {e}")

    # 3D Pose Estimator initialization
    def _initialize_3D_pose_estimator(self, config_file, checkpoint_file):
        try:
            temp = pathlib.PosixPath
            pathlib.PosixPath = pathlib.WindowsPath

            importlib.reload(estimator_3d)

            e3d = estimator_3d.Estimator3D(config_file=config_file, checkpoint_file=checkpoint_file)

            pathlib.PosixPath = temp
            return e3d
        except Exception as e:
            raise RuntimeError(f"Error initializing Estimator3D: {e}")

    # Interpolate joints
    @staticmethod
    def interpolate_joint(lm1, lm2):
        return [(lm1.x + lm2.x) / 2, (lm1.y + lm2.y) / 2, (lm1.z + lm2.z) / 2]

    # Validate the video file
    @staticmethod
    def validate_video_file(video, request_files):
        if "video" not in request_files:
            return False, "No video file provided"

        if not video.filename.endswith(('.mp4', '.avi', '.mov', '.mkv')):
            return False, "Unsupported video format"

        return True, None
    
    # Function to save video temporarily
    @staticmethod
    def save_temp_video(video):
        try:
            temp_video = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
            temp_video.write(video.read())
            temp_video_path = temp_video.name  # Get the file path
            temp_video.close()
            return temp_video_path
        except Exception as e:
            raise RuntimeError(f"Error saving temporary video: {e}")
    
    # Function to draw keypoints on the frame
    @staticmethod
    def draw_keypoints(frame, keypoints):
        for i, (x, y, confidence) in enumerate(keypoints):
            if confidence > 0:
                cv2.circle(frame, (int(x), int(y)), 5, (0, 255, 0), -1)
        return frame
    
    # Open the video file and validate it
    def _open_video(self, file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Video file not found: {file_path}")

        cap = cv2.VideoCapture(file_path)
        if not cap.isOpened():
            raise ValueError(f"Unable to open video file: {file_path}")

        return cap

    # Process a single frame
    def _process_frame(self, frame):
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            detection_result = self.pose_detector.detect(mp_image)

            keypoints = np.zeros((25, 3))

            if detection_result.pose_landmarks:
                landmarks = detection_result.pose_landmarks[0]

                for mp_idx, openpose_idx in self.mediapipe_to_openpose.items():
                    if mp_idx < len(landmarks):
                        landmark = landmarks[mp_idx]
                        keypoints[openpose_idx, 0] = landmark.x * self.img_width
                        keypoints[openpose_idx, 1] = landmark.y * self.img_height
                        keypoints[openpose_idx, 2] = 1.0

                neck = self.interpolate_joint(landmarks[13], landmarks[14])
                keypoints[1] = [neck[0] * self.img_width, neck[1] * self.img_height, 1.0]

                mid_hip = self.interpolate_joint(landmarks[23], landmarks[24])
                keypoints[8] = [mid_hip[0] * self.img_width, mid_hip[1] * self.img_height, 1.0]

            ## Draw keypoints
            # frame_with_keypoints = draw_keypoints(frame, keypoints)
        
            # Show the frame
            # cv2.imshow("Pose Estimation", frame_with_keypoints)
            # cv2.waitKey(1)  # 1ms delay for video processing
            return keypoints
        except Exception as e:
            raise RuntimeError(f"Error processing a frame: {e}")

    # Get 2D keypoints list from the video
    def _get_2D_keypoints_list(self, cap):
        keypoints_list = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            self.img_height, self.img_width = frame.shape[:2]

            if self.img_height == 0 or self.img_width == 0:
                raise ValueError("Invalid frame dimensions: height or width is 0.")

            keypoints = self._process_frame(frame)
            keypoints_list.append(keypoints)

        cap.release()
        cv2.destroyAllWindows()
        return keypoints_list

    # Estimate 3D pose from 2D keypoints list
    def _estimate_3d_from_2d(self, keypoints_list):
        try:
            pose2d = np.stack(keypoints_list)[:, :, :2]
            return self.estimator_3d.estimate(pose2d, image_width=self.img_width, image_height=self.img_height)
        except Exception as e:
            raise RuntimeError(f"Error in _estimate_3d_from_2d: {e}")

    @staticmethod
    def align_and_scale_3d_pose(pose_3d):
        rotation_matrix_x = np.array([
            [1,  0,  0], 
            [0, -1,  0], 
            [0,  0, -1]   
        ])
        pose_3d = np.einsum('ij,klj->kli', rotation_matrix_x, pose_3d)

        min_y = np.min(pose_3d[:, :, 1])
        pose_3d[:, :, 1] += -min_y

        pose_3d *= 0.1
        return pose_3d

    # Convert 3D pose to BVH format
    def _convert_3d_to_bvh(self, pose_3d):
        bvh_output_dir = Path('BVHs')
        bvh_output_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        bvh_file_name = f'bvh_{timestamp}.bvh'
        bvh_file = bvh_output_dir / bvh_file_name

        cmu_skel = cmu_skeleton.CMUSkeleton()
        cmu_skel.poses2bvh(pose_3d, output_file=bvh_file)

        return bvh_file_name

    # Process the video file
    def process_video(self, temp_video_path):        
        try:
            cap = self._open_video(temp_video_path)
            keypoints = self._get_2D_keypoints_list(cap)
            points_3d = self._estimate_3d_from_2d(keypoints)
            corrected_3d_points = self.align_and_scale_3d_pose(points_3d)
            bvh_filename =  self._convert_3d_to_bvh(corrected_3d_points)
        
            return jsonify({
                "success": True,
                "bvh_filename": bvh_filename,
            }), 200
            
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
        finally:
            if temp_video_path and os.path.exists(temp_video_path):
                os.remove(temp_video_path)  # Ensure file cleanup

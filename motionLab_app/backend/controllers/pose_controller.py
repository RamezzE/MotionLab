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

import matplotlib.pyplot as plt
# from mpl_toolkits.mplot3d import Axes3D

OPENPOSE_CONNECTIONS_25 = [
    (0, 1),  
    (0, 15),
    (0, 16),
    (1, 2), 
    (1,5),
    (1, 8),
    (2, 3),
    (3, 4),
    (5, 6), 
    (6, 7),
    (8, 9),
    (8, 12),
    (9, 10),
    (10, 11),
    (11, 22),
    (11, 24),
    (12, 13),
    (13, 14),
    (14, 19),
    (14, 21),
    (15, 17),
    (16, 18),
    (19, 20),
    (22, 23),    
]

class PoseController:
    def __init__(self, model_path='utils/pose_landmarker.task', config_file='utils/video_pose.yaml', checkpoint_file='utils/best_58.58.pth'):
    # def __init__(self, model_path='utils/pose_landmarker.task', config_file='utils/linear_model.yaml', checkpoint_file='utils/best_64.12.pth'):
        # self.mediapipe_to_openpose = {
        #     0: 0, 13: 5, 14: 2, 15: 6, 16: 3, 17: 7, 18: 4,
        #     23: 12, 24: 9, 25: 13, 26: 10, 27: 14, 28: 11,
        #     31: 19, 32: 22, 29: 20, 30: 21, 28: 23, 27: 24,
        #     1: 16, 2: 15, 3: 18, 4: 17,
        # }
        self.mediapipe_to_openpose = {
            0: 0, 
            13: 5, 
            14: 2, 
            15: 6, 
            16: 3, 
            17: 7, 
            18: 4,
            23: 12, 
            24: 9, 
            25: 13, 
            26: 10, 
            27: 14, 
            28: 11,
            31: 20, 
            32: 23,
            29: 19,
            30: 22,
            2: 16, 
            5: 15, 
            7: 18, 
            8: 17,
            # keypoints 21 = keypoints 14 & keypoints 24 = keypoints 11
            # Neck [1] = (landmark 11 + landmark 12) / 2
            # Mid Hip [8] = (landmark 23 + landmark 24) / 2
        }
        
        self.img_width = 0
        self.img_height = 0
        # self.pose_detector = self._initialize_pose_detector(model_path)
        self.estimator_3d = self._initialize_3D_pose_estimator(config_file, checkpoint_file)
        
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose()
        self.mp_drawing = mp.solutions.drawing_utils

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
    def draw_openpose_keypoints(frame, keypoints):
        for i, (x, y, _) in enumerate(keypoints):
            cv2.circle(frame, (int(x), int(y)), 5, (0, 255, 0), -1)
            cv2.putText(frame, str(i), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
        
        for connection in OPENPOSE_CONNECTIONS_25:
            joint1 = keypoints[connection[0]]
            joint2 = keypoints[connection[1]] 
            cv2.line(frame, (int(joint1[0]), int(joint1[1])), (int(joint2[0]), int(joint2[1])), (0, 255, 0), 2)
        
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
    def _process_frame(self, frame, visualize = False):
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            # mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            # detection_result = self.pose_detector.detect(mp_image)
            detection_result = self.pose.process(rgb_frame)

            keypoints = np.zeros((25, 3))
            pose_world_keypoints = np.zeros((25, 3))
            
            if detection_result.pose_landmarks:
                landmarks = detection_result.pose_landmarks.landmark
                # landmarks = detection_result.pose_world_landmarks.landmark

                pose_world_landmarks = detection_result.pose_world_landmarks.landmark

                for mp_idx, openpose_idx in self.mediapipe_to_openpose.items():
                    if mp_idx < len(landmarks):
                        landmark = landmarks[mp_idx]
                        world_landmark = pose_world_landmarks[mp_idx]
                        
                        keypoints[openpose_idx] = [landmark.x * self.img_width, landmark.y * self.img_height, 1.0]
                        
                        pose_world_keypoints[openpose_idx] = [world_landmark.x, world_landmark.y, world_landmark.z]
                        

                neck = self.interpolate_joint(landmarks[11], landmarks[12])
                keypoints[1] = [neck[0] * self.img_width, neck[1] * self.img_height, 1.0]
                
                neck_world = self.interpolate_joint(pose_world_landmarks[11], pose_world_landmarks[12])
                pose_world_keypoints[1] = [neck_world[0], neck_world[1], neck_world[2]]
                
                mid_hip = self.interpolate_joint(landmarks[23], landmarks[24])
                keypoints[8] = [mid_hip[0] * self.img_width, mid_hip[1] * self.img_height, 1.0]
                
                mid_hip_world = self.interpolate_joint(pose_world_landmarks[23], pose_world_landmarks[24])
                pose_world_keypoints[8] = [mid_hip_world[0], mid_hip_world[1], mid_hip_world[2]]
                
                
                keypoints[21] = keypoints[14]
                keypoints[24] = keypoints[11]
                
                pose_world_keypoints[21] = pose_world_keypoints[14]
                pose_world_keypoints[24] = pose_world_keypoints[11]

            ## Draw keypoints
            if visualize:
                frame_with_keypoints = self.draw_openpose_keypoints(frame, keypoints)

                # Show the frame
                cv2.imshow("Pose Estimation", frame_with_keypoints)
                cv2.waitKey(1)  # 1ms delay for video processing
            return keypoints, pose_world_keypoints
        except Exception as e:
            print(f"Error processing a frame: {e}")
            raise RuntimeError(f"Error processing a frame: {e}")

    # Get keypoints list from the video
    def _get_keypoints_list(self, cap, visualize=False):
        keypoints_list = []
        pose_world_keypoints_list = []
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            self.img_height, self.img_width = frame.shape[:2]

            if self.img_height == 0 or self.img_width == 0:
                raise ValueError("Invalid frame dimensions: height or width is 0.")

            keypoints, pose_world_keypoints = self._process_frame(frame, visualize)
            keypoints_list.append(keypoints)
            pose_world_keypoints_list.append(pose_world_keypoints)

        cap.release()
        if visualize:
            cv2.destroyAllWindows()
        return keypoints_list, pose_world_keypoints_list

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

        pose_3d *= 0.05
        return pose_3d


    # Convert 3D pose to BVH format
    def _convert_3d_to_bvh(self, pose_3d):
        try:
            bvh_output_dir = Path('BVHs')
            bvh_output_dir.mkdir(parents=True, exist_ok=True)

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            bvh_file_name = f'bvh_{timestamp}.bvh'
            bvh_file = bvh_output_dir / bvh_file_name
            
            print(pose_3d.shape)
            
            cmu_skeleton.CMUSkeleton().poses2bvh(pose_3d, output_file=bvh_file)
            
            print(f"BVH file saved: {bvh_file_name}")
            return bvh_file_name
        except Exception as e:
            print(f"Error in _convert_3d_to_bvh: {e}")
            raise RuntimeError(f"Error in _convert_3d_to_bvh: {e}")
        
    def _draw_mediapipe_landmarks(self, image, landmarks):
        if landmarks is not None:
            annotated_image = image.copy()
            self.mp_drawing.draw_landmarks(
                annotated_image,
                landmarks,
                self.mp_pose.POSE_CONNECTIONS)
            return annotated_image
        else:
            return image
        
    # def _process_results_mediapipe(self, results, frame, ax, visualize=False):
    #     landmarks = results.pose_world_landmarks.landmark
    #     x = [landmark.x for landmark in landmarks]
    #     y = [landmark.y for landmark in landmarks]
    #     z = [landmark.z for landmark in landmarks]
        
    #     pose_3d = np.column_stack((x, y, z))  # Shape: (num_landmarks, 3)
    #     x = np.array(x)
    #     y = np.array(y)
    #     z = np.array(z)
        
    #     if visualize:
    #         ax.clear()
    #         ax.scatter(x, -z, -y) # Invert y and z axes for visualization
            
    #         # Draw connections
    #         for connection in self.mp_pose.POSE_CONNECTIONS:
    #             idx1, idx2 = connection
    #             ax.plot([x[idx1], x[idx2]], [-z[idx1], -z[idx2]], [-y[idx1], -y[idx2]], color='black')
            
    #         ax.set_xlim(-1, 1)
    #         ax.set_ylim(-1, 1)
    #         ax.set_zlim(-1, 1) 
    #         ax.set_xlabel('X-axis')
    #         ax.set_ylabel('Y-axis')
    #         ax.set_zlabel('Z-axis')
    #         plt.pause(0.01)
    #         plt.show(block=False)
            
    #         annotated_frame = self._draw_mediapipe_landmarks(frame, results.pose_landmarks)

    #         cv2.imshow('Pose Estimation', annotated_frame)
    #         cv2.waitKey(1)
            
    #     return pose_3d
            
    # def _get_mediapipe_landmarks(self, video_path, visualize=False):
        
    #     try:
    #         cap = cv2.VideoCapture(video_path)
            
    #         fig = plt.figure()
    #         ax = fig.add_subplot(111, projection='3d')
            
    #         mediapipe_landmarks = []
    #         while cap.isOpened():
    #             ret, frame = cap.read()
    #             if not ret:
    #                 break
    #             frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    #             results = self.pose.process(frame_rgb)
                
    #             if results.pose_world_landmarks:
    #                 pose_3d = self._process_results_mediapipe(results, frame, ax, visualize)
    #                 # landmarks = results.pose_world_landmarks.landmark
    #                 # Append correctly structured 3D pose
    #                 # mediapipe_landmarks.append(landmarks)
    #                 mediapipe_landmarks.append(pose_3d)
                    
    #         return np.array(mediapipe_landmarks)
    #     except Exception as e:
    #         print(f"Error in _get_mediapipe_landmarks: {e}")
    #         raise RuntimeError(f"Error in _get_mediapipe_landmarks: {e}")
    #     finally:
    #         cap.release()
    #         cv2.destroyAllWindows()
        
    def _visualize_3D_points(self, points_3d, connections=None):
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')

        # 🔹 Compute dynamic limits based on all frames (before loop)
        points_3d_numpy = np.array(points_3d)
        x_max, y_max, z_max = np.max(points_3d_numpy[:, :, 0]), np.max(points_3d_numpy[:, :, 1]), np.max(points_3d_numpy[:, :, 2])
        x_min, y_min, z_min = np.min(points_3d_numpy[:, :, 0]), np.min(points_3d_numpy[:, :, 1]), np.min(points_3d_numpy[:, :, 2])

        up_limit = max(abs(x_max), abs(y_max), abs(z_max))
        down_limit = -up_limit

        for point in points_3d:
            ax.clear()
            x = point[:, 0]  # Extract X coordinates
            y = point[:, 1]  # Extract Y coordinates
            z = point[:, 2]  # Extract Z coordinates

            ax.scatter(x, -z, -y)

            for connection in connections:
                idx1, idx2 = connection
                ax.plot([x[idx1], x[idx2]], [-z[idx1], -z[idx2]], [-y[idx1], -y[idx2]], color='black')

            ax.set_xlim(down_limit, up_limit)
            ax.set_ylim(down_limit, up_limit)
            ax.set_zlim(down_limit, up_limit)
            # ax.set_xlim(-1, 1)
            # ax.set_ylim(-1, 1)
            # ax.set_zlim(-1, 1)
            ax.set_xlabel('X-axis')
            ax.set_ylabel('Y-axis')
            ax.set_zlabel('Z-axis')

            plt.pause(0.01)
            plt.show(block=False)
        
    # Process the video file
    def process_video(self, temp_video_path):        
        try:
            cap = self._open_video(temp_video_path)
            keypoints, pose_world_keypoints = self._get_keypoints_list(cap, visualize=False)
            
            # self._visualize_3D_points(pose_world_keypoints, connections=OPENPOSE_CONNECTIONS_25)
            # points_3d = self._estimate_3d_from_2d(keypoints)
            points_3d = self._estimate_3d_from_2d(keypoints)

            corrected_3d_points = self.align_and_scale_3d_pose(points_3d)
            
            bvh_filename =  self._convert_3d_to_bvh(corrected_3d_points)
            
            # mediapipe_landmarks = self._get_mediapipe_landmarks(temp_video_path, visualize=False)
            # self._visualize_3D_points(mediapipe_landmarks)
            # print(mediapipe_landmarks.shape) 
            # bvh_filename =  self._convert_3d_to_bvh(mediapipe_landmarks)
            
            return jsonify({
                "success": True,
                "bvh_filename": bvh_filename,
            }), 200
            
        except Exception as e:
            print(f"Error in process_video: {e}")
            return jsonify({"success": False, "error": str(e)}), 500
        finally:
            if temp_video_path and os.path.exists(temp_video_path):
                os.remove(temp_video_path)  # Ensure file cleanup

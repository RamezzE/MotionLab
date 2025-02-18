import numpy as np
import importlib
import pathlib
from utils.pose_estimator_3d import estimator_3d
import cv2

class PoseUtils:
    mediapipe_to_openpose = {
            0: 0, 11: 5, 12: 2, 13: 6, 14: 3, 
            # 13: 5, # 14: 2, # 15: 6, # 16: 3, 
            17: 7, 18: 4, 23: 12,  24: 9,  
            25: 13,  26: 10, 27: 14,
            28: 11, 31: 20, 32: 23, 29: 19, 30: 22, 
            2: 16, 5: 15, 7: 18, 8: 17,
    }
     
    @staticmethod
    def interpolate_joint(lm1, lm2):
        """
        Interpolates between two landmark points to find a midpoint.

        :param lm1: First landmark with x, y, z attributes
        :param lm2: Second landmark with x, y, z attributes
        :return: List [x, y, z] of the interpolated joint
        """
        return [(lm1.x + lm2.x) / 2, (lm1.y + lm2.y) / 2, (lm1.z + lm2.z) / 2]
    
    @staticmethod
    def align_and_scale_3d_pose(pose_3d):
        """
        Aligns and scales a 3D pose to fit within a 2D frame.
        :param pose_3d: 3D pose with shape (n_frames, n_joints, 3)
        :return: Aligned and scaled 3D pose
        """
        rotation_matrix_x = np.array([
            [1,  0,  0], 
            [0, -1,  0], 
            [0,  0, -1]   
        ])
        pose_3d = np.einsum('ij,klj->kli', rotation_matrix_x, pose_3d)

        min_y = np.min(pose_3d[:, :, 1])
        pose_3d[:, :, 1] += -min_y

        pose_3d *= 0.025
        return pose_3d
    
    @staticmethod
    def get_keypoints_list(cap, pose_model, img_width, img_height):
        keypoints_list = []
        pose_world_keypoints_list = []
        landmarks_list = []
                
        if img_width == 0 or img_height == 0:
                raise ValueError("Invalid frame dimensions: height or width is 0.")
            
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            keypoints, pose_world_keypoints, landmarks = PoseUtils.process_frame(frame, pose_model, img_width, img_height)
            keypoints_list.append(keypoints)
            pose_world_keypoints_list.append(pose_world_keypoints)
            landmarks_list.append(landmarks)


        return keypoints_list, pose_world_keypoints_list, landmarks_list
    
    @staticmethod
    def process_frame(frame, pose_model, img_width, img_height):
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            detection_result = pose_model.process(rgb_frame)

            keypoints = np.zeros((25, 3))
            pose_world_keypoints = np.zeros((25, 3))
            landmarks_list = []
            
            if detection_result.pose_landmarks:
                landmarks = detection_result.pose_landmarks.landmark
                landmarks_list.append(landmarks)
                # landmarks = detection_result.pose_world_landmarks.landmark

                pose_world_landmarks = detection_result.pose_world_landmarks.landmark

                for mp_idx, openpose_idx in PoseUtils.mediapipe_to_openpose.items():
                    if mp_idx < len(landmarks):
                        landmark = landmarks[mp_idx]
                        world_landmark = pose_world_landmarks[mp_idx]
                        
                        keypoints[openpose_idx] = [landmark.x * img_width, landmark.y * img_height, 1.0]
                        pose_world_keypoints[openpose_idx] = [world_landmark.x, world_landmark.y, world_landmark.z]
                        

                neck = PoseUtils.interpolate_joint(landmarks[11], landmarks[12])
                keypoints[1] = [neck[0] * img_width, neck[1] * img_height, 1.0]
                
                neck_world = PoseUtils.interpolate_joint(pose_world_landmarks[11], pose_world_landmarks[12])
                pose_world_keypoints[1] = [neck_world[0], neck_world[1], neck_world[2]]
                
                mid_hip = PoseUtils.interpolate_joint(landmarks[23], landmarks[24])
                keypoints[8] = [mid_hip[0] * img_width, mid_hip[1] * img_height, 1.0]
                
                mid_hip_world = PoseUtils.interpolate_joint(pose_world_landmarks[23], pose_world_landmarks[24])
                pose_world_keypoints[8] = [mid_hip_world[0], mid_hip_world[1], mid_hip_world[2]]
                
                keypoints[21] = keypoints[14]
                keypoints[24] = keypoints[11]
                
                pose_world_keypoints[21] = pose_world_keypoints[14]
                pose_world_keypoints[24] = pose_world_keypoints[11]
                       
            return keypoints, pose_world_keypoints, landmarks_list
        except Exception as e:
            print(f"Error processing a frame: {e}")
            raise RuntimeError(f"Error processing a frame: {e}")
    
    @staticmethod
    def get_root_keypoints(landmarks_list):
        root_keypoints = []

        # Relevant keypoints for stable root motion
        relevant_indices = [11, 12, 23, 24, 25, 26]  # Hips, knees, ankles
        num_keypoints = len(relevant_indices)  # Expected number of keypoints per frame
        default_value = [0.0, 0.0, 0.0]  # Default value if no previous frame exists

        # Store the last valid frame to fill missing values
        previous_frame = [default_value] * num_keypoints  # Initialize with default

        for frame in landmarks_list:
            frame_keypoints = []  # Store only relevant keypoints

            if frame:  # Ensure the frame is not empty
                for landmarks in frame:
                    if landmarks:
                        for i in relevant_indices:
                            if i < len(landmarks):  # Ensure index is within bounds
                                landmark = landmarks[i]
                                frame_keypoints.append([landmark.x, landmark.y, landmark.z])  # Collect selected keypoints
                            else:
                                frame_keypoints.append(previous_frame[i])  # Use previous frame value if missing
                    else:
                        frame_keypoints = previous_frame.copy()  # Use entire previous frame if landmarks are empty
            else:
                frame_keypoints = previous_frame.copy()  # Use previous frame if entire frame is missing

            # Ensure the frame has the correct number of keypoints
            while len(frame_keypoints) < num_keypoints:
                frame_keypoints.append(previous_frame[len(frame_keypoints)])  # Fill with previous values

            # Store this frame for future reference
            previous_frame = frame_keypoints.copy()

            # Compute the average of selected keypoints
            avg_root = np.mean(frame_keypoints, axis=0)  # Mean of relevant keypoints
            root_keypoints.append(avg_root.tolist())  # Store as list
            
        return root_keypoints
    
    @staticmethod
    def initialize_3D_pose_estimator(config_file, checkpoint_file):
        try:
            temp = pathlib.PosixPath
            pathlib.PosixPath = pathlib.WindowsPath

            importlib.reload(estimator_3d)

            e3d = estimator_3d.Estimator3D(config_file=config_file, checkpoint_file=checkpoint_file)

            pathlib.PosixPath = temp
            return e3d
        except Exception as e:
            raise RuntimeError(f"Error initializing Estimator3D: {e}")
        
    @staticmethod
    def estimate_3d_from_2d(keypoints_list, estimator_3d, img_width, img_height):
        try:
            pose2d = np.stack(keypoints_list)[:, :, :2]
            return estimator_3d.estimate(pose2d, image_width=img_width, image_height=img_height)
        except Exception as e:
            raise RuntimeError(f"Error in estimate_3d_from_2d: {e}")
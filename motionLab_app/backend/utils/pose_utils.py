import numpy as np
import importlib
import pathlib
from utils.pose_estimator_3d import estimator_3d

class PoseUtils:
    
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
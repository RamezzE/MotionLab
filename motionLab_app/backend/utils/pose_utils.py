import numpy as np

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
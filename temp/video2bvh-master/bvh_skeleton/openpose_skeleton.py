from . import math3d
from . import bvh_helper
import numpy as np


class OpenPoseSkeleton(object):

    def __init__(self):
        self.root = 'MidHip'
        self.keypoint2index = {
            'Nose': 0,
            'Neck': 1,
            'RShoulder': 2,
            'RElbow': 3,
            'RWrist': 4,
            'LShoulder': 5,
            'LElbow': 6,
            'LWrist': 7,
            'MidHip': 8,
            'RHip': 9,
            'RKnee': 10,
            'RAnkle': 11,
            'LHip': 12,
            'LKnee': 13,
            'LAnkle': 14,
            'REye': 15,
            'LEye': 16,
            'REar': 17,
            'LEar': 18,
            'LBigToe': 19,
            'LSmallToe': 20,
            'LHeel': 21,
            'RBigToe': 22,
            'RSmallToe': 23,
            'RHeel': 24
        }
        self.index2keypoint = {v: k for k, v in self.keypoint2index.items()}
        self.keypoint_num = len(self.keypoint2index)

        self.children = {
            'MidHip': ['Neck', 'RHip', 'LHip'],
            'Neck': ['Nose', 'RShoulder', 'LShoulder'],
            'Nose': ['REye', 'LEye'],
            'REye': ['REar'],
            'REar': [],
            'LEye': ['LEar'],
            'LEar': [],
            'RShoulder': ['RElbow'],
            'RElbow': ['RWrist'],
            'RWrist': [],
            'LShoulder': ['LElbow'],
            'LElbow': ['LWrist'],
            'LWrist': [],
            'RHip': ['RKnee'],
            'RKnee': ['RAnkle'],
            'RAnkle': ['RBigToe', 'RSmallToe', 'RHeel'],
            'RBigToe': [],
            'RSmallToe': [],
            'RHeel': [],
            'LHip': ['LKnee'],
            'LKnee': ['LAnkle'],
            'LAnkle': ['LBigToe', 'LSmallToe', 'LHeel'],
            'LBigToe': [],
            'LSmallToe': [],
            'LHeel': [],
        }
        self.parent = {self.root: None}
        for parent, children in self.children.items():
            for child in children:
                self.parent[child] = parent
        
        self.left_joints = [
            joint for joint in self.keypoint2index
            if 'Left' in joint
        ]
        self.right_joints = [
            joint for joint in self.keypoint2index
            if 'Right' in joint
        ]
        # Define initial directions for OpenPose joints
        self.initial_directions = {
            'MidHip': [0, 0, 0],
            'Neck': [0, 0, 1],
            'Nose': [0, 0, 1],
            'RShoulder': [1, 0, 0],
            'RElbow': [1, 0, 0],
            'RWrist': [1, 0, 0],
            'LShoulder': [-1, 0, 0],
            'LElbow': [-1, 0, 0],
            'LWrist': [-1, 0, 0],
            'RHip': [1, 0, 0],
            'RKnee': [1, 0, 0],
            'RAnkle': [1, 0, 0],
            'RBigToe': [1, 0, 0],
            'RSmallToe': [1, 0, 0],
            'RHeel': [1, 0, 0],
            'LHip': [-1, 0, 0],
            'LKnee': [-1, 0, 0],
            'LAnkle': [-1, 0, 0],
            'LBigToe': [-1, 0, 0],
            'LSmallToe': [-1, 0, 0],
            'LHeel': [-1, 0, 0],
            'REye': [0, 1, 0],
            'LEye': [0, 1, 0],
            'REar': [0, 1, 0],
            'LEar': [0, 1, 0],
        }

    def get_initial_offset(self, poses_3d):
        bone_lens = {self.root: [0]}
        stack = [self.root]
        while stack:
            parent = stack.pop()
            p_idx = self.keypoint2index[parent]
            p_name = parent
            while p_idx == -1:
                p_name = self.parent[p_name]
                p_idx = self.keypoint2index[p_name]
            for child in self.children[parent]:
                stack.append(child)

                if self.keypoint2index[child] == -1:
                    bone_lens[child] = [0.1]
                else:
                    c_idx = self.keypoint2index[child]
                    bone_lens[child] = np.linalg.norm(
                        poses_3d[:, p_idx] - poses_3d[:, c_idx],
                        axis=1
                    )

        bone_len = {}
        for joint in self.keypoint2index:
            if 'Left' in joint or 'Right' in joint:
                base_name = joint.replace('Left', '').replace('Right', '')
                left_len = np.mean(bone_lens['Left' + base_name])
                right_len = np.mean(bone_lens['Right' + base_name])
                bone_len[joint] = (left_len + right_len) / 2
            else:
                bone_len[joint] = np.mean(bone_lens[joint])

        initial_offset = {}
        for joint, direction in self.initial_directions.items():
            direction = np.array(direction) / max(np.linalg.norm(direction), 1e-12)
            initial_offset[joint] = direction * bone_len[joint]

        return initial_offset

    def get_bvh_header(self, poses_3d):
        initial_offset = self.get_initial_offset(poses_3d)

        nodes = {}
        for joint in self.keypoint2index:
            is_root = joint == self.root
            is_end_site = 'EndSite' in joint
            nodes[joint] = bvh_helper.BvhNode(
                name=joint,
                offset=initial_offset[joint],
                rotation_order='zxy' if not is_end_site else '',
                is_root=is_root,
                is_end_site=is_end_site,
            )
        for joint, children in self.children.items():
            nodes[joint].children = [nodes[child] for child in children]
            for child in children:
                nodes[child].parent = nodes[joint]

        header = bvh_helper.BvhHeader(root=nodes[self.root], nodes=nodes)
        return header
    
    def pose2euler(self, pose, header):
        """
        Convert a 3D pose to Euler angles for BVH.
        
        Args:
        - pose: 3D coordinates of the joints (list of size [num_joints, 3])
        - header: BVH header containing joint structure and rotation order.
        
        Returns:
        - channel: list of Euler angles for the pose in order
        """
        # Initialize the channel list and storage for quaternions and euler angles
        channel = []
        quats = {}  # store quaternions for each joint
        eulers = {}  # store Euler angles for each joint

        # Stack for traversing the skeleton starting from the root
        stack = [header.root]

        # Iterate over the joint hierarchy
        while stack:
            node = stack.pop()
            joint = node.name
            joint_idx = self.keypoint2index[joint]

            # Add the position (X, Y, Z) to the channel for the root joint
            if node.is_root:
                channel.extend(pose[joint_idx])  # Translation in 3D

            # Determine the axis directions based on parent-child relationships
            if joint == 'MidHip':
                # Special case for the root (MidHip), orientation is computed based on hips and neck
                x_dir = pose[self.keypoint2index['LHip']] - pose[self.keypoint2index['RHip']]  # Left-Right direction
                z_dir = pose[self.keypoint2index['Neck']] - pose[joint_idx]  # Forward direction (towards Neck)
                order = 'zyx'  # Convention for Euler angles

            elif joint == 'RHip' or joint == 'LHip':
                # For hips, orientation is computed based on knee direction
                child_idx = self.keypoint2index[node.children[0].name]
                z_dir = pose[joint_idx] - pose[child_idx]  # Direction from hip to knee
                order = 'zyx'  # Convention for Euler angles

            else:
                # For other joints, orientation is determined by child joint directions
                parent_idx = self.keypoint2index[self.parent[joint]]
                child_idx = self.keypoint2index[node.children[0].name] if node.children else None
                if child_idx is not None:
                    z_dir = pose[joint_idx] - pose[child_idx]
                    order = 'zyx'
                else:
                    z_dir = pose[joint_idx] - pose[parent_idx]
                    order = 'zyx'

            # Create Direction Cosine Matrix (DCM) from axis vectors
            if 'x_dir' in locals() and 'z_dir' in locals():
                # Compute DCM if x_dir and z_dir are defined
                dcm = math3d.dcm_from_axis(x_dir, None, z_dir, order)
            else:
                # If no explicit directions, use default
                dcm = math3d.dcm_from_axis(None, None, z_dir, order)

            # Convert DCM to quaternion
            quats[joint] = math3d.dcm2quat(dcm)

            # If the joint has a parent, calculate local quaternion
            if node.parent:
                local_quat = math3d.quat_divide(quats[joint], quats[node.parent.name])
            else:
                local_quat = quats[joint]  # Root joint, no parent

            # Convert quaternion to Euler angles
            euler = math3d.quat2euler(local_quat, order=node.rotation_order)
            euler = np.rad2deg(euler)  # Convert radians to degrees
            eulers[joint] = euler
            channel.extend(euler)

            # Add children of the current joint to the stack for next iteration
            for child in node.children[::-1]:  # Reverse to maintain correct order
                if not child.is_end_site:
                    stack.append(child)

        return channel
    
    def poses2bvh(self, poses_3d, header=None, output_file=None):
        if not header:
            header = self.get_bvh_header(poses_3d)

        channels = []
        for frame, pose in enumerate(poses_3d):
            channels.append(self.pose2euler(pose, header))

        if output_file:
            bvh_helper.write_bvh(output_file, header, channels)

        return channels, header

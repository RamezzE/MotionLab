from . import math3d
from . import bvh_helper

import numpy as np
from pprint import pprint


class CMUSkeleton(object):

    def __init__(self):
        self.counter = -1
        self.root_positions = []
        self.root = 'Hips'
        self.keypoint2index = {
            'Hips': 0,
            'RightUpLeg': 1,
            'RightLeg': 2,
            'RightFoot': 3,
            'LeftUpLeg': 4,
            'LeftLeg': 5,
            'LeftFoot': 6,
            'Spine': 7,
            'Spine1': 8,
            'Neck1': 9,
            'Head': 10,
            'LeftArm': 11,
            'LeftForeArm': 12,
            'LeftHand': 13,
            'RightArm': 14,
            'RightForeArm': 15,
            'RightHand': 16,
            # Additional joints with index -1
            'LHipJoint': -1,
            'RHipJoint': -1,
            'LeftToeBase': -1,
            'RightToeBase': -1,
            'LeftShoulder': -1,
            'RightShoulder': -1,
            'Neck': -1,
            'LeftFingerBase': -1,
            'LeftHandIndex1': -1,
            'LThumb': -1,
            'RightFingerBase': -1,
            'RightHandIndex1': -1,
            'RThumb': -1,
            'LowerBack': -1,
            # End Site joints
            'LeftToeBase_End': -1,
            'RightToeBase_End': -1,
            'Head_End': -1,
            'LeftHandIndex1_End': -1,
            'LThumb_End': -1,
            'RightHandIndex1_End': -1,
            'RThumb_End': -1,
        }
        self.index2keypoint = {v: k for k, v in self.keypoint2index.items() if v != -1}
        self.keypoint_num = len([k for k, v in self.keypoint2index.items() if v != -1])

        self.children = {
            'Hips': ['LHipJoint', 'RHipJoint', 'LowerBack'],  
            'RHipJoint': ['RightUpLeg'],
            'RightUpLeg': ['RightLeg'],
            'RightLeg': ['RightFoot'],
            'RightFoot': ['RightToeBase'],
            'RightToeBase': ['RightToeBase_End'],
            'RightToeBase_End': [],  # End sites should have no children
            'LHipJoint': ['LeftUpLeg'],
            'LeftUpLeg': ['LeftLeg'],
            'LeftLeg': ['LeftFoot'],
            'LeftFoot': ['LeftToeBase'],
            'LeftToeBase': ['LeftToeBase_End'],
            'LeftToeBase_End': [],  # End sites should have no children
            'LowerBack': ['Spine'],
            'Spine': ['Spine1'],
            'Spine1': ['Neck', 'LeftShoulder', 'RightShoulder'],
            'LeftShoulder': ['LeftArm'],
            'LeftArm': ['LeftForeArm'],
            'LeftForeArm': ['LeftHand'],
            'LeftHand': ['LeftFingerBase', 'LThumb'],
            'LeftFingerBase': ['LeftHandIndex1'],
            'LeftHandIndex1': ['LeftHandIndex1_End'],
            'LeftHandIndex1_End': [],  # End sites should have no children
            'LThumb': ['LThumb_End'],
            'LThumb_End': [],  # End sites should have no children
            'Neck': ['Neck1'],
            'Neck1': ['Head'],
            'Head': ['Head_End'],
            'Head_End': [],  # End sites should have no children
            'RightShoulder': ['RightArm'],
            'RightArm': ['RightForeArm'],
            'RightForeArm': ['RightHand'],
            'RightHand': ['RightFingerBase', 'RThumb'],
            'RightFingerBase': ['RightHandIndex1'],
            'RightHandIndex1': ['RightHandIndex1_End'],
            'RightHandIndex1_End': [],  # End sites should have no children
            'RThumb': ['RThumb_End'],
            'RThumb_End': [],  # End sites should have no children
        }
        
        # Build parent dictionary
        self.parent = {self.root: None}
        for parent, children in self.children.items():
            for child in children:
                self.parent[child] = parent
                
        # Define left and right joints
        self.left_joints = [
            joint for joint in self.keypoint2index
            if joint.startswith('Left') or joint.startswith('L') and joint != 'LowerBack'
        ]
        self.right_joints = [
            joint for joint in self.keypoint2index
            if joint.startswith('Right') or joint.startswith('R')
        ]

        # T-pose directions
        self.initial_directions = {
            'Hips': [0, 0, 0],
            'RHipJoint': [0, 0, 0],
            'RightUpLeg': [-1, 0, 0],
            'RightLeg': [0, 0, -1],
            'RightFoot': [0, 0, -1],
            'RightToeBase': [0, -1, 0],
            'RightToeBase_End': [0, 0, 1],
            'LHipJoint': [0, 0, 0],
            'LeftUpLeg': [1, 0, 0],
            'LeftLeg': [0, 0, -1],
            'LeftFoot': [0, 0, -1],
            'LeftToeBase': [0, -1, 0],
            'LeftToeBase_End': [0, 0, 1],
            'LowerBack': [0, 0, 0],
            'Spine': [0, 0, 1],
            'Spine1': [0, 0, 1],
            'LeftShoulder': [0, 0, 0],
            'LeftArm': [1, 0, 0],
            'LeftForeArm': [1, 0, 0],
            'LeftHand': [1, 0, 0],
            'LeftFingerBase': [0, 0, 0],
            'LeftHandIndex1': [1, 0, 0],
            'LeftHandIndex1_End': [1, 0, 0],
            'LThumb': [1, 0, 0],
            'LThumb_End': [1, 0, 1],
            'Neck': [0, 0, 0],
            'Neck1': [0, 0, 1],
            'Head': [0, 0, 1],
            'Head_End': [0, 1, -0.2],
            'RightShoulder': [0, 0, 0],
            'RightArm': [-1, 0, 0],
            'RightForeArm': [-1, 0, 0],
            'RightHand': [-1, 0, 0],
            'RightFingerBase': [0, 0, 0],
            'RightHandIndex1': [-1, 0, 0],
            'RightHandIndex1_End': [-1, 0, 0],
            'RThumb': [-1, 0, 0],
            'RThumb_End': [-1, 0, 1],
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
                    bone_lens[child] = [0.1]  # Default length for end sites
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
                if 'Left' + base_name in bone_lens and 'Right' + base_name in bone_lens:
                    left_len = np.mean(bone_lens['Left' + base_name])
                    right_len = np.mean(bone_lens['Right' + base_name])
                    bone_len[joint] = (left_len + right_len) / 2
                else:
                    bone_len[joint] = np.mean(bone_lens.get(joint, [0.1]))
            else:
                bone_len[joint] = np.mean(bone_lens.get(joint, [0.1]))

        initial_offset = {}
        for joint, direction in self.initial_directions.items():
            direction = np.array(direction) / max(np.linalg.norm(direction), 1e-12)
            initial_offset[joint] = direction * bone_len.get(joint, 0.1)

        return initial_offset

    def get_bvh_header(self, poses_3d):
        initial_offset = self.get_initial_offset(poses_3d)

        nodes = {}
        for joint in self.keypoint2index:
            is_end_site = joint.endswith('_End')
            nodes[joint] = bvh_helper.BvhNode(
                name=joint.replace('_End', '') if is_end_site else joint,
                offset=initial_offset[joint],
                rotation_order='zyx' if not is_end_site else '',
                is_root=joint == self.root,
                is_end_site=is_end_site,
            )
        
        # Set up parent-child relationships
        for joint, children in self.children.items():
            nodes[joint].children = [nodes[child] for child in children]
            for child in children:
                nodes[child].parent = nodes[joint]

        header = bvh_helper.BvhHeader(root=nodes[self.root], nodes=nodes)
        return header


    def pose2euler(self, pose, header):
        channel = []
        quats = {}
        eulers = {}
        stack = [header.root]
        while stack:
            node = stack.pop()
            joint = node.name
            joint_idx = self.keypoint2index[joint]
            
            if node.is_root:
                self.counter += 1
                MAX_X = 50
                # MAX_X = 100
                # MAX_X = 30
                MAX_Y = 50
                MIN_Y = 0
                
                OLD_MAX = 1
                OLD_MIN = 0
                                
                x = ((self.root_positions[self.counter][0] - OLD_MIN) / (OLD_MAX - OLD_MIN)) * (MAX_X - -MAX_X) + -MAX_X
                y = ((self.root_positions[self.counter][1] - OLD_MIN) / (OLD_MAX - OLD_MIN)) * (MAX_Y - MIN_Y) + MIN_Y
                # z = ((self.root_positions[self.counter][2] - OLD_MIN) / (OLD_MAX - OLD_MIN)) * (50 - 0) + 0
                pos = [x, y, 0]
                channel.extend(pos)

            index = self.keypoint2index
            order = None
            if joint == 'Hips':
                x_dir = pose[index['LeftUpLeg']] - pose[index['RightUpLeg']]
                y_dir = None
                z_dir = pose[index['Spine']] - pose[joint_idx]
                order = 'zyx'
            elif joint in ['RightUpLeg', 'RightLeg']:
                child_idx = self.keypoint2index[node.children[0].name]
                x_dir = pose[index['Hips']] - pose[index['RightUpLeg']]
                y_dir = None
                z_dir = pose[joint_idx] - pose[child_idx]
                order = 'zyx'
            elif joint in ['LeftUpLeg', 'LeftLeg']:
                child_idx = self.keypoint2index[node.children[0].name]
                x_dir = pose[index['LeftUpLeg']] - pose[index['Hips']]
                y_dir = None
                z_dir = pose[joint_idx] - pose[child_idx]
                order = 'zyx'
            elif joint == 'Spine':
                x_dir = pose[index['LeftUpLeg']] - pose[index['RightUpLeg']]
                y_dir = None
                z_dir = pose[index['Spine1']] - pose[joint_idx]
                order = 'zyx'
            elif joint == 'Spine1':
                x_dir = pose[index['LeftArm']] - pose[index['RightArm']]
                y_dir = None
                z_dir = pose[joint_idx] - pose[index['Spine']]
                order = 'zyx'
            elif joint == 'Neck1':
                x_dir = None
                y_dir = pose[index['Spine1']] - pose[joint_idx]
                z_dir = pose[index['Head']] - pose[index['Spine1']]
                order = 'zyx'
            elif joint == 'LeftArm':
                x_dir = pose[index['LeftForeArm']] - pose[joint_idx]
                y_dir = pose[index['LeftForeArm']] - pose[index['LeftHand']]
                z_dir = None
                order = 'zyx'
            elif joint == 'LeftForeArm':
                x_dir = pose[index['LeftHand']] - pose[joint_idx]
                y_dir = pose[joint_idx] - pose[index['LeftArm']]
                z_dir = None
                order = 'zyx'
            elif joint == 'RightArm':
                x_dir = pose[joint_idx] - pose[index['RightForeArm']]
                y_dir = pose[index['RightForeArm']] - pose[index['RightHand']]
                z_dir = None
                order = 'zyx'
            elif joint == 'RightForeArm':
                x_dir = pose[joint_idx] - pose[index['RightHand']]
                y_dir = pose[joint_idx] - pose[index['RightArm']]
                z_dir = None
                order = 'zyx'
            
            if order:
                if x_dir is None and y_dir is not None and z_dir is not None:
                    x_dir = np.cross(y_dir, z_dir)
                elif y_dir is None and x_dir is not None and z_dir is not None:
                    y_dir = np.cross(z_dir, x_dir)
                elif z_dir is None and x_dir is not None and y_dir is not None:
                    z_dir = np.cross(x_dir, y_dir)
                
                if x_dir is None:
                    x_dir = np.array([1, 0, 0])
                if y_dir is None:
                    y_dir = np.array([0, 1, 0])
                if z_dir is None:
                    z_dir = np.array([0, 0, 1])
                    
                dcm = math3d.dcm_from_axis(x_dir, y_dir, z_dir, order)
                quats[joint] = math3d.dcm2quat(dcm)
            else:
                quats[joint] = quats[self.parent[joint]].copy()
            
            local_quat = quats[joint].copy()
            if node.parent:
                local_quat = math3d.quat_divide(
                    q=quats[joint], r=quats[node.parent.name]
                )
            
            euler = math3d.quat2euler(
                q=local_quat, order=node.rotation_order
            )
            euler = np.rad2deg(euler)
            eulers[joint] = euler
            channel.extend(euler)

            for child in node.children[::-1]:
                if not child.is_end_site:
                    stack.append(child)

        return channel


    def poses2bvh(self, poses_3d, header=None, output_file=None, fps=30, root_keypoints=None):
        if root_keypoints:
            self.root_positions = root_keypoints
        
        if not header:
            header = self.get_bvh_header(poses_3d)

        channels = []
        for frame, pose in enumerate(poses_3d):
            channels.append(self.pose2euler(pose, header))
        
        if output_file:
            bvh_helper.write_bvh(output_file, header, channels, fps)
        
        return channels, header
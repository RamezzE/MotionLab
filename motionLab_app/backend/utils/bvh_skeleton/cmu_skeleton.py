from . import math3d
from . import bvh_helper

import numpy as np
from pprint import pprint


class CMUSkeleton(object):

    def __init__(self):
        self.root = 'Hips'
        self.counter = -1
        self.root_positions = []
        self.keypoint2index = {
            # Body joints (0-16)
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
            'HeadEndSite': 10,
            'LeftArm': 11,
            'LeftForeArm': 12,
            'LeftHand': 13,
            'RightArm': 14,
            'RightForeArm': 15,
            'RightHand': 16,
            
            # Left hand joints (17-31)
            'LeftThumb': 17,
            'LeftThumbMid': 18,
            'LeftThumbTip': 19,
            'LeftIndex': 20,
            'LeftIndexMid': 21,
            'LeftIndexTip': 22,
            'LeftMiddle': 23,
            'LeftMiddleMid': 24,
            'LeftMiddleTip': 25,
            'LeftRing': 26,
            'LeftRingMid': 27,
            'LeftRingTip': 28,
            'LeftPinky': 29,
            'LeftPinkyMid': 30,
            'LeftPinkyTip': 31,
            
            # Right hand joints (32-46)
            'RightThumb': 32,
            'RightThumbMid': 33,
            'RightThumbTip': 34,
            'RightIndex': 35,
            'RightIndexMid': 36,
            'RightIndexTip': 37,
            'RightMiddle': 38,
            'RightMiddleMid': 39,
            'RightMiddleTip': 40,
            'RightRing': 41,
            'RightRingMid': 42,
            'RightRingTip': 43,
            'RightPinky': 44,
            'RightPinkyMid': 45,
            'RightPinkyTip': 46,
            
            # Unused joints
            'RightHipJoint': -1,
            'RightFootEndSite': -1,
            'LeftHipJoint': -1,
            'LeftFootEndSite': -1,
            'LeftShoulder': -1,
            'RightShoulder': -1,
            'LowerBack': -1,
            'Neck': -1,
        }
        self.index2keypoint = {v: k for k, v in self.keypoint2index.items()}
        self.keypoint_num = len(self.keypoint2index)

        self.children = {
            'Hips': ['LeftHipJoint', 'LowerBack', 'RightHipJoint'],
            'LeftHipJoint': ['LeftUpLeg'],
            'LeftUpLeg': ['LeftLeg'],
            'LeftLeg': ['LeftFoot'],
            'LeftFoot': ['LeftFootEndSite'],
            'LeftFootEndSite': [],
            'LowerBack': ['Spine'],
            'Spine': ['Spine1'],
            'Spine1': ['LeftShoulder', 'Neck', 'RightShoulder'],
            'LeftShoulder': ['LeftArm'],
            'LeftArm': ['LeftForeArm'],
            'LeftForeArm': ['LeftHand'],
            # 'LeftHand': ['LeftHandEndSite'],
            
            # 'LeftHandEndSite': [],
            'Neck': ['Neck1'],
            'Neck1': ['HeadEndSite'],
            'HeadEndSite': [],
            'RightShoulder': ['RightArm'],
            'RightArm': ['RightForeArm'],
            'RightForeArm': ['RightHand'],
            # 'RightHand': ['RightHandEndSite'],
            
            # Left Fingers
            'LeftHand': ['LeftThumb', 'LeftIndex', 'LeftMiddle', 'LeftRing', 'LeftPinky'],
            
            # Left Thumb
            'LeftThumb': ['LeftThumbMid'],
            'LeftThumbMid': ['LeftThumbTip'],
            'LeftThumbTip': [],
            # 'LeftThumbTipEndSite': [],
            
            # Left Index
            'LeftIndex': ['LeftIndexMid'],
            'LeftIndexMid': ['LeftIndexTip'],
            'LeftIndexTip': [],
            # 'LeftIndexTipEndSite': [],
            
            # Left Middle
            'LeftMiddle': ['LeftMiddleMid'],
            'LeftMiddleMid': ['LeftMiddleTip'],
            'LeftMiddleTip':[],
            # 'LeftMiddleTipEndSite': [],
            
            # Left Ring
            'LeftRing': ['LeftRingMid'],
            'LeftRingMid': ['LeftRingTip'],
            'LeftRingTip': [],
            # 'LeftRingTipEndSite': [],
            
            # Left Pinky
            'LeftPinky': ['LeftPinkyMid'],
            'LeftPinkyMid': ['LeftPinkyTip'],
            'LeftPinkyTip': [],
            # 'LeftPinkyTipEndSite': [],
            
            # Right Fingers
            'RightHand': ['RightThumb', 'RightIndex', 'RightMiddle', 'RightRing', 'RightPinky'],
            
            # Right Thumb
            'RightThumb': ['RightThumbMid'],
            'RightThumbMid': ['RightThumbTip'],
            'RightThumbTip': [],
            # 'RightThumbTipEndSite': [],
            
            # Right Index
            'RightIndex': ['RightIndexMid'],
            'RightIndexMid': ['RightIndexTip'],
            'RightIndexTip': [],
            # 'RightIndexTipEndSite': [],
            
            # Right Middle
            'RightMiddle': ['RightMiddleMid'],
            'RightMiddleMid': ['RightMiddleTip'],
            'RightMiddleTip': [],
            # 'RightMiddleTipEndSite': [],
            
            # Right Ring
            'RightRing': ['RightRingMid'],
            'RightRingMid': ['RightRingTip'],
            'RightRingTip': [],
            # 'RightRingTipEndSite': [],
            
            # Right Pinky
            'RightPinky': ['RightPinkyMid'],
            'RightPinkyMid': ['RightPinkyTip'],
            'RightPinkyTip': [],
            # 'RightPinkyTipEndSite': [],
            
            # 'RightHandEndSite': [],
            'RightHipJoint': ['RightUpLeg'],
            'RightUpLeg': ['RightLeg'],
            'RightLeg': ['RightFoot'],
            'RightFoot': ['RightFootEndSite'],
            'RightFootEndSite': [],
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

        # T-pose
        self.initial_directions = {
            'Hips': [0, 0, 0],
            'LeftHipJoint': [1, 0, 0],
            'LeftUpLeg': [1, 0, 0],
            'LeftLeg': [0, 0, -1],
            'LeftFoot': [0, 0, -1],
            'LeftFootEndSite': [0, -1, 0],
            'LowerBack': [0, 0, 1],
            'Spine': [0, 0, 1],
            'Spine1': [0, 0, 1],
            'LeftShoulder': [1, 0, 0],
            'LeftArm': [1, 0, 0],
            'LeftForeArm': [1, 0, 0],
            'LeftHand': [1, 0, 0],
            # 'LeftHandEndSite': [1, 0, 0],
            'Neck': [0, 0, 1],
            'Neck1': [0, 0, 1],
            'HeadEndSite': [0, 0, 1],
            'RightShoulder': [-1, 0, 0],
            'RightArm': [-1, 0, 0],
            'RightForeArm': [-1, 0, 0],
            'RightHand': [-1, 0, 0],
            # 'RightHandEndSite': [-1, 0, 0],
            'RightHipJoint': [-1, 0, 0],
            'RightUpLeg': [-1, 0, 0],
            'RightLeg': [0, 0, -1],
            'RightFoot': [0, 0, -1],
            'RightFootEndSite': [0, -1, 0],
            
        
            "LeftThumb": [1, 0.3, 0.4],
            "LeftThumbMid": [1, 0.2, 0.3],
            "LeftThumbTip": [1, 0.1, 0.3],

            "LeftIndex": [1, 0, 0.17],
            "LeftIndexMid": [1, 0, 0.08],
            "LeftIndexTip": [1, 0, 0.05],

            "LeftMiddle": [1, 0, 0.05],  
            "LeftMiddleMid": [1, 0, 0.03],
            "LeftMiddleTip": [1, 0, 0.02],

            "LeftRing": [1, 0, -0.1], 
            "LeftRingMid": [1, 0, -0.08],
            "LeftRingTip": [1, 0, -0.06],

            "LeftPinky": [1, 0, -0.2],
            "LeftPinkyMid": [1, 0, -0.15],
            "LeftPinkyTip": [1, 0, -0.13],

            "RightThumb": [-1, 0.3, 0.4],  
            "RightThumbMid": [-1, 0.2, 0.3],
            "RightThumbTip": [-1, 0.1, 0.3],

            "RightIndex": [-1, 0, 0.17],
            "RightIndexMid": [-1, 0, 0.08],
            "RightIndexTip": [-1, 0, 0.05],

            "RightMiddle": [-1, 0, 0.05],
            "RightMiddleMid": [-1, 0, 0.03],
            "RightMiddleTip": [-1, 0, 0.02],

            "RightRing": [-1, 0, -0.1],
            "RightRingMid": [-1, 0, -0.08],
            "RightRingTip": [-1, 0, -0.06],

            "RightPinky": [-1, 0, -0.2],
            "RightPinkyMid": [-1, 0, -0.15],
            "RightPinkyTip": [-1, 0, -0.13]
    }

        # Print debug info inside __init__
        print("Expected joints in CMU skeleton:", len(self.keypoint2index))
        active_joints = {k: v for k, v in self.keypoint2index.items() if v >= 0}
        print("Active joints:", len(active_joints))
        print("Active joint mapping:", active_joints)

    def get_initial_offset(self, poses_3d):
        # TODO: RANSAC
        bone_lens = {self.root: [0]}
        stack = [self.root]
        while stack:
            parent = stack.pop()
            p_idx = self.keypoint2index[parent]
            p_name = parent
            while p_idx == -1:
                # Find real parent
                p_name = self.parent[p_name]
                p_idx = self.keypoint2index[p_name]
                
            for child in self.children[parent]:
                stack.append(child)

                if self.keypoint2index[child] == -1:
                    # Assign correct finger lengths manually
                    finger_lengths = {
                        'Thumb': [2.5, 1.5, 1],  # [Base, Mid, Tip] 
                        'Index': [3.0, 2.5, 2.0],  
                        'Middle': [3.0, 2.5, 2.0],  
                        'Ring': [2.8, 2.3, 1.8],    
                        'Pinky': [2.5, 2.0, 1.5]    
                    }
                    
                    scale = 0.5

                    for finger, lengths in finger_lengths.items():
                        if finger in child:
                            if 'Middle' in child: # Handle Middle finger differently because of common 'Mid' substring
                                if 'MiddleMid' in child:
                                    bone_lens[child] = lengths[1] * scale
                                elif 'MiddleTip' in child:
                                    bone_lens[child] = lengths[2] * scale
                                elif 'MiddleTipEndSite' in child:
                                    bone_lens[child] = 0.3
                                else:
                                    bone_lens[child] = lengths[0] * scale
                                break # Stop after assigning the right offset
                                
                            if 'Mid' in child:
                                bone_lens[child] = lengths[1] * scale # Mid joint
                            elif 'Tip' in child and 'EndSite' not in child:
                                bone_lens[child] = lengths[2] * scale # Tip joint
                            elif 'EndSite' in child:
                                bone_lens[child] = 0.3
                            else:
                                bone_lens[child] = lengths[0] * scale # Base joint 
                            break  # Stop after assigning the right offset

                    else:
                        bone_lens[child] = 0.1  # Default small value for missing data

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
                left_len = np.mean(bone_lens['Left' + base_name]) if 'Left' + base_name in bone_lens else None
                right_len = np.mean(bone_lens['Right' + base_name]) if 'Right' + base_name in bone_lens else None

                if left_len is not None and right_len is not None:
                    bone_len[joint] = (left_len + right_len) / 2
                elif left_len is not None:
                    bone_len[joint] = left_len
                elif right_len is not None:
                    bone_len[joint] = right_len
                else:
                    bone_len[joint] = 0.1  # Default small value for missing data

            elif "Thumb" in joint or "Index" in joint or "Middle" in joint or "Ring" in joint or "Pinky" in joint:
                # Assign predefined lengths if not already set
                for finger, lengths in finger_lengths.items():
                    if finger in joint:
                        bone_len[joint] = lengths.pop(0)
                        break
                else:
                    bone_len[joint] = 0.1  # Default

            else:
                bone_len[joint] = np.mean(bone_lens[joint])

        # Compute the initial offsets using the corrected bone lengths
        initial_offset = {}
        for joint, direction in self.initial_directions.items():
            direction = np.array(direction, dtype=np.float64)  # Ensure high precision

            if joint in bone_len:
                # Use full precision and ensure multiplication is element-wise
                initial_offset[joint] = np.array(direction) * np.array(bone_len[joint], dtype=np.float64)
                # print("Joint: ", joint, "Direction: ", direction, "Bone Length: ", bone_len[joint])
                # print("Initial Offset: ", initial_offset[joint])
            else:
                initial_offset[joint] = np.array(direction) * 0.1  # Default small offset

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
        """Convert a single pose to Euler angles."""
        channels = []
        index = self.keypoint2index
        
        # First add root position
        channels.extend(pose[0])  # Root position
        
        # Process each joint
        for node in header.nodes:
            joint = node.name
            joint_idx = index[joint]
            
            # Skip joints that aren't in our pose data
            if joint_idx == -1:
                channels.extend([0, 0, 0])  # Add zero rotation for skipped joints
                continue
            
            try:
                # Handle different joint types
                if joint == 'Hips':
                    x_dir = pose[index['RightUpLeg']] - pose[index['LeftUpLeg']]
                    y_dir = pose[index['Spine']] - pose[joint_idx]
                    z_dir = np.cross(x_dir, y_dir)
                    order = 'xyz'
                
                # Handle hand joints specifically
                elif 'Hand' in joint or 'Thumb' in joint or 'Index' in joint or 'Middle' in joint or 'Ring' in joint or 'Pinky' in joint:
                    # For hand joints, use parent-child relationship for direction
                    parent_idx = index[self.parent[joint]]
                    if parent_idx >= 0:
                        # Calculate direction from parent to current joint
                        z_dir = pose[joint_idx] - pose[parent_idx]
                        # Create arbitrary but consistent x and y directions
                        x_dir = np.array([1, 0, 0])
                        y_dir = np.cross(z_dir, x_dir)
                        x_dir = np.cross(y_dir, z_dir)
                        order = 'xyz'
                    else:
                        # If no valid parent, use default orientation
                        channels.extend([0, 0, 0])
                        continue
                
                else:
                    # Handle other body joints as before
                    child_name = node.children[0].name if node.children else None
                    child_idx = index.get(child_name, -1)
                    if child_idx >= 0:
                        y_dir = pose[child_idx] - pose[joint_idx]
                    else:
                        y_dir = pose[joint_idx] - pose[index[self.parent[joint]]]
                    
                    x_dir = np.array([1, 0, 0])  # Arbitrary but consistent
                    z_dir = np.cross(x_dir, y_dir)
                    x_dir = np.cross(y_dir, z_dir)
                    order = 'xyz'
                
                # Normalize directions
                x_dir = x_dir / np.linalg.norm(x_dir)
                y_dir = y_dir / np.linalg.norm(y_dir)
                z_dir = z_dir / np.linalg.norm(z_dir)
                
                # Calculate rotation
                dcm = math3d.dcm_from_axis(x_dir, y_dir, z_dir, order)
                channels.extend(math3d.euler_from_dcm(dcm, order))
                
            except Exception as e:
                print(f"Warning: Error calculating rotation for joint {joint}, using zero rotation")
                channels.extend([0, 0, 0])
        
        return channels


    def poses2bvh(self, poses_3d, output_file, fps, root_keypoints=None):
        if root_keypoints is not None and root_keypoints.size > 0:  # Check if array exists and is not empty
            self.root_positions = root_keypoints
        else:
            self.root_positions = poses_3d[:, 0]  # Use first joint as root if no root_keypoints provided
        
        header = self.get_bvh_header(poses_3d)

        channels = []
        for frame, pose in enumerate(poses_3d):
            channels.append(self.pose2euler(pose, header))
        
        if output_file:
            bvh_helper.write_bvh(output_file, header, channels, fps)
        
        return channels, header
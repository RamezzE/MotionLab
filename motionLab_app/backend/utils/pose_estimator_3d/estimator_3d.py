from .model.factory import create_model
from .dataset.wild_pose_dataset import WildPoseDataset
import mediapipe as mp
import numpy as np
import pprint
import torch
import torch.utils.data
import yaml
from easydict import EasyDict
from pathlib import Path
import cv2
import os

class Estimator3D(object):
    """Base class of 3D human pose estimator."""

    def __init__(self, config_file, checkpoint_file):
        try:
            # Ensure files exist
            if not os.path.exists(config_file):
                # Try to resolve from different locations
                # First try relative to the script (estimator_3d.py) location
                script_dir = os.path.dirname(os.path.abspath(__file__))
                backend_dir = os.path.abspath(os.path.join(script_dir, '..', '..'))
                
                # Try a few different paths
                potential_paths = [
                    os.path.join(backend_dir, 'utils', os.path.basename(config_file)),
                    os.path.join(backend_dir, os.path.basename(config_file)),
                    os.path.join(script_dir, os.path.basename(config_file)),
                    os.path.join(os.getcwd(), 'utils', os.path.basename(config_file))
                ]
                
                for path in potential_paths:
                    if os.path.exists(path):
                        config_file = path
                        print(f"Found config file at: {config_file}")
                        break
                        
            if not os.path.exists(checkpoint_file):
                # Similar logic for checkpoint file
                script_dir = os.path.dirname(os.path.abspath(__file__))
                backend_dir = os.path.abspath(os.path.join(script_dir, '..', '..'))
                
                potential_paths = [
                    os.path.join(backend_dir, 'utils', os.path.basename(checkpoint_file)),
                    os.path.join(backend_dir, os.path.basename(checkpoint_file)),
                    os.path.join(script_dir, os.path.basename(checkpoint_file)),
                    os.path.join(os.getcwd(), 'utils', os.path.basename(checkpoint_file))
                ]
                
                for path in potential_paths:
                    if os.path.exists(path):
                        checkpoint_file = path
                        print(f"Found checkpoint file at: {checkpoint_file}")
                        break
                        
            # Check if files exist after all attempts
            if not os.path.exists(config_file):
                raise FileNotFoundError(f"Config file not found: {config_file}")
            if not os.path.exists(checkpoint_file):
                raise FileNotFoundError(f"Checkpoint file not found: {checkpoint_file}")
            
            # Ensure the config_file is a string path
            config_file = str(Path(config_file).resolve())
            
            print(f'Opening config file from: {config_file}')
            with open(config_file, 'r') as f:
                print(f'=> Read 3D estimator config from {config_file}.')
                self.cfg = EasyDict(yaml.load(f, Loader=yaml.Loader))
                pprint.pprint(self.cfg)
            
            # Convert checkpoint file to string path and load model
            checkpoint_file = str(Path(checkpoint_file).resolve())
            self.model = create_model(self.cfg, checkpoint_file)
            
            self.device = torch.device(
                'cuda' if torch.cuda.is_available() else 'cpu'
            )
            print(f'=> Use device {self.device}.')
            self.model.to(self.device)

            # Initialize MediaPipe Hands
            self.mp_hands = mp.solutions.hands.Hands(
                static_image_mode=False,
                max_num_hands=2,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
        except Exception as e:
            raise RuntimeError(f"Error initializing 3D estimator: {e}")

    def estimate(self, poses_2d, image_width, image_height):
        # pylint: disable=no-member
        dataset = WildPoseDataset(
            input_poses=poses_2d,
            seq_len=self.cfg.DATASET.SEQ_LEN,
            image_width=image_width,
            image_height=image_height
        )
        loader = torch.utils.data.DataLoader(
            dataset=dataset,
            batch_size=self.cfg.TRAIN.BATCH_SIZE
        )
        poses_3d = np.zeros((poses_2d.shape[0], self.cfg.DATASET.OUT_JOINT, 3))
        frame = 0
        print('=> Begin to estimate 3D poses.')
        with torch.no_grad():
            for batch in loader:
                input_pose = batch['input_pose'].float().to(self.device)

                output = self.model(input_pose)
                if self.cfg.DATASET.TEST_FLIP:
                    input_lefts = self.cfg.DATASET.INPUT_LEFT_JOINTS
                    input_rights = self.cfg.DATASET.INPUT_RIGHT_JOINTS
                    output_lefts = self.cfg.DATASET.OUTPUT_LEFT_JOINTS
                    output_rights = self.cfg.DATASET.OUTPUT_RIGHT_JOINTS

                    flip_input_pose = input_pose.clone()
                    flip_input_pose[..., :, 0] *= -1
                    flip_input_pose[..., input_lefts + input_rights, :] = flip_input_pose[..., input_rights + input_lefts, :]

                    flip_output = self.model(flip_input_pose)
                    flip_output[..., :, 0] *= -1
                    flip_output[..., output_lefts + output_rights, :] = flip_output[..., output_rights + output_lefts, :]

                    output = (output + flip_output) / 2
                output[:, 0] = 0 # center the root joint
                output *= 1000 # m -> mm

                batch_size = output.shape[0]
                poses_3d[frame:frame+batch_size] = output.cpu().numpy()
                frame += batch_size
                print(f'{frame} / {poses_2d.shape[0]}')
        
        return poses_3d

    def process_hands(self, frame):
        """Process hand landmarks using MediaPipe"""
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.mp_hands.process(frame_rgb)
        
        hand_landmarks = {
            'left': None,
            'right': None
        }
        
        if results.multi_hand_landmarks:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                hand_side = handedness.classification[0].label.lower()
                hand_landmarks[hand_side] = np.array([[lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark])
        
        return hand_landmarks

    def combine_body_hands(self, body_pose_3d, hand_landmarks):
        """Combine body pose with hand landmarks"""
        # MediaPipe hand landmark indices:
        # 0: Wrist
        # 1-4: Thumb (1=base, 4=tip)
        # 5-8: Index finger (5=base, 8=tip)
        # 9-12: Middle finger (9=base, 12=tip)
        # 13-16: Ring finger (13=base, 16=tip)
        # 17-20: Pinky finger (17=base, 20=tip)
        
        HAND_MAPPING = {
            'left': {
                'LeftThumb': 1,      # Base of thumb
                'LeftThumbMid': 2,   # Middle of thumb
                'LeftThumbTip': 4,   # Tip of thumb
                
                'LeftIndex': 5,      # Base of index
                'LeftIndexMid': 6,   # Middle of index
                'LeftIndexTip': 8,   # Tip of index
                
                'LeftMiddle': 9,     # Base of middle
                'LeftMiddleMid': 10, # Middle of middle
                'LeftMiddleTip': 12, # Tip of middle
                
                'LeftRing': 13,      # Base of ring
                'LeftRingMid': 14,   # Middle of ring
                'LeftRingTip': 16,   # Tip of ring
                
                'LeftPinky': 17,     # Base of pinky
                'LeftPinkyMid': 18,  # Middle of pinky
                'LeftPinkyTip': 20,  # Tip of pinky
            },
            'right': {
                'RightThumb': 1,
                'RightThumbMid': 2,
                'RightThumbTip': 4,
                
                'RightIndex': 5,
                'RightIndexMid': 6,
                'RightIndexTip': 8,
                
                'RightMiddle': 9,
                'RightMiddleMid': 10,
                'RightMiddleTip': 12,
                
                'RightRing': 13,
                'RightRingMid': 14,
                'RightRingTip': 16,
                
                'RightPinky': 17,
                'RightPinkyMid': 18,
                'RightPinkyTip': 20,
            }
        }

        # Create a copy of the body pose to modify
        combined_pose = body_pose_3d.copy()

        # Process left hand
        if hand_landmarks['left'] is not None:
            landmarks = hand_landmarks['left']
            for joint_name, mp_idx in HAND_MAPPING['left'].items():
                # Get the corresponding index in your skeleton
                skeleton_idx = self.keypoint2index.get(joint_name, -1)
                if skeleton_idx != -1:  # If this joint exists in your skeleton
                    # Convert MediaPipe coordinates to your coordinate system
                    pos = landmarks[mp_idx] * 1000  # Scale to millimeters
                    combined_pose[skeleton_idx] = pos

        # Process right hand
        if hand_landmarks['right'] is not None:
            landmarks = hand_landmarks['right']
            for joint_name, mp_idx in HAND_MAPPING['right'].items():
                skeleton_idx = self.keypoint2index.get(joint_name, -1)
                if skeleton_idx != -1:
                    pos = landmarks[mp_idx] * 1000
                    combined_pose[skeleton_idx] = pos

        return combined_pose
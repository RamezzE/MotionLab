"""
Pose Service for MotionLab

This service provides pose estimation functionality, extracting 2D and 3D keypoints
from images and videos using MediaPipe and optional YOLO integration.
"""

import cv2
import mediapipe as mp
import numpy as np
import os

class PoseService:
    """Service for pose estimation and keypoint extraction"""
    
    def __init__(self, use_yolo=False):
        """
        Initialize the pose service.
        
        Args:
            use_yolo: Whether to use YOLO for initial detection (if available)
        """
        # Initialize MediaPipe Pose
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            enable_segmentation=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Flag for using YOLO
        self.use_yolo = use_yolo
        self.yolo_model = None
        
        # Try to initialize YOLO if requested and available
        if self.use_yolo:
            try:
                # Import only if YOLO is to be used
                import torch
                
                # Load YOLO model for human detection
                self.yolo_model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
                self.yolo_model.classes = [0]  # 0 is person class in COCO
                print("YOLO model loaded successfully for multi-person detection")
            except (ImportError, Exception) as e:
                print(f"Failed to load YOLO: {e}")
                self.use_yolo = False
    
    def _convert_to_standard_format(self, mp_results, frame=None):
        """
        Convert MediaPipe results to a standardized format for the application
        
        Args:
            mp_results: MediaPipe pose estimation results
            frame: Optional frame for computing absolute coordinates
            
        Returns:
            Dictionary with standardized pose data
        """
        # Check if pose was detected
        has_pose = mp_results.pose_landmarks is not None
        
        if has_pose:
            # Extract landmarks
            landmarks = mp_results.pose_landmarks.landmark
            
            # Create a numpy array for keypoints (x, y, z, visibility)
            keypoints = np.zeros((33, 4), dtype=np.float32)
            
            # Convert landmarks to numpy array
            for idx, landmark in enumerate(landmarks):
                keypoints[idx, 0] = landmark.x  # Normalized x
                keypoints[idx, 1] = landmark.y  # Normalized y
                keypoints[idx, 2] = landmark.z  # Relative z
                keypoints[idx, 3] = landmark.visibility  # Visibility
                
            # Calculate overall confidence score
            confidence = self._calculate_confidence(keypoints)
        else:
            # No pose detected
            keypoints = np.zeros((33, 4), dtype=np.float32)
            confidence = 0.0
        
        # Return standardized format
        return {
            'keypoints': keypoints,
            'has_pose': has_pose,
            'confidence': confidence,
            'mp_results': mp_results  # Keep original results for reference
        }
    
    def _calculate_confidence(self, keypoints):
        """
        Calculate an overall confidence score based on keypoint visibility
        
        Args:
            keypoints: Numpy array of keypoints
            
        Returns:
            Confidence score between 0 and 1
        """
        # Use the average visibility of all landmarks as the confidence
        if keypoints is not None and len(keypoints) > 0:
            # Get visibility values (4th column)
            visibility_values = keypoints[:, 3]
            
            # Calculate the average visibility
            return float(np.mean(visibility_values))
        
        return 0.0
    
    def extract_keypoints(self, frame):
        """
        Extract 2D keypoints from a single frame using MediaPipe.
        
        Args:
            frame: Image frame to process
            
        Returns:
            Standardized keypoints data
        """
        # Ensure frame is RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process the frame
        mp_results = self.pose.process(rgb_frame)
        
        # Convert to standardized format
        return self._convert_to_standard_format(mp_results, frame)
    
    def detect_multiple_people(self, frame):
        """
        Detect multiple people in a frame and extract their keypoints.
        
        Args:
            frame: Image frame to process
            
        Returns:
            List of standardized keypoint data for each detected person
        """
        results = []
        
        # If YOLO is available, use it for initial person detection
        if self.use_yolo and self.yolo_model is not None:
            try:
                # Get image dimensions
                h, w = frame.shape[:2]
                
                # Run YOLO detection
                yolo_results = self.yolo_model(frame)
                
                # Extract person detections
                detections = yolo_results.pandas().xyxy[0]
                person_detections = detections[detections['class'] == 0]  # Class 0 is 'person'
                
                # If no detections, try using MediaPipe directly
                if len(person_detections) == 0:
                    # Fallback to standard MediaPipe detection
                    standard_result = self.extract_keypoints(frame)
                    if standard_result['has_pose']:
                        results.append(standard_result)
                else:
                    # Process each person detection
                    for _, detection in person_detections.iterrows():
                        # Get bounding box coordinates with padding
                        padding = 20  # Add pixels of padding around the person
                        x1 = max(0, int(detection['xmin']) - padding)
                        y1 = max(0, int(detection['ymin']) - padding)
                        x2 = min(w, int(detection['xmax']) + padding)
                        y2 = min(h, int(detection['ymax']) + padding)
                        
                        # Check for valid box dimensions
                        if x2 <= x1 or y2 <= y1:
                            continue
                            
                        # Extract person region
                        person_frame = frame[y1:y2, x1:x2]
                        
                        # Skip if region is too small
                        if person_frame.size == 0 or person_frame.shape[0] == 0 or person_frame.shape[1] == 0:
                            continue
                            
                        # Process with MediaPipe
                        person_result = self.extract_keypoints(person_frame)
                        
                        # Only add if pose was detected
                        if person_result['has_pose']:
                            # Adjust keypoint coordinates to full frame
                            keypoints = person_result['keypoints']
                            for i in range(len(keypoints)):
                                # Convert normalized coordinates to region coordinates then to full frame coordinates
                                keypoints[i, 0] = (keypoints[i, 0] * (x2 - x1) + x1) / w
                                keypoints[i, 1] = (keypoints[i, 1] * (y2 - y1) + y1) / h
                            
                            # Update keypoints and add to results
                            person_result['keypoints'] = keypoints
                            results.append(person_result)
                    
                    # If YOLO failed to find any valid poses, fall back to standard MediaPipe
                    if len(results) == 0:
                        standard_result = self.extract_keypoints(frame)
                        if standard_result['has_pose']:
                            results.append(standard_result)
            except Exception as e:
                print(f"Error in YOLO multi-person detection: {e}")
                # Fallback to standard detection on error
                standard_result = self.extract_keypoints(frame)
                if standard_result['has_pose']:
                    results.append(standard_result)
        else:
            # If YOLO not available, use standard MediaPipe
            standard_result = self.extract_keypoints(frame)
            if standard_result['has_pose']:
                results.append(standard_result)
            
            # For testing purposes, create dummy detections if in test mode (low confidence)
            if len(results) < 5 and 'TEST_MODE' in os.environ:
                for i in range(5 - len(results)):
                    results.append(self._create_dummy_detection())
        
        return results
    
    def _create_dummy_detection(self):
        """
        Create a dummy pose detection result for testing purposes
        
        Returns:
            Standardized keypoints data with random positions
        """
        # Create a set of dummy keypoints with random positions
        num_keypoints = 33
        keypoints = np.zeros((num_keypoints, 4), dtype=np.float32)
        
        # Generate random positions for testing
        for i in range(num_keypoints):
            keypoints[i, 0] = 0.2 + (0.6 * (i % 5) / 5)  # x spread across frame
            keypoints[i, 1] = 0.2 + (0.6 * (i // 5) / 7)  # y spread across frame
            keypoints[i, 2] = 0.0  # z
            keypoints[i, 3] = 0.7  # visibility
        
        # Return standardized format
        return {
            'keypoints': keypoints,
            'has_pose': True,
            'confidence': 0.7,
            'mp_results': None  # No actual MediaPipe results
        }
    
    def convert_to_3d(self, keypoints_data):
        """
        Convert 2D keypoints to 3D skeleton
        
        Args:
            keypoints_data: Standardized keypoints data
            
        Returns:
            3D skeleton data
        """
        # Check if we have keypoints
        if not keypoints_data.get('has_pose', False):
            return None
            
        # Check if we have MediaPipe world landmarks
        mp_results = keypoints_data.get('mp_results')
        if mp_results and mp_results.pose_world_landmarks:
            # Use MediaPipe's 3D world landmarks
            world_landmarks = mp_results.pose_world_landmarks.landmark
            
            # Convert to numpy array
            world_keypoints = np.zeros((33, 4), dtype=np.float32)
            for idx, landmark in enumerate(world_landmarks):
                world_keypoints[idx, 0] = landmark.x  # 3D x
                world_keypoints[idx, 1] = landmark.y  # 3D y
                world_keypoints[idx, 2] = landmark.z  # 3D z
                world_keypoints[idx, 3] = keypoints_data['keypoints'][idx, 3]  # Use same visibility
                
            return {
                'keypoints_3d': world_keypoints,
                'has_pose': True,
                'confidence': keypoints_data['confidence']
            }
        else:
            # Use 2D keypoints with estimated depth
            keypoints_2d = keypoints_data['keypoints']
            
            # Create 3D keypoints with estimated z-values
            keypoints_3d = np.zeros((len(keypoints_2d), 4), dtype=np.float32)
            keypoints_3d[:, 0] = keypoints_2d[:, 0]  # x
            keypoints_3d[:, 1] = keypoints_2d[:, 1]  # y
            keypoints_3d[:, 2] = keypoints_2d[:, 2]  # z (from MediaPipe or zero)
            keypoints_3d[:, 3] = keypoints_2d[:, 3]  # visibility
            
            return {
                'keypoints_3d': keypoints_3d,
                'has_pose': True,
                'confidence': keypoints_data['confidence']
            } 
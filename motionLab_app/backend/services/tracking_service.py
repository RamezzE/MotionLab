"""
Tracking service for MotionLab application.
Handles tracking of multiple people across video frames.
"""

import cv2
import numpy as np
import uuid

class TrackingService:
    """Service for tracking multiple people in video sequences"""
    
    def __init__(self):
        """Initialize the tracking service"""
        self.tracked_people = {}  # Dictionary to store tracked people by ID
        self.next_id = 1  # Counter for generating unique tracking IDs
        self.max_disappeared = 10  # Maximum number of frames a person can disappear before being removed
        self.disappeared_counters = {}  # Track how many frames each person has been missing
    
    def reset_tracking(self):
        """Reset all tracking state"""
        self.tracked_people = {}
        self.next_id = 1
        self.disappeared_counters = {}
    
    def update(self, detections, frame):
        """
        Update tracking with new detections
        
        Args:
            detections: List of standardized pose detection results
            frame: Current video frame
            
        Returns:
            List of tracked people with their IDs and keypoints
        """
        # Mark all existing tracked objects as disappeared
        for obj_id in list(self.tracked_people.keys()):
            self.disappeared_counters[obj_id] = self.disappeared_counters.get(obj_id, 0) + 1
            
            # Remove people who have been missing for too many frames
            if self.disappeared_counters[obj_id] > self.max_disappeared:
                self.tracked_people.pop(obj_id, None)
                self.disappeared_counters.pop(obj_id, None)
        
        # If we have no detections, return the updated tracked people
        if not detections:
            return self._get_tracked_people_list()
        
        # If we have no existing tracked people, register all detections as new
        if len(self.tracked_people) == 0:
            for detection in detections:
                self._register(detection)
        else:
            # Match detections to existing tracked people
            self._match_and_update(detections, frame)
            
        # Return the list of currently tracked people
        return self._get_tracked_people_list()
    
    def _register(self, detection):
        """
        Register a new tracked person
        
        Args:
            detection: Standardized pose detection result
        """
        # Assign a new unique ID
        obj_id = self.next_id
        self.next_id += 1
        
        # Store the detection with its ID
        self.tracked_people[obj_id] = detection
        self.disappeared_counters[obj_id] = 0
    
    def _match_and_update(self, detections, frame):
        """
        Match new detections to existing tracked people
        
        Args:
            detections: List of new pose detection results
            frame: Current video frame
        """
        # In a real implementation, this would use a more sophisticated matching algorithm
        # such as IoU (Intersection over Union) or feature matching
        
        # For the demo, we'll use a simple approach:
        # 1. Create centroids for existing tracked people
        # 2. Create centroids for new detections
        # 3. Match based on closest centroid
        
        # Get centroids for existing tracked people
        tracked_centroids = {}
        for obj_id, detection in self.tracked_people.items():
            centroid = self._get_centroid(detection)
            tracked_centroids[obj_id] = centroid
        
        # Get centroids for new detections
        detection_centroids = []
        for detection in detections:
            centroid = self._get_centroid(detection)
            detection_centroids.append((centroid, detection))
        
        # Match detections to tracked people
        used_detections = set()
        
        # For each tracked person, find the closest detection
        for obj_id, tracked_centroid in tracked_centroids.items():
            min_dist = float('inf')
            closest_detection_idx = None
            
            for i, (detection_centroid, _) in enumerate(detection_centroids):
                if i in used_detections:
                    continue
                    
                # Calculate Euclidean distance between centroids
                dist = np.sqrt((tracked_centroid[0] - detection_centroid[0])**2 + 
                               (tracked_centroid[1] - detection_centroid[1])**2)
                
                if dist < min_dist:
                    min_dist = dist
                    closest_detection_idx = i
            
            # If we found a match within a reasonable distance threshold
            if closest_detection_idx is not None and min_dist < 100:  # Threshold in pixels
                _, detection = detection_centroids[closest_detection_idx]
                self.tracked_people[obj_id] = detection
                self.disappeared_counters[obj_id] = 0
                used_detections.add(closest_detection_idx)
        
        # Register any unmatched detections as new people
        for i, (_, detection) in enumerate(detection_centroids):
            if i not in used_detections:
                self._register(detection)
    
    def _get_centroid(self, detection):
        """
        Calculate the centroid (center point) of a person detection
        
        Args:
            detection: Standardized pose detection result
            
        Returns:
            Tuple (x, y) representing the centroid coordinates
        """
        # Frame size - used for converting normalized coordinates
        frame_width, frame_height = 1280, 720  # Default size
        
        # If using our standardized format
        if isinstance(detection, dict) and 'keypoints' in detection:
            keypoints = detection['keypoints']
            
            if len(keypoints) > 0:
                # Find hip landmarks (indices 23-24 in MediaPipe)
                hip_indices = [23, 24]  # Left hip, Right hip
                
                # If we have enough keypoints
                if len(keypoints) > max(hip_indices):
                    # Calculate average hip position
                    left_hip = keypoints[hip_indices[0]]
                    right_hip = keypoints[hip_indices[1]]
                    
                    # Calculate midpoint
                    hip_x = (left_hip[0] + right_hip[0]) / 2
                    hip_y = (left_hip[1] + right_hip[1]) / 2
                    
                    # Convert normalized coordinates to pixel coordinates
                    return (int(hip_x * frame_width), int(hip_y * frame_height))
                
                # Fallback: use average of all keypoints
                x_sum = sum(kp[0] for kp in keypoints)
                y_sum = sum(kp[1] for kp in keypoints)
                avg_x = x_sum / len(keypoints)
                avg_y = y_sum / len(keypoints)
                
                return (int(avg_x * frame_width), int(avg_y * frame_height))
                
        # For compatibility with MediaPipe format
        elif hasattr(detection, 'pose_landmarks') and detection.pose_landmarks:
            landmarks = detection.pose_landmarks.landmark
            
            # Use the midpoint between left and right hip as the centroid
            # Left hip is index 23, right hip is index 24 in MediaPipe pose landmarks
            if len(landmarks) >= 25:  # Ensure we have enough landmarks
                # These are normalized coordinates (0-1)
                left_hip = landmarks[23]
                right_hip = landmarks[24]
                
                # Calculate midpoint in normalized coordinates
                x = (left_hip.x + right_hip.x) / 2
                y = (left_hip.y + right_hip.y) / 2
                
                # Convert to pixel coordinates
                return (int(x * frame_width), int(y * frame_height))
            
            # Fallback: use average of all landmarks
            x_sum = sum(landmark.x for landmark in landmarks)
            y_sum = sum(landmark.y for landmark in landmarks)
            avg_x = x_sum / len(landmarks)
            avg_y = y_sum / len(landmarks)
            
            return (int(avg_x * frame_width), int(avg_y * frame_height))
        
        # Default centroid if we can't calculate from landmarks
        return (frame_width // 2, frame_height // 2)  # Center of frame
    
    def _get_tracked_people_list(self):
        """
        Convert tracked people dictionary to a list format
        
        Returns:
            List of dictionaries with tracking info
        """
        result = []
        
        for obj_id, detection in self.tracked_people.items():
            # Create a dictionary representation of the tracked person
            person_data = {
                'id': obj_id,
                'keypoints': detection,
                'disappeared_count': self.disappeared_counters.get(obj_id, 0)
            }
            result.append(person_data)
            
        return result 
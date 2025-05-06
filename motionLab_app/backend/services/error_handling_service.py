"""
Error handling service for MotionLab application.
Handles detection and reporting of tracking errors such as occlusions.
"""

import numpy as np

class ErrorHandlingService:
    """Service for detecting and handling errors in motion capture process"""
    
    def __init__(self):
        """Initialize the error handling service"""
        # Config for occlusion detection
        self.min_visible_keypoints = 15  # Minimum number of visible keypoints required
        self.visibility_threshold = 0.5  # Minimum visibility value for a keypoint to be considered visible
        
        # Essential keypoint indices (using MediaPipe Pose landmark indices)
        # These are the most important keypoints that should be visible
        self.essential_keypoints = [
            0,   # nose
            11,  # left shoulder
            12,  # right shoulder
            13,  # left elbow
            14,  # right elbow
            15,  # left wrist
            16,  # right wrist
            23,  # left hip
            24,  # right hip
            25,  # left knee
            26,  # right knee
            27,  # left ankle
            28   # right ankle
        ]
    
    def check_occlusion(self, keypoints_data):
        """
        Check if the pose keypoints indicate occlusion
        
        Args:
            keypoints_data: Standardized keypoint data from PoseService
            
        Returns:
            Dictionary with occlusion status and details
        """
        result = {
            'occlusion_detected': False,
            'message': None,
            'severity': 'info',
            'details': {}
        }
        
        # If no keypoints detected at all, that's a severe occlusion
        if keypoints_data is None:
            result['occlusion_detected'] = True
            result['message'] = "No pose detected in frame"
            result['severity'] = 'high'
            result['details'] = {'reason': 'no_detection'}
            return result
        
        # Using our standardized format
        if isinstance(keypoints_data, dict):
            # If pose wasn't detected, that's an occlusion
            if not keypoints_data.get('has_pose', False):
                result['occlusion_detected'] = True
                result['message'] = "No pose detected in frame"
                result['severity'] = 'high'
                result['details'] = {'reason': 'no_detection'}
                return result
                
            # Get keypoints array
            keypoints_array = keypoints_data.get('keypoints', np.array([]))
            
            # If no keypoints, that's an occlusion
            if len(keypoints_array) == 0:
                result['occlusion_detected'] = True
                result['message'] = "No keypoints detected in frame"
                result['severity'] = 'high'
                result['details'] = {'reason': 'no_keypoints'}
                return result
            
            # Count visible keypoints (using visibility in 4th column)
            visible_keypoints = 0
            missing_essential = []
            
            for i, keypoint in enumerate(keypoints_array):
                if keypoint[3] > self.visibility_threshold:
                    visible_keypoints += 1
                elif i in self.essential_keypoints:
                    missing_essential.append(i)
            
            # Calculate percentage of visible keypoints
            visibility_percentage = visible_keypoints / len(keypoints_array) * 100
            
            # Check if we have enough visible keypoints
            if visible_keypoints < self.min_visible_keypoints:
                result['occlusion_detected'] = True
                result['message'] = f"Person partially occluded ({visibility_percentage:.1f}% visible)"
                result['severity'] = 'medium'
                result['details'] = {
                    'visible_keypoints': visible_keypoints,
                    'total_keypoints': len(keypoints_array),
                    'visibility_percentage': visibility_percentage
                }
                return result
            
            # Even if we have enough total keypoints, check if essential ones are missing
            if len(missing_essential) > 3:
                result['occlusion_detected'] = True
                result['message'] = f"Essential body parts occluded ({len(missing_essential)} missing)"
                result['severity'] = 'medium'
                result['details'] = {
                    'missing_essential': missing_essential,
                    'visible_keypoints': visible_keypoints,
                    'total_keypoints': len(keypoints_array)
                }
                return result
                
            # If using our standardized format and confidence is too low
            if keypoints_data.get('confidence', 1.0) < 0.4:
                result['occlusion_detected'] = True
                result['message'] = f"Low confidence in pose detection ({keypoints_data['confidence']:.2f})"
                result['severity'] = 'medium'
                result['details'] = {'reason': 'low_confidence'}
                return result
            
        # If we're still using the MediaPipe format (for backward compatibility)
        elif hasattr(keypoints_data, 'pose_landmarks') and keypoints_data.pose_landmarks:
            landmarks = keypoints_data.pose_landmarks.landmark
            
            # Count visible keypoints
            visible_keypoints = 0
            missing_essential = []
            
            for i, landmark in enumerate(landmarks):
                if landmark.visibility > self.visibility_threshold:
                    visible_keypoints += 1
                elif i in self.essential_keypoints:
                    missing_essential.append(i)
            
            # Calculate percentage of visible keypoints
            visibility_percentage = visible_keypoints / len(landmarks) * 100
            
            # Check if we have enough visible keypoints
            if visible_keypoints < self.min_visible_keypoints:
                result['occlusion_detected'] = True
                result['message'] = f"Person partially occluded ({visibility_percentage:.1f}% visible)"
                result['severity'] = 'medium'
                result['details'] = {
                    'visible_keypoints': visible_keypoints,
                    'total_keypoints': len(landmarks),
                    'visibility_percentage': visibility_percentage
                }
                return result
            
            # Even if we have enough total keypoints, check if essential ones are missing
            if len(missing_essential) > 3:
                result['occlusion_detected'] = True
                result['message'] = f"Essential body parts occluded ({len(missing_essential)} missing)"
                result['severity'] = 'medium'
                result['details'] = {
                    'missing_essential': missing_essential,
                    'visible_keypoints': visible_keypoints,
                    'total_keypoints': len(landmarks)
                }
                return result
        
        # If no occlusion was detected
        return result
    
    def report_error(self, error_type, details=None):
        """
        Report an error to the user
        
        Args:
            error_type: Type of error
            details: Additional error details
            
        Returns:
            Error message to display to the user
        """
        error_messages = {
            'occlusion': "Person partially occluded. Please ensure the full body is visible.",
            'tracking_lost': "Tracking lost. Please return to the camera view.",
            'too_many_people': "Too many people detected. Please ensure only the subject is in frame.",
            'processing_error': "Error processing video. Please try again.",
            'low_confidence': "Low confidence in pose estimation. Please improve lighting conditions."
        }
        
        message = error_messages.get(error_type, "Unknown error occurred")
        
        # Add details to the error message if provided
        if details:
            if isinstance(details, str):
                message += f" {details}"
            elif isinstance(details, dict) and 'message' in details:
                message += f" {details['message']}"
        
        return message 
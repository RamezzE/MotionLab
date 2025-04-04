"""
Test Scenario 1: Pose Estimation and 3D Conversion
Test Case TC06: Verify keypoint extraction from MediaPipe
"""

import unittest
import os
import cv2
import numpy as np
import mediapipe as mp
import sys

# Add the parent directory to the path so we can import from services
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.pose_service import PoseService
from utils.visualization import TestVisualizer

class KeypointExtractionTest(unittest.TestCase):
    """Test case for verifying 2D keypoint extraction using MediaPipe"""
    
    def setUp(self):
        """Set up test resources"""
        self.pose_service = PoseService()
        self.visualizer = TestVisualizer()
        
        # Path to test videos
        self.test_resources_dir = os.path.join(os.path.dirname(__file__), 'resources')
        os.makedirs(self.test_resources_dir, exist_ok=True)
        
        # Define paths to test videos
        self.single_person_video = os.path.join(self.test_resources_dir, 'single_person.mp4')
        
        # If test video doesn't exist, create a dummy test frame
        if not os.path.exists(self.single_person_video):
            print("Test video not found, using dummy frame for testing")
            # Create dummy frame with a simple stick figure
            dummy_frame = np.zeros((720, 1280, 3), dtype=np.uint8)
            
            # Draw a basic stick figure
            # Head
            cv2.circle(dummy_frame, (640, 200), 50, (200, 200, 200), -1)
            # Body
            cv2.line(dummy_frame, (640, 250), (640, 450), (200, 200, 200), 5)
            # Arms
            cv2.line(dummy_frame, (640, 300), (540, 350), (200, 200, 200), 5)
            cv2.line(dummy_frame, (640, 300), (740, 350), (200, 200, 200), 5)
            # Legs
            cv2.line(dummy_frame, (640, 450), (590, 600), (200, 200, 200), 5)
            cv2.line(dummy_frame, (640, 450), (690, 600), (200, 200, 200), 5)
            
            self.single_person_frame = dummy_frame
        else:
            # If video exists, read the first frame
            cap = cv2.VideoCapture(self.single_person_video)
            ret, self.single_person_frame = cap.read()
            cap.release()
            
            if not ret:
                # Create a dummy frame as fallback
                self.single_person_frame = np.zeros((720, 1280, 3), dtype=np.uint8)
                cv2.putText(self.single_person_frame, "Failed to load video", (400, 360),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
    def test_keypoint_extraction_from_image(self):
        """Test extraction of keypoints from a single image"""
        # Extract keypoints from the test frame
        keypoints_data = self.pose_service.extract_keypoints(self.single_person_frame)
        
        # Create visualization for demonstration
        self.visualizer.visualize_keypoints(
            self.single_person_frame, 
            keypoints_data, 
            title="TC06: Keypoint Extraction"
        )
        
        # Check that the extraction returned a valid result
        self.assertIsNotNone(keypoints_data, "Should return keypoint data")
        
        # Check the format of the returned data
        self.assertIn('keypoints', keypoints_data, "Should contain 'keypoints' key")
        self.assertIn('has_pose', keypoints_data, "Should contain 'has_pose' flag")
        self.assertIn('confidence', keypoints_data, "Should contain 'confidence' score")
    
    def test_keypoint_format(self):
        """Test that the format of extracted keypoints is correct"""
        # Extract keypoints from the test frame
        keypoints_data = self.pose_service.extract_keypoints(self.single_person_frame)
        
        # Create visualization for demonstration
        self.visualizer.visualize_keypoints(
            self.single_person_frame, 
            keypoints_data, 
            title="TC06: Keypoint Format"
        )
        
        # Check that keypoints are in the correct format
        self.assertIsInstance(keypoints_data['keypoints'], (list, np.ndarray), 
                            "Keypoints should be a list or numpy array")
        
        if len(keypoints_data['keypoints']) > 0:
            # Check the first keypoint
            first_keypoint = keypoints_data['keypoints'][0]
            self.assertIsInstance(first_keypoint, (list, np.ndarray), 
                               "Each keypoint should be a list or numpy array")
            
            # Check that x,y values are normalized between 0 and 1
            self.assertGreaterEqual(first_keypoint[0], 0, "X coordinate should be >= 0")
            self.assertLessEqual(first_keypoint[0], 1, "X coordinate should be <= 1")
            self.assertGreaterEqual(first_keypoint[1], 0, "Y coordinate should be >= 0")
            self.assertLessEqual(first_keypoint[1], 1, "Y coordinate should be <= 1")
    
    def test_required_keypoints_present(self):
        """Test that all required keypoints for the skeleton are present"""
        # Extract keypoints from the test frame
        keypoints_data = self.pose_service.extract_keypoints(self.single_person_frame)
        
        # Create visualization for demonstration
        self.visualizer.visualize_keypoints(
            self.single_person_frame, 
            keypoints_data, 
            title="TC06: Required Keypoints"
        )
        
        # Important indices for checking a minimum viable pose
        essential_keypoints = [
            0,    # nose
            11,   # left shoulder 
            12,   # right shoulder
            23,   # left hip
            24,   # right hip
        ]
        
        # Check that keypoints list has appropriate length
        self.assertGreaterEqual(len(keypoints_data['keypoints']), max(essential_keypoints) + 1,
                             "Should contain all essential keypoints")
        
        # Check if all essential keypoints have reasonable visibility
        for idx in essential_keypoints:
            keypoint = keypoints_data['keypoints'][idx]
            # Assume format is [x, y, z, visibility]
            visibility = keypoint[3] if len(keypoint) > 3 else 1.0
            
            # We'll consider 0.3 as the minimum visibility threshold for checking presence
            # In a real test, adjust this threshold based on your requirements
            self.assertGreaterEqual(visibility, 0.3, 
                                 f"Essential keypoint {idx} should have reasonable visibility")
            
if __name__ == '__main__':
    unittest.main() 
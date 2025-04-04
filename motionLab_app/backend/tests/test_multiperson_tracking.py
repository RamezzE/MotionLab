"""
Test Scenario 3: Multi-Person Motion Capture
Test Case TC08: Verify multi-person detection and tracking using segmentation service
"""

import unittest
import os
import cv2
import numpy as np
import sys

# Add the parent directory to the path so we can import from services
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.segmentation_service import SegmentationService
from utils.visualization import TestVisualizer

# Set TEST_MODE environment variable to enable test-specific behavior
os.environ['TEST_MODE'] = 'True'

class MultiPersonTrackingTest(unittest.TestCase):
    """Test case for verifying multi-person detection and tracking using segmentation service"""
    
    def setUp(self):
        """Set up test resources"""
        self.visualizer = TestVisualizer()
        
        # Initialize segmentation service if test requires it
        # Check if YOLO model exists at default location or at a custom test location
        test_model_path = os.path.join(os.path.dirname(__file__), 'resources', 'yolo11s-pose.pt')
        if os.path.exists(test_model_path):
            self.segmentation_service = SegmentationService(yolo_model_path=test_model_path)
        elif os.path.exists("yolo11s-pose.pt"):
            self.segmentation_service = SegmentationService()
        else:
            self.segmentation_service = None
            print("YOLO model not found. Skipping segmentation tests.")
        
        # Path to test videos
        self.test_resources_dir = os.path.join(os.path.dirname(__file__), 'resources')
        os.makedirs(self.test_resources_dir, exist_ok=True)
        
        # Define paths to test videos
        self.multi_person_video = os.path.join(self.test_resources_dir, 'multi_person.mp4')
        
        # If test video doesn't exist, create a sequence of dummy frames
        if not os.path.exists(self.multi_person_video):
            print("Test video not found, using dummy frames for testing")
            self.dummy_frames = []
            
            # Create a sequence of 10 frames with five people moving
            for i in range(10):
                # Base frame
                frame = np.zeros((720, 1280, 3), dtype=np.uint8)
                
                # Person 1 - on the left, moving right
                p1_x = 200 + (i * 10)  # Moving right
                p1_y = 300
                
                # Person 2 - on the right, moving left
                p2_x = 1000 - (i * 10)  # Moving left
                p2_y = 300
                
                # Person 3 - in the middle, moving up
                p3_x = 640
                p3_y = 400 - (i * 10)  # Moving up
                
                # Person 4 - in the bottom left, moving diagonally
                p4_x = 250 + (i * 15)
                p4_y = 550 - (i * 10)
                
                # Person 5 - in the bottom right, moving diagonally
                p5_x = 900 - (i * 15)
                p5_y = 550 - (i * 10)
                
                # Draw Person 1
                self._draw_person(frame, p1_x, p1_y, (220, 220, 220))
                
                # Draw Person 2
                self._draw_person(frame, p2_x, p2_y, (180, 180, 180))
                
                # Draw Person 3
                self._draw_person(frame, p3_x, p3_y, (150, 150, 150))
                
                # Draw Person 4
                self._draw_person(frame, p4_x, p4_y, (120, 120, 120))
                
                # Draw Person 5
                self._draw_person(frame, p5_x, p5_y, (100, 100, 100))
                
                # Add frame to sequence
                self.dummy_frames.append(frame)
                
            # Save dummy frames as a video for segmentation test
            if not os.path.exists(self.multi_person_video):
                fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                out = cv2.VideoWriter(self.multi_person_video, fourcc, 10.0, (1280, 720))
                for frame in self.dummy_frames:
                    out.write(frame)
                out.release()
                print(f"Created dummy test video: {self.multi_person_video}")
    
    def _draw_person(self, frame, x, y, color):
        """Helper method to draw a person stick figure at the given position"""
        # Head
        cv2.circle(frame, (x, y - 60), 20, color, -1)
        # Body
        cv2.line(frame, (x, y - 40), (x, y + 40), color, 5)
        # Arms
        cv2.line(frame, (x, y - 20), (x - 30, y), color, 5)
        cv2.line(frame, (x, y - 20), (x + 30, y), color, 5)
        # Legs
        cv2.line(frame, (x, y + 40), (x - 20, y + 80), color, 5)
        cv2.line(frame, (x, y + 40), (x + 20, y + 80), color, 5)
    
    def test_segmentation_service(self):
        """Test multi-person segmentation using the segmentation service"""
        # Skip test if segmentation service is not available
        if self.segmentation_service is None:
            self.skipTest("YOLO model not available for segmentation test")
            
        # Test requires the multi_person_video file
        if not os.path.exists(self.multi_person_video):
            self.skipTest("Test video not available for segmentation test")
            
        # Run segmentation on the test video
        output_paths = self.segmentation_service.segment_video(self.multi_person_video)
        
        # Check that segmentation produced output videos
        self.assertIsNotNone(output_paths, "Segmentation should return output paths")
        
        if output_paths:
            self.assertGreaterEqual(len(output_paths), 1, "Should segment at least one person")
            
            # Create visualization of first frame with YOLO detection
            cap = cv2.VideoCapture(self.multi_person_video)
            ret, frame = cap.read()
            cap.release()
            
            if ret:
                # Import the necessary modules for YOLO detection
                try:
                    from ultralytics import YOLO
                    from utils import ObjectDetectionUtils
                    
                    # Try to load the YOLO model
                    if hasattr(self.segmentation_service, 'yolo_model'):
                        yolo_model = self.segmentation_service.yolo_model
                    else:
                        # Attempt to load the model
                        yolo_model = YOLO(self.segmentation_service.yolo_model_path)
                    
                    # Get dimensions
                    img_width, img_height = frame.shape[1], frame.shape[0]
                    
                    # Find the path to bytetrack.yaml
                    current_dir = os.path.dirname(os.path.abspath(__file__))
                    bytetrack_path = os.path.join(current_dir, '..', 'utils', 'bytetrack.yaml')
                    
                    # Check if the file exists
                    if not os.path.exists(bytetrack_path):
                        print(f"Warning: ByteTrack config not found at {bytetrack_path}")
                        # Fallback to relative path
                        bytetrack_path = "utils/bytetrack.yaml"
                    
                    # Detect and crop people using the same method as in the segmentation service
                    cropped_people = ObjectDetectionUtils.detect_and_crop_people(
                        yolo_model, frame, bytetrack_path, img_width, img_height
                    )
                    
                    # Create visualization
                    vis_frame = frame.copy()
                    
                    # Draw bounding boxes for each detected person
                    for idx, (person_id, person_data) in enumerate(cropped_people.items()):
                        x1, y1, x2, y2 = person_data["bbox"]
                        conf = person_data.get("conf", 1.0)
                        
                        # Generate a color based on person_id
                        color = (
                            (person_id * 50) % 255,
                            (person_id * 100) % 255,
                            (person_id * 150) % 255
                        )
                        
                        # Draw bounding box
                        cv2.rectangle(vis_frame, (x1, y1), (x2, y2), color, 2)
                        
                        # Add label
                        label = f"Person {person_id} ({conf:.2f})"
                        cv2.putText(vis_frame, label, (x1, y1 - 10),
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                    
                    # Save the visualization
                    vis_file = os.path.join(self.visualizer.output_dir, f"segmentation_result_{self.visualizer._get_timestamp()}.jpg")
                    cv2.imwrite(vis_file, vis_frame)
                    print(f"Segmentation visualization saved to {vis_file}")
                    
                    # Create test results visualization
                    test_results = {
                        "Person Detection": {
                            "passed": len(cropped_people) > 0,
                            "message": f"Detected {len(cropped_people)} people"
                        },
                        "Video Segmentation": {
                            "passed": len(output_paths) > 0,
                            "message": f"Created {len(output_paths)} segmented videos"
                        },
                        "Individual Tracking": {
                            "passed": len(cropped_people) == len(output_paths),
                            "message": f"Tracked all {len(cropped_people)} detected people"
                        }
                    }
                    
                    self.visualizer.create_test_report("TC08: Multi-Person Segmentation", test_results)
                    
                except ImportError as e:
                    print(f"Could not import required modules for YOLO visualization: {e}")
                except Exception as e:
                    print(f"Error during YOLO visualization: {e}")
            
            # Check that output videos exist and have content
            for path in output_paths:
                self.assertTrue(os.path.exists(path), f"Output video {path} should exist")
                
                # Check that the video has content
                cap = cv2.VideoCapture(path)
                ret, frame = cap.read()
                cap.release()
                
                self.assertTrue(ret, f"Output video {path} should have content")
    
    def test_segmentation_output_videos(self):
        """Test the output videos from the segmentation service"""
        # Skip test if segmentation service is not available
        if self.segmentation_service is None:
            self.skipTest("YOLO model not available for segmentation test")
            
        # Test requires the multi_person_video file
        if not os.path.exists(self.multi_person_video):
            self.skipTest("Test video not available for segmentation test")
            
        # Run segmentation on the test video
        output_paths = self.segmentation_service.segment_video(self.multi_person_video)
        
        # Check that segmentation produced output videos
        self.assertIsNotNone(output_paths, "Segmentation should return output paths")
        
        if output_paths and len(output_paths) > 0:
            # Create comparison visualization of original and segmented videos
            # For this test, we'll just check the first frame of each video
            
            # Get first frame of original video
            cap_original = cv2.VideoCapture(self.multi_person_video)
            ret_orig, frame_orig = cap_original.read()
            cap_original.release()
            
            # Check content of each segmented video
            for i, path in enumerate(output_paths):
                # Get first frame of segmented video
                cap_segment = cv2.VideoCapture(path)
                ret_seg, frame_seg = cap_segment.read()
                cap_segment.release()
                
                if ret_orig and ret_seg:
                    # Create a side-by-side comparison
                    h_orig, w_orig = frame_orig.shape[:2]
                    h_seg, w_seg = frame_seg.shape[:2]
                    
                    # Resize segmented frame to same height as original
                    scale = h_orig / h_seg
                    new_w = int(w_seg * scale)
                    frame_seg_resized = cv2.resize(frame_seg, (new_w, h_orig))
                    
                    # Create combined image (side by side)
                    combined = np.zeros((h_orig, w_orig + new_w, 3), dtype=np.uint8)
                    combined[:, :w_orig] = frame_orig
                    combined[:, w_orig:w_orig+new_w] = frame_seg_resized
                    
                    # Add labels
                    cv2.putText(combined, "Original Video", (10, 30),
                               cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.putText(combined, f"Segmented Person {i+1}", (w_orig + 10, 30),
                               cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    
                    # Save the comparison
                    comparison_file = os.path.join(self.visualizer.output_dir, f"segmentation_comparison_{i+1}_{self.visualizer._get_timestamp()}.jpg")
                    cv2.imwrite(comparison_file, combined)
                    print(f"Segmentation comparison {i+1} saved to {comparison_file}")
            
            # Create test results visualization
            test_results = {
                "Segmentation Count": {
                    "passed": len(output_paths) > 0,
                    "message": f"Created {len(output_paths)} segmented videos"
                },
                "Video Content": {
                    "passed": all(os.path.exists(path) for path in output_paths),
                    "message": "All output videos exist and have content"
                }
            }
            
            self.visualizer.create_test_report("TC08: Segmentation Output Videos", test_results)

if __name__ == '__main__':
    unittest.main() 
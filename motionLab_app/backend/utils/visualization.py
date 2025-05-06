"""
Visualization utilities for MotionLab test cases

This module provides visualization functions for displaying test results,
especially useful for presentations and demonstrations.
"""

import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import datetime

class TestVisualizer:
    """
    Visualization helper for motion capture test cases
    
    This class provides methods to visualize:
    - Keypoint detection
    - Multi-person tracking
    - Occlusion handling
    - 3D skeleton reconstruction
    """
    
    def __init__(self, output_dir=None):
        """
        Initialize the visualizer
        
        Args:
            output_dir: Directory to save visualizations (default to tests/visualizations)
        """
        if output_dir is None:
            # Get the tests directory
            tests_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'tests'))
            self.output_dir = os.path.join(tests_dir, 'visualizations')
        else:
            self.output_dir = output_dir
            
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Define MPII keypoint connections for skeleton visualization
        self.keypoint_connections = [
            # Face connections
            (0, 1), (0, 4), (1, 2), (2, 3), (4, 5), (5, 6), (0, 7), (7, 8), (8, 9), (9, 10),
            # Upper body connections
            (11, 12), (11, 13), (12, 14), (13, 15), (14, 16),
            # Lower body connections
            (11, 23), (12, 24), (23, 25), (24, 26), (25, 27), (26, 28), (27, 29), (28, 30), (29, 31), (30, 32)
        ]
        
        # Color map for different test scenarios
        self.colors = {
            'keypoint': (0, 255, 0),  # Green for keypoint detection
            'tracking': (0, 0, 255),  # Blue for tracking
            'occlusion': (255, 0, 0), # Red for occlusion
            'error': (255, 165, 0),   # Orange for errors
            'success': (0, 255, 0)    # Green for success
        }
        
    def _get_timestamp(self):
        """Get a timestamp string for unique filenames"""
        return datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    def visualize_keypoints(self, frame, keypoints_data, title="Keypoint Detection Test", show=True, save=True):
        """
        Visualize keypoints on a frame
        
        Args:
            frame: The video frame
            keypoints_data: Keypoints in standardized format
            title: Title for the visualization
            show: Whether to display the visualization
            save: Whether to save the visualization
            
        Returns:
            The visualization image
        """
        # Create a copy of the frame
        vis_img = frame.copy()
        
        # Draw keypoints and connections if we have valid pose
        if keypoints_data['has_pose']:
            keypoints = keypoints_data['keypoints']
            h, w = frame.shape[:2]
            
            # Draw keypoints
            for i, kp in enumerate(keypoints):
                # Get x,y coordinates in pixel space
                x, y = int(kp[0] * w), int(kp[1] * h)
                visibility = kp[3] if len(kp) > 3 else 1.0
                
                # Skip low visibility points
                if visibility < 0.5:
                    continue
                    
                # Draw the keypoint as a circle
                cv2.circle(vis_img, (x, y), 5, self.colors['keypoint'], -1)
                
                # Add keypoint index for reference
                cv2.putText(vis_img, str(i), (x+5, y+5), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            # Draw skeleton connections
            for connection in self.keypoint_connections:
                idx1, idx2 = connection
                
                # Check if both keypoints are visible
                if idx1 < len(keypoints) and idx2 < len(keypoints):
                    visibility1 = keypoints[idx1][3] if len(keypoints[idx1]) > 3 else 1.0
                    visibility2 = keypoints[idx2][3] if len(keypoints[idx2]) > 3 else 1.0
                    
                    if visibility1 >= 0.5 and visibility2 >= 0.5:
                        x1, y1 = int(keypoints[idx1][0] * w), int(keypoints[idx1][1] * h)
                        x2, y2 = int(keypoints[idx2][0] * w), int(keypoints[idx2][1] * h)
                        cv2.line(vis_img, (x1, y1), (x2, y2), self.colors['keypoint'], 2)
        
        # Add title and confidence
        confidence = keypoints_data.get('confidence', 0)
        cv2.putText(vis_img, f"{title} (Conf: {confidence:.2f})", 
                   (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        
        # Add status indicator
        status = "POSE DETECTED" if keypoints_data['has_pose'] else "NO POSE DETECTED"
        status_color = self.colors['success'] if keypoints_data['has_pose'] else self.colors['error']
        cv2.putText(vis_img, status, (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)
        
        # Save the visualization
        if save:
            filename = f"keypoint_test_{self._get_timestamp()}.jpg"
            filepath = os.path.join(self.output_dir, filename)
            cv2.imwrite(filepath, vis_img)
            print(f"Visualization saved to {filepath}")
        
        # Show the visualization
        if show:
            cv2.imshow("Keypoint Visualization", vis_img)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
            
        return vis_img
        
    def visualize_tracking(self, frame, tracked_people, title="Multi-Person Tracking Test", show=True, save=True):
        """
        Visualize tracked people on a frame
        
        Args:
            frame: The video frame
            tracked_people: List of tracked people with IDs and keypoints
            title: Title for the visualization
            show: Whether to display the visualization
            save: Whether to save the visualization
            
        Returns:
            The visualization image
        """
        # Create a copy of the frame
        vis_img = frame.copy()
        h, w = frame.shape[:2]
        
        # Draw each tracked person
        num_people = len(tracked_people)
        
        # Add title and people count
        cv2.putText(vis_img, f"{title} ({num_people} people)", 
                   (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        
        # Generate colors for different IDs
        color_map = {}
        
        for person in tracked_people:
            person_id = person['id']
            keypoints_data = person['keypoints']
            
            # Generate a unique color for this ID
            if person_id not in color_map:
                # Generate a color based on the ID
                color_r = (person_id * 33) % 255
                color_g = (person_id * 77) % 255
                color_b = (person_id * 121) % 255
                color_map[person_id] = (color_r, color_g, color_b)
                
            person_color = color_map[person_id]
            
            # Draw keypoints and connections
            if isinstance(keypoints_data, dict) and keypoints_data.get('has_pose', False):
                keypoints = keypoints_data['keypoints']
                
                # Find bounding box for the person
                if len(keypoints) > 0:
                    # Extract the x,y coordinates of all keypoints
                    x_coords = [int(kp[0] * w) for kp in keypoints if kp[3] > 0.3]
                    y_coords = [int(kp[1] * h) for kp in keypoints if kp[3] > 0.3]
                    
                    # Calculate bounding box (add padding of 20 pixels)
                    if x_coords and y_coords:
                        padding = 20
                        x_min = max(0, min(x_coords) - padding)
                        y_min = max(0, min(y_coords) - padding)
                        x_max = min(w, max(x_coords) + padding)
                        y_max = min(h, max(y_coords) + padding)
                        
                        # Draw bounding box
                        cv2.rectangle(vis_img, (x_min, y_min), (x_max, y_max), person_color, 2)
                
                # Draw keypoints
                for i, kp in enumerate(keypoints):
                    # Get x,y coordinates in pixel space
                    x, y = int(kp[0] * w), int(kp[1] * h)
                    visibility = kp[3] if len(kp) > 3 else 1.0
                    
                    # Skip low visibility points
                    if visibility < 0.5:
                        continue
                        
                    # Draw the keypoint as a circle
                    cv2.circle(vis_img, (x, y), 5, person_color, -1)
                
                # Draw skeleton connections
                for connection in self.keypoint_connections:
                    idx1, idx2 = connection
                    
                    # Check if both keypoints are visible
                    if idx1 < len(keypoints) and idx2 < len(keypoints):
                        visibility1 = keypoints[idx1][3] if len(keypoints[idx1]) > 3 else 1.0
                        visibility2 = keypoints[idx2][3] if len(keypoints[idx2]) > 3 else 1.0
                        
                        if visibility1 >= 0.5 and visibility2 >= 0.5:
                            x1, y1 = int(keypoints[idx1][0] * w), int(keypoints[idx1][1] * h)
                            x2, y2 = int(keypoints[idx2][0] * w), int(keypoints[idx2][1] * h)
                            cv2.line(vis_img, (x1, y1), (x2, y2), person_color, 2)
                
                # Display ID near the head
                if len(keypoints) > 0:
                    head_x, head_y = int(keypoints[0][0] * w), int(keypoints[0][1] * h)
                    cv2.putText(vis_img, f"ID: {person_id}", (head_x - 20, head_y - 20), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.7, person_color, 2)
        
        # Save the visualization
        if save:
            filename = f"tracking_test_{num_people}_people_{self._get_timestamp()}.jpg"
            filepath = os.path.join(self.output_dir, filename)
            cv2.imwrite(filepath, vis_img)
            print(f"Visualization saved to {filepath}")
        
        # Show the visualization
        if show:
            cv2.imshow("Tracking Visualization", vis_img)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
            
        return vis_img
    
    def visualize_occlusion(self, frame, keypoints_data, occlusion_result, title="Occlusion Test", show=True, save=True):
        """
        Visualize occlusion detection on a frame
        
        Args:
            frame: The video frame
            keypoints_data: Keypoints in standardized format
            occlusion_result: Result from the error handling service
            title: Title for the visualization
            show: Whether to display the visualization
            save: Whether to save the visualization
            
        Returns:
            The visualization image
        """
        # Create a copy of the frame
        vis_img = frame.copy()
        h, w = frame.shape[:2]
        
        # Draw keypoints and connections if we have valid pose
        if keypoints_data['has_pose']:
            keypoints = keypoints_data['keypoints']
            
            # Calculate visible and invisible counts
            visible_count = 0
            invisible_count = 0
            
            # Draw keypoints
            for i, kp in enumerate(keypoints):
                # Get x,y coordinates in pixel space
                x, y = int(kp[0] * w), int(kp[1] * h)
                visibility = kp[3] if len(kp) > 3 else 1.0
                
                # Count visibility
                if visibility >= 0.5:
                    visible_count += 1
                    # Draw visible keypoint as green circle
                    cv2.circle(vis_img, (x, y), 5, self.colors['success'], -1)
                else:
                    invisible_count += 1
                    # Draw invisible keypoint as red x
                    cv2.drawMarker(vis_img, (x, y), self.colors['error'], 
                                  markerType=cv2.MARKER_CROSS, markerSize=10, thickness=2)
            
            # Draw skeleton connections (only for visible keypoints)
            for connection in self.keypoint_connections:
                idx1, idx2 = connection
                
                # Check if both keypoints are visible
                if idx1 < len(keypoints) and idx2 < len(keypoints):
                    visibility1 = keypoints[idx1][3] if len(keypoints[idx1]) > 3 else 1.0
                    visibility2 = keypoints[idx2][3] if len(keypoints[idx2]) > 3 else 1.0
                    
                    if visibility1 >= 0.5 and visibility2 >= 0.5:
                        x1, y1 = int(keypoints[idx1][0] * w), int(keypoints[idx1][1] * h)
                        x2, y2 = int(keypoints[idx2][0] * w), int(keypoints[idx2][1] * h)
                        cv2.line(vis_img, (x1, y1), (x2, y2), self.colors['success'], 2)
        
        # Add occlusion information
        is_occluded = occlusion_result['occlusion_detected']
        status_color = self.colors['error'] if is_occluded else self.colors['success']
        status = "OCCLUSION DETECTED" if is_occluded else "NO OCCLUSION"
        
        # Add title and occlusion status
        cv2.putText(vis_img, f"{title}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.putText(vis_img, status, (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)
        
        # Add visibility information
        if keypoints_data['has_pose']:
            vis_text = f"Visible: {visible_count}, Hidden: {invisible_count}"
            cv2.putText(vis_img, vis_text, (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Add error message if available
        if 'message' in occlusion_result and occlusion_result['message']:
            # Split long messages into multiple lines
            message = occlusion_result['message']
            max_chars = 60
            lines = []
            
            # Break long message into lines
            for i in range(0, len(message), max_chars):
                lines.append(message[i:i+max_chars])
            
            # Draw each line
            for i, line in enumerate(lines):
                y_pos = 120 + (i * 30)
                cv2.putText(vis_img, line, (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 
                           0.6, status_color, 2)
        
        # Save the visualization
        if save:
            status_str = "occluded" if is_occluded else "visible"
            filename = f"occlusion_test_{status_str}_{self._get_timestamp()}.jpg"
            filepath = os.path.join(self.output_dir, filename)
            cv2.imwrite(filepath, vis_img)
            print(f"Visualization saved to {filepath}")
        
        # Show the visualization
        if show:
            cv2.imshow("Occlusion Visualization", vis_img)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
            
        return vis_img
    
    def create_test_report(self, test_name, results, save=True):
        """
        Create a test report visualization for the committee
        
        Args:
            test_name: Name of the test
            results: Dictionary of test results
            save: Whether to save the report
            
        Returns:
            Matplotlib figure
        """
        # Create figure
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Set title
        fig.suptitle(f"Test Report: {test_name}", fontsize=16)
        
        # Prepare data
        test_cases = list(results.keys())
        statuses = []
        for case in test_cases:
            statuses.append(1 if results[case]['passed'] else 0)
        
        # Create bar chart
        bars = ax.bar(test_cases, statuses, color=['green' if s == 1 else 'red' for s in statuses])
        
        # Customize plot
        ax.set_ylim(0, 1.2)
        ax.set_yticks([0, 1])
        ax.set_yticklabels(['Failed', 'Passed'])
        ax.set_xlabel('Test Cases')
        ax.set_ylabel('Status')
        
        # Add pass percentage
        pass_percentage = sum(statuses) / len(statuses) * 100
        ax.text(0.5, 1.1, f"Pass Rate: {pass_percentage:.1f}%", 
                horizontalalignment='center', transform=ax.transAxes, fontsize=14)
        
        # Add information text for each bar
        for i, bar in enumerate(bars):
            case = test_cases[i]
            result = results[case]
            
            # Add text on top of bars
            if result['passed']:
                ax.text(i, 1.05, "✓", ha='center', fontsize=16, color='green')
            else:
                ax.text(i, 1.05, "✗", ha='center', fontsize=16, color='red')
                
            # Add error message for failures
            if not result['passed'] and 'message' in result:
                # Truncate long messages
                msg = result['message']
                if len(msg) > 40:
                    msg = msg[:37] + "..."
                ax.text(i, 0.5, msg, ha='center', va='center', rotation=90, fontsize=8, color='white')
        
        # Save figure if requested
        if save:
            filename = f"{test_name.replace(' ', '_').lower()}_report_{self._get_timestamp()}.png"
            filepath = os.path.join(self.output_dir, filename)
            plt.savefig(filepath, dpi=150, bbox_inches='tight')
            print(f"Test report saved to {filepath}")
        
        return fig
    
    def create_animation(self, frames, tracked_data, title="Motion Tracking", save=True):
        """
        Create an animation showing tracking over a sequence of frames
        
        Args:
            frames: List of video frames
            tracked_data: List of tracking data for each frame
            title: Title for the animation
            save: Whether to save the animation
            
        Returns:
            Animation object
        """
        if not frames or not tracked_data:
            print("No frames or tracking data provided for animation")
            return None
            
        # Create figure
        fig, ax = plt.subplots(figsize=(12, 8))
        
        # Initialize empty image
        h, w = frames[0].shape[:2]
        img = ax.imshow(cv2.cvtColor(frames[0], cv2.COLOR_BGR2RGB))
        
        # Set title
        ax.set_title(title)
        
        # Remove axes
        ax.axis('off')
        
        # Function to update the animation
        def update(frame_idx):
            # Get frame and tracked data for this index
            if frame_idx >= len(frames) or frame_idx >= len(tracked_data):
                return [img]
                
            frame = frames[frame_idx]
            people = tracked_data[frame_idx]
            
            # Create visualization
            vis_frame = self.visualize_tracking(frame, people, show=False, save=False)
            
            # Update image
            img.set_array(cv2.cvtColor(vis_frame, cv2.COLOR_BGR2RGB))
            
            return [img]
        
        # Create animation
        anim = FuncAnimation(fig, update, frames=min(len(frames), len(tracked_data)), interval=100, blit=True)
        
        # Save animation if requested
        if save:
            filename = f"tracking_animation_{self._get_timestamp()}.mp4"
            filepath = os.path.join(self.output_dir, filename)
            
            # Save as MP4
            anim.save(filepath, writer='ffmpeg', fps=10, dpi=100)
            print(f"Animation saved to {filepath}")
        
        return anim
    
    def visualize_yolo_detections(self, frame, detections, title="YOLO Person Detection", show=True, save=True):
        """
        Visualize YOLO person detections with prominent bounding boxes
        
        Args:
            frame: The video frame
            detections: List of standardized keypoint data for each detected person
            title: Title for the visualization
            show: Whether to display the visualization
            save: Whether to save the visualization
            
        Returns:
            The visualization image
        """
        # Create a copy of the frame
        vis_img = frame.copy()
        h, w = frame.shape[:2]
        
        # Add title and detection count
        cv2.putText(vis_img, f"{title} ({len(detections)} people)", 
                   (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        
        # Generate colors for different people
        colors = [
            (0, 255, 0),    # Green
            (255, 0, 0),    # Blue
            (0, 0, 255),    # Red
            (255, 255, 0),  # Cyan
            (255, 0, 255),  # Magenta
            (0, 255, 255),  # Yellow
            (128, 0, 255),  # Purple
            (255, 128, 0),  # Orange
            (0, 255, 128),  # Mint
            (128, 255, 0),  # Lime
        ]
        
        # Draw each detection
        for i, detection in enumerate(detections):
            if not detection.get('has_pose', False):
                continue
                
            keypoints = detection['keypoints']
            confidence = detection.get('confidence', 0.0)
            
            # Use color based on index (cycle through colors)
            color = colors[i % len(colors)]
            
            # Find bounding box for the person
            if len(keypoints) > 0:
                # Extract the x,y coordinates of all visible keypoints
                x_coords = [int(kp[0] * w) for kp in keypoints if kp[3] > 0.3]
                y_coords = [int(kp[1] * h) for kp in keypoints if kp[3] > 0.3]
                
                # Calculate bounding box (add padding of 20 pixels)
                if x_coords and y_coords:
                    padding = 30
                    x_min = max(0, min(x_coords) - padding)
                    y_min = max(0, min(y_coords) - padding)
                    x_max = min(w, max(x_coords) + padding)
                    y_max = min(h, max(y_coords) + padding)
                    
                    # Draw thick bounding box
                    cv2.rectangle(vis_img, (x_min, y_min), (x_max, y_max), color, 3)
                    
                    # Add person label with confidence
                    label = f"Person {i+1} ({confidence:.2f})"
                    text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)[0]
                    
                    # Add background for text
                    cv2.rectangle(vis_img, 
                                 (x_min, y_min - text_size[1] - 10), 
                                 (x_min + text_size[0] + 10, y_min), 
                                 color, -1)  # Filled rectangle
                    
                    # Add text
                    cv2.putText(vis_img, label, 
                               (x_min + 5, y_min - 5), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Draw keypoints sparingly (just main ones for clarity)
            main_keypoints = [0, 11, 12, 23, 24]  # nose, shoulders, hips
            for idx in main_keypoints:
                if idx < len(keypoints):
                    kp = keypoints[idx]
                    x, y = int(kp[0] * w), int(kp[1] * h)
                    visibility = kp[3]
                    
                    # Skip low visibility points
                    if visibility < 0.5:
                        continue
                        
                    # Draw the keypoint as a circle
                    cv2.circle(vis_img, (x, y), 7, color, -1)
        
        # Save the visualization
        if save:
            filename = f"yolo_detection_{len(detections)}_people_{self._get_timestamp()}.jpg"
            filepath = os.path.join(self.output_dir, filename)
            cv2.imwrite(filepath, vis_img)
            print(f"YOLO visualization saved to {filepath}")
        
        # Show the visualization
        if show:
            cv2.imshow("YOLO Detection Visualization", vis_img)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
            
        return vis_img
    
    def visualize_yolo_segmentation(self, frame, results, output_paths=None, title="YOLO Segmentation", show=True, save=True):
        """
        Visualize YOLO segmentation results with bounding boxes and segmentation masks
        
        Args:
            frame: The original video frame
            results: YOLO detection results 
            output_paths: Optional list of output video paths from segmentation
            title: Title for the visualization
            show: Whether to display the visualization
            save: Whether to save the visualization
            
        Returns:
            The visualization image
        """
        # Create a copy of the frame
        vis_img = frame.copy()
        h, w = frame.shape[:2]
        
        # Add title and detection count
        if hasattr(results, 'boxes'):
            person_count = len([box for box in results.boxes.data.cpu().numpy() 
                              if box[5] == 0])  # Class 0 is person
            cv2.putText(vis_img, f"{title} ({person_count} people)", 
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            
            # Draw YOLO boxes directly
            for result in results.boxes.data.cpu().numpy():
                x1, y1, x2, y2, conf, cls = result
                if cls == 0:  # person class
                    # Generate a random color for this detection
                    color = (0, 255, 0)  # default to green
                    
                    # Draw bounding box
                    cv2.rectangle(vis_img, (int(x1), int(y1)), (int(x2), int(y2)), color, 3)
                    
                    # Add label
                    label = f"Person ({conf:.2f})"
                    text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)[0]
                    
                    # Add background for text
                    cv2.rectangle(vis_img, 
                                 (int(x1), int(y1) - text_size[1] - 10), 
                                 (int(x1) + text_size[0] + 10, int(y1)), 
                                 color, -1)  # Filled rectangle
                    
                    # Add text
                    cv2.putText(vis_img, label, 
                               (int(x1) + 5, int(y1) - 5), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Add information about segmented outputs
        if output_paths:
            y_offset = 60
            cv2.putText(vis_img, f"Segmented videos: {len(output_paths)}", 
                       (10, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # List output paths
            for i, path in enumerate(output_paths[:3]):  # Show up to 3 paths
                y_offset += 30
                cv2.putText(vis_img, f"- {os.path.basename(path)}", 
                           (30, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
                
            # Indicate if there are more paths
            if len(output_paths) > 3:
                y_offset += 30
                cv2.putText(vis_img, f"... and {len(output_paths) - 3} more", 
                           (30, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        
        # Save the visualization
        if save:
            filename = f"yolo_segmentation_{self._get_timestamp()}.jpg"
            filepath = os.path.join(self.output_dir, filename)
            cv2.imwrite(filepath, vis_img)
            print(f"YOLO segmentation visualization saved to {filepath}")
        
        # Show the visualization
        if show:
            cv2.imshow("YOLO Segmentation Visualization", vis_img)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
            
        return vis_img 
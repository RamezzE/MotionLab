import os
import numpy as np
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

mediapipe_to_openpose = {
    0: 0, 13: 5, 14: 2, 15: 6, 16: 3, 17: 7, 18: 4,
    23: 12, 24: 9, 25: 13, 26: 10, 27: 14, 28: 11,
    31: 19, 32: 22, 29: 20, 30: 21, 28: 23, 27: 24,
    1: 16, 2: 15, 3: 18, 4: 17,
}

# MediaPipe Pose detector initialization
def initialize_pose_detector():
    try:
        base_options = python.BaseOptions(model_asset_path='utils/pose_landmarker.task')
        options = vision.PoseLandmarkerOptions(
            base_options=base_options,
            output_segmentation_masks=True
        )
        return vision.PoseLandmarker.create_from_options(options)
    except Exception as e:
        raise RuntimeError(f"Error initializing pose detector: {e}")

# Interpolate joints
def interpolate_joint(lm1, lm2):
    try:
        return [(lm1.x + lm2.x) / 2, (lm1.y + lm2.y) / 2, (lm1.z + lm2.z) / 2]
    except Exception as e:
        raise ValueError(f"Error interpolating joints: {e}")

# Open the video file and validate it
def open_video(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Video file not found: {file_path}")

    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        raise ValueError(f"Unable to open video file: {file_path}")

    return cap

# Process a single frame
def process_frame(frame, detector, img_width, img_height, mediapipe_to_openpose):
    try:
        # Convert frame to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        # Detect pose landmarks
        detection_result = detector.detect(mp_image)

        keypoints = np.zeros((25, 3))  # OpenPose format: 25 joints

        if detection_result.pose_landmarks:
            landmarks = detection_result.pose_landmarks[0]

            # Map MediaPipe landmarks to OpenPose
            for mp_idx, openpose_idx in mediapipe_to_openpose.items():
                if mp_idx < len(landmarks):
                    landmark = landmarks[mp_idx]
                    keypoints[openpose_idx, 0] = landmark.x * img_width
                    keypoints[openpose_idx, 1] = landmark.y * img_height
                    keypoints[openpose_idx, 2] = 1.0  # Confidence

            # Add interpolated joints
            neck = interpolate_joint(landmarks[13], landmarks[14])
            keypoints[1] = [neck[0] * img_width, neck[1] * img_height, 1.0]

            mid_hip = interpolate_joint(landmarks[23], landmarks[24])
            keypoints[8] = [mid_hip[0] * img_width, mid_hip[1] * img_height, 1.0]

        return keypoints
    except Exception as e:
        print(f"Error processing a frame: {e}")
        raise RuntimeError(f"Error processing a frame: {e}")

def get_keypoints_list(detector, cap, mediapipe_to_openpose):
    
    keypoints_list = []
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        img_height, img_width = frame.shape[:2]

        # Validate frame dimensions
        if img_height == 0 or img_width == 0:
            raise ValueError("Invalid frame dimensions: height or width is 0.")

        # Process the current frame
        keypoints = process_frame(frame, detector, img_width, img_height, mediapipe_to_openpose)
        keypoints_list.append(keypoints)

    cap.release()
    
    return keypoints_list

# Main function to process the video
def process_video(file_path):
    try:
        # Step 1: Initialize Pose Detector
        detector = initialize_pose_detector()

        # Step 2: Open Video File
        cap = open_video(file_path)

        # Step 3: Get Keypoints List
        return get_keypoints_list(detector, cap, mediapipe_to_openpose)
        
    except Exception as e:
        print(f"Error in process_video function: {e}")
        raise RuntimeError(f"Error in process_video function: {e}")
    
    
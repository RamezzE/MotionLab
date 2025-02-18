import os
import numpy as np
import cv2
import pathlib
import mediapipe as mp
from flask import jsonify

from utils.video_utils import VideoUtils
from utils.pose_utils import PoseUtils
from utils.drawing_utils import DrawingUtils
from utils.bvh_utils import BVHUtils

from ultralytics import YOLO

class PoseController:
    def __init__(self, config_file='utils/video_pose.yaml', checkpoint_file='utils/best_58.58.pth'):
        
        self.mediapipe_to_openpose = {
            0: 0, 11: 5, 12: 2, 13: 6, 14: 3, 
            # 13: 5, # 14: 2, # 15: 6, # 16: 3, 
            17: 7, 18: 4, 23: 12,  24: 9,  
            25: 13,  26: 10, 27: 14,
            28: 11, 31: 20, 32: 23, 29: 19, 30: 22, 
            2: 16, 5: 15, 7: 18, 8: 17,
        }
        
        self.img_width = 0
        self.img_height = 0
        self.fps = 30
        
        # 2D Pose detector initialization
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose()
        
        # 3D Pose Estimator initialization
        self.estimator_3d = PoseUtils.initialize_3D_pose_estimator(config_file, checkpoint_file)    

    # Process a single frame
    def _process_frame(self, frame, visualize = False):
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            detection_result = self.pose.process(rgb_frame)

            keypoints = np.zeros((25, 3))
            pose_world_keypoints = np.zeros((25, 3))
            landmarks_list = []
            if detection_result.pose_landmarks:
                landmarks = detection_result.pose_landmarks.landmark
                landmarks_list.append(landmarks)
                # landmarks = detection_result.pose_world_landmarks.landmark

                pose_world_landmarks = detection_result.pose_world_landmarks.landmark

                for mp_idx, openpose_idx in self.mediapipe_to_openpose.items():
                    if mp_idx < len(landmarks):
                        landmark = landmarks[mp_idx]
                        world_landmark = pose_world_landmarks[mp_idx]
                        
                        keypoints[openpose_idx] = [landmark.x * self.img_width, landmark.y * self.img_height, 1.0]
                        pose_world_keypoints[openpose_idx] = [world_landmark.x, world_landmark.y, world_landmark.z]
                        

                neck = PoseUtils.interpolate_joint(landmarks[11], landmarks[12])
                keypoints[1] = [neck[0] * self.img_width, neck[1] * self.img_height, 1.0]
                
                neck_world = PoseUtils.interpolate_joint(pose_world_landmarks[11], pose_world_landmarks[12])
                pose_world_keypoints[1] = [neck_world[0], neck_world[1], neck_world[2]]
                
                mid_hip = PoseUtils.interpolate_joint(landmarks[23], landmarks[24])
                keypoints[8] = [mid_hip[0] * self.img_width, mid_hip[1] * self.img_height, 1.0]
                
                mid_hip_world = PoseUtils.interpolate_joint(pose_world_landmarks[23], pose_world_landmarks[24])
                pose_world_keypoints[8] = [mid_hip_world[0], mid_hip_world[1], mid_hip_world[2]]
                
                keypoints[21] = keypoints[14]
                keypoints[24] = keypoints[11]
                
                pose_world_keypoints[21] = pose_world_keypoints[14]
                pose_world_keypoints[24] = pose_world_keypoints[11]
            
            ## Draw keypoints
            if visualize:
                frame_with_keypoints = DrawingUtils.draw_openpose_keypoints(frame, keypoints)

                # Show the frame
                if self.img_height > 500:
                    scale = 500 / self.img_height
                    frame_with_keypoints = cv2.resize(frame_with_keypoints, (0, 0), fx=scale, fy=scale)
                    
                cv2.imshow("Pose Estimation", frame_with_keypoints)
                cv2.waitKey(1)  # 1ms delay for video processing
            return keypoints, pose_world_keypoints, landmarks_list
        except Exception as e:
            print(f"Error processing a frame: {e}")
            raise RuntimeError(f"Error processing a frame: {e}")

    # Get keypoints list from the video
    def _get_keypoints_list(self, cap, visualize=False):
        keypoints_list = []
        pose_world_keypoints_list = []
        landmarks_list = []
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            self.img_height, self.img_width = frame.shape[:2]

            if self.img_height == 0 or self.img_width == 0:
                raise ValueError("Invalid frame dimensions: height or width is 0.")

            keypoints, pose_world_keypoints, landmarks = self._process_frame(frame, visualize)
            keypoints_list.append(keypoints)
            pose_world_keypoints_list.append(pose_world_keypoints)
            landmarks_list.append(landmarks)

        cap.release()
        if visualize:
            cv2.destroyAllWindows()
        return keypoints_list, pose_world_keypoints_list, landmarks_list

    # Estimate 3D pose from 2D keypoints list
    def _estimate_3d_from_2d(self, keypoints_list):
        try:
            pose2d = np.stack(keypoints_list)[:, :, :2]
            return self.estimator_3d.estimate(pose2d, image_width=self.img_width, image_height=self.img_height)
        except Exception as e:
            raise RuntimeError(f"Error in _estimate_3d_from_2d: {e}")
            
    # Process the video file
    def process_video(self, temp_video_path):        
        try:
            cap = VideoUtils.open_video(temp_video_path)
            self.fps = VideoUtils.get_video_fps(cap)
            
            keypoints, pose_world_keypoints, landmarks_list = self._get_keypoints_list(cap, visualize=False)
            
            root_keypoints = PoseUtils.get_root_keypoints(landmarks_list)
                        
            points_3d = self._estimate_3d_from_2d(keypoints)

            corrected_3d_points = PoseUtils.align_and_scale_3d_pose(points_3d)
            
            # DrawingUtils.visualize_3D_points(corrected_3d_points, connections=DrawingUtils.CMU_CONNECTIONS)
            
            bvh_filename =  BVHUtils.convert_3d_to_bvh(corrected_3d_points, root_keypoints, self.fps)
            
            # return jsonify({
            #     "success": True,
            #     "bvh_filename": bvh_filename,
            # }), 200
            
            return bvh_filename
        except Exception as e:
            print(f"Error in process_video: {e}")
            return jsonify({"success": False, "error": str(e)}), 500
        finally:
            if temp_video_path and os.path.exists(temp_video_path):
                os.remove(temp_video_path)  # Ensure file cleanup

    def multiple_human_segmentation(self, video_path):
        try:
            # self.yolo_model = YOLO('yolo11m-pose.pt')
            self.yolo_model = YOLO('yolo11s-pose.pt')
            # self.yolo_model = YOLO('yolo11n.pt')
            writers = {}
            self.output_video_paths = []
            # Create an output folder
            output_folder = 'output_videos'
            
            cap = VideoUtils.open_video(video_path)
            self.fps = VideoUtils.get_video_fps(cap)
            
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            pathlib.Path(output_folder).mkdir(parents=True, exist_ok=True)
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                self.img_height, self.img_width = frame.shape[:2]
                
                self._process_YOLO_frame(writers, frame, output_folder, "utils/bytetrack.yaml")
            
            cap.release()
            for writer in writers.values():
                writer.release()
                
            cv2.destroyAllWindows()
            
            bvh_filenames = []
            
            for video_path in self.output_video_paths:
                cap = cv2.VideoCapture(video_path)
                frames_num = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                cap.release()

                if frames_num < 0.4 * total_frames:
                    os.remove(video_path)
                    continue

                print("Processing video:", video_path)
                bvh_filename = self.process_video(video_path)
                bvh_filenames.append(bvh_filename)
            
            return True, bvh_filenames
            
        except Exception as e:
            print(f"Error in _multiple_human_segmentation: {e}")
            return jsonify({"success": False, "error": str(e)}), 500
        
    def _process_YOLO_frame(self, writers, frame, output_folder, tracker_path):
        try:            
            
            results = self.yolo_model.track(frame, persist = True, tracker = tracker_path)
            
            for result in results:
                boxes = result.boxes.xyxy
                labels = result.boxes.cls
                confidences = result.boxes.conf
                
                if len(boxes) == 0:
                    continue
                
                for i, box in enumerate(boxes):
                    x1, y1, x2, y2 = box
                    confidence = confidences[i]
                    
                    bbox_area = abs(x2 - x1) * abs(y2 - y1)  # Compute bounding box area
                    image_area = self.img_width * self.img_height  # Total image area

                    if bbox_area < 0.05 * image_area:  # Adjust the threshold as needed
                        continue
                    
                    if labels[i] == 0 and confidence > 0.7:
                        black_background = np.zeros_like(frame)
                        person_frame = frame[int(y1):int(y2), int(x1):int(x2)]  # Crop the person
                        black_background[int(y1):int(y2), int(x1):int(x2)] = person_frame  # Paste on black background
                        person_id = int(result.boxes.id[i])  # Get tracking ID
                        
                        if person_id not in writers:
                            writers[person_id], output_video_path = VideoUtils.initialize_video_writer(person_id, output_folder, self.fps, (self.img_width, self.img_height))
                            self.output_video_paths.append(output_video_path)
                            
                        # Write the processed frame to the corresponding VideoWriter object
                        writers[person_id].write(black_background)
            
        except Exception as e:
            print(f"Error in _process_YOLO_frame: {e}")
            raise RuntimeError(f"Error in _process_YOLO_frame: {e}")
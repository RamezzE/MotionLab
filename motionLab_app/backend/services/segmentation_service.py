import os
import pathlib
import cv2
from utils import VideoUtils, ObjectDetectionUtils
from ultralytics import YOLO

class SegmentationService:
    def __init__(self, yolo_model_path="yolo11s-pose.pt", output_folder="output_videos"):
        """Initializes the segmentation service with a YOLO model and output folder."""
        self.yolo_model_path = yolo_model_path
        self.output_folder = output_folder
        pathlib.Path(self.output_folder).mkdir(parents=True, exist_ok=True)  # Ensure output folder exists

    def segment_video(self, video_path):
        """Segments multiple humans from a video and returns segmented video paths."""
        self.yolo_model = YOLO(self.yolo_model_path)
        pathlib.Path(self.output_folder).mkdir(parents=True, exist_ok=True)  # Ensure output folder exists

        try:
            writers = {}
            output_video_paths = []
            
            cap = VideoUtils.open_video(video_path)
            fps = VideoUtils.get_video_fps(cap)
            img_width, img_height = VideoUtils.get_video_dimensions(cap)
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                cropped_people = ObjectDetectionUtils.detect_and_crop_people(
                    self.yolo_model, frame, "utils/bytetrack.yaml", img_width, img_height
                )
                VideoUtils.write_cropped_people(
                    writers, cropped_people, self.output_folder, fps, (img_width, img_height), output_video_paths
                )

            cap.release()
            for writer in writers.values():
                writer.release()

            cv2.destroyAllWindows()
            
            return output_video_paths
        
        except Exception as e:
            print(f"Error in segment_video: {e}")
            return None

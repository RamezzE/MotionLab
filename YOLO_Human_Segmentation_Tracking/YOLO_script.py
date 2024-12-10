import numpy as np
import os
import cv2
from ultralytics import YOLO

# YOLO v11 POSE detection model (to only detect humans as needed)
model = YOLO('yolo11n-pose.pt')

# load video
video_name = '5-people-walking-compressed.mp4'
video_path = f'Source Videos/{video_name}'


output_folder = f"Output Videos\YOLO\\{video_name}"
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

def initialize_video_writer(person_id, frame_width, frame_height, fps, output_folder):
    """
    Initializes a VideoWriter object for the given person_id.
    """
    output_video_path = os.path.join(output_folder, f'person_{person_id}.mp4')
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(output_video_path, fourcc, fps, (frame_width, frame_height))
    return writer

def process_frame(frame, model, writers, output_folder, frame_width, frame_height, fps):
    """
    Processes each frame of the video, performs detection and tracking,
    and writes frames with detected people to their respective video files.
    """
    results = model.track(frame, persist=True)

    for result in results:
        boxes = result.boxes.xyxy  # Get bounding boxes [x1, y1, x2, y2]
        labels = result.boxes.cls  # Class IDs for detected objects
        confidences = result.boxes.conf  # Confidence scores

        if len(boxes) == 0:
            continue

        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = box  # Unpack bounding box coordinates
            confidence = confidences[i]

            # Only process the person class (ID = 0) with confidence > 0.7
            if labels[i] == 0 and confidence > 0.7:
                black_background = np.zeros_like(frame)
                person_frame = frame[int(y1):int(y2), int(x1):int(x2)]  # Crop the person
                black_background[int(y1):int(y2), int(x1):int(x2)] = person_frame  # Paste on black background

                person_id = int(result.boxes.id[i])  # Get tracking ID

                # Check if a VideoWriter exists for this person, create if not
                if person_id not in writers:
                    writers[person_id] = initialize_video_writer(person_id, frame_width, frame_height, fps, output_folder)

                # Write the processed frame to the corresponding VideoWriter object
                writers[person_id].write(black_background)

def process_video(video_path, output_folder, model):
    """
    Processes the video frame by frame, detects people, and writes their frames to separate video files.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Couldn't open video file at {video_path}")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))

    # Initialize dictionary to store VideoWriter objects for each person
    writers = {}

    while True:
        ret, frame = cap.read()

        if not ret:
            print("End of video reached or error reading frame.")
            break

        # Process the frame (detection, tracking, and writing)
        process_frame(frame, model, writers, output_folder, frame_width, frame_height, fps)

    # Release the capture and all VideoWriter objects
    cap.release()
    for writer in writers.values():
        writer.release()

    cv2.destroyAllWindows()

process_video(video_path, output_folder, model)
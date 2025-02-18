import numpy as np

class ObjectDetectionUtils:
    @staticmethod
    def detect_and_crop_people(yolo_model, frame, tracker_path, img_width, img_height):
        """
        Runs YOLO tracking, filters detections, and crops detected people.
        Returns a list of (person_id, cropped_frame) tuples.
        """
        results = yolo_model.track(frame, persist=True, tracker=tracker_path)
        cropped_people = []

        for result in results:
            boxes = result.boxes.xyxy
            labels = result.boxes.cls
            confidences = result.boxes.conf
            ids = result.boxes.id if hasattr(result.boxes, 'id') else [None] * len(boxes)

            if len(boxes) == 0:
                continue

            for i, box in enumerate(boxes):
                x1, y1, x2, y2 = box
                confidence = confidences[i]

                bbox_area = abs(x2 - x1) * abs(y2 - y1)  
                image_area = img_width * img_height

                if bbox_area < 0.05 * image_area:  # Ignore small detections
                    continue

                if labels[i] == 0 and confidence > 0.7:
                    black_background = np.zeros_like(frame)
                    person_frame = frame[int(y1):int(y2), int(x1):int(x2)]
                    black_background[int(y1):int(y2), int(x1):int(x2)] = person_frame  

                    person_id = int(ids[i]) if ids[i] is not None else None
                    cropped_people.append((person_id, black_background))

        return cropped_people

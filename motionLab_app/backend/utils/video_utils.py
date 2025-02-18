import os
import cv2

class VideoUtils:
    
    @staticmethod
    def open_video(file_path):
        """
        Opens a video file and validates its existence.

        :param file_path: Path to the video file
        :return: OpenCV VideoCapture object
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Video file not found: {file_path}")

        cap = cv2.VideoCapture(file_path)
        if not cap.isOpened():
            raise ValueError(f"Unable to open video file: {file_path}")
        return cap
    
    @staticmethod
    def delete_video(file_path):
        """
        Deletes a video file if it exists.

        :param file_path: Path to the video file
        """
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
    
    @staticmethod 
    def get_video_dimensions(video):
        """
        Returns the dimensions of a video.

        :param video: OpenCV VideoCapture object
        :return: Tuple (width, height) of the video frame
        """
        width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        return width, height
    
    @staticmethod
    def get_video_frame_count(video_path):
        """
        Returns the total number of frames in a video.

        :param video: OpenCV VideoCapture object
        :return: Total number of frames in the video
        """
        video = cv2.VideoCapture(video_path)
        frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        video.release()
        return frame_count
    
    @staticmethod
    def get_video_fps(video):
        """
        Returns the frames per second of a video.

        :param video: OpenCV VideoCapture object
        :return: Frames per second of the video
        """
        return video.get(cv2.CAP_PROP_FPS)

    @staticmethod
    def initialize_video_writer(person_id, output_folder, fps, frame_size):
        """
        Initializes a VideoWriter object for a given person_id.

        :param person_id: ID of the detected person
        :param output_folder: Folder where the video will be saved
        :param fps: Frames per second for the output video
        :param frame_size: Tuple (width, height) of the video frame
        :return: VideoWriter object, Output video path
        """
        output_video_path = os.path.join(output_folder, f'person_{person_id}.mp4')
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        writer = cv2.VideoWriter(output_video_path, fourcc, fps, frame_size)
        return writer, output_video_path
    
    @staticmethod
    def write_cropped_people(writers, cropped_people, output_folder, fps, frame_size, output_video_paths):
        """
        Writes cropped person frames to individual video files.
        """
        for person_id, cropped_frame in cropped_people:
            if person_id is None:
                continue  # Skip if no ID assigned

            if person_id not in writers:
                writers[person_id], output_video_path = VideoUtils.initialize_video_writer(
                    person_id, output_folder, fps, frame_size
                )
                output_video_paths.append(output_video_path)

            writers[person_id].write(cropped_frame)
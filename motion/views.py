from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import json
from django.conf import settings
from django.http import HttpResponse

from .models import Video
import os

from .serializers import VideoSerializer
import cv2
import mediapipe as mp


class VideoUploadView(APIView):
    def post(self, request, *args, **kwargs):
        video_serializer = VideoSerializer(data=request.data)
        if video_serializer.is_valid():
            video = video_serializer.save()
            return Response({
                "id": video.id,
                "title": video.title,
                "video_file": video.video_file.url,
                "uploaded_at": video.uploaded_at
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(video_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PoseDetectionView(APIView):
    def post(self, request, video_id, *args, **kwargs):
        try:
            video = Video.objects.get(id=video_id)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=404)

        video_path = video.video_file.path
        cap = cv2.VideoCapture(video_path)

        mp_pose = mp.solutions.pose
        pose = mp_pose.Pose()

        landmarks_list = []

        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            result = pose.process(rgb_frame)

            if result.pose_landmarks:
                frame_landmarks = []
                for landmark in result.pose_landmarks.landmark:
                    frame_landmarks.append({
                        "x": landmark.x,
                        "y": landmark.y,
                        "z": landmark.z,
                        "visibility": landmark.visibility
                    })
                landmarks_list.append(frame_landmarks)

        cap.release()

        landmarks_file_name = f"landmarks_video_{video_id}.json"
        landmarks_file_path = os.path.join(
            settings.MEDIA_ROOT, 'landmarks', landmarks_file_name)

        os.makedirs(os.path.dirname(landmarks_file_path), exist_ok=True)

        with open(landmarks_file_path, 'w') as f:
            json.dump(landmarks_list, f)

        return Response({"message": "Pose detection completed and landmarks saved.",
                         "landmarks_file": landmarks_file_path}, status=200)

class StickFigureVideoView(APIView):
    def get(self, request, video_id, *args, **kwargs):
        try:
            video = Video.objects.get(id=video_id)
            landmarks_file_path = os.path.join(settings.MEDIA_ROOT, 'landmarks', f"landmarks_video_{video_id}.json")
            original_video_path = video.video_file.path
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=404)

        if not os.path.exists(landmarks_file_path):
            return Response({"error": "Landmarks not found"}, status=404)

        with open(landmarks_file_path, 'r') as f:
            landmarks_data = json.load(f)

        cap = cv2.VideoCapture(original_video_path)
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(cap.get(cv2.CAP_PROP_FPS))

        output_video_path = os.path.join(settings.MEDIA_ROOT, 'landmarks', f"stick_figure_video_{video_id}.mp4")
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_video_path, fourcc, fps, (frame_width, frame_height))

        connections = [
            (11, 13), (13, 15),   # Left arm
            (12, 14), (14, 16),   # Right arm
            (11, 12),             # Shoulders
            (11, 23), (12, 24),   # Body (shoulders to hips)
            (23, 25), (25, 27),   # Left leg
            (24, 26), (26, 28),   # Right leg
            (23, 24),             # Hips
        ]

        frame_idx = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret or frame_idx >= len(landmarks_data):
                break

            frame_landmarks = landmarks_data[frame_idx]

            for connection in connections:
                x1, y1 = int(frame_landmarks[connection[0]]['x'] * frame_width), int(frame_landmarks[connection[0]]['y'] * frame_height)
                x2, y2 = int(frame_landmarks[connection[1]]['x'] * frame_width), int(frame_landmarks[connection[1]]['y'] * frame_height)
                cv2.line(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)

            for lm in frame_landmarks:
                x, y = int(lm['x'] * frame_width), int(lm['y'] * frame_height)
                cv2.circle(frame, (x, y), 5, (0, 0, 255), -1)

            out.write(frame)
            frame_idx += 1

        cap.release()
        out.release()

        with open(output_video_path, 'rb') as f:
            video_data = f.read()

        return HttpResponse(video_data, content_type='video/mp4')

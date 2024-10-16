from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import json
from django.conf import settings

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
            video = Video.objects.get(id= video_id)
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
        landmarks_file_path = os.path.join(settings.MEDIA_ROOT, 'landmarks', landmarks_file_name)

        os.makedirs(os.path.dirname(landmarks_file_path), exist_ok=True)

        with open(landmarks_file_path, 'w') as f:
            json.dump(landmarks_list, f)

        return Response({"message": "Pose detection completed and landmarks saved.",
                         "landmarks_file": landmarks_file_path}, status=200)
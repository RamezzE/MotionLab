from django.urls import path
from .views import VideoUploadView, PoseDetectionView

urlpatterns = [
    path('upload/', VideoUploadView.as_view(), name='video-upload'),
    path('pose-detection/<int:video_id>/', PoseDetectionView.as_view(), name='pose-detection'),
]

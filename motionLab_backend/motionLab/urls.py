from django.urls import path
from .views import SignupView, LoginView, VideoView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path('videos/', VideoView.as_view(), name='videos'),
]

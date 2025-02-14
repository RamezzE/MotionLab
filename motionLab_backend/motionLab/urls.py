from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import SignupView, LoginView, UploadBVHView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("upload-bvh/", UploadBVHView.as_view(), name="upload-bvh"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

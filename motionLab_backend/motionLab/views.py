import os
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from .models import Video
from .serializers import UserSerializer, VideoSerializer
from django.contrib.auth.hashers import make_password, check_password
from django.core.files.storage import default_storage


User = get_user_model()


class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "").strip()

        print(f"Normalized Email: {email}, Password: {password}")

        try:
            user = User.objects.get(email=email)
            print(f"Found user: {user.email}")

            if user.password == password:
                print("Password is valid.")
                return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
            else:
                print("Invalid password.")
                return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            print("User does not exist.")
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)


class UploadBVHView(APIView):
    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        file_name = default_storage.save(file.name, file)

        file_url = f"{settings.MEDIA_URL}{file_name}".replace("//", "/")  # Avoid double slashes
        print(f"File URL: {file_url}")
        return Response(
            {"file_path": file_url, "message": "File uploaded successfully"},
            status=status.HTTP_201_CREATED
        )




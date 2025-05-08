import os
import requests
from models.avatar_model import Avatar
from database import db

class AvatarService:
    
    @staticmethod
    def download_avatar(download_url, avatar_name, user_id):
        try:
            # Define the directory where avatars will be saved
            directory = "avatars"
            
            # Check if the directory exists, and create it if it doesn't
            if not os.path.exists(directory):
                os.makedirs(directory)
            
            # Download the avatar file from the URL
            response = requests.get(download_url)
            if response.status_code == 200:
                file_path = f"{directory}/{avatar_name}_{user_id}.glb"
                with open(file_path, "wb") as f:
                    f.write(response.content)
                return file_path
            else:
                print(f"Failed to download avatar from {download_url}")
                return None
        except Exception as e:
            print(f"Error downloading avatar: {e}")
            return None
    
    @staticmethod
    def create_avatar(data):
        try:
            avatar_name = data["avatarName"]
            user_id = data["userId"]
            download_url = data["downloadUrl"]
            
            # Call the download_avatar function
            avatar_path = AvatarService.download_avatar(download_url, avatar_name, user_id)
            if not avatar_path:
                return None
            
            # Create the avatar in the database
            avatar = Avatar.create(avatar_name, user_id, avatar_path)
            if avatar:
                return avatar.to_dict()
            
            return None
        except Exception as e:
            print(f"Error in create_avatar: {e}")
            return None

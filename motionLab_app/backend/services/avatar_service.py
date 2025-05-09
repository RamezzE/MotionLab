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
                file_name = f"{avatar_name}_{user_id}.glb"
                file_path = f"{directory}/{file_name}"
                with open(file_path, "wb") as f:
                    f.write(response.content)
                return file_name
            else:
                print(f"Failed to download avatar from {download_url}")
                return None
        except Exception as e:
            print(f"Error downloading avatar: {e}")
            return None
        
    @staticmethod
    def check_duplicate_avatar_name(avatar_name, user_id):
        try:
            # Check if an avatar with the same name already exists for the user
            existing_avatar = Avatar.query.filter_by(name=avatar_name, user_id=user_id).first()
            return existing_avatar is not None
        except Exception as e:
            print(f"Error checking duplicate avatar name: {e}")
            return False
    
    @staticmethod
    def create_avatar(data):
        try:
            avatar_name = data["avatarName"]
            user_id = data["userId"]
            download_url = data["downloadUrl"]
            
            # Call the download_avatar function
            avatar_filename = AvatarService.download_avatar(download_url, avatar_name, user_id)
            if not avatar_filename:
                return None
            
            # Create the avatar in the database
            avatar = Avatar.create(avatar_name, user_id, avatar_filename)
            if avatar:
                return avatar.to_dict()
            
            return None
        except Exception as e:
            print(f"Error in create_avatar: {e}")
            return None
        
    @staticmethod
    def get_avatars_by_user_id(user_id):
        try:
            avatars = Avatar.query.filter_by(user_id=user_id).all()
            return [avatar.to_dict() for avatar in avatars] if avatars else None
        except Exception as e:
            print(f"Error in get_avatars_by_user_id: {e}")
            return None
        
    @staticmethod
    def get_avatar_by_id_and_user_id(avatar_id, user_id):
        try:
            avatar = Avatar.query.filter_by(id=avatar_id, user_id=user_id).first()
            return avatar.to_dict() if avatar else None
        except Exception as e:
            print(f"Error in get_avatar_by_id_and_user_id: {e}")
            return None

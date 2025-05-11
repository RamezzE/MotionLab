import subprocess
import os
from datetime import datetime, timedelta
import threading
import time

from models.retargeted_avatar_model import RetargetedAvatar  # Import the model at the top

class RetargetedAvatarService:
    # Dictionary to store cleanup timers
    _cleanup_timers = {}

    @staticmethod
    def retarget_bvh_to_avatar(bvh_filename: str, avatar_filename: str, project_id: str):
        full_bvh_path = os.path.abspath(os.path.join("BVHs", bvh_filename))
        full_avatar_path = os.path.abspath(os.path.join("avatars", avatar_filename))

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}.glb"
        export_path = os.path.abspath(os.path.join("retargeted_avatars", filename))
        retarget_script_path = os.path.abspath("scripts/retarget_script.py")

        # Ensure output directory exists
        os.makedirs(os.path.dirname(export_path), exist_ok=True)

        # Call Blender in background mode
        cmd = [
            "python", retarget_script_path, "--",
            full_bvh_path, full_avatar_path, export_path
        ]

        print(f"▶️ Running Blender subprocess for retargeting:\n{' '.join(cmd)}")

        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

        print("Blender Output:\n", result.stdout)
        if result.returncode != 0:
            print("Blender Error:\n", result.stderr)
            return None

        # Extract just the filename to store in DB
        filename = os.path.basename(export_path)

        # ✅ Add new row to DB
        retargeted_avatar = RetargetedAvatar.create(project_id=project_id, path=filename)
        if not retargeted_avatar:
            print("Failed to save retargeted avatar to DB.")
            return None
        print("Retargeted avatar saved to DB:", retargeted_avatar.to_dict())

        # Schedule cleanup after 15 minutes
        RetargetedAvatarService._schedule_cleanup(filename, retargeted_avatar.id)

        return retargeted_avatar.to_dict()

    @staticmethod
    def _schedule_cleanup(filename: str, avatar_id: int):
        """Schedule cleanup of a retargeted avatar file and database record after 15 minutes."""
        def cleanup():
            time.sleep(15 * 60)  # Wait for 15 minutes
            try:
                # Delete the file
                file_path = os.path.join("retargeted_avatars", filename)
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"Cleaned up retargeted avatar file: {filename}")

                # Delete the database record
                RetargetedAvatar.delete_by_id(avatar_id)
                print(f"Cleaned up retargeted avatar database record: {avatar_id}")
            except Exception as e:
                print(f"Error cleaning up retargeted avatar {filename}: {e}")

        # Start cleanup in a separate thread
        cleanup_thread = threading.Thread(target=cleanup)
        cleanup_thread.daemon = True
        cleanup_thread.start()
        RetargetedAvatarService._cleanup_timers[filename] = cleanup_thread

    @staticmethod
    def delete_retargeted_avatar_file(filename: str) -> bool:
        """Delete a retargeted avatar file from the filesystem."""
        try:
            # Check if file exists
            does_exist = os.path.exists(os.path.join("retargeted_avatars", filename))
            if not does_exist:
                return True, "File already deleted"
            file_path = os.path.join("retargeted_avatars", filename)
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"Deleted retargeted avatar file: {filename}")
                return True
            return False
        except Exception as e:
            print(f"Error deleting retargeted avatar file {filename}: {e}")
            return False

    @staticmethod
    def delete_retargeted_avatar(avatar_id: int) -> tuple[bool, str]:
        """Delete a retargeted avatar and its associated file."""
        try:
            # Get the avatar record first to get the filename
            avatar = RetargetedAvatar.get_by_id(avatar_id)
            if not avatar:
                return False, "Avatar not found"
                
            # Delete the file first
            if RetargetedAvatarService.delete_retargeted_avatar_file(avatar.path):
                # Then delete the database record
                if RetargetedAvatar.delete_by_id(avatar_id):
                    return True, "Avatar deleted successfully"
                else:
                    return False, "Failed to delete avatar record"
            else:
                return False, "Failed to delete avatar file"
        except Exception as e:
            print(f"Error deleting retargeted avatar {avatar_id}: {e}")
            return False, str(e)


import subprocess
import os
from datetime import datetime

from models.retargeted_avatar_model import RetargetedAvatar  # Import the model at the top

class RetargetedAvatarService:

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

        return retargeted_avatar.to_dict()


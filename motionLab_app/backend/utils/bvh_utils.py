from pathlib import Path
from utils.bvh_skeleton import cmu_skeleton
from datetime import datetime

class BVHUtils:
    @staticmethod
    def convert_3d_to_bvh(pose_3d, root_keypoints, fps, x_sensitivity, y_sensitivity):
        """
        Converts 3D pose data into BVH format.

        :param pose_3d: 3D joint positions
        :param root_keypoints: Root joint positions
        :param fps: Frames per second
        :return: BVH filename
        """
        try:
            bvh_output_dir = Path('BVHs')
            bvh_output_dir.mkdir(parents=True, exist_ok=True)

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            bvh_file_name = f'bvh_{timestamp}.bvh'
            bvh_file = bvh_output_dir / bvh_file_name

            cmu_skeleton.CMUSkeleton().poses2bvh(
                pose_3d, output_file=bvh_file, fps=fps, root_keypoints=root_keypoints, x_sensitivity=x_sensitivity, y_sensitivity=y_sensitivity
            )

            print(f"BVH file saved: {bvh_file_name}")
            return bvh_file_name
        except Exception as e:
            print(f"Error in convert_3d_to_bvh: {e}")
            raise RuntimeError(f"Error in convert_3d_to_bvh: {e}")

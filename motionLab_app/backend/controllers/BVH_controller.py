from models.bvh_model import BVH
import os

class BVHController:
    
    @staticmethod
    def create_bvh(data):
        name = data["name"]
        path = data["path"]
        project_id = data["projectId"]
        
        bvh = BVH.create(name, path, project_id)
        print("BVH created:", bvh)
        return {"success": True, "bvh": bvh.to_dict()}
    
    @staticmethod
    def create_bvhs(filenames, project_id):
        try:
            for filename in filenames:
                BVH.create(filename, project_id)
            
            return True
        except Exception as e:
            return False
        
    @staticmethod
    def delete_bvhs_by_project_id(project_id):
        try:
            bvh_filenames = BVH.delete_bvhs_by_project_id(project_id)
            for filename in bvh_filenames:
                os.remove(os.path.join("BVHs", filename))
                
            return True
        except Exception as e:
            return False
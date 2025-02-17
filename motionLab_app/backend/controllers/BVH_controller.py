from models.bvh_model import BVH

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
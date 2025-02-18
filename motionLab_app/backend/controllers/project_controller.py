from models.project_model import Project
from controllers.BVH_controller import BVHController

class ProjectController:
    
    @staticmethod
    def create_project(data):
        project_name = data["projectName"]
        user_id = data["userId"]
        
        return Project.create(project_name, user_id)
    
    @staticmethod
    def get_project_by_id(project_id):
        return Project.get_project_by_id(project_id)
    
    @staticmethod
    def get_projects_by_user_id(user_id):
        try:
            projects = Project.get_projects_by_user_id(user_id)
            return {"success": True, "projects": [project.to_dict() for project in projects]}
        except Exception as e:
            return {"success": False, "message": str(e)}
        
    @staticmethod
    def delete_project(project_id, user_id):
        try:
            if (Project.delete_project_by_id(project_id, user_id)):
                BVHController.delete_bvhs_by_project_id(project_id)
            else:
                return {"success": False, "message": "Project not found"}
            
            return {"success": True, "message": "Project deleted successfully"}
        except Exception as e:
            return {"success": False, "message": str(e)}
        
    @staticmethod
    def get_bvh_filenames(project_id, user_id):
        try:
            project = Project.get_project_by_id(project_id)
            project_dict = project.to_dict()

            if str(project_dict["user_id"]) != str(user_id):
                return {"success": False, "message": "Unauthorized"}
            
            bvh_files = BVHController.get_bvhs_by_project_id(project_id)
            bvh_dicts = [bvh.to_dict() for bvh in bvh_files]
            bvh_filenames = [bvh["path"] for bvh in bvh_dicts]
            return {"success": True, "filenames": bvh_filenames}
        except Exception as e:
            return {"success": False, "message": str(e)}
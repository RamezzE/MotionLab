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
from models.project_model import Project
from services.bvh_service import BVHService

class ProjectService:
    
    @staticmethod
    def create_project(data):
        try:
            project_name = data["projectName"]
            user_id = data["userId"]
            
            project = Project.create(project_name, user_id)
            if project:
                return project.to_dict()
            
            return None
            
        except Exception as e:
            print(f"Error in create_project: {e}")
            return None
        
    @staticmethod
    def update_project_status(project_id, is_processing):
        try:
            project = Project.get_project_by_id(project_id)
            if project:
                project.is_processing = is_processing
                project.save()
                return True
            
            return False
        except Exception as e:
            print(f"Error in update_project_status: {e}")
            return False
    
    @staticmethod
    def get_projects_by_user_id(user_id):
        try:
            projects = Project.get_projects_by_user_id(user_id)
            if projects:
                return [project.to_dict() for project in projects]
            
            return None
        except Exception as e:
            print(f"Error in get_projects_by_user_id: {e}")
            return None
        
    @staticmethod
    def get_project_by_name_and_user_id(project_name, user_id):
        try:
            project = Project.get_project_by_name_and_user_id(project_name, user_id)
            if project:
                return project.to_dict()
            
            return None
        except Exception as e:
            print(f"Error in get_project_by_name_and_user_id: {e}")
            return None
        
    @staticmethod
    def delete_project(project_id, user_id):
        try:
            if (Project.delete_project_by_id(project_id, user_id) and BVHService.delete_bvhs_by_project_id(project_id)):
                return True, "Project deleted successfully"
            
            return False, "Error while deleting project"
        except Exception as e:
            print(f"Error in delete_project: {e}")
            return False, str(e)
        
    @staticmethod
    def get_bvh_filenames(project_id, user_id):
        try:
            project = Project.get_project_by_id(project_id)
            project_dict = project.to_dict()

            if str(project_dict["user_id"]) != str(user_id):
                return None, "Unauthorized access"
            
            bvh_dicts = BVHService.get_bvhs_by_project_id(project_id)
            if bvh_dicts is None:
                return None, "Error retrieving BVH files"
            
            bvh_filenames = [bvh["path"] for bvh in bvh_dicts]
            return bvh_filenames, None
        except Exception as e:
            print(f"Error in get_bvh_filenames: {e}")
            return None, str(e)
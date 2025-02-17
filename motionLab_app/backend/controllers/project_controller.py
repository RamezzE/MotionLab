from models.project_model import Project

class ProjectController:
    
    @staticmethod
    def create_project(data):
        project_name = data["projectName"]
        user_id = data["userId"]
        
        project = Project.create(project_name, user_id)
        return {"success": True, "project": project.to_dict()}
    
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
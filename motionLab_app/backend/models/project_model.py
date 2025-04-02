from database import db

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    is_processing = db.Column(db.Boolean, default=False)
    creation_date = db.Column(db.DateTime, server_default=db.func.now())
    
    @classmethod
    def create(cls, project_name, user_id, is_processing=True):

        try:
            project = cls(name=project_name, user_id=user_id, is_processing=is_processing, creation_date=db.func.now())
            db.session.add(project)
            db.session.commit()
            return project
        except Exception as e:
            print("Error creating project in create / project_model.py:", e)
            return None
    
    @staticmethod
    def delete_project_by_id(project_id, user_id):
        try:
            project = Project.get_project_by_id(project_id)
            project_dict = project.to_dict()
            if project and str(project_dict["user_id"]) == user_id:
                db.session.delete(project)
                db.session.commit()
                return True
            return False
        except Exception as e:
            print("Error deleting project by id in delete_project_by_id / project_model.py:", e)
            return False
    
    def to_dict(self):
        try:
            return {
                "id": self.id,
                "name": self.name,
                "user_id": self.user_id,
                "is_processing": self.is_processing,
                "creation_date": self.creation_date
            }
        except Exception as e:
            print("Error converting project to dict in to_dict / project_model.py:", e)
            return None
        
    @staticmethod
    def get_project_by_id(project_id):
        try:
            return Project.query.get(project_id)
        except Exception as e:
            print("Error getting project by id in get_project_by_id / project_model.py:", e)
            return None
    
    @staticmethod
    def get_projects_by_user_id(user_id):
        try:
            return Project.query.filter_by(user_id=user_id).all()
        except Exception as e:
            print("Error getting projects by user id in get_projects_by_user_id / project_model.py:", e)
            return None
        
    @staticmethod
    def get_project_by_name_and_user_id(project_name, user_id):
        try:
            return Project.query.filter_by(name=project_name, user_id=user_id).first()
        except Exception as e:
            print("Error getting project by name and user id in get_project_by_name_and_user_id / project_model.py:", e)
            return None

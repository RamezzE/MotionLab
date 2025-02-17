from database import db

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    creation_date = db.Column(db.DateTime, server_default=db.func.now())
    
    @classmethod
    def create(cls, project_name, user_id):
        project = cls(name=project_name, user_id=user_id, creation_date=db.func.now())
        db.session.add(project)
        db.session.commit()
        return project
    
    @staticmethod
    def delete_project_by_id(project_id, user_id):
        """Deletes a project by its ID && its user id."""
        project = Project.get_project_by_id(project_id)
        project_dict = project.to_dict()
        if project and str(project_dict["user_id"]) == user_id:
            db.session.delete(project)
            db.session.commit()
            return True
        return False
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "creation_date": self.creation_date
        }
        
    @staticmethod
    def get_project_by_id(project_id):
        return Project.query.get(project_id)
    
    @staticmethod
    def get_projects_by_user_id(user_id):
        return Project.query.filter_by(user_id=user_id).all()

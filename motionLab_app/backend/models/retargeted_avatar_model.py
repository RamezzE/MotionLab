from database import db

class RetargetedAvatar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    creation_date = db.Column(db.DateTime, server_default=db.func.now())

    @classmethod
    def create(cls, project_id, path):
        try:
            retargeted_avatar = cls(path=path, project_id=project_id, creation_date=db.func.now())

            db.session.add(retargeted_avatar)
            db.session.commit()
            
            return retargeted_avatar
        except Exception as e:
            print("Error creating RetargetedAvatar in create / retargeted_avatar_model.py:", e)
            return None
        
    @classmethod
    def get_by_id(cls, avatar_id):
        try:
            return cls.query.filter_by(id=avatar_id).first()
        except Exception as e:
            print("Error getting RetargetedAvatar by id in get_by_id / retargeted_avatar_model.py:", e)
            return None
    
    def to_dict(self):
        try:
            return {
                "id": self.id,
                "filename": self.path,
                "project_id": self.project_id,
                "creation_date": self.creation_date
            }
        except Exception as e:
            print("Error converting RetargetedAvatar to dict in to_dict / retargeted_avatar_model.py:", e)
            return None
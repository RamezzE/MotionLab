from database import db

class Avatar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    path = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    creation_date = db.Column(db.DateTime, server_default=db.func.now())

    @classmethod
    def create(cls, name, user_id, path):
        try:
            avatar = cls(name=name, path=path, user_id=user_id, creation_date=db.func.now())

            db.session.add(avatar)
            db.session.commit()
            
            return avatar
        except Exception as e:
            print("Error creating Avatar in create / avatar_model.py:", e)
            return None
    
    def to_dict(self):
        try:
            return {
                "id": self.id,
                "filename": self.path,
                "name": self.name,
                "user_id": self.user_id,
                "creation_date": self.creation_date
            }
        except Exception as e:
            print("Error converting Avatar to dict in to_dict / avatar_model.py:", e)
            return None
        
    def get_avatar_by_id_and_user_id(self, avatar_id, user_id):
        try:
            return Avatar.query.filter_by(id=avatar_id, user_id=user_id).first()
        except Exception as e:
            print("Error getting Avatar by id and user id in get_avatar_by_id_and_user_id / avatar_model.py:", e)
            return None
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @classmethod
    def create(cls, first_name, last_name, email, password):
        user = cls(first_name=first_name, last_name=last_name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.get(user_id)

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    def update(self, updated_data):
        if "first_name" in updated_data:
            self.first_name = updated_data["first_name"]
        if "last_name" in updated_data:
            self.last_name = updated_data["last_name"]
        if "email" in updated_data:
            self.email = updated_data["email"]
        if "password" in updated_data:
            self.set_password(updated_data["password"])
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
        
    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email
        }
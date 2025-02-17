from database import db

class BVH(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    
    @classmethod
    def create(cls, path, project_id):
        bvh = cls(path=path, project_id=project_id)
        db.session.add(bvh)
        db.session.commit()
        return bvh
    
    def get_by_id(bvh_id):
        return BVH.query.get(bvh_id)
    
    def get_by_project_id(project_id):
        return BVH.query.filter_by(project_id=project_id).all()
    
    def to_dict(self):
        return {
            "id": self.id,
            "path": self.path,
            "projectId": self.project_id
        }
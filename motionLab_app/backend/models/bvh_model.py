from database import db

class BVH(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    
    @classmethod
    def create(cls, path, project_id):
        try:
            bvh = cls(path=path, project_id=project_id)
            db.session.add(bvh)
            db.session.commit()
            
            return bvh
        except Exception as e:
            print("Error creating BVH in create / bvh_model.py:", e)
            return None
    
    @staticmethod
    def delete_bvhs_by_project_id(project_id):
        try:
            bvh_files = BVH.query.filter_by(project_id=project_id).all()
            bvh_paths = [bvh.path for bvh in bvh_files]
            for bvh in bvh_files:
                db.session.delete(bvh)
            db.session.commit()
            return bvh_paths
        except Exception as e:
            print("Error deleting BVHs by project id in delete_bvhs_by_project_id / bvh_model.py:", e)
            return None
    
    def get_by_project_id(project_id):
        try:
            return BVH.query.filter_by(project_id=project_id).all()
        except Exception as e:
            print("Error getting BVHs by project id in get_by_project_id / bvh_model.py:", e)
            return None
    
    def to_dict(self):
        try:
            return {
                "id": self.id,
                "path": self.path,
                "projectId": self.project_id
            }
        except Exception as e:
            print("Error converting BVH to dict in to_dict / bvh_model.py:", e)
            return None
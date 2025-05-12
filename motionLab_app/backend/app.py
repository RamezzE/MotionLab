import os
from flask import Flask, send_from_directory, abort, jsonify

from pathlib import Path
from flask_cors import CORS

from extensions import mail
from database import SQLALCHEMY_CONFIG, init_db, db
from routes import auth_bp, pose_bp, project_bp, admin_bp, avatar_bp  # Import the Blueprints
from services.retarget_avatar_service import RetargetedAvatarService

def create_app():
    app = Flask(__name__)
    
    app.config.update(SQLALCHEMY_CONFIG)
    init_db(app)  # Initialize the database'
    
    with app.app_context():
        db.create_all()  # Ensure tables are created before using them
        
    CORS(app)
    
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(pose_bp, url_prefix="/pose")
    app.register_blueprint(project_bp, url_prefix="/project")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(avatar_bp, url_prefix="/avatar")
    
    if (os.getenv('MAIL_USERNAME') and os.getenv('MAIL_PASSWORD')):
        print("Mail credentials found in environment variables.")
        app.config.update(
            MAIL_SERVER= os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
            MAIL_PORT=587,
            MAIL_USE_TLS=True,
            MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
            MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
            MAIL_DEFAULT_SENDER=os.getenv('MAIL_USERNAME'),
        )
    
    # Initialize RetargetedAvatarService with the app instance
    RetargetedAvatarService.init_app(app)
    
    return app

app = create_app()

mail.init_app(app)

BVH_DIRECTORY = Path('BVHs')

@app.route('/bvh/<filename>', methods=['GET'])
def serve_bvh_file(filename):
    try:
        # Ensure the file exists in the BVHs directory
        file_path = BVH_DIRECTORY / filename
        if not file_path.is_file():
            abort(404, description="File not found")

        # Send the file from the BVHs directory
        return send_from_directory(BVH_DIRECTORY, filename, as_attachment=True)
    except Exception as e:
        return {"error": str(e)}, 500
    
@app.route('/avatars/<path:filename>', methods=['GET'])
def serve_avatar_file(filename):
    try:
        # Ensure the file exists in the avatars directory
        file_path = Path('avatars') / filename
        if not file_path.is_file():
            app.logger.error(f"File not found: {file_path}")
            abort(404, description="File not found")

        # Send the file from the avatars directory
        return send_from_directory('avatars', filename, as_attachment=True)
    except Exception as e:
        return {"error": str(e)}, 500
    
@app.route('/retargeted_avatars/<path:filename>', methods=['GET'])
def serve_retargeted_avatar_file(filename):
    try:
        # Ensure the file exists in the avatars directory
        file_path = Path('retargeted_avatars') / filename
        if not file_path.is_file():
            app.logger.error(f"File not found: {file_path}")
            abort(404, description="File not found")

        # Send the file from the avatars directory
        return send_from_directory('retargeted_avatars', filename, as_attachment=True)
    except Exception as e:
        return {"error": str(e)}, 500

@app.route('/retargeted-avatars/<project_id>', methods=['GET'])
def get_retargeted_avatars(project_id):
    try:
        from models.retargeted_avatar_model import RetargetedAvatar
        retargeted_avatars = RetargetedAvatar.get_by_project_id(project_id)
        return jsonify([avatar.to_dict() for avatar in retargeted_avatars])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return "Welcome to the Home Page!"

if __name__ == "__main__":
    # Use environment variables for configuration
    app.run(
        debug=os.getenv('FLASK_DEBUG', '0') == '1',
        port=int(os.getenv('FLASK_RUN_PORT', 5000))
    )

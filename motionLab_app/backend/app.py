import os
from flask import Flask, send_from_directory, abort

from pathlib import Path
from flask_cors import CORS

from extensions import mail
from database import SQLALCHEMY_CONFIG, init_db, db
from routes import auth_bp, pose_bp, project_bp, admin_bp  # Import the Blueprints

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

@app.route("/")
def home():
    return "Welcome to the Home Page!"

if __name__ == "__main__":
    # Use environment variables for configuration
    app.run(
        debug=os.getenv('FLASK_DEBUG', '0') == '1',
        port=int(os.getenv('FLASK_RUN_PORT', 5000))
    )

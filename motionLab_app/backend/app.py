import os
from flask import Flask, send_from_directory, abort
from routes.user_routes import user_bp  # Import the Blueprint
from routes.pose_routes import pose_bp  # Import the Blueprint
from pathlib import Path
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Register the Blueprint with the app
app.register_blueprint(user_bp, url_prefix="/user")
app.register_blueprint(pose_bp, url_prefix="/pose")

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

import os
from flask import Flask
from routes.user_routes import user_bp  # Import the Blueprint
from routes.pose_routes import pose_bp  # Import the Blueprint

from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Register the Blueprint with the app
app.register_blueprint(user_bp, url_prefix="/user")
app.register_blueprint(pose_bp, url_prefix="/pose")

@app.route("/")
def home():
    return "Welcome to the Home Page!"

if __name__ == "__main__":
    # Use environment variables for configuration
    app.run(
        debug=os.getenv('FLASK_DEBUG', '0') == '1',
        port=int(os.getenv('FLASK_RUN_PORT', 5000))
    )

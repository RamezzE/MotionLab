from flask import Flask
from routes.user_routes import user_bp  # Import the Blueprint

app = Flask(__name__)

# Register the Blueprint with the app
app.register_blueprint(user_bp, url_prefix="/user")

@app.route("/")
def home():
    return "Welcome to the Home Page!"

if __name__ == "__main__":
    # Use environment variables for configuration
    app.run(
        debug=os.getenv('FLASK_DEBUG', '0') == '1',
        port=int(os.getenv('FLASK_RUN_PORT', 5000))
    )

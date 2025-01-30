import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Database URI (Change for PostgreSQL/MySQL)
DB_URI = os.getenv("DATABASE_URL", "sqlite:///users.db")

SQLALCHEMY_CONFIG = {
    "SQLALCHEMY_DATABASE_URI": DB_URI,
    "SQLALCHEMY_TRACK_MODIFICATIONS": False,
}

db = SQLAlchemy()
migrate = None  # Placeholder for migration instance

def init_db(app):
    global migrate
    db.init_app(app)
    migrate = Migrate(app, db)  # Initialize migrations


db = SQLAlchemy()
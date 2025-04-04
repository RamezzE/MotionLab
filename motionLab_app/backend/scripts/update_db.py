"""
Script to update the database schema by recreating all tables.
WARNING: This will delete all data in the database!
Run this from the backend directory with: 
python scripts/update_db.py
"""


import sys
import os

# Add the parent directory to the path so we can import from the application
sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..')))


from database import db
from app import create_app


def update_db_schema():
    """Drop and recreate all database tables"""
    app = create_app()

    with app.app_context():
        print("Dropping all database tables...")
        db.drop_all()

        print("Creating all database tables with updated schema...")
        db.create_all()

        print("Database schema has been updated successfully!")
        return True


if __name__ == '__main__':
    confirmation = input(
        "This will DELETE ALL DATA in the database. Are you sure? (yes/no): ")
    if confirmation.lower() != 'yes':
        print("Operation cancelled.")
        sys.exit(0)

    if update_db_schema():
        print("Success! You'll need to recreate any necessary data.")
    else:
        print("Failed to update database schema.")
        sys.exit(1)

"""
Script to fix the database schema for the User model.
This will drop and recreate only the User table.
WARNING: This will delete all users in the database!
Run this from the backend directory with:
python scripts/fix_db.py
"""

import sys
import os

# Add the parent directory to the path so we can import from the application
sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from database import db
from models.user_model import User

def fix_user_table():
    """Drop and recreate the User table"""
    app = create_app()
    
    with app.app_context():
        # Get the User table
        user_table = User.__table__
        
        print("Dropping User table...")
        # Drop only the User table
        user_table.drop(db.engine)
        
        print("Creating User table with updated schema...")
        # Create the User table with the updated schema
        user_table.create(db.engine)
        
        print("User table schema has been fixed!")
        return True

if __name__ == '__main__':
    confirmation = input("This will DELETE ALL USERS in the database. Are you sure? (yes/no): ")
    if confirmation.lower() != 'yes':
        print("Operation cancelled.")
        sys.exit(0)
        
    if fix_user_table():
        print("Success! Now create a new admin user with the create_admin.py script.")
    else:
        print("Failed to fix User table schema.")
        sys.exit(1) 
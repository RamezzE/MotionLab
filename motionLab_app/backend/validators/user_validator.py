import re

class UserValidator:
    @staticmethod
    def validate_login(data):
        """Validates login data (email & password)"""
        errors = {}

        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        if not email:
            errors["email"] = "Email is required"
        elif not re.match(r"^\S+@\S+\.\S+$", email):
            errors["email"] = "Invalid email format"

        if not password:
            errors["password"] = "Password is required"
        elif len(password) < 8:
            errors["password"] = "Password must be at least 8 characters"

        return errors

    @staticmethod
    def validate_signup(data):
        """Validates signup data (first name, last name, email, password)"""
        errors = {}

        first_name = data.get("firstName", "").strip()
        last_name = data.get("lastName", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        confirm_password = data.get("confirmPassword", "").strip()

        if not first_name:
            errors["firstName"] = "First Name is required"

        if not last_name:
            errors["lastName"] = "Last Name is required"

        if not email:
            errors["email"] = "Email is required"
        elif not re.match(r"^\S+@\S+\.\S+$", email):
            errors["email"] = "Invalid email format"

        if not password:
            errors["password"] = "Password is required"
        elif len(password) < 8:
            errors["password"] = "Password must be at least 8 characters"

        if not confirm_password:
            errors["confirmPassword"] = "Confirm Password is required"
        elif confirm_password != password:
            errors["confirmPassword"] = "Passwords do not match"

        return errors
    
    @staticmethod
    def validate_password_reset(data):
        """Validates password reset data (email)"""
        errors = {}

        email = data.get("email", "").strip()

        if not email:
            errors["email"] = "Email is required"
        elif not re.match(r"^\S+@\S+\.\S+$", email):
            errors["email"] = "Invalid email format"

        return errors

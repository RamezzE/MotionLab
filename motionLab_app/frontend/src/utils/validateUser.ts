import { LoginErrors, LoginFormData, SignupErrors, SignupFormData } from "../types/formTypes";

export const validateLogin = (formData: LoginFormData): LoginErrors => {
    let { email, password } = formData;
    const errors: LoginErrors = {};

    email = email.trim();
    password = password.trim();

    if (!email) {
        errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.email = "Invalid email format";
    }

    if (!password) {
        errors.password = "Password is required";
    }

    return errors;
};

export const validateSignup = (formData: SignupFormData): SignupErrors => {
    let { firstName, lastName, email, password, confirmPassword } = formData;
    const errors: SignupErrors = {};

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    if (!firstName) {
        errors.firstName = "First Name is required";
    }

    if (!lastName) {
        errors.lastName = "Last Name is required";
    }

    if (!email) {
        errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.email = "Invalid email format";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};

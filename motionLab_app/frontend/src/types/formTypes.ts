export interface LoginFormData {
    email: string;
    password: string;
}

export interface LoginErrors {
    email?: string;
    password?: string;
}

export interface SignupFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignupErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}
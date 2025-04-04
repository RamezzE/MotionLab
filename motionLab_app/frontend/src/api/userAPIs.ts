import axios from "axios";
import { ApiResponse } from "@/types/apiTypes";

const BASE_URL: string = "http://127.0.0.1:5000"; // Flask backend URL

export const signup = async (userData: any) => {
    try {
        const response = await axios.post<ApiResponse<any>>(
            `${BASE_URL}/auth/signup`,
            { ...userData },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Signup API Error:", error.response?.data || error.message);
        return error.response?.data;
    }
};

export const login = async (userData: any) => {
    try {
        const response = await axios.post<ApiResponse<any>>(
            `${BASE_URL}/auth/login`,
            { ...userData },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Login API Error:", error.response.data);
        return error.response.data;
    }
};

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post<ApiResponse<any>>(
            `${BASE_URL}/auth/request-password-reset`,
            { email },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Request Password Reset API Error:", error.response.data);
        return error.response.data;
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post<ApiResponse<any>>(
            `${BASE_URL}/auth/reset-password`,
            { token, newPassword },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Reset Password API Error:", error.response.data);
        return error.response.data;
    }
}
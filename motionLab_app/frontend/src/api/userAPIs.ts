import axios from "axios";
import { ApiResponse } from "@/types/apiTypes";
import { serverURL } from "./config";

const axiosInstance = axios.create({
    baseURL: serverURL + '/auth',
    headers: {
        "Content-Type": "application/json",
    },
});

export const signup = async (userData: any) => {
    try {
        const response = await axiosInstance.post<ApiResponse<any>>(
            `/signup`,
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
        const response = await axiosInstance.post<ApiResponse<any>>(
            `/login`,
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
        const response = await axiosInstance.post<ApiResponse<any>>(
            `/request-password-reset`,
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
        const response = await axiosInstance.post<ApiResponse<any>>(
            `/reset-password`,
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

export const sendVerificationEmail = async (email: string) => {
    try {
        const response = await axiosInstance.post<ApiResponse<any>>(
            `/send-verification-email`,
            { email },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Send Verification Email API Error:", error.response.data);
        return error.response.data;
    }
}

export const verifyEmail = async (token: string) => {
    try {
        const response = await axiosInstance.post<ApiResponse<any>>(
            `/verify-email`,
            { token },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Verify Email API Error:", error.response.data);
        return error.response.data;
    }
}

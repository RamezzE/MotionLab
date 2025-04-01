import axios from "axios";

const BASE_URL: string = "http://127.0.0.1:5000"; // Flask backend URL

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const signup = async (userData: any): Promise<ApiResponse<any>> => {
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
        return { success: false, data: error.response?.data || error.message };
    }
};

export const login = async (userData: any): Promise<ApiResponse<any>> => {
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
        console.error("Login API Error:", error.response?.data || error.message);
        return { success: false, data: error.response?.data || error.message };
    }
};

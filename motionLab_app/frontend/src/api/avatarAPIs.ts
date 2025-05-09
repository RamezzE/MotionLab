import axios from "axios";
import { ApiResponse } from "@/types/apiTypes"; // Adjust the import path as needed

const BASE_URL: string = "http://127.0.0.1:5000/avatar"; // Flask backend URL

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json", // Ensuring the request is sent as JSON
    },
});

// Replace `any` with the appropriate type if known
export const createAvatar = async (
    avatarName: string,
    userId: string,
    downloadUrl: string,
): Promise<ApiResponse<any>> => {
    try {
        // Send the parameters in the request body for a POST request
        const response = await axiosInstance.post(`/create-avatar`, {
            avatarName,
            userId,
            downloadUrl,
        });

        // Return the response data if the request is successful
        return response.data;
    } catch (error: any) {
        console.error("Error creating avatar:", error.message);
        return { success: false, data: error.message }; // Return error message in case of failure
    }
};

export const getAvatarsByUser = async (userId: string): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.get(`/avatars`, {
            params: { userId }, // Sending userId as a query parameter
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching avatars:", error.message);
        return { success: false, data: error.message };
    }
};

export const getAvatarByIdAndUserId = async (
    avatarId: string,
    userId: string,
): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.get(`/`, {
            params: { avatarId, userId }, // Sending avatarId and userId as query parameters
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching avatar:", error.message);
        return { success: false, data: error.message };
    }
}

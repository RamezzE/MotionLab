import axios from "axios";

const BASE_URL: string = "http://127.0.0.1:5000"; // Flask backend URL

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Define a generic interface for API responses
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// Replace `any` with the appropriate type if known

export const getProjectsByUser = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.get(`/project/get-projects`, {
            params: { userId },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching projects by user:", error.message);
        return { success: false, data: error.message };
    }
};

export const deleteProjectById = async (
    projectId: string,
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<any>>(
            `/project/delete-project`, {
            params: { projectId, userId },
        }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting project:", error.message);
        return { success: false, data: error.message };
    }
};

export const getProjectBVHFilenames = async (
    projectId: string,
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<any>>(
            `/project/get-bvh-filenames`, {
            params: { projectId, userId },
        }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching BVH filenames:", error.message);
        return { success: false, data: error.message };
    }
};

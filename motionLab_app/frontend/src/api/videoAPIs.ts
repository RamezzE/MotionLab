import axios, { AxiosProgressEvent } from "axios";
import { ApiResponse } from "@/types/apiTypes"; // Adjust the import path as needed
import { serverURL } from "./config";

const axiosInstance = axios.create({
    baseURL: serverURL,
});

// Define the type for the upload result. Adjust as needed.
export interface UploadResponse {
    // Define properties based on your backend response
    [key: string]: any;
}

/**
 * Uploads a video file along with project information.
 *
 * @param file - The video file to upload.
 * @param projectName - The name of the project.
 * @param userId - The ID of the user.
 * @param onUploadProgress - Optional callback to track upload progress.
 * @returns A promise that resolves to the API response.
 */
export const uploadVideo = async (
    file: File,
    projectName: string,
    userId: string,
    onUploadProgress?: (progress: number) => void
): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append("video", file); // Append the video file with the key 'video'
    formData.append("projectName", projectName); // Append the project name
    formData.append("userId", userId); // Append the user ID

    try {
        const response = await axiosInstance.post<ApiResponse<UploadResponse>>(
            `/pose/process-video`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Required for file uploads
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (onUploadProgress && progressEvent.total) {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onUploadProgress(progress); // Update progress
                    }
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Error uploading video:", error);
        return error.response.data;
    }
};

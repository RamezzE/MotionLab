import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000"; // Flask backend URL

export const uploadVideo = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("video", file); // Append the video file with the key 'video'

    try {
        const response = await axios.post(
            `${BASE_URL}/pose/process-video`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Required for file uploads
                },
                onUploadProgress: (progressEvent) => {
                    if (onUploadProgress) {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onUploadProgress(progress); // Update progress
                    }
                },
            }
        );

        return response.data; // Return response from backend
    } catch (error) {
        console.error("Error uploading video:", error);
        return { success: false, error: error.message };
    }
};

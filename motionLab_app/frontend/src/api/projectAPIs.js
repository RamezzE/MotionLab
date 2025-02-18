import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000"; // Flask backend URL

export const getProjectsByUser = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/project/get-projects?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects by user:", error.message);
        return { success: false, data: error.message };
    }
};

export const deleteProjectById = async (projectId, userId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/project/delete-project?projectId=${projectId}&userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting project:", error.message);
        return { success: false, data: error.message };
    }
}

export const getProjectBVHFilenames = async (projectId, userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/project/get-bvh-filenames?projectId=${projectId}&userId=${userId}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching BVH filenames:", error.message);
        return { success: false, data: error.message };
    }
}
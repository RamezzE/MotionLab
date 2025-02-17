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
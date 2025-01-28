import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

/**
 * @param {string} token
 * @returns {Promise<object>}
 */
export const googleLogin = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/google/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Google Login Failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during Google Login:", error.message);
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup/`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Signup Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signup API Error:", error.response?.data || error.message);
    throw error.response?.data || { error: "Signup failed. Please try again." };
  }
};

export const login = async (userData) => {
  try {
    console.log("Axios Request Payload:", userData); // Log the payload
    const response = await axios.post(`${BASE_URL}/login/`, userData, {
      headers: {
        "Content-Type": "application/json", // Ensure JSON format
      },
    });
    console.log("Login Response Data:", response.data); // Log response data
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message); // Log backend error
    throw (
      error.response?.data || {
        error: "Login failed. Please check your credentials.",
      }
    );
  }
};

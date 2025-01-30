import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000"; // Flask backend URL

// /**
//  * @param {string} token
//  * @returns {Promise<object>}
//  */
// export const googleLogin = async (token) => {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/google/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ token }),
//     });

//     if (!response.ok) {
//       throw new Error("Google Login Failed");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error during Google Login:", error.message);
//     throw error;
//   }
// };

export const signup = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/signup`,
      { ...userData },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Signup API Error:", error.response?.data || error.message);
    return { success: false, data: error.response?.data || error.message };
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      { ...userData },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message);
    return { success: false, data: error.response?.data || error.message };
  }
};
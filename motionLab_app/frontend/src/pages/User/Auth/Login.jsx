import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../../../api/userAPIs";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim inputs to remove extra spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log("Login Payload:", {
      email: trimmedEmail,
      password: trimmedPassword,
    }); // Log trimmed payload

    try {
      const response = await login({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);
      alert("Login successful! Redirecting...");
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response && error.response.data) {
        setErrors(error.response.data); // Backend error
      } else {
        alert("An unexpected error occurred during login.");
      }
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      await googleLogin(token);
      alert("Google Login Successful! Redirecting...");
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error.message);
      alert("Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google Login Failure:", error);
    alert("Google Login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="w-screen h-screen flex items-center justify-center px-4 py-6 text-white">
        <div className="text-center px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome Back
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            Login to your account to continue
          </p>
          <form
            className="flex flex-col space-y-6 items-center w-full max-w-md"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className="w-full">
              <input
                type="email"
                placeholder="Email Address"
                className={`w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.email ? "ring-red-500" : "focus:ring-purple-600"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="w-full">
              <input
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.password ? "ring-red-500" : "focus:ring-purple-600"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-purple-600 text-white px-8 py-4 rounded-md hover:bg-purple-700 transition duration-300 text-lg w-full"
            >
              Login
            </button>
          </form>

          <p className="text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 hover:underline transition duration-300"
            >
              Sign Up
            </Link>
          </p>

          <div className="mt-8 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              shape="circle"
              size="medium"
              text="icon"
              logo_alignment="center"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;

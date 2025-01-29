import React, { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../../../api/userAPIs";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import FormField from "../../../components/UI/FormField";

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
      <div className="flex justify-center items-center px-4 w-screen text-white">
        <div className="z-10 px-4 text-center">
          <h1 className="mb-6 font-bold text-5xl md:text-6xl leading-tight">
            Welcome Back
          </h1>
          <p className="mb-6 text-gray-300 text-xl md:text-2xl">
            Login to your account to continue
          </p>
          <form
            className="flex flex-col items-center space-y-6 mx-auto w-[80vw] sm:w-96"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className="flex flex-col gap-y-4 w-full">

              <FormField
                type="email"
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                extraStyles={`bg-gray-800 ${errors.email && "ring-red-500"}`}
              />

              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}

              <FormField
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                extraStyles={`bg-gray-800 ${errors.password && "ring-red-500"}`}
              />

              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-8 py-2 rounded-md w-full text-lg text-white transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 hover:underline transition duration-300"
            >
              Sign Up
            </Link>
          </p>

          <div className="flex justify-center mt-8">
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

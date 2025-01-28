import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup, googleLogin } from "../../../api/userAPIs";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const { email, password, firstName, lastName } = formData;
      await signup({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);

      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("An unexpected error occurred during signup.");
      }
    }
  };

  const handleGoogleSignUpSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      await googleLogin(token);
      alert("Google Signup Successful! Redirecting...");
      navigate("/login");
    } catch (error) {
      console.error("Google Signup Error:", error.message);
      alert("Google signup failed. Please try again.");
    }
  };

  const handleGoogleSignUpFailure = (error) => {
    console.error("Google Signup Failure:", error);
    alert("Google Signup failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="w-screen h-screen flex items-center justify-center px-4 py-6 text-white">
        <div className="text-center px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Create an Account
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            Sign up to get started
          </p>
          <form
            className="flex flex-col space-y-6 justify-center items-center w-full max-w-md mx-auto"
            onSubmit={handleSubmit}
          >
            {/* First Name */}
            <div className="w-full">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className={`w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.firstName ? "ring-red-500" : "focus:ring-purple-600"
                }`}
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="w-full">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className={`w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.lastName ? "ring-red-500" : "focus:ring-purple-600"
                }`}
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="w-full">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={`w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.email ? "ring-red-500" : "focus:ring-purple-600"
                }`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="w-full">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.password ? "ring-red-500" : "focus:ring-purple-600"
                }`}
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="w-full">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "ring-red-500"
                    : "focus:ring-purple-600"
                }`}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="bg-purple-600 text-white px-8 py-4 rounded-md hover:bg-purple-700 transition duration-300 text-lg w-full"
            >
              Sign Up
            </button>
          </form>

          {/* Redirect to Login */}
          <p className="text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:underline transition duration-300"
            >
              Log In
            </Link>
          </p>

          {/* Google Signup */}
          <div className="mt-8 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignUpSuccess}
              onError={handleGoogleSignUpFailure}
              text="icon"
              shape="circle"
              size="medium"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUpPage;

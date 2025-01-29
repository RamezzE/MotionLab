import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup, googleLogin } from "../../../api/userAPIs";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import FormField from "../../../components/UI/FormField";

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
      <div className="flex justify-center items-center px-4 w-screen text-white">
        <div className="z-10 px-4 text-center">
          <h1 className="mb-6 font-bold text-5xl md:text-6xl leading-tight">
            Join Now
          </h1>
          <p className="mb-6 text-gray-300 text-xl md:text-2xl">
            Sign up to get started
          </p>
          <form
            className="flex flex-col items-center space-y-6 mx-auto w-[80vw] sm:w-96"
            onSubmit={handleSubmit}
          >

            <div className="flex flex-col gap-y-4 w-full">
              <div className="flex flex-row gap-x-4 w-full">
                <FormField
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  extraStyles={`bg-gray-800 ${errors.firstName && "ring-red-500"}`}
                />

                {errors.firstName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.firstName}</p>
                )}

                <FormField
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  extraStyles={`bg-gray-800 ${errors.lastName && "ring-red-500"}`}
                />

                {errors.lastName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
              <FormField
                type="text"
                id="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                extraStyles={`bg-gray-800 ${errors.email && "ring-red-500"}`}
              />

              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}

              <FormField
                type="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                extraStyles={`bg-gray-800 ${errors.password && "ring-red-500"}`}
              />

              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
              )}

              <FormField
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                extraStyles={`bg-gray-800 ${errors.confirmPassword && "ring-red-500"}`}
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>
              )}

            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-8 py-2 rounded-md w-full text-lg text-white transition duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Redirect to Login */}
          <p className="mt-6 text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:underline transition duration-300"
            >
              Log In
            </Link>
          </p>

          {/* Google Signup */}
          <div className="flex justify-center mt-8">
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

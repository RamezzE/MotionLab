import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { signup, googleLogin } from "../../../api/userAPIs";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import FormField from "../../../components/UI/FormField";
import useUserStore from "../../../store/useUserStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { isAuthenticated, signup, error } = useUserStore();
  const navigate = useNavigate();


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(formData);
  };

  // const handleGoogleSignUpSuccess = async (credentialResponse) => {
  //   try {
  //     const token = credentialResponse.credential;
  //     await googleLogin(token);
  //     alert("Google Signup Successful! Redirecting...");
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Google Signup Error:", error.message);
  //     alert("Google signup failed. Please try again.");
  //   }
  // };

  // const handleGoogleSignUpFailure = (error) => {
  //   console.error("Google Signup Failure:", error);
  //   alert("Google Signup failed. Please try again.");
  // };

  return (
    // <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
                  extraStyles={`bg-gray-800 ${error.firstName && "ring-red-500"}`}
                />

                {error.firstName && (
                  <p className="mt-1 text-red-500 text-sm">{error.firstName}</p>
                )}

                <FormField
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  extraStyles={`bg-gray-800 ${error.lastName && "ring-red-500"}`}
                />

                {error.lastName && (
                  <p className="mt-1 text-red-500 text-sm">{error.lastName}</p>
                )}
              </div>
              <FormField
                type="text"
                id="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                extraStyles={`bg-gray-800 ${error.email && "ring-red-500"}`}
              />

              {error.email && (
                <p className="mt-1 text-red-500 text-sm">{error.email}</p>
              )}

              <FormField
                type="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                extraStyles={`bg-gray-800 ${error.password && "ring-red-500"}`}
              />

              {error.password && (
                <p className="mt-1 text-red-500 text-sm">{error.password}</p>
              )}

              <FormField
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                extraStyles={`bg-gray-800 ${error.confirmPassword && "ring-red-500"}`}
              />

              {error.confirmPassword && (
                <p className="mt-1 text-red-500 text-sm">{error.confirmPassword}</p>
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
          {/* <div className="flex justify-center mt-8">
            <GoogleLogin
              onSuccess={handleGoogleSignUpSuccess}
              onError={handleGoogleSignUpFailure}
              text="icon"
              shape="circle"
              size="medium"
            />
          </div> */}
        </div>
      </div>
    // </GoogleOAuthProvider>
  );
};

export default SignUpPage;

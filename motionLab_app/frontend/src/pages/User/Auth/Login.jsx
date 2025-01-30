import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// import { login, googleLogin } from "../../../api/userAPIs";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import FormField from "../../../components/UI/FormField";
import useUserStore from "../../../store/useUserStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isAuthenticated, login, error, clearError } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  // const handleGoogleLoginSuccess = async (credentialResponse) => {
  //   try {
  //     const token = credentialResponse.credential;
  //     await googleLogin(token);
  //     alert("Google Login Successful! Redirecting...");
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Google Login Error:", error.message);
  //     alert("Google login failed. Please try again.");
  //   }
  // };

  // const handleGoogleLoginFailure = (error) => {
  //   console.error("Google Login Failure:", error);
  //   alert("Google Login failed. Please try again.");
  // };

  return (
    // <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
              value={formData.email}
              onChange={(e) => handleInputChange(e)}
              extraStyles={`bg-gray-800 ${error.email && "ring-red-500"}`}
            />

            {error.email && (
              <p className="mt-1 text-red-500 text-sm text-start">{error.email}</p>
            )}

            <FormField
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange(e)}
              extraStyles={`bg-gray-800 ${error.login_password && "ring-red-500"}`}
            />

            {error.password && (
              <p className="mt-1 text-red-500 text-sm text-start">{error.password}</p>
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

        {/* <div className="flex justify-center mt-8">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              shape="circle"
              size="medium"
              text="icon"
              logo_alignment="center"
            />
          </div> */}
      </div>
    </div>
    // </GoogleOAuthProvider>
  );
};

export default LoginPage;

import React, { useState, useEffect, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import FormField from "@components/UI/FormField";
import useUserStore from "@/store/useUserStore";

import { SignupErrors } from "@/types/formTypes";

const SignUpPage = () => {
  const { isAuthenticated, signup } = useUserStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<SignupErrors>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await signup(formData);
    if (!response.success) {
      if (response.errors) {
        setErrors(response.errors);
      }
    }
    else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      navigate("/");
    }
  };

  return (
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
              <div className="flex flex-col gap-y-2 text-start">

                <FormField
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  extraStyles={`bg-gray-800`} label={""} />

                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}

              </div>

              <div className="flex flex-col gap-y-2 text-start">

                <FormField
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  extraStyles={`bg-gray-800`} label={""} />

                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}

              </div>
            </div>
            <FormField
              type="text"
              id="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              extraStyles={`bg-gray-800`} label={""} />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <FormField
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              extraStyles={`bg-gray-800`} label={""} />

              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}

            <FormField
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              extraStyles={`bg-gray-800`} label={""} />

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}

          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-2 rounded-md w-full text-white text-lg transition duration-300"
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

      </div>
    </div>
  );
};

export default SignUpPage;

import React, { useState, useEffect, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import FormField from "@components/UI/FormField";
import useUserStore from "@/store/useUserStore";

import { SignupErrors } from "@/types/formTypes";
import FormButton from "@/components/UI/FormButton";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    try {
      e.preventDefault();
      setLoading(true);
      setErrorMessage(null);
      setErrors({});

      const response = await signup(formData);
      if (!response.success) {


        if (response.errors) {
          setErrors(response.errors);
        }
        else if (response.message) {
          setErrorMessage(response.message);
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

        navigate("/");
      }
    }
    catch (error) {
      console.error("Signup Error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 w-screen text-white">
      <div className="flex flex-col gap-y-8 px-4 text-center">
        <div className="flex flex-col gap-y-4">
          <h1 className="font-bold text-5xl md:text-6xl leading-tight">
            Join Now
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl">
            Sign up to get started
          </p>
        </div>

        <form
          className="flex flex-col items-center gap-y-6 mx-auto w-[80vw] sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-y-4 bg-gray-800/30 backdrop-blur-sm p-6 rounded-lg w-full">
            <div className="flex flex-row gap-x-4 w-full">
              <div className="flex flex-col gap-y-2 w-full text-start">
                <FormField
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  label=""
                  extraStyles="bg-gray-900"
                />
                {errors.firstName && (
                  <div className="bg-red-500/20 shadow-lg shadow-red-500/20 p-3 border-2 border-red-500 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium text-red-400">{errors.firstName}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-y-2 w-full text-start">
                <FormField
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  label=""
                  extraStyles="bg-gray-900"
                />
                {errors.lastName && (
                  <div className="bg-red-500/20 shadow-lg shadow-red-500/20 p-3 border-2 border-red-500 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium text-red-400">{errors.lastName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <FormField
              type="text"
              id="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              label=""
              extraStyles="bg-gray-900"
            />
            {errors.email && (
              <div className="bg-red-500/20 shadow-lg shadow-red-500/20 p-3 border-2 border-red-500 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-red-400">{errors.email}</p>
                </div>
              </div>
            )}

            <FormField
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              label=""
              extraStyles="bg-gray-900"
            />
            {errors.password && (
              <div className="bg-red-500/20 shadow-lg shadow-red-500/20 p-3 border-2 border-red-500 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-red-400">{errors.password}</p>
                </div>
              </div>
            )}

            <FormField
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              label=""
              extraStyles="bg-gray-900"
            />
            {errors.confirmPassword && (
              <div className="bg-red-500/20 shadow-lg shadow-red-500/20 p-3 border-2 border-red-500 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-red-400">{errors.confirmPassword}</p>
                </div>
              </div>
            )}
          </div>

          <FormButton
            type="submit"
            label="Sign Up"
            loading={loading}
            extraStyles="w-full"
          />

          {errorMessage && (
            <div className="bg-red-500/20 shadow-lg shadow-red-500/20 p-3 border-2 border-red-500 rounded-lg w-full">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium text-red-400">{errorMessage}</p>
              </div>
            </div>
          )}
        </form>

        <div className="flex flex-col gap-y-2 w-full text-center">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-purple-400 hover:text-purple-300 transition duration-300"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

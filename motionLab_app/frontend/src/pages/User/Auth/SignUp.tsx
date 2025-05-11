import React, { useState, useEffect, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import FormField from "@components/UI/FormField";
import useUserStore from "@/store/useUserStore";

import { SignupErrors } from "@/types/formTypes";
import FormButton from "@/components/UI/FormButton";
import ErrorMessage from "@/components/UI/ErrorMessage";

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
                  <ErrorMessage message={errors.firstName} className="mt-4" />
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
                  <ErrorMessage message={errors.lastName} className="mt-4" />
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
              <ErrorMessage message={errors.email} className="mt-4" />
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
              <ErrorMessage message={errors.password} className="mt-4" />
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
              <ErrorMessage message={errors.confirmPassword} className="mt-4" />
            )}
          </div>

          <FormButton
            type="submit"
            label="Sign Up"
            loading={loading}
            extraStyles="w-full"
          />

          {errorMessage && (
            <ErrorMessage message={errorMessage} className="mt-4" />
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

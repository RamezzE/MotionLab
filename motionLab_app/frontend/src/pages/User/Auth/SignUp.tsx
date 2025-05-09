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
                  label={""} />

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
                  label={""} />

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
              label={""} />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <FormField
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              label={""} />

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            <FormField
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              label={""} />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}

          </div>

          <FormButton
            type="submit"
            label="Sign Up"
            loading={loading}
          />

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </form>

        {/* Redirect to Login */}
        <p className="mt-6 text-gray-300">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-500 hover:underline transition duration-300"
          >
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignUpPage;

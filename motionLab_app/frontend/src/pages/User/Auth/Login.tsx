import { useState, useEffect, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "@/components/UI/ErrorMessage";
import FormField from "@components/UI/FormField";
import FormButton from "@/components/UI/FormButton";

import useUserStore from "@/store/useUserStore";
import { LoginErrors } from "@/types/formTypes";

const LoginPage = () => {
  const { isAuthenticated, login } = useUserStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {

      e.preventDefault();

      setLoading(true);

      setErrorMessage(null);
      setErrors({});

      const response = await login(formData);

      if (response.success) {
        setFormData({
          email: "",
          password: "",
        });
        navigate("/");
      } else {
        console.log("Login Response:", response);
        if (response.errors !== undefined) {
          setErrors(response.errors);
        }
        else if (response.message) {
          setErrorMessage(response.message);
        }

      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
    finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-center items-center px-4 w-screen text-white">
      <div className="flex flex-col gap-y-8 px-4 text-center">
        <div className="flex flex-col gap-y-4">
          <h1 className="font-bold text-5xl md:text-6xl leading-tight">
            Welcome Back
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl">
            Login to your account to continue
          </p>
        </div>

        <form
          className="flex flex-col items-center gap-y-6 mx-auto w-[80vw] sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-y-4 bg-gray-800/30 backdrop-blur-sm p-6 rounded-lg w-full">
            <FormField
              type="email"
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
              <div className="bg-red-500/20 shadow-lg shadow-red-500/20 p-3 border-2 border-red-500 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-red-400">{errors.password}</p>
                </div>
              </div>
            )}
          </div>

          <FormButton
            type="submit"
            label="Login"
            loading={loading}
            extraStyles="w-full"
          />

          {errorMessage && (
            <ErrorMessage message={errorMessage} className="mt-4" />
          )}
        </form>

        <div className="flex flex-col gap-y-2 w-full text-center">
          <p className="text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-purple-400 hover:text-purple-300 transition duration-300"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-gray-400">
            <Link
              to="/auth/forget-password"
              className="hover:text-purple-400 transition duration-300"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

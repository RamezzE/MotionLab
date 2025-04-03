import { useState, useEffect, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

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
      <div className="flex flex-col gap-y-6 px-4 text-center">
        <h1 className="font-bold text-5xl md:text-6xl leading-tight">
          Welcome Back
        </h1>
        <p className="text-gray-300 text-xl md:text-2xl">
          Login to your account to continue
        </p>
        <form
          className="flex flex-col items-center gap-y-6 mx-auto w-[80vw] sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-y-4 w-full">
            <FormField
              type="email"
              id="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              extraStyles="bg-gray-800"
              label=""
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
            <FormField
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              extraStyles="bg-gray-800"
              label=""
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <FormButton
            type="submit"
            label="Login"
            loading={loading}
          />

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </form>

        <div className="flex flex-col gap-y-2 w-full text-center">
          <p className="text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 hover:underline transition duration-300"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-gray-400">
            <Link
              to="/forget-password"
              className="hover:underline transition duration-300"
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

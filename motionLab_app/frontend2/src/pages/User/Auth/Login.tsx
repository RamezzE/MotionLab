import { useState, useEffect, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import FormField from "@components/UI/FormField";
import useUserStore from "@/store/useUserStore";

import { LoginErrors } from "@/types/formTypes";

const LoginPage = () => {
  const { isAuthenticated, login } = useUserStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await login(formData);

    if (response.success) {
      setFormData({
        email: "",
        password: "",
      })
      setErrors({});
      navigate("/");
    }
    else {
      if (response.errors)
        setErrors(response.errors);
    }

  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
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
              extraStyles={`bg-gray-800`} label={""}
            />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            {/* Password */}

            <FormField
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange(e)}
              extraStyles={`bg-gray-800`}
              label={""} />

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

          </div>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-2 rounded-md w-full text-white text-lg transition duration-300"
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

      </div>
    </div>
  );
};

export default LoginPage;

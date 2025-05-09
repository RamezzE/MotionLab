import { useState, ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import FormField from "@components/UI/FormField";
import FormButton from "@/components/UI/FormButton";

import useUserStore from "@/store/useUserStore";

const ForgotPasswordPage: React.FC = () => {
    const { sendPasswordResetEmail, isAuthenticated } = useUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/"); // Redirect to home if already authenticated  
        }
    }, [isAuthenticated, navigate]);

    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Simple email regex pattern
    const emailRegex = /^\S+@\S+\.\S+$/;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        // Validation: Check if email is empty
        if (!email.trim()) {
            setErrorMessage("Email is required.");
            return;
        }
        // Validation: Check email format
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const response = await sendPasswordResetEmail(email);
            if (response.success) {
                setSuccessMessage(response.message || "Password reset email sent. Please check your inbox.");
            } else {
                setErrorMessage(response.message || "Error sending password reset email.");
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
            setErrorMessage("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    return (
        <div className="flex justify-center items-center px-4 w-screen text-white">
            <div className="flex flex-col gap-y-6 px-4 text-center">
                <h1 className="font-bold text-5xl md:text-6xl leading-tight">
                    Forgot Password
                </h1>
                <p className="text-gray-300 text-xl md:text-2xl">
                    Enter your email to receive password reset instructions.
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
                            value={email}
                            onChange={handleInputChange}
                            extraStyles="bg-gray-800"
                            label=""
                        />
                    </div>

                    <FormButton
                        type="submit"
                        label="Reset Password"
                        loading={loading}
                    />

                    {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-500 text-sm">{successMessage}</p>
                    )}
                </form>

                <div className="flex flex-col gap-y-2 w-full text-center">
                    <p className="text-gray-300">
                        Remembered your password?{" "}
                        <Link
                            to="/auth/login"
                            className="text-blue-500 hover:underline transition duration-300"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

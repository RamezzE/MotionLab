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
            <div className="flex flex-col gap-y-8 px-4 text-center">
                <div className="flex flex-col gap-y-4">
                    <h1 className="font-bold text-5xl md:text-6xl leading-tight">
                        Forgot Password
                    </h1>
                    <p className="text-gray-300 text-xl md:text-2xl">
                        Enter your email to receive password reset instructions.
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
                            value={email}
                            onChange={handleInputChange}
                            extraStyles="bg-gray-900"
                            label=""
                        />
                    </div>

                    <FormButton
                        type="submit"
                        label="Reset Password"
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

                    {successMessage && (
                        <div className="bg-green-500/20 shadow-green-500/20 shadow-lg p-3 border-2 border-green-500 rounded-lg w-full">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="font-medium text-green-400">{successMessage}</p>
                            </div>
                        </div>
                    )}
                </form>

                <div className="flex flex-col gap-y-2 w-full text-center">
                    <p className="text-gray-300">
                        Remembered your password?{" "}
                        <Link
                            to="/auth/login"
                            className="text-purple-400 hover:text-purple-300 transition duration-300"
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

import { useState, ChangeEvent, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

import FormField from "@components/UI/FormField";
import FormButton from "@/components/UI/FormButton";
import useUserStore from "@/store/useUserStore";

const ResetPasswordPage: React.FC = () => {
    const { resetPassword, isAuthenticated } = useUserStore(); // Ensure you have this function in your user store
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/"); // Redirect to home if already authenticated
        }
    }, [isAuthenticated, navigate]);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setErrorMessage("Invalid or missing token.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
        if (!token) {
            setErrorMessage("Missing token. Cannot reset password.");
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword(token, password);
            if (response.success) {
                setSuccessMessage(response.message || "Your password has been reset successfully.");
                // Optionally redirect to login after a delay
                setTimeout(() => {
                    navigate("/auth/login");
                }, 2000);
            } else {
                setErrorMessage(response.message || "Error resetting password.");
            }
        } catch (error) {
            console.error("Reset Password Error:", error);
            setErrorMessage("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    return (
        <div className="flex justify-center items-center px-4 w-screen text-white">
            <div className="flex flex-col gap-y-8 px-4 text-center">
                <div className="flex flex-col gap-y-4">
                    <h1 className="font-bold text-5xl md:text-6xl leading-tight">
                        Reset Password
                    </h1>
                    <p className="text-gray-300 text-xl md:text-2xl">
                        Enter your new password.
                    </p>
                </div>

                <form
                    className="flex flex-col items-center gap-y-6 mx-auto w-[80vw] sm:w-96"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-y-4 bg-gray-800/30 backdrop-blur-sm p-6 rounded-lg w-full">
                        <FormField
                            type="password"
                            id="password"
                            placeholder="New Password"
                            value={password}
                            onChange={handlePasswordChange}
                            extraStyles="bg-gray-900"
                            label=""
                        />
                        <FormField
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
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

export default ResetPasswordPage;

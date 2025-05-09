import React, { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useUserStore from "@/store/useUserStore";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import FormField from "@/components/UI/FormField";
import FormButton from "@/components/UI/FormButton";

const VerifyEmailPage: React.FC = () => {
    const { verifyEmail, sendVerificationEmail, user, isAuthenticated } = useUserStore();
    const navigate = useNavigate();


    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!isAuthenticated || !user || user.is_email_verified) {
            navigate("/auth/login");
        }
        
        // Admin users don't need to verify their email
        if (user && user.is_admin) {
            navigate("/");
        }
    }, [isAuthenticated, user, navigate]);


    // States for the verification flow (token present)
    const [verifyLoading, setVerifyLoading] = useState(true);
    const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
    const [verifyError, setVerifyError] = useState<string | null>(null);

    // States for the "request verification email" flow (no token)
    const [email, setEmail] = useState(user?.email || "");
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestMessage, setRequestMessage] = useState<string | null>(null);
    const [requestError, setRequestError] = useState<string | null>(null);

    // If a token is present, verify the email automatically.
    useEffect(() => {
        if (token) {
            const verify = async () => {
                try {
                    const response = await verifyEmail(token);
                    if (response.success) {
                        setVerifyMessage(response.message || "Email verified successfully.");
                        // Redirect to home after a delay.
                        setTimeout(() => {
                            navigate("/");
                        }, 3000);
                    } else {
                        setVerifyError(response.message || "Email verification failed.");
                    }
                } catch (err) {
                    console.error("Email verification error:", err);
                    setVerifyError("An unexpected error occurred during email verification.");
                } finally {
                    setVerifyLoading(false);
                }
            };

            verify();
        }
    }, [token, navigate, verifyEmail]);

    // Handler for the request verification email form
    const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRequestError(null);
        setRequestMessage(null);

        if (!email.trim()) {
            setRequestError("Email is required.");
            return;
        }
        // Optionally add a simple email regex check.
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setRequestError("Please enter a valid email address.");
            return;
        }

        setRequestLoading(true);
        try {
            const response = await sendVerificationEmail(email);
            if (response.success) {
                setRequestMessage(
                    response.message || "Verification email sent. Please check your inbox."
                );
            } else {
                setRequestError(response.message || "Error sending verification email.");
            }
        } catch (error) {
            console.error("Request verification email error:", error);
            setRequestError("An unexpected error occurred. Please try again later.");
        } finally {
            setRequestLoading(false);
        }
    };

    // If token is provided, render the verification UI.
    if (token) {
        return (
            <div className="flex flex-col justify-center items-center gap-y-4 px-4 w-full min-h-[40vh] text-white">
                <div className="flex flex-col gap-y-6 px-4 text-center">
                    {verifyLoading ? (
                        <>
                            <p className="text-xl">Verifying your email...</p>
                            <LoadingSpinner />
                        </>
                    ) : verifyError ? (
                        <p className="text-red-500 text-xl">{verifyError}</p>
                    ) : (
                        <p className="text-green-500 text-xl">{verifyMessage}</p>
                    )}
                </div>
            </div>
        );
    }

    // If no token, render the "Request Verification Email" form.
    return (
        <div className="flex flex-col justify-center items-center gap-y-4 px-4 w-full min-h-[40vh] text-white">
            <div className="flex flex-col gap-y-6 px-4 text-center">
                <h1 className="font-bold text-5xl md:text-6xl leading-tight">
                    Verify Your Email
                </h1>
                <p className="text-gray-300 text-xl md:text-2xl">
                    We will send a verification link to your email.
                </p>
                <form
                    className="flex flex-col items-center gap-y-6 mx-auto w-[80vw] sm:w-96"
                    onSubmit={handleRequestSubmit}
                >
                    <div className="flex flex-col gap-y-4 w-full">
                        <FormField
                            type="email"
                            id="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            extraStyles="bg-gray-800"
                            label=""
                            disabled
                        />
                    </div>

                    <FormButton
                        type="submit"
                        label="Request Verification Email"
                        loading={requestLoading}
                    />

                    {requestError && (
                        <p className="text-red-500 text-sm">{requestError}</p>
                    )}
                    {requestMessage && (
                        <p className="text-green-500 text-sm">{requestMessage}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default VerifyEmailPage;

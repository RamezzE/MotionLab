import React from 'react'
import { useNavigate } from 'react-router-dom'
import FormButton from '@/components//UI/FormButton';

interface VerifyEmailGuardProps {
    title?: string;
}

const VerifyEmailGuard: React.FC<VerifyEmailGuardProps> = ({ title }) => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center gap-y-8 px-4 w-full min-h-[40vh] text-white">
            <div className="flex flex-col gap-y-4 text-center">
                <h1 className="font-bold text-5xl md:text-6xl leading-tight">
                    {title || "Verify Your Email"}
                </h1>
                <p className="text-gray-300 text-xl md:text-2xl">
                    Please verify your email address to continue.
                </p>
            </div>

            <div className="flex flex-col gap-y-6 bg-gray-800/30 backdrop-blur-sm p-6 rounded-lg w-full max-w-md">
                <div className="flex flex-col gap-y-4">
                    <p className="text-gray-300 text-center">
                        We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                    </p>
                    <p className="text-gray-400 text-sm text-center">
                        Didn't receive the email? Check your spam folder or request a new verification link.
                    </p>
                </div>
                <FormButton
                    label='Resend Verification Email'
                    onClick={() => navigate("/auth/resend-verification")}
                    extraStyles="w-full"
                />
            </div>
        </div>
    )
}

export default VerifyEmailGuard
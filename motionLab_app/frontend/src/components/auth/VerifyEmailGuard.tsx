import React from 'react'
import { useNavigate } from 'react-router-dom'
import FormButton from '@/components/UI/FormButton';

interface VerifyEmailGuardProps {
    title: string;
}

const VerifyEmailGuard = ({ title }: VerifyEmailGuardProps) => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center gap-y-4 px-4 w-full min-h-[40vh] text-white">
            <h1 className="font-bold text-5xl">{title}</h1>
            <p className="text-gray-300 text-lg">
                Your email address has not been verified.
            </p>
            <p className="text-gray-300 text-lg">
                Please verify your email before uploading your video.
            </p>
            <FormButton
                label='Verify Email'
                onClick={() => navigate("/auth/verify-email")}
                fullWidth={false}
                textSize='base'
            />
        </div>
    )
}

export default VerifyEmailGuard
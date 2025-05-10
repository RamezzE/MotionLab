import React from 'react'
import { useNavigate } from 'react-router-dom'
import FormButton from '@/components//UI/FormButton';

interface LoginGuardProps {
    title?: string;
}

const LoginGuard: React.FC<LoginGuardProps> = ({ title }) => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center gap-y-8 px-4 w-full min-h-[40vh] text-white">
            <div className="flex flex-col gap-y-4 text-center">
                <h1 className="font-bold text-5xl md:text-6xl leading-tight">
                    {title || "Create your Avatar"}
                </h1>
                <p className="text-gray-300 text-xl md:text-2xl">
                    You must be logged in to continue.
                </p>
            </div>

            <div className="flex flex-col gap-y-6 bg-gray-800/30 backdrop-blur-sm p-6 rounded-lg w-full max-w-md">
                <p className="text-gray-300 text-center">
                    Please log in to access this feature and start creating amazing animations.
                </p>
                <FormButton
                    label='Login'
                    onClick={() => navigate("/auth/login")}
                    extraStyles="w-full"
                />
            </div>
        </div>
    )
}

export default LoginGuard
import React from 'react'
import { useNavigate } from 'react-router-dom'
import FormButton from '@/components//UI/FormButton';

interface LoginGuardProps {
    title?: string;
}

const LoginGuard: React.FC<LoginGuardProps> = ({ title }) => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center gap-y-4 px-4 w-full min-h-[40vh] text-white">
            <h1 className="font-bold text-5xl">{title || "Create your Avatar"}</h1>
            <p className="text-gray-300 text-lg">
                You must be logged in to continue.
            </p>
            <FormButton
                label='Login'
                onClick={() => navigate("/auth/login")}
                fullWidth={false}
                textSize='base'
            />
        </div>
    )
}

export default LoginGuard
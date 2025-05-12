// AvatarNameModal.tsx
import React from 'react';
import FormButton from '@/components/UI/FormButton';
import { X } from "lucide-react";
import ErrorMessage from '../UI/ErrorMessage';

interface AvatarNameModalProps {
    avatarName: string;
    setAvatarName: React.Dispatch<React.SetStateAction<string>>;
    onCreateAvatar: () => void;
    onCancel: () => void;
    loading: boolean;
    error: string | null; // Optional error message prop
}

const AvatarNameModal: React.FC<AvatarNameModalProps> = ({
    avatarName,
    setAvatarName,
    onCreateAvatar,
    onCancel,
    loading,
    error, // Optional error message prop
}) => {
    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/90">
            <div className="bg-gray-800 px-6 py-4 border border-purple-500/20 rounded-lg w-full sm:w-[400px] max-w-[90vw]">
                <div className="flex flex-row justify-between items-center mb-4">
                    <div className="w-6" /> {/* Spacer for balance */}
                    <h2 className="font-bold text-white text-xl">Enter Avatar Name</h2>
                    {!loading && (
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    )}
                    {loading && (<div className="w-6" />)}
                </div>
                
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 border border-purple-500/10 rounded-lg">
                        <input
                            type="text"
                            value={avatarName}
                            onChange={(e) => setAvatarName(e.target.value)}
                            placeholder="Enter Avatar Name"
                            className="bg-black/50 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-full text-white placeholder-gray-400"
                            disabled={loading}
                        />
                        {error && (
                           <ErrorMessage message={error} />
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        {!loading && (
                            <FormButton
                                label="Cancel"
                                onClick={onCancel}
                                theme="transparent"
                                fullWidth={false}
                                textSize="base"
                                disabled={loading}
                            />
                        )}
                        <FormButton
                            label={loading ? 'Creating...' : 'Create Avatar'}
                            onClick={onCreateAvatar}
                            loading={loading}
                            theme="default"
                            fullWidth={false}
                            textSize="base"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarNameModal;

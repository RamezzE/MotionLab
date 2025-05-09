// AvatarNameModal.tsx
import React from 'react';
import FormButton from '@/components/UI/FormButton';

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
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/75">
            <div className="bg-gray-800 p-6 rounded-lg w-full sm:w-[400px]">
                <h2 className="mb-4 text-white text-xl">Enter Avatar Name</h2>
                <input
                    type="text"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="Enter Avatar Name"
                    className="bg-black/50 px-4 py-2 rounded-md w-full text-white"
                />
                {error && <p className="mt-2 px-2 text-red-500">{error}</p>} {/* Display error message if present */}

                <div className="flex justify-end gap-4 mt-4">
                    <FormButton
                        label="Cancel"
                        onClick={onCancel}
                        theme="transparent" // Transparent theme for cancel button
                        fullWidth={false} // Set to false for fixed width
                        textSize="base" // Adjust text size as needed
                    />
                    <FormButton
                        label={loading ? 'Uploading...' : 'Create Avatar'}
                        onClick={onCreateAvatar}
                        loading={loading}
                        theme="default"
                        fullWidth={false} // Set to false for fixed width
                        textSize="base" // Adjust text size as needed
                    />

                </div>
            </div>
        </div>
    );
};

export default AvatarNameModal;

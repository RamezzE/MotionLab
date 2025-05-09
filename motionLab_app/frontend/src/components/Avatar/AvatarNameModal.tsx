// AvatarNameModal.tsx
import React from 'react';

interface AvatarNameModalProps {
    avatarName: string;
    setAvatarName: React.Dispatch<React.SetStateAction<string>>;
    onCreateAvatar: () => void;
    closeModal: () => void;
    loading: boolean;
}

const AvatarNameModal: React.FC<AvatarNameModalProps> = ({
    avatarName,
    setAvatarName,
    onCreateAvatar,
    closeModal,
    loading,
}) => {
    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50">
            <div className="bg-gray-800 p-6 rounded-lg w-full sm:w-[400px]">
                <h2 className="mb-4 text-white text-xl">Enter Avatar Name</h2>
                <input
                    type="text"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="Enter Avatar Name"
                    className="bg-black/50 px-4 py-2 rounded-md w-full text-white"
                />
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={closeModal}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onCreateAvatar}
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white"
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Create Avatar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarNameModal;

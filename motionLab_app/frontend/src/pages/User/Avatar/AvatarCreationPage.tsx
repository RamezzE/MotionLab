import { AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import useUserStore from "@/store/useUserStore";
import AvatarCreatorWrapper from "@/components/Avatar/AvatarCreator";

import useAvatarStore from "@/store/useAvatarStore";
import AvatarNameModal from "@/components/Avatar/AvatarNameModal"; // Import the modal component

interface AvatarCreationProps {
    avatarId?: string;  // Optional prop for editing an existing avatar
}

const config: AvatarCreatorConfig = {
    clearCache: true,
    quickStart: true,
    language: 'en',
    bodyType: 'fullbody',
};

const AvatarCreation: React.FC<AvatarCreationProps> = () => {
    const { user } = useUserStore();
    const { createAvatar } = useAvatarStore();
    const navigate = useNavigate();
    const { avatarId } = useParams(); // Get the avatarId from the URL parameters
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [avatarName, setAvatarName] = useState<string>(''); // New state for avatar name input
    const [nameInputVisible, setNameInputVisible] = useState<boolean>(false); // Flag to show input field
    const [error, setError] = useState<string | null>(null); // State to store error messages

    // Modify config based on avatarId
    const updatedConfig = {
        ...config,
        // If avatarId exists, pass it along in the config to load the existing avatar
        ...(avatarId && { avatarId }),
    };

    useEffect(() => {
        if (avatarId) {
            // You can make an API call here to load the existing avatar data using the avatarId
            // Example: fetchAvatar(avatarId);
            console.log(`Editing avatar with ID: ${avatarId}`);
        }
    }, [avatarId]);

    const handleAvatarExported = async (event: AvatarExportedEvent) => {
        setAvatarUrl(event.data.url);
        console.log('Avatar exported:', event.data);

        if (!user) {
            console.error('User is not logged in. Cannot upload avatar.');
            return;
        }

        // Show input field to enter avatar name before uploading
        setNameInputVisible(true);
    }

    const handleCreateAvatar = async () => {
        if (!avatarName) {
            setError('Avatar name is required');
            return;
        }

        setLoading(true);

        if (!user) {
            setError('User is not logged in. Cannot upload avatar.');
            setLoading(false);
            return;
        }

        try {
            const response = await createAvatar(
                avatarName, // Use the entered avatar name
                String(user.id), // Ensure user ID is available and converted to string
                avatarUrl
            );

            console.log('Avatar creation response:', response);

            if (response.success) {
                console.log('Avatar uploaded successfully:', response.data);
                navigate("/profile/avatars");
            } else {
                setError(response.message || 'Unknown error occurred during avatar upload');
                console.error('Error uploading avatar:', response.message || 'Unknown error');
            }

        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setLoading(false);
        }
    }

    const closeModal = () => {
        setNameInputVisible(false); // Close the modal
        setAvatarUrl(''); // Clear the avatar URL when closing the modal
        setAvatarName(''); // Clear the avatar name input
        setError(null); // Clear any error messages
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center gap-y-4 px-4 w-full min-h-[40vh] text-white">
                <h1 className="font-bold text-5xl">Create your Avatar</h1>
                <p className="text-gray-300 text-lg">
                    You must be logged in to continue.
                </p>
                <button
                    className="bg-purple-600 hover:bg-purple-700 mt-4 px-6 py-3 rounded-md text-white transition"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center gap-y-8 px-4 w-full">
            <h1 className="font-bold text-white text-5xl">
                {avatarId ? 'Edit your Avatar' : 'Create your Avatar'}
            </h1>

            {/* AvatarCreator component is now separate */}
            <AvatarCreatorWrapper
                config={updatedConfig}
                onAvatarExported={handleAvatarExported}
            />

            {/* Modal for avatar name input */}
            {nameInputVisible && (
                <AvatarNameModal
                    avatarName={avatarName}
                    setAvatarName={setAvatarName}
                    onCreateAvatar={handleCreateAvatar}
                    onCancel={closeModal}
                    loading={loading}
                    error={error}
                />
            )}
        </div>
    );
};

export default AvatarCreation;

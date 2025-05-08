import { AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import useUserStore from "@/store/useUserStore";
import AvatarCreatorWrapper from "@/components/Avatar/AvatarCreator";

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
    const navigate = useNavigate();
    const { avatarId } = useParams(); // Get the avatarId from the URL parameters
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');

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

        setLoading(true);
        try {
            const response = await fetch(event.data.url);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append('avatar', blob, 'avatar.glb');

            // Upload the avatar to your server or handle it as needed
            // Example: await uploadAvatarToServer(formData);

            console.log('Avatar uploaded successfully!');
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setLoading(false);
        }
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
        </div>
    );
};

export default AvatarCreation;

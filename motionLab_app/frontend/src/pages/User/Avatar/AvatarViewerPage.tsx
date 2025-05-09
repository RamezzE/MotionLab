import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useUserStore from "@/store/useUserStore";
import useAvatarStore from "@/store/useAvatarStore"; // Import the store
import AvatarViewer from "@/components/Avatar/AvatarViewer"; // Import the AvatarViewer component
import { Avatar } from "@/types/types";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { serverURL } from "@/api/config"; // Import the server URL

const AvatarViewerPage: React.FC = () => {
    const { user } = useUserStore(); // Get the user from the user store
    const { avatarId } = useParams(); // Get avatarId from URL
    const { getAvatarByIdAndUserId } = useAvatarStore(); // Get the avatar fetching function from the store
    const [loading, setLoading] = useState<boolean>(true); // State to manage loading
    const [avatar, setAvatar] = useState<Avatar | null>(null); // State to store the fetched avatar
    const [error, setError] = useState<string | null>(null); // State to store error messages

    const modelSrc = `${serverURL}/avatars/` + avatar?.filename; // Construct the model source URL

    useEffect(() => {
        if (!user || !user.id || !avatarId) {
            return;
        }

        const fetchAvatarData = async () => {
            try {
                const response = await getAvatarByIdAndUserId(avatarId, String(user.id));
                console.log("Fetched avatar data:", response); // Log the response for debugging

                // Check if response has success and data
                if (response.success && response.data) {
                    setAvatar(response.data);
                } else {
                    setError("Avatar not found.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch avatar data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAvatarData();
    }, [user, avatarId, getAvatarByIdAndUserId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full min-h-[40vh]">
                <LoadingSpinner size={125} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center w-full min-h-[40vh]">
                <p className="text-white">{error}</p>
            </div>
        );
    }

    if (!avatar) {
        return (
            <div className="flex justify-center items-center w-full min-h-[40vh]">
                <p className="text-white">No avatar found.</p>
            </div>
        );
    }

    // Ensure that you have the right fields in the `avatar` object
    console.log('Avatar data:', avatar); // Check the avatar data structure

    return (
        <div className="flex flex-col items-center gap-y-4 px-4 w-full">
            <h1 className="font-bold text-white text-5xl">Your Avatar</h1>

            <AvatarViewer
                modelSrc={modelSrc} // Assuming `avatar.filename` is the link to the model (GLB file)
                characterName={avatar.name} // Assuming `avatar.name` contains the name of the avatar
                createdDate={avatar.creation_date} // Assuming `avatar.creation_date` is a valid string date
                displayMode="default"
                onDelete={() => {
                    console.log("Delete avatar", avatar.id);
                }}
            />
        </div>
    );
};

export default AvatarViewerPage;

import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import AvatarViewer from "@/components/Avatar/AvatarViewer";
import { useNavigate } from "react-router-dom";
import useAvatarStore from "@/store/useAvatarStore";
import { serverURL } from "@/api/config";
import FormButton from "@/components/UI/FormButton";
import EmptyState from "@/components/UI/EmptyState";

const AvatarsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { avatars, fetchAvatars: fetchAvatarsStore, deleteAvatarByIdAndUserId } = useAvatarStore();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchAvatars = async () => {
            setLoading(true);
            await fetchAvatarsStore(user.id.toString());
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        };

        fetchAvatars();
    }, [user]);

    const handleAvatarDelete = async (avatarId: string) => {
        if (!user || !user.id) return;

        const confirmed = window.confirm("Are you sure you want to delete this avatar?");
        if (confirmed) {
            setLoading(true);
            await deleteAvatarByIdAndUserId(avatarId, user.id.toString());
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full min-h-[40vh]">
                <LoadingSpinner size={125} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-y-8">
            <div className="text-center">
                <h1 className="mb-2 font-bold text-white text-5xl">Your Avatars</h1>
                <p className="text-gray-300 text-lg">Here are the avatars you have created.</p>
            </div>

            <FormButton
                label="Create New Avatar"
                onClick={() => navigate("/avatar/create")}
                loading={loading}
                // theme="dark"
                fullWidth={false}
            />

            <div className="flex flex-row flex-wrap justify-center items-center gap-4 w-full">
                {avatars.map((character) => (
                    <AvatarViewer
                        key={character.id}
                        characterName={character.name}
                        createdDate={character.creation_date}
                        modelSrc={`${serverURL}/avatars/` + character.filename}
                        // modelSrc={"https://models.readyplayer.me/681d1b48eb427a0b72c4b2ce.glb"}
                        displayMode="list"
                        onPress={() => navigate(`/avatar/view/${character.id}`)}
                        onDelete={() => handleAvatarDelete(character.id)}
                    />
                ))}
            </div>

            {avatars.length === 0 && (
                <EmptyState
                    title="No avatars found"
                    description="You can create an avatar by clicking the button above"
                />
            )}
        </div>
    );
};

export default AvatarsPage;

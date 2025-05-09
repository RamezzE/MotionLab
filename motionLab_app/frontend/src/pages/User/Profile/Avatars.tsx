import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import AvatarViewer from "@/components/Avatar/AvatarViewer";
import { useNavigate } from "react-router-dom";
import useAvatarStore from "@/store/useAvatarStore";
import { serverURL } from "@/api/config";

const AvatarsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { avatars, fetchAvatars: fetchAvatarsStore } = useAvatarStore();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchAvatars = async () => {
            setLoading(true);
            await fetchAvatarsStore(user.id.toString());
            setLoading(false);
        };

        fetchAvatars();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full min-h-[40vh]">
                <LoadingSpinner size={125} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-y-4">
            <div className="mb-8 text-center">
                <h1 className="mb-2 font-bold text-white text-5xl">Your Avatars</h1>
                <p className="text-gray-300 text-lg">Here are the avatars you have created.</p>
            </div>

            {/* Create Your Avatar Button */}
            <div className="mb-6">
                <button
                    onClick={() => navigate("/avatar/create")}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-md text-white transition"
                >
                    Create your Avatar
                </button>
            </div>

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
                        onDelete={() => console.log("Delete character")}
                    />
                ))}
            </div>

            {avatars.length === 0 && (
                <div className="bg-black/50 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md text-white">
                    <h2 className="font-bold text-xl">No Avatars found</h2>
                </div>
            )}
        </div>
    );
};

export default AvatarsPage;

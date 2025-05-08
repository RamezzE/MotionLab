import { useEffect, useState } from "react";

import useUserStore from "@/store/useUserStore";
// import useProjectStore from "@/store/useProjectStore";

import LoadingSpinner from "@/components/UI/LoadingSpinner";
import AvatarViewer from "@/components/Avatar/AvatarViewer";

import { useNavigate } from "react-router-dom";

const CharactersPage: React.FC = () => {

    const navigate = useNavigate();
    const { user } = useUserStore();
    // const { projects, fetchProjects: fetchProjectsStoreFunc } = useProjectStore();
    const characters = [
        {
            id: 1,
            name: "Character 1",
            is_processing: false,
            creation_date: "2023-10-01",
        },
        {
            id: 2,
            name: "Character 2",
            is_processing: true,
            creation_date: "2023-10-02",
        },
        {
            id: 3,
            name: "Character 3",
            is_processing: false,
            creation_date: "2023-10-03",
        },
        {
            id: 4,
            name: "Character 4",
            is_processing: false,
            creation_date: "2023-10-03",
        },
        {
            id: "681d1b48eb427a0b72c4b2ce",
            name: "Character 5",
            is_processing: false,
            creation_date: "2023-10-03",
        }
    ];
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchCharacters = async () => {
            setLoading(true);
            // await fetchProjectsStoreFunc(user.id.toString());
            setLoading(false);
        };

        fetchCharacters();
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
                <h1 className="mb-2 font-bold text-white text-5xl">Your Characters</h1>
                <p className="text-gray-300 text-lg">
                    Here are the characters you have created.
                </p>
            </div>

            <div className="flex flex-row flex-wrap justify-center items-center gap-4 w-full">
                {characters.map((character) => (
                    <AvatarViewer
                        key={character.id}
                        characterName={character.name}
                        // is_processing={character.is_processing}
                        createdDate={character.creation_date}
                        modelSrc={"https://models.readyplayer.me/681d1b48eb427a0b72c4b2ce.glb"}
                        // modelSrc={"https://models.readyplayer.me/681d1320eb427a0b72c3d0bd.glb"}
                        displayMode="list"
                        onEdit={() => {
                            // console.log("Edit character");
                            navigate(`/avatar/edit/${character.id}`);
                        }}
                        onDelete={() => console.log("Delete character")}
                    />
                ))}
            </div>

            {characters.length === 0 && (
                <div className="bg-black/50 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md text-white">
                    <h2 className="font-bold text-xl">No Characters found</h2>
                </div>
            )}
        </div>
    );
};

export default CharactersPage;

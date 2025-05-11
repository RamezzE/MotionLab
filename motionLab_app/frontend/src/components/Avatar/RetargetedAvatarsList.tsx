import React, { useEffect, useState } from 'react';
import { serverURL } from '@/api/config';
import { getRetargetedAvatars, deleteRetargetedAvatar } from '@/api/projectAPIs';
import AvatarViewer from './AvatarViewer';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

interface RetargetedAvatar {
    id: number;
    filename: string;
    project_id: number;
    creation_date: string;
}

const RetargetedAvatarsList: React.FC = () => {
    const [retargetedAvatars, setRetargetedAvatars] = useState<RetargetedAvatar[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { projectId } = useParams();

    const fetchRetargetedAvatars = async () => {
        try {
            if (!projectId) return;
            const response = await getRetargetedAvatars(projectId);
            console.log("Retargeted avatars:", response);
            if (response) {
                // @ts-expect-error
                setRetargetedAvatars(response);
            }
        } catch (error) {
            console.error('Error fetching retargeted avatars:', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setRefreshing(false);
            }, 1000);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchRetargetedAvatars();
        }
    }, [projectId]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchRetargetedAvatars();
    };

    const handleDownload = (filename: string) => {
        const downloadUrl = `${serverURL}/retargeted_avatars/${filename}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (avatarId: number) => {
        try {
            const response = await deleteRetargetedAvatar(avatarId);
            if (response.success) {
                // Remove the deleted avatar from the state
                setRetargetedAvatars(prev => prev.filter(avatar => avatar.id !== avatarId));
            } else {
                console.error('Failed to delete avatar:', response.data);
            }
        } catch (error) {
            console.error('Error deleting avatar:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full min-h-[40vh]">
                <LoadingSpinner size={125} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-y-8 w-full max-w-[90vw]">
            <div className="relative text-center">
                <h2 className="mb-2 font-bold text-white text-2xl sm:text-3xl">Recently Retargeted Avatars</h2>
                <p className="text-gray-300 text-base sm:text-lg">Your recently retargeted avatars will appear here.</p>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="top-1/2 -right-12 absolute disabled:opacity-50 p-2 text-gray-400 hover:text-white transition-colors -translate-y-1/2"
                    aria-label="Refresh list"
                >
                    <RefreshCw size={24} className={refreshing ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="flex flex-row flex-wrap justify-center items-center gap-4 w-full max-h-[600px] overflow-y-auto">
                {retargetedAvatars.map((avatar) => (
                    <AvatarViewer
                        key={avatar.id}
                        characterName={``}
                        createdDate={avatar.creation_date}
                        modelSrc={`${serverURL}/retargeted_avatars/${avatar.filename}`}
                        displayMode="list"
                        onPress={() => handleDownload(avatar.filename)}
                        onDelete={() => handleDelete(avatar.id)}
                    />
                ))}
            </div>

            {retargetedAvatars.length === 0 && (
                <div className="bg-black/50 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md text-white">
                    <h2 className="font-bold text-xl">No Avatars found for this project</h2>
                    <p className="mt-2 text-gray-400">Retargeted avatars will appear here after you create them.</p>
                </div>
            )}
        </div>
    );
};

export default RetargetedAvatarsList; 
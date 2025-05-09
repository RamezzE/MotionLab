import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, RefreshCcw } from "lucide-react";

import useUserStore from "@/store/useUserStore";
import useProjectStore from "@/store/useProjectStore";

import LoadingSpinner from "@components/UI/LoadingSpinner";

interface ProjectProps {
    id: string;
    name: string;
    is_processing: boolean;
    creationDate: string;
}

const ProjectCard: React.FC<ProjectProps> = ({
    id,
    name,
    is_processing,
    creationDate,
}) => {

    const { user } = useUserStore();
    const { fetchProjectById, deleteProject } = useProjectStore();

    const [loading, setLoading] = useState(false);

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete this project?");
        if (confirmed) {
            if (!user?.id) {
                console.error("User is not available or user ID is missing.");
                return;
            }
            setLoading(true);
            await deleteProject(id, user.id.toString());
            setLoading(false);
        }
    };

    const handleRefresh = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        await fetchProjectById(id, user?.id.toString() || "");
        setLoading(false);
    };

    return (
        <div className="relative bg-gray-800 shadow-lg p-6 border border-purple-600 rounded-lg w-md max-w-[80vw] text-white">
            {/* Refresh Status Button */}
            {is_processing && !loading && (
                <button
                    onClick={handleRefresh}
                    className="top-4 right-12 absolute flex items-center gap-x-1 bg-red-5600 text-gray-400 hover:text-white transition duration-300 cursor-pointer"
                    title="Refresh current status"
                >
                    <RefreshCcw size={20} />
                    <span className="text-sm">Refresh Status</span>
                </button>
            )}

            {/* Trash Icon Button */}
            {
                loading ? (
                    <div className="top-4 right-4 absolute cursor-pointer">
                        <LoadingSpinner size={20} />
                    </div>
                ) : (
                    <button
                        onClick={handleDelete}
                        className="top-4 right-4 absolute text-gray-400 hover:text-red-500 transition duration-300"
                        title="Delete project"
                    >
                        <Trash2 size={20} />
                    </button>
                )
            }

            {/* Project Content */}
            {is_processing ? (
                <div
                    className="opacity-70"
                    title="Project is still processing"
                >
                    <h2 className="font-bold text-xl">{name}</h2>
                    <p className="mt-2 text-gray-400 text-sm">Created on: {creationDate}</p>
                    <span className="flex items-center space-x-2 mt-2">
                        <p className="text-yellow-300 text-xs">Status: Processing.. </p>
                        <LoadingSpinner size={16} extraStyles="text-yellow-300"/>
                    </span>
                </div>
            ) : (
                <Link to={`/project/${id}`} className="block">
                    <h2 className="font-bold text-xl">{name}</h2>
                    <p className="mt-2 text-gray-400 text-sm">Created on: {creationDate}</p>
                </Link>
            )}
        </div>
    );
};

export default ProjectCard;

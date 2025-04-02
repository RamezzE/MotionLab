import React from "react";
import { Link } from "react-router-dom";
import { Trash2, RefreshCcw } from "lucide-react";

import { deleteProjectById } from "@/api/projectAPIs";
import useUserStore from "@/store/useUserStore";

interface ProjectProps {
    id: string;
    name: string;
    is_processing: boolean;
    creationDate: string;
    removeProjectFromList: (id: string) => void;
}

const ProjectCard: React.FC<ProjectProps> = ({
    id,
    name,
    is_processing,
    creationDate,
    removeProjectFromList,
}) => {
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete this project?");
        if (confirmed) {
            const user = useUserStore.getState().user;
            if (!user?.id) {
                console.error("User is not available or user ID is missing.");
                return;
            }
            const response = await deleteProjectById(id, user.id);
            if (response.success) {
                removeProjectFromList(id);
            } else {
                console.error("Error deleting project:", response);
            }
        }
    };

    const handleRefresh = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Fetching current status for project:", id);
        // TODO: Add logic to fetch and update the current project status.
    };

    return (
        <div className="relative bg-gray-800 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md text-white">
            {/* Refresh Status Button */}
            {is_processing && (
                <button
                    onClick={handleRefresh}
                    className="top-4 right-12 absolute flex items-center space-x-1 text-gray-400 hover:text-white transition duration-300 cursor-pointer"
                    title="Refresh current status"
                >
                    <RefreshCcw size={20} />
                    <span className="text-sm">Refresh Status</span>
                </button>
            )}

            {/* Trash Icon Button */}
            <button
                onClick={handleDelete}
                className="top-4 right-4 absolute text-gray-400 hover:text-red-500 transition duration-300"
            >
                <Trash2 size={20} />
            </button>

            {/* Project Content */}
            {is_processing ? (
                <div
                    className="block opacity-70 cursor-not-allowed"
                    title="Project is still processing"
                >
                    <h2 className="font-bold text-xl">{name}</h2>
                    <p className="mt-2 text-gray-400 text-sm">Created on: {creationDate}</p>
                    <p className="mt-1 text-yellow-300 text-xs">Status: Processing..</p>
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

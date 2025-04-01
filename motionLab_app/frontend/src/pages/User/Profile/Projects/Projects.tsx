import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react"; // Import trash icon

import { getProjectsByUser, deleteProjectById } from "@/api/projectAPIs";
import useUserStore from "@/store/useUserStore";

// Define the shape of a project item as returned from the backend
export interface ProjectItem {
    id: string;
    name: string;
    creation_date: string;
}

interface ProjectProps {
    id: string;
    name: string;
    creationDate: string;
    removeProjectFromList: (id: string) => void;
}

const Project: React.FC<ProjectProps> = ({ id, name, creationDate, removeProjectFromList }) => {
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent navigation when clicking delete
        const confirmed: boolean = window.confirm("Are you sure you want to delete this project?");
        if (confirmed) {
            const user = useUserStore.getState().user;
            if (!user || !user.id) {
                console.error("User is not available or user ID is missing.");
                return;
            }
            const response: { success: boolean } = await deleteProjectById(id, user.id);
            if (response.success) {
                removeProjectFromList(id);
            } else {
                console.error("Error deleting project:", response);
            }
        }
    };

    return (
        <div className="relative bg-gray-800 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md text-white">
            {/* Trash Icon Button */}
            <button
                onClick={handleDelete}
                className="top-4 right-4 absolute text-gray-400 hover:text-red-500 transition duration-300"
            >
                <Trash2 size={20} />
            </button>

            {/* Project Content */}
            <Link to={`/project/${id}`} className="block">
                <h2 className="font-bold text-xl">{name}</h2>
                <p className="mt-2 text-gray-400 text-sm">Created on: {creationDate}</p>
            </Link>
        </div>
    );
};

const Projects: React.FC = () => {
    const [projectList, setProjectList] = useState<ProjectItem[]>([]);
    const { user } = useUserStore();

    const removeProjectFromList = (projectId: string) => {
        setProjectList((prevProjects) =>
            prevProjects.filter((project) => project.id !== projectId)
        );
    };

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchProjects = async () => {
            const response = await getProjectsByUser(user.id);
            if (response.success) {
                setProjectList(response.data);
            } else {
                console.error("Error fetching projects:", response.message);
            }
        };

        fetchProjects();
    }, [user]);

    return (
        <div className="flex flex-col items-center space-y-4">
            {projectList.map((project) => (
                <Project
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    creationDate={project.creation_date}
                    removeProjectFromList={removeProjectFromList}
                />
            ))}

            {projectList.length === 0 && (
                <div className="bg-gray-800 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md text-white">
                    <h2 className="font-bold text-xl">No projects found</h2>
                </div>
            )}
        </div>
    );
};

export default Projects;

import { useState, useEffect } from "react";

import ProjectCard from "@components/cards/ProjectCard";
import { getProjectsByUser } from "@/api/projectAPIs";
import useUserStore from "@/store/useUserStore";

import { Project as ProjectType } from "@/types/types";

const Projects: React.FC = () => {
    const [projectList, setProjectList] = useState<ProjectType[]>([]);
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
            console.log("Response from getProjectsByUser:", response.data);
            if (response.success) {
                setProjectList(response.data);
            } else {
                console.log("response", response);
                console.error("Error fetching projects:", response.message);
            }
        };

        fetchProjects();
    }, [user]);

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="mb-8 text-center">
                <h1 className="mb-2 font-bold text-white text-5xl">Your Projects</h1>
                <p className="text-gray-300 text-lg">
                    Here are the projects you have created.
                </p>
            </div>
            {projectList.map((project) => (
                <ProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    is_processing={project.is_processing}
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

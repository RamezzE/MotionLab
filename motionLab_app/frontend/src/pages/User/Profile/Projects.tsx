import { useEffect, useState } from "react";

import ProjectCard from "@components/cards/ProjectCard";

import useUserStore from "@/store/useUserStore";
import useProjectStore from "@/store/useProjectStore";

import LoadingSpinner from "@/components/UI/LoadingSpinner";

const Projects: React.FC = () => {
    const { user } = useUserStore();
    const { projects, fetchProjects: fetchProjectsStoreFunc } = useProjectStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchProjects = async () => {
            setLoading(true);
            await fetchProjectsStoreFunc(user.id.toString());
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        };

        fetchProjects();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full min-h-[40vh]">
                <LoadingSpinner size={125} />
            </div>
        );

    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="mb-8 text-center">
                <h1 className="mb-2 font-bold text-white text-5xl">Your Projects</h1>
                <p className="text-gray-300 text-lg">
                    Here are the projects you have created.
                </p>
            </div>

            <div className="flex flex-row flex-wrap justify-center items-center gap-4 w-full">

                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        is_processing={project.is_processing}
                        creationDate={project.creation_date}
                    />
                ))}
            </div>

            {projects.length === 0 && (
                <div className="bg-gray-800 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md text-white">
                    <h2 className="font-bold text-xl">No projects found</h2>
                </div>
            )}
        </div>
    );
};

export default Projects;

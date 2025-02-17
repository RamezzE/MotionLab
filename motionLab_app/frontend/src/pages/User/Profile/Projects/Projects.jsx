import { useState, useEffect } from "react";
import { getProjectsByUser } from "../../../../api/projectAPIs";
import useUserStore from "../../../../store/useUserStore";
import { Link } from "react-router-dom";
const Project = ({ id, name, creationDate }) => {
    return (
        <Link to={`/project/${id}`} className="bg-gray-800 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md text-white">
            <div className="bg-gray-800 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md text-white">
                <h2 className="font-bold text-xl">{name}</h2>
                <p className="mt-2 text-gray-400 text-sm">Created on: {creationDate}</p>
            </div>
        </Link>
    );
};

const Projects = () => {

    const [projectList, setProjectList] = useState([]);
    const { user } = useUserStore();

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchProjects = async () => {
            const response = await getProjectsByUser(user.id);
            if (response.success) {
                setProjectList(response.projects);
            } else {
                console.error("Error fetching projects:", response.projects);
            }
        };
        fetchProjects();
    }, [user]);

    return (
        <div className="flex flex-col items-center space-y-4">
            {projectList.map((project) => (
                <Project key={project.id} id={project.id} name={project.name} creationDate={project.creation_date} />
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

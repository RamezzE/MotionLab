import React, { useState, useEffect } from "react";
import { getAllProjects, deleteProject } from "@/api/adminAPIs";
import { Project } from "@/api/adminAPIs";

const ProjectsOverview = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [statsData, setStatsData] = useState({
        total: 0,
        processing: 0,
        completed: 0,
        failed: 0
    });

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllProjects();
            if (response.success && response.data) {
                setProjects(response.data);
                
                // Update stats
                const stats = {
                    total: response.data.length,
                    processing: response.data.filter(p => p.status === "processing").length,
                    completed: response.data.filter(p => p.status === "completed").length,
                    failed: response.data.filter(p => p.status === "failed").length
                };
                
                setStatsData(stats);
                
                // Check if the response message indicates mock data
                if (response.message && (response.message.includes("mock") || response.message.includes("development"))) {
                    setUsingMockData(true);
                } else {
                    setUsingMockData(false);
                }
            } else {
                setError(response.message || "Failed to fetch projects");
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            setError("An unexpected error occurred while fetching projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const handleDeleteProject = async (projectId: number) => {
        try {
            const response = await deleteProject(projectId);
            if (response.success) {
                setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
                setStatsData(prev => {
                    // Find the project to get its status
                    const project = projects.find(p => p.id === projectId);
                    return {
                        total: prev.total - 1,
                        processing: project?.status === "processing" ? prev.processing - 1 : prev.processing,
                        completed: project?.status === "completed" ? prev.completed - 1 : prev.completed,
                        failed: project?.status === "failed" ? prev.failed - 1 : prev.failed
                    };
                });
            } else {
                setError(response.message || "Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            setError("An unexpected error occurred while deleting project");
        }
    };

    // Filter projects based on search term and status filter
    const filteredProjects = projects.filter(project => {
        const matchesSearch = 
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            project.owner.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || project.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">Projects Overview</h1>
            
            {usingMockData && (
                <div className="bg-amber-600 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using mock data. Backend API not available.
                    </div>
                    <button 
                        onClick={fetchProjects}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100"
                    >
                        Retry API
                    </button>
                </div>
            )}
            
            {error && (
                <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchProjects} 
                        className="mt-2 px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 transition"
                    >
                        Retry
                    </button>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                    <h3 className="text-gray-400 mb-2 text-sm font-medium">Total Projects</h3>
                    <p className="text-white text-2xl font-bold">{statsData.total}</p>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                    <h3 className="text-gray-400 mb-2 text-sm font-medium">Processing</h3>
                    <p className="text-yellow-400 text-2xl font-bold">{statsData.processing}</p>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                    <h3 className="text-gray-400 mb-2 text-sm font-medium">Completed</h3>
                    <p className="text-green-500 text-2xl font-bold">{statsData.completed}</p>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                    <h3 className="text-gray-400 mb-2 text-sm font-medium">Failed</h3>
                    <p className="text-red-500 text-2xl font-bold">{statsData.failed}</p>
                </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="Search projects..." 
                            className="px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <select 
                            className="px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={statusFilter}
                            onChange={handleStatusFilter}
                        >
                            <option value="all">All Status</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-600">
                            <tr>
                                <th className="py-3 px-4 text-left text-white">ID</th>
                                <th className="py-3 px-4 text-left text-white">Project Name</th>
                                <th className="py-3 px-4 text-left text-white">Owner</th>
                                <th className="py-3 px-4 text-left text-white">Status</th>
                                <th className="py-3 px-4 text-left text-white">Created</th>
                                <th className="py-3 px-4 text-left text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-4 px-4 text-center text-white">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-4 px-4 text-center text-white">No projects found</td>
                                </tr>
                            ) : (
                                filteredProjects.map(project => (
                                    <tr key={project.id}>
                                        <td className="py-3 px-4 text-white">{project.id}</td>
                                        <td className="py-3 px-4 text-white">{project.name}</td>
                                        <td className="py-3 px-4 text-white">{project.owner}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-white text-xs rounded-full ${
                                                project.status === "completed" ? "bg-green-500" : 
                                                project.status === "processing" ? "bg-yellow-500" : "bg-red-500"
                                            }`}>
                                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-white">{formatDate(project.creation_date)}</td>
                                        <td className="py-3 px-4 flex gap-2">
                                            <button className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">View</button>
                                            <button 
                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                                onClick={() => handleDeleteProject(project.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-300">Showing {filteredProjects.length} of {projects.length} projects</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-gray-600 text-white rounded">Previous</button>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsOverview; 
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

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

    const openDeleteModal = (project: Project) => {
        setProjectToDelete(project);
        setShowDeleteModal(true);
        setDeleteError(null);
    };

    const closeDeleteModal = () => {
        if (deleteInProgress) return; // Don't close if deletion is in progress
        
        setShowDeleteModal(false);
        setProjectToDelete(null);
        setDeleteInProgress(false);
        setDeleteError(null);
    };

    const handleDeleteProject = async (projectId: number) => {
        if (deleteInProgress) return;
        
        setDeleteInProgress(true);
        setDeleteError(null);
        
        try {
            const response = await deleteProject(projectId);
            if (response.success) {
                // Update projects list
                setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
                
                // Update stats
                const projectToRemove = projects.find(p => p.id === projectId);
                if (projectToRemove) {
                    setStatsData(prev => ({
                        total: prev.total - 1,
                        processing: projectToRemove.status === "processing" ? prev.processing - 1 : prev.processing,
                        completed: projectToRemove.status === "completed" ? prev.completed - 1 : prev.completed,
                        failed: projectToRemove.status === "failed" ? prev.failed - 1 : prev.failed
                    }));
                }
                
                setTimeout(() => {
                    closeDeleteModal();
                }, 500); // Short delay to show success state
            } else {
                setDeleteError(response.message || "Failed to delete project");
            }
        } catch (error: unknown) {
            console.error("Error deleting project:", error);
            // Type check error before accessing message property
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while deleting project";
            setDeleteError(errorMessage);
        } finally {
            // Always reset the loading state after a short delay, regardless of success or error
            setTimeout(() => {
                setDeleteInProgress(false);
            }, 300);
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
        <div className="p-6 bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-white bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Projects Overview</h1>
            
            {usingMockData && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg mb-6 shadow-lg flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using mock data. Backend API not available.
                    </div>
                    <button 
                        onClick={fetchProjects}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100 transition shadow-md"
                    >
                        Retry API
                    </button>
                </div>
            )}
            
            {error && (
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg mb-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchProjects} 
                        className="mt-2 px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 transition shadow-md"
                    >
                        Retry
                    </button>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.02] hover:shadow-indigo-900/10 border border-gray-700">
                    <h3 className="text-gray-400 mb-2 text-sm font-medium">Total Projects</h3>
                    <p className="text-white text-3xl font-bold">{statsData.total}</p>
                    <div className="h-1 w-16 bg-white/20 rounded-full mt-3"></div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.02] hover:shadow-yellow-900/10 border border-gray-700">
                    <h3 className="text-gray-400 mb-2 text-sm font-medium">Processing</h3>
                    <p className="text-yellow-400 text-3xl font-bold">{statsData.processing}</p>
                    <div className="h-1 w-16 bg-yellow-400/20 rounded-full mt-3"></div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.02] hover:shadow-green-900/10 border border-gray-700">
                    <h3 className="text-gray-400 mb-2 text-sm font-medium">Completed</h3>
                    <p className="text-green-500 text-3xl font-bold">{statsData.completed}</p>
                    <div className="h-1 w-16 bg-green-500/20 rounded-full mt-3"></div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.02] hover:shadow-red-900/10 border border-gray-700">
                    <h3 className="text-gray-400 mb-2 text-sm font-medium">Failed</h3>
                    <p className="text-red-500 text-3xl font-bold">{statsData.failed}</p>
                    <div className="h-1 w-16 bg-red-500/20 rounded-full mt-3"></div>
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search projects..." 
                                className="pl-10 pr-4 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent shadow-md w-full"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <select 
                            className="px-4 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent shadow-md"
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
                
                <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                    <table className="min-w-full bg-gray-800/80 rounded-lg overflow-hidden">
                        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                            <tr>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">ID</th>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">Project Name</th>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">Owner</th>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">Status</th>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">Created</th>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 px-4 text-center text-white">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 px-4 text-center text-gray-400">No projects found</td>
                                </tr>
                            ) : (
                                filteredProjects.map((project, index) => (
                                    <tr key={project.id} className={`${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'} hover:bg-gray-700/50 transition-colors duration-150`}>
                                        <td className="py-3 px-4 text-gray-300">{project.id}</td>
                                        <td className="py-3 px-4 text-white font-medium">{project.name}</td>
                                        <td className="py-3 px-4 text-gray-300">{project.owner}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 text-white text-xs rounded-full ${
                                                project.status === "completed" ? "bg-gradient-to-r from-green-500 to-emerald-600" : 
                                                project.status === "processing" ? "bg-gradient-to-r from-yellow-500 to-amber-600" : 
                                                "bg-gradient-to-r from-red-500 to-red-600"
                                            }`}>
                                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">{formatDate(project.creation_date)}</td>
                                        <td className="py-3 px-4 flex gap-2">
                                            <button className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-md hover:from-blue-600 hover:to-blue-700 shadow-sm">View</button>
                                            <button 
                                                className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-md hover:from-red-600 hover:to-red-700 shadow-sm"
                                                onClick={() => openDeleteModal(project)}
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
                
                <div className="mt-5 flex flex-col md:flex-row md:justify-between md:items-center text-sm gap-3">
                    <span className="text-gray-400">Showing <span className="text-purple-400 font-medium">{filteredProjects.length}</span> of <span className="text-white">{projects.length}</span> projects</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-700/70 text-white rounded-lg hover:bg-gray-600/70 transition border border-gray-600/30 shadow-sm">Previous</button>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition shadow-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && projectToDelete && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-700 animate-fadeIn">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-2xl font-bold text-white">
                                Delete Project
                            </h2>
                            <button 
                                onClick={closeDeleteModal}
                                className="text-gray-400 hover:text-white transition-colors"
                                disabled={deleteInProgress}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <div className="bg-red-900/30 border border-red-700/30 rounded-lg p-4 mb-5">
                                <p className="text-white mb-2">Are you sure you want to delete <span className="font-semibold">{projectToDelete.name}</span>?</p>
                                <p className="text-gray-300 text-sm">This action cannot be undone.</p>
                            </div>

                            {deleteError && (
                                <div className="bg-red-900/40 border border-red-700/40 rounded-lg p-3 mb-4 text-red-200 text-sm">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{deleteError}</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-gray-300 mb-2 text-sm">Project details:</p>
                                <ul className="text-sm space-y-1 bg-gray-700/50 p-3 rounded-lg">
                                    <li className="text-gray-300">Owner: <span className="text-white">{projectToDelete.owner}</span></li>
                                    <li className="text-gray-300">Status: <span className={
                                        projectToDelete.status === "completed" ? "text-green-400" : 
                                        projectToDelete.status === "processing" ? "text-yellow-400" : "text-red-400"
                                    }>{projectToDelete.status}</span></li>
                                    <li className="text-gray-300">Created: <span className="text-white">{formatDate(projectToDelete.creation_date)}</span></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition shadow-sm"
                                disabled={deleteInProgress}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteProject(projectToDelete.id)}
                                className={`px-4 py-2 text-white rounded-lg shadow-sm flex items-center justify-center gap-2 ${
                                    deleteInProgress 
                                        ? "bg-red-700 cursor-not-allowed" 
                                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition"
                                }`}
                                disabled={deleteInProgress}
                            >
                                {deleteInProgress ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Delete Project</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsOverview; 
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "@/api/adminAPIs";
import { DashboardStats } from "@/api/adminAPIs";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeUsers: 0,
        totalProjects: 0,
        processingProjects: 0,
        completedProjects: 0,
        failedProjects: 0,
        serverLoad: 0,
        memoryUsage: 0,
        diskUsage: 0,
        uptime: "",
        avgProcessingTime: "",
        dailyUploads: 0,
        storageUsed: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const [recentActivity] = useState([
        { type: "New Project", content: "Walking Analysis", time: "just now" },
        { type: "User Login", content: "sarah@example.com", time: "5 minutes ago" },
        { type: "Processing", content: "Running Motion", time: "10 minutes ago" },
        { type: "Error", content: "Processing failed: Invalid format", time: "25 minutes ago" },
        { type: "New User", content: "alex@example.com", time: "1 hour ago" },
    ]);
    
    const [queuedProjects] = useState([
        { name: "Running Motion", progress: 30 },
        { name: "Dance Sequence", progress: 12 },
        { name: "Walking Analysis", progress: 75 },
    ]);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const response = await getDashboardStats();
            if (response.success && response.data) {
                setStats(response.data);
                // Check if the response message indicates mock data
                if (response.message && (response.message.includes("mock") || response.message.includes("development"))) {
                    setUsingMockData(true);
                } else {
                    setUsingMockData(false);
                }
            } else {
                setError(response.message || "Failed to fetch dashboard statistics");
            }
        } catch (error) {
            setError("An unexpected error occurred");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-600 text-white p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchDashboardStats} 
                        className="mt-4 px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {usingMockData && (
                <div className="bg-amber-600 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using mock data. Backend API not available.
                    </div>
                    <button 
                        onClick={fetchDashboardStats}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100"
                    >
                        Retry API
                    </button>
                </div>
            )}
            
            <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                    <p className="text-white text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-gray-400 text-sm">{stats.activeUsers} active</p>
                    <Link to="/admin/userManage" className="text-purple-400 text-sm hover:text-purple-300 mt-2 block">
                        View all users →
                    </Link>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-gray-400 text-sm font-medium">Projects</h3>
                    <p className="text-white text-2xl font-bold">{stats.totalProjects}</p>
                    <p className="text-gray-400 text-sm">
                        <span className="text-yellow-400">{stats.processingProjects} processing</span> • 
                        <span className="text-green-400 ml-1">{stats.completedProjects} completed</span> • 
                        <span className="text-red-400 ml-1">{stats.failedProjects} failed</span>
                    </p>
                    <Link to="/admin/projects" className="text-purple-400 text-sm hover:text-purple-300 mt-2 block">
                        View all projects →
                    </Link>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-gray-400 text-sm font-medium">System Load</h3>
                    <p className="text-white text-2xl font-bold">{stats.serverLoad}%</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${stats.serverLoad}%`}}></div>
                    </div>
                    <Link to="/admin/metrics" className="text-purple-400 text-sm hover:text-purple-300 mt-2 block">
                        View metrics →
                    </Link>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-gray-400 text-sm font-medium">Storage Used</h3>
                    <p className="text-white text-2xl font-bold">{stats.storageUsed}</p>
                    <p className="text-gray-400 text-sm">
                        Daily uploads: {stats.dailyUploads}
                    </p>
                    <Link to="/admin/metrics" className="text-purple-400 text-sm hover:text-purple-300 mt-2 block">
                        View storage →
                    </Link>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white text-lg font-semibold">Recent Activity</h3>
                        <Link to="/admin/logs" className="text-purple-400 text-sm hover:text-purple-300">
                            View logs →
                        </Link>
                    </div>
                    
                    <div className="space-y-2">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="p-3 bg-gray-700 rounded">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 text-white rounded ${
                                        activity.type === "New Project" ? "bg-green-500" :
                                        activity.type === "User Login" ? "bg-blue-500" :
                                        activity.type === "Processing" ? "bg-yellow-500" :
                                        activity.type === "Error" ? "bg-red-500" :
                                        "bg-purple-500"
                                    }`}>
                                        {activity.type}
                                    </span>
                                    <span className="text-white">{activity.content}</span>
                                    <span className="text-gray-400 text-sm ml-auto">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Quick Actions</h3>
                    
                    <div className="space-y-3">
                        <Link to="/admin/userManage" className="block p-3 bg-gray-700 hover:bg-gray-600 rounded text-white">
                            <i className="fas fa-users mr-2"></i> Manage Users
                        </Link>
                        <Link to="/admin/projects" className="block p-3 bg-gray-700 hover:bg-gray-600 rounded text-white">
                            <i className="fas fa-project-diagram mr-2"></i> View Projects
                        </Link>
                        <Link to="/admin/metrics" className="block p-3 bg-gray-700 hover:bg-gray-600 rounded text-white">
                            <i className="fas fa-chart-line mr-2"></i> System Performance
                        </Link>
                        <Link to="/admin/logs" className="block p-3 bg-gray-700 hover:bg-gray-600 rounded text-white">
                            <i className="fas fa-list mr-2"></i> View Logs
                        </Link>
                        <button className="block w-full p-3 bg-red-600 hover:bg-red-700 rounded text-white">
                            <i className="fas fa-times-circle mr-2"></i> Maintenance Mode
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">System Health</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-300">CPU Usage</span>
                                <span className="text-blue-400">{stats.serverLoad}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${stats.serverLoad}%`}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-300">Memory Usage</span>
                                <span className="text-green-400">{stats.memoryUsage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${stats.memoryUsage}%`}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-300">Disk Usage</span>
                                <span className="text-purple-400">{stats.diskUsage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-purple-500 h-2.5 rounded-full" style={{width: `${stats.diskUsage}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Processing Queue</h3>
                    
                    <div className="space-y-2">
                        {queuedProjects.map((project, index) => (
                            <div key={index} className="p-3 bg-gray-700 rounded flex justify-between items-center">
                                <div>
                                    <span className="text-white font-medium">{project.name}</span>
                                    <p className="text-sm text-gray-400">{project.progress}% complete</p>
                                </div>
                                <div className="w-24 bg-gray-600 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${project.progress}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                        <Link to="/admin/projects" className="text-purple-400 text-sm hover:text-purple-300">
                            View all processing tasks →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
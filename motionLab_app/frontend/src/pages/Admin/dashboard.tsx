import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getDashboardData,
    DashboardStats,
    getRecentActivity,
    getProcessingQueue,
    ActivityItem,
    QueuedProject
} from "@/utils/apiUtils";

// Mock data to use as fallback when API calls fail
const MOCK_DATA = {
    recentActivity: [
        { id: 1, user: "user1@example.com", action: "Created new project", timestamp: "2023-09-10T10:30:00Z" },
        { id: 2, user: "user2@example.com", action: "Uploaded files", timestamp: "2023-09-10T09:15:00Z" },
        { id: 3, user: "user3@example.com", action: "Processed data", timestamp: "2023-09-09T16:45:00Z" },
    ],
    queuedProjects: [
        { id: 101, name: "Project Alpha", status: "Processing", progress: 45, eta: "10 min" },
        { id: 102, name: "Project Beta", status: "Queued", progress: 0, eta: "25 min" },
        { id: 103, name: "Project Gamma", status: "Processing", progress: 75, eta: "3 min" },
    ]
};

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
    const [usingRealTimeMetrics, setUsingRealTimeMetrics] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(true); // Default to auto-refresh enabled
    
    // State for real API data
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(MOCK_DATA.recentActivity);
    const [queuedProjects, setQueuedProjects] = useState<QueuedProject[]>(MOCK_DATA.queuedProjects);
    const [usingRealUserData, setUsingRealUserData] = useState(false);
    const [usingRealProjectData, setUsingRealProjectData] = useState(false);
    const [usingRealActivityData, setUsingRealActivityData] = useState(false);
    const [usingRealQueueData, setUsingRealQueueData] = useState(false);

    useEffect(() => {
        fetchAllData();

        // Set up auto-refresh if enabled
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchAllData(false); // Don't show loading indicator for auto-refresh
            }, 3000); // Refresh every 3 seconds for a visibly dynamic display
            setRefreshInterval(interval);
        } else if (refreshInterval) {
            // Clear interval if auto-refresh is disabled
            clearInterval(refreshInterval);
            setRefreshInterval(null);
        }

        // Cleanup function
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, [autoRefresh]);

    const fetchAllData = async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        }
        
        // Track if we're using any mock data
        let usingAnyMockData = false;
        
        // Fetch dashboard data - this now includes user and project stats
        const dashboardResponse = await getDashboardData();
        if (dashboardResponse.success && dashboardResponse.data) {
            // Set all the dashboard stats at once
            setStats(dashboardResponse.data);
            
            // Update flags for user and project data
            setUsingRealUserData(true);
            setUsingRealProjectData(true);
            
            // Set real-time metrics flag
            setUsingRealTimeMetrics(true);
        } else {
            // If API call fails, keep the existing data or use mock data
            console.log("Using mock dashboard data:", dashboardResponse.message);
            usingAnyMockData = true;
            setUsingRealUserData(false);
            setUsingRealProjectData(false);
            setUsingRealTimeMetrics(false);
            
            // Set error message if one was returned
            if (dashboardResponse.message) {
                setError(dashboardResponse.message);
            }
        }
        
        // Fetch recent activity
        const activityResponse = await getRecentActivity();
        if (activityResponse.success && activityResponse.data && activityResponse.data.length > 0) {
            setRecentActivity(activityResponse.data);
            setUsingRealActivityData(true);
        } else {
            // If API call fails, use mock data
            console.log("Using mock activity data:", activityResponse.message);
            setRecentActivity(MOCK_DATA.recentActivity);
            usingAnyMockData = true;
            setUsingRealActivityData(false);
        }
        
        // Fetch processing queue
        const queueResponse = await getProcessingQueue();
        if (queueResponse.success && queueResponse.data && queueResponse.data.length > 0) {
            setQueuedProjects(queueResponse.data);
            setUsingRealQueueData(true);
        } else {
            // If API call fails, use mock data
            console.log("Using mock queue data:", queueResponse.message);
            setQueuedProjects(MOCK_DATA.queuedProjects);
            usingAnyMockData = true;
            setUsingRealQueueData(false);
        }
        
        // Update overall mock data state
        setUsingMockData(usingAnyMockData);
        
        if (showLoading) {
            setLoading(false);
        }
    };

    const toggleAutoRefresh = () => {
        setAutoRefresh(!autoRefresh);
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
                        onClick={() => fetchAllData()} 
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => fetchAllData()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                    >
                        Refresh
                    </button>
                    <button 
                        onClick={toggleAutoRefresh}
                        className={`px-4 py-2 rounded-md transition ${
                            autoRefresh 
                                ? "bg-green-600 text-white hover:bg-green-700" 
                                : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                    >
                        {autoRefresh ? "Auto-Refresh: ON" : "Auto-Refresh: OFF"}
                    </button>
                </div>
            </div>
            
            {usingRealTimeMetrics && (
                <div className="bg-green-600 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                        <span className="font-bold">Real-Time Metrics</span> - Using metrics from the local system
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${autoRefresh ? "animate-pulse bg-white" : "bg-gray-300"}`}></span>
                        <span className="text-sm">{autoRefresh ? "Live" : "Static"}</span>
                    </div>
                </div>
            )}
            
            {usingMockData && (
                <div className="bg-amber-600 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using some mock data. Not all API endpoints are available.
                    </div>
                    <button 
                        onClick={() => fetchAllData()}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100"
                    >
                        Try Again
                    </button>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between mb-1">
                        <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                        {usingRealUserData && <span className="text-green-400 text-xs">API</span>}
                    </div>
                    <p className="text-white text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-gray-400 text-sm">{stats.activeUsers} active</p>
                    <Link to="/admin/userManage" className="text-purple-400 text-sm hover:text-purple-300 mt-2 block">
                        View all users →
                    </Link>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between mb-1">
                        <h3 className="text-gray-400 text-sm font-medium">Projects</h3>
                        {usingRealProjectData && <span className="text-green-400 text-xs">API</span>}
                    </div>
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
                
                <div className={`bg-gray-800 rounded-lg shadow-lg p-6 ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`}>
                    <div className="flex justify-between mb-1">
                        <h3 className="text-gray-400 text-sm font-medium">System Load</h3>
                        {usingRealTimeMetrics && <span className="text-green-400 text-xs">Real-Time</span>}
                    </div>
                    <div className="flex items-center">
                        <p className="text-white text-2xl font-bold">{stats.serverLoad}%</p>
                        {autoRefresh && usingRealTimeMetrics && (
                            <span className="ml-2 inline-block w-2 h-2 rounded-full animate-pulse bg-green-500"></span>
                        )}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                        <div 
                            className={`bg-blue-600 h-2.5 rounded-full ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`} 
                            style={{width: `${stats.serverLoad}%`}}
                        ></div>
                    </div>
                    <Link to="/admin/metrics" className="text-purple-400 text-sm hover:text-purple-300 mt-2 block">
                        View metrics →
                    </Link>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between mb-1">
                        <h3 className="text-gray-400 text-sm font-medium">Storage Used</h3>
                        {usingRealTimeMetrics && <span className="text-green-400 text-xs">Real-Time</span>}
                    </div>
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
                        <div className="flex items-center gap-2">
                            <h3 className="text-white text-lg font-semibold">Recent Activity</h3>
                            {usingRealActivityData && <span className="text-green-400 text-xs">API</span>}
                        </div>
                        <Link to="/admin/logs" className="text-purple-400 text-sm hover:text-purple-300">
                            View logs →
                        </Link>
                    </div>
                    
                    <div className="space-y-2">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="p-3 bg-gray-700 rounded">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 text-white rounded ${
                                        activity.action === "Created new project" ? "bg-green-500" :
                                        activity.action === "Uploaded files" ? "bg-blue-500" :
                                        activity.action === "Processed data" ? "bg-yellow-500" :
                                        "bg-purple-500"
                                    }`}>
                                        {activity.action}
                                    </span>
                                    <span className="text-white">{activity.user}</span>
                                    <span className="text-gray-400 text-sm ml-auto">{activity.timestamp}</span>
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
                                <span className="text-blue-400 flex items-center">
                                    {stats.serverLoad}%
                                    {autoRefresh && usingRealTimeMetrics && (
                                        <span className="ml-2 inline-block w-2 h-2 rounded-full animate-pulse bg-blue-400"></span>
                                    )}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div 
                                    className={`bg-blue-600 h-2.5 rounded-full ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`} 
                                    style={{width: `${stats.serverLoad}%`}}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-300">Memory Usage</span>
                                <span className="text-green-400 flex items-center">
                                    {stats.memoryUsage}%
                                    {autoRefresh && usingRealTimeMetrics && (
                                        <span className="ml-2 inline-block w-2 h-2 rounded-full animate-pulse bg-green-400"></span>
                                    )}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div 
                                    className={`bg-green-500 h-2.5 rounded-full ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`} 
                                    style={{width: `${stats.memoryUsage}%`}}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-300">Disk Usage</span>
                                <span className="text-purple-400 flex items-center">
                                    {stats.diskUsage}%
                                    {autoRefresh && usingRealTimeMetrics && (
                                        <span className="ml-2 inline-block w-2 h-2 rounded-full animate-pulse bg-purple-400"></span>
                                    )}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div 
                                    className={`bg-purple-500 h-2.5 rounded-full ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`} 
                                    style={{width: `${stats.diskUsage}%`}}
                                ></div>
                            </div>
                        </div>
                        {usingRealTimeMetrics && (
                            <div className="mt-2 text-xs text-gray-400">
                                <span className="text-green-400">Live metrics</span> - Refreshes every 3 seconds
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white text-lg font-semibold">Processing Queue</h3>
                        <div className="flex items-center">
                            <span className={`text-xs px-2 py-1 rounded ${usingRealQueueData ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                                {usingRealQueueData ? "API Data" : "Mock Data"}
                            </span>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        {queuedProjects.length === 0 ? (
                            <p className="text-gray-400">No projects in queue</p>
                        ) : (
                            queuedProjects.map((project) => (
                                <div key={project.id} className="p-3 bg-gray-700 rounded flex justify-between items-center">
                                    <div>
                                        <span className="text-white font-medium">{project.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                project.status === "Processing" ? "bg-blue-500 text-white" : 
                                                project.status === "Queued" ? "bg-yellow-500 text-white" : 
                                                "bg-red-500 text-white"
                                            }`}>
                                                {project.status}
                                            </span>
                                            <p className="text-sm text-gray-400">ETA: {project.eta}</p>
                                        </div>
                                    </div>
                                    <div className="w-24 bg-gray-600 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${project.progress}%`}}></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                        <Link to="/admin/queue" className="text-purple-400 text-sm hover:text-purple-300">
                            View all processing tasks →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

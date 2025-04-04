import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getDashboardData,
    DashboardStats,
    getRecentActivity,
    ActivityItem
} from "@/utils/apiUtils";

// Mock data to use as fallback when API calls fail
const MOCK_DATA = {
    recentActivity: [
        { id: 1, user: "user1@example.com", action: "Created new project", timestamp: "2023-09-10T10:30:00Z" },
        { id: 2, user: "user2@example.com", action: "Uploaded files", timestamp: "2023-09-10T09:15:00Z" },
        { id: 3, user: "user3@example.com", action: "Processed data", timestamp: "2023-09-09T16:45:00Z" },
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
    const [usingRealUserData, setUsingRealUserData] = useState(false);
    const [usingRealProjectData, setUsingRealProjectData] = useState(false);
    const [usingRealActivityData, setUsingRealActivityData] = useState(false);

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
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Admin Dashboard</h1>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => fetchAllData()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition shadow-lg hover:shadow-purple-700/20"
                    >
                        Refresh
                    </button>
                    <button 
                        onClick={toggleAutoRefresh}
                        className={`px-4 py-2 rounded-md transition shadow-lg ${
                            autoRefresh 
                                ? "bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 hover:shadow-green-700/20" 
                                : "bg-gray-700 text-white hover:bg-gray-600 hover:shadow-gray-600/20"
                        }`}
                    >
                        {autoRefresh ? "Auto-Refresh: ON" : "Auto-Refresh: OFF"}
                    </button>
                </div>
            </div>
            
            {usingRealTimeMetrics && (
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg mb-6 flex justify-between items-center shadow-lg">
                    <div className="flex items-center">
                        <div className="h-4 w-4 bg-white rounded-full mr-3 animate-pulse"></div>
                        <span className="font-bold">Real-Time Metrics</span> - Using metrics from the local system
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${autoRefresh ? "animate-ping bg-white" : "bg-gray-300"}`}></span>
                        <span className="text-sm">{autoRefresh ? "Live" : "Static"}</span>
                    </div>
                </div>
            )}
            
            {usingMockData && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg mb-6 flex justify-between items-center shadow-lg">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using some mock data. Not all API endpoints are available.
                    </div>
                    <button 
                        onClick={() => fetchAllData()}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100 transition shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.02] hover:shadow-indigo-900/10 border border-gray-700">
                    <div className="flex justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                        {usingRealUserData && <span className="text-green-400 text-xs px-2 py-0.5 bg-green-900/30 rounded-full">API</span>}
                    </div>
                    <p className="text-white text-3xl font-bold mb-2">{stats.totalUsers}</p>
                    <p className="text-gray-400 text-sm">{stats.activeUsers} active</p>
                    <Link to="/admin/userManage" className="text-purple-400 text-sm hover:text-purple-300 mt-3 inline-block">
                        View all users →
                    </Link>
                </div>
                
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.02] hover:shadow-indigo-900/10 border border-gray-700">
                    <div className="flex justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Projects</h3>
                        {usingRealProjectData && <span className="text-green-400 text-xs px-2 py-0.5 bg-green-900/30 rounded-full">API</span>}
                    </div>
                    <p className="text-white text-3xl font-bold mb-2">{stats.totalProjects}</p>
                    <div className="flex space-x-2 text-gray-400 text-sm">
                        <span className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span> {stats.processingProjects}</span>
                        <span className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span> {stats.completedProjects}</span>
                        <span className="flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span> {stats.failedProjects}</span>
                    </div>
                    <Link to="/admin/projects" className="text-purple-400 text-sm hover:text-purple-300 mt-3 inline-block">
                        View all projects →
                    </Link>
                </div>
                
                <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.02] hover:shadow-indigo-900/10 border border-gray-700 ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`}>
                    <div className="flex justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">System Load</h3>
                        {usingRealTimeMetrics && <span className="text-green-400 text-xs px-2 py-0.5 bg-green-900/30 rounded-full">Real-Time</span>}
                    </div>
                    <div className="flex items-center mb-2">
                        <p className="text-white text-3xl font-bold">{stats.serverLoad}%</p>
                        {autoRefresh && usingRealTimeMetrics && (
                            <span className="ml-2 inline-block w-2 h-2 rounded-full animate-pulse bg-green-500"></span>
                        )}
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-3">
                        <div 
                            className={`bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`} 
                            style={{width: `${stats.serverLoad}%`}}
                        ></div>
                    </div>
                    <Link to="/admin/metrics" className="text-purple-400 text-sm hover:text-purple-300 inline-block">
                        View metrics →
                    </Link>
                </div>
                
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.02] hover:shadow-indigo-900/10 border border-gray-700">
                    <div className="flex justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Storage Used</h3>
                        {usingRealTimeMetrics && <span className="text-green-400 text-xs px-2 py-0.5 bg-green-900/30 rounded-full">Real-Time</span>}
                    </div>
                    <p className="text-white text-3xl font-bold mb-2">{stats.storageUsed}</p>
                    <p className="text-gray-400 text-sm mb-2">
                        Daily uploads: {stats.dailyUploads}
                    </p>
                    <Link to="/admin/metrics" className="text-purple-400 text-sm hover:text-purple-300 inline-block">
                        View storage →
                    </Link>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 col-span-2 border border-gray-700">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <h3 className="text-white text-lg font-semibold">Recent Activity</h3>
                            {usingRealActivityData && <span className="text-green-400 text-xs px-2 py-0.5 bg-green-900/30 rounded-full">API</span>}
                        </div>
                        <Link to="/admin/logs" className="text-purple-400 text-sm hover:text-purple-300">
                            View logs →
                        </Link>
                    </div>
                    
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 text-white rounded ${
                                        activity.action === "Created new project" ? "bg-gradient-to-r from-green-500 to-emerald-600" :
                                        activity.action === "Uploaded files" ? "bg-gradient-to-r from-blue-500 to-indigo-600" :
                                        activity.action === "Processed data" ? "bg-gradient-to-r from-yellow-500 to-amber-600" :
                                        "bg-gradient-to-r from-purple-500 to-indigo-600"
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
                
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700">
                    <h3 className="text-white text-lg font-semibold mb-5">Quick Actions</h3>
                    
                    <div className="space-y-3">
                        <Link to="/admin/userManage" className="flex items-center p-3 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-white transition-all border border-gray-600/30 hover:border-purple-500/50 group">
                            <div className="mr-3 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center rounded-lg group-hover:scale-110 transition-all">
                                <i className="fas fa-users"></i>
                            </div> 
                            Manage Users
                        </Link>
                        <Link to="/admin/projects" className="flex items-center p-3 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-white transition-all border border-gray-600/30 hover:border-purple-500/50 group">
                            <div className="mr-3 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center rounded-lg group-hover:scale-110 transition-all">
                                <i className="fas fa-project-diagram"></i>
                            </div>
                            View Projects
                        </Link>
                        <Link to="/admin/metrics" className="flex items-center p-3 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-white transition-all border border-gray-600/30 hover:border-purple-500/50 group">
                            <div className="mr-3 h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center rounded-lg group-hover:scale-110 transition-all">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            System Performance
                        </Link>
                        <Link to="/admin/logs" className="flex items-center p-3 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-white transition-all border border-gray-600/30 hover:border-purple-500/50 group">
                            <div className="mr-3 h-10 w-10 bg-gradient-to-br from-amber-500 to-red-700 flex items-center justify-center rounded-lg group-hover:scale-110 transition-all">
                                <i className="fas fa-list"></i>
                            </div>
                            View Logs
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700 mx-auto max-w-2xl w-full">
                    <h3 className="text-white text-lg font-semibold mb-5">System Health</h3>
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300">CPU Usage</span>
                                <span className="text-blue-400 flex items-center">
                                    {stats.serverLoad}%
                                    {autoRefresh && usingRealTimeMetrics && (
                                        <span className="ml-2 inline-block w-2 h-2 rounded-full animate-pulse bg-blue-400"></span>
                                    )}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700/40 rounded-full h-3">
                                <div 
                                    className={`bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`} 
                                    style={{width: `${stats.serverLoad}%`}}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300">Memory Usage</span>
                                <span className="text-green-400 flex items-center">
                                    {stats.memoryUsage}%
                                    {autoRefresh && usingRealTimeMetrics && (
                                        <span className="ml-2 inline-block w-2 h-2 rounded-full animate-pulse bg-green-400"></span>
                                    )}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700/40 rounded-full h-3">
                                <div 
                                    className={`bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`} 
                                    style={{width: `${stats.memoryUsage}%`}}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300">Disk Usage</span>
                                <span className="text-purple-400 flex items-center">
                                    {stats.diskUsage}%
                                    {autoRefresh && usingRealTimeMetrics && (
                                        <span className="ml-2 inline-block w-2 h-2 rounded-full animate-pulse bg-purple-400"></span>
                                    )}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700/40 rounded-full h-3">
                                <div 
                                    className={`bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full ${autoRefresh && usingRealTimeMetrics ? "transition-all duration-700" : ""}`} 
                                    style={{width: `${stats.diskUsage}%`}}
                                ></div>
                            </div>
                        </div>
                        {usingRealTimeMetrics && (
                            <div className="mt-2 text-sm text-gray-400 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                <span>Live metrics - Refreshes every 3 seconds</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/apiTypes";

const BASE_URL: string = "http://127.0.0.1:5000"; // Flask backend URL

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Mock data for when the API calls fail
const MOCK_DATA = {
    dashboardStats: {
        totalUsers: 124,
        activeUsers: 87,
        totalProjects: 312,
        processingProjects: 8,
        completedProjects: 295,
        failedProjects: 9,
        serverLoad: 42,
        memoryUsage: 65,
        diskUsage: 78,
        uptime: "5d 12h 34m",
        avgProcessingTime: "3m 12s",
        dailyUploads: 14,
        storageUsed: "1.2 TB"
    },
    users: [
        { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com", status: "active", projects: 5 },
        { id: 2, first_name: "Sarah", last_name: "Smith", email: "sarah@example.com", status: "active", projects: 3 },
        { id: 3, first_name: "Alex", last_name: "Johnson", email: "alex@example.com", status: "inactive", projects: 0 },
        { id: 4, first_name: "Emily", last_name: "Davis", email: "emily@example.com", status: "active", projects: 2 }
    ],
    projects: [
        { id: 1, name: "Walking Motion", user_id: 1, owner: "john@example.com", status: "completed", creation_date: "2023-04-01" },
        { id: 2, name: "Dancing Sequence", user_id: 2, owner: "sarah@example.com", status: "processing", creation_date: "2023-04-02" },
        { id: 3, name: "Running Analysis", user_id: 1, owner: "john@example.com", status: "completed", creation_date: "2023-04-03" },
        { id: 4, name: "Boxing Movements", user_id: 3, owner: "alex@example.com", status: "failed", creation_date: "2023-04-05" },
        { id: 5, name: "Yoga Poses", user_id: 4, owner: "emily@example.com", status: "completed", creation_date: "2023-04-08" }
    ],
    getSystemMetrics: (timeRange: string) => {
        const dataPoints = timeRange === "day" ? 24 : timeRange === "week" ? 7 : 30;
        const labels = timeRange === "day" 
            ? Array.from({ length: 24 }, (_, i) => `${i}:00`) 
            : timeRange === "week" 
            ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            : Array.from({ length: 30 }, (_, i) => `Day ${i+1}`);
        
        return {
            timeRange,
            labels,
            cpu: Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 60) + 20),
            memory: Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 50) + 30),
            processingHistory: Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 40) + 10),
            errorRate: Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 10)),
            diskUsage: 78,
            avgProcessTime: timeRange === "day" ? "2m 45s" : timeRange === "week" ? "3m 10s" : "3m 30s"
        };
    },
    getLogs: (logType: string = "all", logLevel: string = "all", limit: number = 100) => {
        const types = ["auth", "processor", "system", "database"];
        const levels = ["debug", "info", "warning", "error"];
        
        return Array.from({ length: limit }, (_, i) => ({
            id: i + 1,
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString().replace('T', ' ').slice(0, 19),
            level: logLevel === "all" ? levels[Math.floor(Math.random() * levels.length)] : logLevel,
            service: logType === "all" ? types[Math.floor(Math.random() * types.length)] : logType,
            message: `Mock log message for ${logType === "all" ? types[Math.floor(Math.random() * types.length)] : logType} service`
        }));
    }
};

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    processingProjects: number;
    completedProjects: number;
    failedProjects: number;
    serverLoad: number;
    memoryUsage: number;
    diskUsage: number;
    uptime: string;
    avgProcessingTime: string;
    dailyUploads: number;
    storageUsed: string;
}

export interface SystemMetrics {
    timeRange: string;
    labels: string[];
    cpu: number[];
    memory: number[];
    processingHistory: number[];
    errorRate: number[];
    diskUsage: number;
    avgProcessTime: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    projects: number;
    status: string;
}

export interface Project {
    id: number;
    name: string;
    user_id: number;
    owner: string;
    status: string;
    creation_date: string;
}

export interface Log {
    id: number;
    timestamp: string;
    level: string;
    message: string;
    service: string;
}

// Flag to control whether to use mock data instead of real API calls
const USE_MOCK_DATA = false;

/**
 * Fetches dashboard statistics
 */
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
        return { 
            success: true, 
            data: MOCK_DATA.dashboardStats,
            message: "Using mock data (development mode)"
        };
    }
    
    try {
        const response: AxiosResponse<ApiResponse<DashboardStats>> = await axiosInstance.get("/admin/dashboard-stats");
        return response.data;
    } catch (error: any) {
        console.error("Error fetching dashboard stats:", error);
        // Fallback to mock data on error
        return { 
            success: true, 
            data: MOCK_DATA.dashboardStats,
            message: "Using mock data (API unavailable)" 
        };
    }
};

/**
 * Fetches system metrics
 * @param timeRange - The time range for metrics: day, week, or month
 */
export const getSystemMetrics = async (timeRange: string): Promise<ApiResponse<SystemMetrics>> => {
    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
        return { 
            success: true, 
            data: MOCK_DATA.getSystemMetrics(timeRange),
            message: "Using mock data (development mode)"
        };
    }
    
    try {
        const response: AxiosResponse<ApiResponse<SystemMetrics>> = await axiosInstance.get(
            `/admin/system-metrics?timeRange=${timeRange}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching system metrics:", error);
        // Fallback to mock data on error
        return { 
            success: true, 
            data: MOCK_DATA.getSystemMetrics(timeRange),
            message: "Using mock data (API unavailable)" 
        };
    }
};

/**
 * Fetches all users
 */
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
        return { 
            success: true, 
            data: MOCK_DATA.users,
            message: "Using mock data (development mode)"
        };
    }
    
    try {
        const response: AxiosResponse<ApiResponse<User[]>> = await axiosInstance.get("/admin/users");
        return response.data;
    } catch (error: any) {
        console.error("Error fetching users:", error);
        // Fallback to mock data on error
        return { 
            success: true, 
            data: MOCK_DATA.users,
            message: "Using mock data (API unavailable)" 
        };
    }
};

/**
 * Updates a user
 * @param userId - The user ID to update
 * @param userData - The updated user data
 */
export const updateUser = async (userId: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
        const user = MOCK_DATA.users.find(u => u.id === userId);
        if (!user) {
            return { success: false, message: "User not found" };
        }
        
        const updatedUser = { ...user, ...userData };
        return { 
            success: true, 
            data: updatedUser,
            message: "Using mock data (development mode)" 
        };
    }
    
    try {
        const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.put(
            `/admin/users/${userId}`,
            userData
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating user:", error);
        // Return error message
        return { success: false, message: error.message };
    }
};

/**
 * Deletes a user
 * @param userId - The user ID to delete
 */
export const deleteUser = async (userId: number): Promise<ApiResponse<null>> => {
    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
        return { 
            success: true, 
            message: "User deleted successfully (mock data - development mode)" 
        };
    }
    
    try {
        const response: AxiosResponse<ApiResponse<null>> = await axiosInstance.delete(
            `/admin/users/${userId}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Fetches all projects
 */
export const getAllProjects = async (): Promise<ApiResponse<Project[]>> => {
    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
        return { 
            success: true, 
            data: MOCK_DATA.projects,
            message: "Using mock data (development mode)"
        };
    }
    
    try {
        const response: AxiosResponse<ApiResponse<Project[]>> = await axiosInstance.get("/admin/projects");
        return response.data;
    } catch (error: any) {
        console.error("Error fetching projects:", error);
        // Fallback to mock data on error
        return { 
            success: true, 
            data: MOCK_DATA.projects,
            message: "Using mock data (API unavailable)" 
        };
    }
};

/**
 * Deletes a project
 * @param projectId - The project ID to delete
 */
export const deleteProject = async (projectId: number): Promise<ApiResponse<null>> => {
    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
        return { 
            success: true, 
            message: "Project deleted successfully (mock data - development mode)" 
        };
    }
    
    try {
        const response: AxiosResponse<ApiResponse<null>> = await axiosInstance.delete(
            `/admin/projects/${projectId}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting project:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Fetches system logs
 * @param logType - The log type filter
 * @param logLevel - The log level filter
 * @param limit - The maximum number of logs to fetch
 */
export const getLogs = async (
    logType: string = "all",
    logLevel: string = "all",
    limit: number = 100
): Promise<ApiResponse<Log[]>> => {
    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
        return { 
            success: true, 
            data: MOCK_DATA.getLogs(logType, logLevel, limit),
            message: "Using mock data (development mode)"
        };
    }
    
    try {
        const response: AxiosResponse<ApiResponse<Log[]>> = await axiosInstance.get(
            `/admin/logs?logType=${logType}&logLevel=${logLevel}&limit=${limit}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching logs:", error);
        // Fallback to mock data on error
        return { 
            success: true, 
            data: MOCK_DATA.getLogs(logType, logLevel, limit),
            message: "Using mock data (API unavailable)" 
        };
    }
}; 
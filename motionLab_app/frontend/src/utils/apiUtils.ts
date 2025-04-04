import axios from 'axios';

const BASE_URL: string = "http://127.0.0.1:5000";

// Function to get the token from local storage
const getAuthToken = (): string | null => {
  try {
    const userStorage = localStorage.getItem('user-storage');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      return userData.state?.user?.token || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interface for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Dashboard Stats interface
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

// User interface
export interface UserSummary {
  totalUsers: number;
  activeUsers: number;
}

// Project interface
export interface ProjectSummary {
  totalProjects: number;
  processingProjects: number;
  completedProjects: number;
  failedProjects: number;
}

// Activity interface
export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  timestamp: string;
}

// Queue Project interface
export interface QueuedProject {
  id: number;
  name: string;
  status: string;
  progress: number;
  eta: string;
}

/**
 * Get dashboard statistics from the API
 * This uses the backend's get_dashboard_stats endpoint to fetch all stats at once
 */
export const getDashboardData = async (): Promise<ApiResponse<DashboardStats>> => {
  try {
    const response = await axiosInstance.get('/admin/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return a formatted error response instead of throwing
    return {
      success: false,
      message: "Failed to fetch dashboard statistics from server",
      data: undefined
    };
  }
};

/**
 * Get user statistics from the API
 * This is now implemented as a wrapper around getDashboardData to extract just the user stats
 */
export const getUserStats = async (): Promise<ApiResponse<UserSummary>> => {
  try {
    const dashboardResponse = await getDashboardData();
    
    if (dashboardResponse.success && dashboardResponse.data) {
      // Extract just the user-related stats
      return {
        success: true,
        data: {
          totalUsers: dashboardResponse.data.totalUsers,
          activeUsers: dashboardResponse.data.activeUsers
        }
      };
    } else {
      // If dashboard data failed, return the error
      return {
        success: false,
        message: dashboardResponse.message || "Failed to fetch user statistics",
        data: undefined
      };
    }
  } catch (error) {
    console.error("Error in getUserStats:", error);
    return {
      success: false,
      message: "Failed to process user statistics",
      data: undefined
    };
  }
};

/**
 * Get project statistics from the API
 * This is now implemented as a wrapper around getDashboardData to extract just the project stats
 */
export const getProjectStats = async (): Promise<ApiResponse<ProjectSummary>> => {
  try {
    const dashboardResponse = await getDashboardData();
    
    if (dashboardResponse.success && dashboardResponse.data) {
      // Extract just the project-related stats
      return {
        success: true,
        data: {
          totalProjects: dashboardResponse.data.totalProjects,
          processingProjects: dashboardResponse.data.processingProjects,
          completedProjects: dashboardResponse.data.completedProjects,
          failedProjects: dashboardResponse.data.failedProjects
        }
      };
    } else {
      // If dashboard data failed, return the error
      return {
        success: false,
        message: dashboardResponse.message || "Failed to fetch project statistics",
        data: undefined
      };
    }
  } catch (error) {
    console.error("Error in getProjectStats:", error);
    return {
      success: false,
      message: "Failed to process project statistics",
      data: undefined
    };
  }
};

/**
 * Get recent activity from the API
 */
export const getRecentActivity = async (limit: number = 5): Promise<ApiResponse<ActivityItem[]>> => {
  try {
    const response = await axiosInstance.get(`/admin/activity/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    // Return a formatted error response instead of throwing
    return {
      success: false,
      message: "Failed to fetch recent activity from server",
      data: undefined
    };
  }
};

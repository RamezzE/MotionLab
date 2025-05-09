import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
    getProjectsByUser,
    deleteProjectById,
    getProjectBVHFilenames,
    getProjectById,
    createRetargetedAvatar,
} from "@/api/projectAPIs";
import { Project } from "@/types/types";
import { ApiResponse } from "@/types/apiTypes";

interface ProjectStoreState {
    projects: Project[];
    error: string | null;
    fetchProjects: (userId: string) => Promise<void>;
    fetchProjectById: (projectId: string, userId: string) => Promise<void>;
    deleteProject: (projectId: string, userId: string) => Promise<boolean>;
    getBVHFilenames: (projectId: string, userId: string) => Promise<ApiResponse<any>>;
    createRetargetedAvatar: (projectId: string, userId: string, bvh_filename: string, selectedAvatarId: string) => Promise<ApiResponse<any>>;
    clearError: () => void;
    clearProjects: () => void;
}

const useProjectStore = create<ProjectStoreState>()(
    persist(
        (set, get) => ({
            projects: [],
            error: null,

            fetchProjects: async (userId: string): Promise<void> => {
                const response = await getProjectsByUser(userId);
                if (response.success && response.data) {
                    // Assuming response.data is an array of Project objects
                    set({ projects: response.data });

                    // Update local storage after fetching the projects
                    localStorage.setItem("projects", JSON.stringify(response.data));
                } else {
                    set({
                        error:
                            typeof response.data === "string"
                                ? response.data
                                : "Error fetching projects",
                    });
                }
            },


            fetchProjectById: async (projectId: string, userId: string): Promise<void> => {
                const response = await getProjectById(projectId, userId);
                if (response.success && response.data) {
                    // update the projects state with the fetched project
                    set((state) => ({
                        projects: state.projects.map((project) =>
                            project.id === projectId ? response.data : project
                        ),
                    }));
                } else {
                    set({
                        error:
                            typeof response.data === "string"
                                ? response.data
                                : "Error fetching project",
                    });
                }
            },

            deleteProject: async (projectId: string, userId: string): Promise<boolean> => {
                const response = await deleteProjectById(projectId, userId);
                if (response.success) {
                    set({
                        projects: get().projects.filter((project) => project.id !== projectId),
                    });
                    return true;
                }
                return false;
            },

            getBVHFilenames: async (projectId: string, userId: string): Promise<ApiResponse<any>> => {
                const response = await getProjectBVHFilenames(projectId, userId);
                return response;
            },

            createRetargetedAvatar: async (projectId: string, userId: string, bvh_filename: string, selectedAvatarId: string): Promise<ApiResponse<any>> => {
                const response = await createRetargetedAvatar(projectId, userId, bvh_filename, selectedAvatarId);
                console.log("Response from createRetargetedAvatar:", response);
                return response;
            },

            clearError: () => set({ error: null }),

            clearProjects: () => {
                set({ projects: [] });

                localStorage.removeItem("projects"); // Clear projects from local storage
            },
        }),
        {
            name: "project-storage",
            storage: {
                getItem: (name: string) => {
                    const item = localStorage.getItem(name);
                    return item ? JSON.parse(item) : null;
                },
                setItem: (name: string, value: any) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name: string) => {
                    localStorage.removeItem(name);
                },
            },
        }
    )
);

export default useProjectStore;

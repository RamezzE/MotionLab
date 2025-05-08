import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAvatar } from "@/api/avatarAPIs";
import { Avatar } from "@/types/types";
import { ApiResponse } from "@/types/apiTypes";

interface AvatarStoreState {
    avatars: Avatar[];
    error: string | null;
    fetchAvatars: (userId: string) => Promise<void>;
    createAvatar: (avatarName: string, userId: string, downloadUrl: string) => Promise<ApiResponse<any>>;
    // fetchProjectById: (projectId: string, userId: string) => Promise<void>;
    // deleteProject: (projectId: string, userId: string) => Promise<boolean>;
    // getBVHFilenames: (projectId: string, userId: string) => Promise<ApiResponse<any>>;
    // clearError: () => void;
    // clearProjects: () => void;
}

const useProjectStore = create<AvatarStoreState>()(
    persist(
        (set, get) => ({
            avatars: [],
            error: null,

            fetchAvatars: async (userId: string): Promise<void> => {
                // const response = await getProjectsByUser(userId);
                // if (response.success && response.data) {
                //     // Assuming response.data is an array of Project objects
                //     set({ projects: response.data });
                // } else {
                //     set({
                //         error:
                //             typeof response.data === "string"
                //                 ? response.data
                //                 : "Error fetching projects",
                //     });
                // }
            },
            createAvatar: async (
                avatarName: string,
                userId: string,
                downloadUrl: string
            ): Promise<ApiResponse<any>> => {
                const response = await createAvatar(avatarName, userId, downloadUrl);
                if (response.success && response.data) {
                    set((state) => ({
                        avatars: [...state.avatars, response.data],
                    }));
                } else {
                    set({
                        error:
                            typeof response.data === "string"
                                ? response.data
                                : "Error creating avatar",
                    });
                }
                return response;
            }

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

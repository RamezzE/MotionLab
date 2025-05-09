import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAvatar, getAvatarsByUser, getAvatarByIdAndUserId, deleteAvatarByIdAndUserId } from "@/api/avatarAPIs";
import { Avatar } from "@/types/types";
import { ApiResponse } from "@/types/apiTypes";

interface AvatarStoreState {
    avatars: Avatar[];
    error: string | null;
    fetchAvatars: (userId: string) => Promise<void>;
    getAvatarByIdAndUserId: (avatarId: string, userId: string) => Promise<ApiResponse<any>>;
    createAvatar: (avatarName: string, userId: string, downloadUrl: string) => Promise<ApiResponse<any>>;
    deleteAvatarByIdAndUserId: (avatarId: string, userId: string) => Promise<ApiResponse<any>>;
    clearAvatars: () => void;
}

const useAvatarStore = create<AvatarStoreState>()(
    persist(
        (set, get) => ({
            avatars: [], // Initial avatars state
            error: null, // Initial error state

            // Function to fetch avatars by user ID
            fetchAvatars: async (userId: string): Promise<void> => {
                const response = await getAvatarsByUser(userId);
                console.log("Fetched avatars:", response);

                if (response.success && response.data) {
                    set({ avatars: response.data });
                } else {
                    set({
                        error:
                            typeof response.data === "string"
                                ? response.data
                                : "Error fetching avatars",
                    });
                }
            },

            getAvatarByIdAndUserId: async (
                avatarId: string,
                userId: string
            ): Promise<ApiResponse<any>> => {
                const response = await getAvatarByIdAndUserId(avatarId, userId);
                console.log("Fetched avatar by ID:", response);

                if (response.success && response.data) {
                    return response;
                } else {
                    set({
                        error:
                            typeof response.data === "string"
                                ? response.data
                                : "Error fetching avatar",
                    });
                    return { success: false, data: null };
                }
            },

            // Function to create a new avatar
            createAvatar: async (
                avatarName: string,
                userId: string,
                downloadUrl: string
            ): Promise<ApiResponse<any>> => {
                const response = await createAvatar(avatarName, userId, downloadUrl);

                if (response.success && response.data) {
                    // Add the new avatar to the state
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
            },

            deleteAvatarByIdAndUserId: async (
                avatarId: string,
                userId: string
            ): Promise<ApiResponse<any>> => {
                const response = await deleteAvatarByIdAndUserId(avatarId, userId);
                console.log("Deleted avatar:", response);

                if (response.success) {
                    // Remove the deleted avatar from the state
                    set((state) => ({
                        avatars: state.avatars.filter((avatar) => avatar.id !== avatarId),
                    }));
                } else {
                    set({
                        error:
                            typeof response.data === "string"
                                ? response.data
                                : "Error deleting avatar",
                    });
                }

                return response;
            },

            // Function to clear avatars from the state
            clearAvatars: () => set({ avatars: [] }),

        }),
        {
            name: "avatar-storage", // name of the localStorage key
            storage: {
                getItem: (name) => {
                    const item = localStorage.getItem(name);
                    return item ? JSON.parse(item) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    localStorage.removeItem(name);
                },
            }, // Custom localStorage wrapper to conform to PersistStorage type
            // Optional: Handle errors or migration of storage data
            onRehydrateStorage: (state) => {
                console.log("Rehydrated state:", state); // This logs the state when it's being rehydrated from localStorage
            },
        }
    )
);

export default useAvatarStore;

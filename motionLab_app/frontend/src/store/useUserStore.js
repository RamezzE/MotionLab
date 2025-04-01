import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login, signup } from "../api/userAPIs";
import { validateLogin, validateSignup } from "../utils/validateUser"; // Import validation

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (formData) => {
        const errors = validateLogin(formData);

        if (Object.keys(errors).length > 0) {
          set({ error: errors }); // Store validation errors in Zustand
          return false;
        }

        const response = await login(formData);

        if (response.success && response.user) {
          const expiry = Date.now() + ONE_WEEK; // Set expiration for 1 week
          set({
            user: response.user,
            isAuthenticated: true,
            token: response.token,
            expiry, // Store expiry time
          });
          return true;
        } else {
          set({ error: response.data.errors || "An unexpected error occurred while logging in" });
          return false;
        }
      },

      signup: async (formData) => {
        const errors = validateSignup(formData);

        if (Object.keys(errors).length > 0) {
          set({ error: errors });
          return false;
        }

        const response = await signup(formData);

        if (response.success && response.user) {
          const expiry = Date.now() + ONE_WEEK;
          set({
            user: response.user,
            isAuthenticated: true,
            token: response.token,
            expiry, // Store expiry time
          });
          return true;
        } else {
          set({ error: response.data.errors || "An unexpected error occurred while signing up" });
          return false;
        }
      },

      clearError: (fieldName) => {
        set((state) => {
          return { error: { ...state.error, [fieldName]: null } };
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, token: null, error: {}, expiry: null });
      },

      checkExpiry: () => {
        const state = get();
        if (state.expiry && Date.now() > state.expiry) {
          set({ user: null, isAuthenticated: false, token: null, error: {}, expiry: null });
        }
      },
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);

// Auto-check expiration when the app loads
useUserStore.getState().checkExpiry();

export default useUserStore;

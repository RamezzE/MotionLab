import { create } from "zustand";
import { persist } from "zustand/middleware";

import { login, signup } from "@/api/userAPIs";
import { validateLogin, validateSignup } from "@/utils/validateUser";
import { User } from "@/types/types";
import { LoginFormData, SignupFormData, LoginErrors } from "@/types/formTypes";

interface AuthResponse {
  success: boolean;
  message?: string;
  errors?: LoginErrors;
}

interface UserStoreState {
  user: User | null;
  isAuthenticated: boolean;
  expiry: number | null;
  login: (formData: LoginFormData) => Promise<AuthResponse>;
  signup: (formData: SignupFormData) => Promise<AuthResponse>;
  logout: () => void;
  checkExpiry: () => void;
}

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      expiry: null,

      login: async (formData: LoginFormData): Promise<AuthResponse> => {
        const errors = validateLogin(formData);
        console.log(errors);
        if (Object.keys(errors).length > 0) {
          return { success: false, errors: errors };
        }

        const response = await login(formData);
        console.log(response);

        if (response.success && response.data) {
          const expiry = Date.now() + ONE_WEEK; // Set expiration for 1 week
          set({
            user: response.data,
            isAuthenticated: true,
            expiry,
          });
          return { success: true };
        } else {
          return { success: false, errors: response.errors };
        }
      },

      signup: async (formData: SignupFormData): Promise<AuthResponse> => {
        const errors = validateSignup(formData);
        if (Object.keys(errors).length > 0) {
          return { success: false, errors: errors };
        }

        const response = await signup(formData);
        if (response.success && response.data) {
          const expiry = Date.now() + ONE_WEEK;
          set({
            user: response.data,
            isAuthenticated: true,
            expiry,
          });
          return { success: true };
        } else {
          return { success: false, errors: response.errors };
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          expiry: null,
        });
      },

      checkExpiry: () => {
        const state = get();
        if (state.expiry && Date.now() > state.expiry) {
          set({
            user: null,
            isAuthenticated: false,
            expiry: null,
          });
        }
      },
    }),
    {
      name: "user-storage",
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
      }, // Custom wrapper for localStorage
    }
  )
);

// Auto-check expiration when the app loads
useUserStore.getState().checkExpiry();

export default useUserStore;

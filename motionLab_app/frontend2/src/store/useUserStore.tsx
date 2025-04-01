import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login, signup } from "../api/userAPIs";
import { validateLogin, validateSignup } from "../utils/validateUser";
import { User } from "../../types";

// Define the expected types for form data
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Define the API response structure (adjust types as needed)
export interface UserAPIResponse {
  success: boolean;
  user?: any;
  token?: string;
  data?: any;
}

// Define the shape of the user store state
interface UserStoreState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  expiry: number | null;
  login: (formData: LoginFormData) => Promise<boolean>;
  signup: (formData: SignupFormData) => Promise<boolean>;
  logout: () => void;
  checkExpiry: () => void;
}

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      expiry: null,

      login: async (formData: LoginFormData): Promise<boolean> => {
        const errors = validateLogin(formData);

        if (Object.keys(errors).length > 0) {
          
          return false;
        }

        const response: UserAPIResponse = await login(formData);

        if (response.success && response.user) {
          const expiry = Date.now() + ONE_WEEK; // Set expiration for 1 week
          set({
            user: response.user,
            isAuthenticated: true,
            token: response.token || null,
            expiry,
          });
          return true;
        } else {
          return false;
        }
      },

      signup: async (formData: SignupFormData): Promise<boolean> => {
        const errors = validateSignup(formData);

        if (Object.keys(errors).length > 0) {
          return false;
        }

        const response: UserAPIResponse = await signup(formData);

        if (response.success && response.user) {
          const expiry = Date.now() + ONE_WEEK;
          set({
            user: response.user,
            isAuthenticated: true,
            token: response.token || null,
            expiry,
          });
          return true;
        } else {
  
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          error: {},
          expiry: null,
        });
      },

      checkExpiry: () => {
        const state = get();
        if (state.expiry && Date.now() > state.expiry) {
          set({
            user: null,
            isAuthenticated: false,
            token: null,
            expiry: null,
          });
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

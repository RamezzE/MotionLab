import { create } from "zustand";
import { persist } from "zustand/middleware";

import { login, signup, requestPasswordReset, resetPassword, verifyEmail, sendVerificationEmail } from "@/api/userAPIs";
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
  isLoggedIn: boolean;
  expiry: number | null;
  login: (formData: LoginFormData) => Promise<AuthResponse>;
  signup: (formData: SignupFormData) => Promise<AuthResponse>;
  logout: () => void;
  checkExpiry: () => void;
  sendPasswordResetEmail: (email: string) => Promise<AuthResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<AuthResponse>;
  verifyEmail: (token: string) => Promise<AuthResponse>;
  sendVerificationEmail: (email: string) => Promise<AuthResponse>;
}


const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      expiry: null,

      login: async (formData: LoginFormData): Promise<AuthResponse> => {
        const errors = validateLogin(formData);

        if (Object.keys(errors).length > 0) {
          return { success: false, errors: errors };
        }

        const response = await login(formData);

        if (response.success && 'data' in response && response.data) {
          const expiry = Date.now() + ONE_WEEK; // Set expiration for 1 week
          set({
            user: response.data,
            isLoggedIn: true,
            expiry,
          });
          return { success: true };
        } else {
          return {
            success: response.success,
            message: response.message || "An error has occurred"
          };
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
            isLoggedIn: true,
            expiry,
          });
          return { success: true };
        } else {
          return { success: false, errors: response.errors, message: response.message || "An error has occured" };
        }
      },

      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          expiry: null,
        });
      },

      checkExpiry: () => {
        const state = get();
        if (state.expiry && Date.now() > state.expiry) {
          set({
            user: null,
            isLoggedIn: false,
            expiry: null,
          });
        }
      },
      sendPasswordResetEmail: async (email: string): Promise<AuthResponse> => {
        try {

          const response = await requestPasswordReset(email);
          if (response.success) {
            return { success: true, message: "Password reset email sent. Please check your inbox." };
          } else {
            return { success: false, message: response.message || "Error sending password reset email." };
          }

        } catch (error) {
          console.error("Error sending password reset email:", error);
          return { success: false, message: "An unexpected error occurred. Please try again later." };
        }
      },
      resetPassword: async (token: string, newPassword: string): Promise<AuthResponse> => {
        try {
          const response = await resetPassword(token, newPassword);
          if (response.success) {
            return { success: true, message: "Your password has been reset successfully." };
          } else {
            return { success: false, message: response.message || "Error resetting password." };
          }
        } catch (error) {
          console.error("Error resetting password:", error);
          return { success: false, message: "An unexpected error occurred. Please try again later." };
        }
      },
      verifyEmail: async (token: string): Promise<AuthResponse> => {
        try {
          const response = await verifyEmail(token);
          if (response.success) {
            set({
              user: { ...get().user, emailVerified: true } as User,
            });
            return { success: true, message: "Email verified successfully." };
          } else {
            return { success: false, message: response.message || "Error verifying email." };
          }
        } catch (error) {
          console.error("Error verifying email:", error);
          return { success: false, message: "An unexpected error occurred. Please try again later." };
        }
      },
      sendVerificationEmail: async (email: string): Promise<AuthResponse> => {
        try {
          const response = await sendVerificationEmail(email);
          if (response.success) {
            return { success: true, message: "Verification email sent. Please check your inbox." };
          } else {
            return { success: false, message: response.message || "Error sending verification email." };
          }
        } catch (error) {
          console.error("Error sending verification email:", error);
          return { success: false, message: "An unexpected error occurred. Please try again later." };
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

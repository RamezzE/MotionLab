import { create } from "zustand";
import { login, signup } from "../api/userAPIs";
import { validateLogin, validateSignup } from "../utils/validateUser"; // Import validation

const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  error: {},

  login: async (formData) => {

    const errors = validateLogin(formData);

    if (Object.keys(errors).length > 0) {
      set({ error: errors }); // Store validation errors in Zustand
      return false;
    }

    const response = await login(formData);
    
    if (response.success && response.user) {
      set({
        user: response.user,
        isAuthenticated: true,
        token: response.token,
        error: {}, // Reset errors on successful login
      });
      return true;

      // Store in localStorage
      // localStorage.setItem("token", response.token);
    }
    else  {
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

    // Call the signup API
    const response = await signup(formData);

    if (response.success && response.user) {
      set({
        user: response.user,
        isAuthenticated: true,
        token: response.token,
        error: {},
      });
      return true;

      // Store in localStorage
      // localStorage.setItem("token", response.token);
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
    set({ user: null, isAuthenticated: false, token: null, error: {} });

    // Clear from localStorage
    // localStorage.removeItem("token");
  },
}));

export default useUserStore;

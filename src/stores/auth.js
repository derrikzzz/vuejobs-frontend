import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { loginAPI, registerAPI, fetchMeAPI } from "@/api/auth.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
  }),

  actions: {
    async login(credentials) {
      try {
        const result = await loginAPI(credentials);
        if (result?.token) {
          this.token = result.token;
          this.user = result.user;
          localStorage.setItem("token", result.token);
          return { success: true };
        }
        return { success: false, error: "Login failed" };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
      }
    },

    async register(data) {
      try {
        const result = await registerAPI(data);
        if (result?.token) {
          this.token = result.token;
          this.user = result.user;
          localStorage.setItem("token", result.token);
          return { success: true };
        }
        return { success: false, error: "Registration failed" };
      } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: error.message };
      }
    },

    async fetchCurrentUser() {
      if (!this.token) return;
      try {
        this.isLoading = true;
        const { user } = await fetchMeAPI(this.token);
        this.user = user;
      } catch (error) {
        console.error("Error fetching current user:", error);
        this.logout();
      } finally {
        this.isLoading = false;
      }
    },

    async initializeAuth() {
      if (this.token) {
        await this.fetchCurrentUser();
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },
});

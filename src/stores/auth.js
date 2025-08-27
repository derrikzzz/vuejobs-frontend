import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import authService from "@/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isLoading: false,
    isInitialized: false,
  }),

  actions: {
    // Initialize auth state listener
    initializeAuth() {
      return new Promise((resolve) => {
        const unsubscribe = authService.onAuthStateChanged(
          async (firebaseUser) => {
            this.isLoading = true;

            if (firebaseUser) {
              // User is signed in
              this.user = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                emailVerified: firebaseUser.emailVerified,
                photoURL: firebaseUser.photoURL,
              };

              // Fetch additional user data from Firestore
              const userDocResult = await authService.getUserDocument(
                firebaseUser.uid
              );
              if (userDocResult.success) {
                this.user = { ...this.user, ...userDocResult.data };
              }
            } else {
              // User is signed out
              this.user = null;
            }

            this.isLoading = false;
            if (!this.isInitialized) {
              this.isInitialized = true;
              resolve();
            }
          }
        );

        // Store unsubscribe function for cleanup if needed
        this.authUnsubscribe = unsubscribe;
      });
    },

    // Login with email and password
    async login(credentials) {
      this.isLoading = true;
      try {
        const result = await authService.login(credentials);
        return result;
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
      } finally {
        this.isLoading = false;
      }
    },

    // Register with email and password
    async register(data) {
      this.isLoading = true;
      try {
        const result = await authService.register(data);
        return result;
      } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: error.message };
      } finally {
        this.isLoading = false;
      }
    },

    // Login with Google
    async loginWithGoogle() {
      this.isLoading = true;
      try {
        const result = await authService.loginWithGoogle();
        return result;
      } catch (error) {
        console.error("Google login error:", error);
        return { success: false, error: error.message };
      } finally {
        this.isLoading = false;
      }
    },

    // Logout
    async logout() {
      this.isLoading = true;
      try {
        const result = await authService.logout();
        if (result.success) {
          this.user = null;
        }
        return result;
      } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error: error.message };
      } finally {
        this.isLoading = false;
      }
    },

    // Reset password
    async resetPassword(email) {
      try {
        const result = await authService.resetPassword(email);
        return result;
      } catch (error) {
        console.error("Reset password error:", error);
        return { success: false, error: error.message };
      }
    },

    // Update user profile
    async updateProfile(profileData) {
      this.isLoading = true;
      try {
        const result = await authService.updateUserProfile(profileData);
        if (result.success) {
          // Update local user state
          this.user = { ...this.user, ...profileData };
        }
        return result;
      } catch (error) {
        console.error("Update profile error:", error);
        return { success: false, error: error.message };
      } finally {
        this.isLoading = false;
      }
    },

    // Change password
    async changePassword(passwordData) {
      try {
        const result = await authService.changePassword(passwordData);
        return result;
      } catch (error) {
        console.error("Change password error:", error);
        return { success: false, error: error.message };
      }
    },

    // Send email verification
    async sendEmailVerification() {
      try {
        const result = await authService.sendEmailVerification();
        return result;
      } catch (error) {
        console.error("Send email verification error:", error);
        return { success: false, error: error.message };
      }
    },

    // Cleanup auth listener
    cleanupAuth() {
      if (this.authUnsubscribe) {
        this.authUnsubscribe();
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isEmailVerified: (state) => state.user?.emailVerified || false,

    //Authorization getters
    canAddJobs: (state) => {
      if (!state.user) return false;
      return (
        state.user.role === "admin" ||
        state.user.role === "recruiter" ||
        state.user.role === "employer"
      );
    },

    isAdmin: (state) => state.user?.role === "admin",
    isRecruiter: (state) => state.user?.role === "recruiter",
    isEmployer: (state) => state.user?.role === "employer",
  },
});

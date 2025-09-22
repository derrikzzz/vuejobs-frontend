import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import HomeView from "@/views/HomeView.vue";
import JobsView from "@/views/JobsView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import JobView from "@/views/JobView.vue";
import AddJobView from "@/views/AddJobView.vue";
import EditJobView from "@/views/EditJobView.vue";
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ReviewResumeView from "@/views/ReviewResume.vue";
import ActionListView from "@/views/ActionList.vue";
import TestView from "@/views/TestView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
      meta: { requiresGuest: true },
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: false }, // Temporarily disabled for debugging
    },
    {
      path: "/jobs",
      name: "jobs",
      component: JobsView,
      meta: { requiresAuth: false }, // Temporarily disabled for debugging
    },
    {
      path: "/jobs/:id",
      name: "job",
      component: JobView,
      meta: { requiresAuth: true },
    },
    {
      path: "/jobs/add",
      name: "add-job",
      component: AddJobView,
      meta: {
        requiresAuth: true,
        requiresPermission: "jobs:create",
        roles: ["employer", "admin"],
      },
    },
    {
      path: "/jobs/edit/:id",
      name: "edit-job",
      component: EditJobView,
      meta: {
        requiresAuth: true,
        requiresPermission: "jobs:edit:own", // Will be checked dynamically for ownership
        roles: ["employer", "admin"],
      },
    },
    {
      path: "/review-resume",
      name: "review-resume",
      component: ReviewResumeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/action-list",
      name: "action-list",
      component: ActionListView,
      meta: { requiresAuth: true },
    },
    {
      path: "/test",
      name: "test",
      component: TestView,
      meta: { requiresAuth: false }, // No auth required for testing
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/views/AdminView.vue"),
      meta: {
        requiresAuth: true,
        roles: ["admin"],
        requiresPermission: "users:manage",
      },
    },
    {
      path: "/:catchAll(.*)*",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

// Route guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Wait for auth to initialize on first navigation
  if (!authStore.isInitialized) {
    await authStore.initializeAuth();
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
    return;
  }

  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: "home" });
    return;
  }

  // Check if email verification is required for certain routes
  if (
    to.meta.requiresVerification &&
    authStore.isAuthenticated &&
    !authStore.isEmailVerified
  ) {
    next({
      name: "profile",
      query: { message: "Please verify your email address" },
    });
    return;
  }

  // Check role-based access
  if (to.meta.roles && authStore.isAuthenticated) {
    const userRole = authStore.userRole;
    if (!to.meta.roles.includes(userRole)) {
      next({
        name: "home",
        query: { error: "You don't have permission to access this page" },
      });
      return;
    }
  }

  // Check specific permissions
  if (to.meta.requiresPermission && authStore.isAuthenticated) {
    const hasPermission = authStore.hasPermission(to.meta.requiresPermission);
    if (!hasPermission) {
      next({
        name: "home",
        query: { error: "Insufficient permissions to access this page" },
      });
      return;
    }
  }

  next();
});

export default router;

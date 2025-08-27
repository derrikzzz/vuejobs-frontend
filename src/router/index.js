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
import UnauthorizedView from "@/views/UnauthorizedView.vue";

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
      meta: { requiresAuth: true },
    },
    {
      path: "/jobs",
      name: "jobs",
      component: JobsView,
      meta: { requiresAuth: true },
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
        requiresRole: ["admin", "recruiter", "employer"],
      },
    },
    {
      path: "/jobs/edit/:id",
      name: "edit-job",
      component: EditJobView,
      meta: { requiresAuth: true },
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
      path: "/unauthorized",
      name: "unauthorized",
      component: UnauthorizedView,
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

  // Check if route requires specific roles
  if (to.meta.requiresRole) {
    const userRole = authStore.currentUser?.role;
    if (!userRole || !to.meta.requiresRole.includes(userRole)) {
      next({ name: "unauthorized" });
      return;
    }
  }

  next();
});

export default router;

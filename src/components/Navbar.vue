<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import logo from "@/assets/img/logo.png";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const route = useRoute();
const authStore = useAuthStore();
const showUserMenu = ref(false);
const menuRef = ref(null);

const isActiveLink = (p) => route.path === p;
const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => authStore.currentUser);

const handleLogout = async () => {
  await authStore.logout();
  showUserMenu.value = false;
};

const handleProtectedRouteClick = (routePath, event) => {
  if (!isAuthenticated.value) {
    event.preventDefault();
    toast.error("Please login to access this page");
    router.push(`/login?redirect=${encodeURIComponent(routePath)}`);
    return false;
  }
  return true;
};

const onDocClick = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    showUserMenu.value = false;
  }
};
const onDocKey = (e) => {
  if (e.key === "Escape") showUserMenu.value = false;
};

onMounted(() => {
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onDocKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick);
  document.removeEventListener("keydown", onDocKey);
});
</script>

<template>
  <nav class="bg-green-700 border-b border-green-500">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2"
              >Vue Jobs</span
            >
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex items-center space-x-2">
              <RouterLink
                to="/"
                @click="handleProtectedRouteClick('/', $event)"
                :class="[
                  isActiveLink('/') ? 'bg-green-900' : 'hover:bg-gray-900',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Home</RouterLink
              >
              <RouterLink
                to="/jobs"
                @click="handleProtectedRouteClick('/jobs', $event)"
                :class="[
                  isActiveLink('/jobs') ? 'bg-green-900' : 'hover:bg-gray-900',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Jobs</RouterLink
              >
              <RouterLink
                to="/review-resume"
                @click="handleProtectedRouteClick('/review-resume', $event)"
                :class="[
                  isActiveLink('/review-resume')
                    ? 'bg-green-900'
                    : 'hover:bg-gray-900',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Review Resume</RouterLink
              >

              <!-- Authenticated User Links -->
              <template v-if="isAuthenticated">
                <!-- Only show Add Job for authorized users -->
                <RouterLink
                  v-if="authStore.canAddJobs"
                  to="/jobs/add"
                  @click="handleProtectedRouteClick('/jobs/add', $event)"
                  :class="[
                    isActiveLink('/jobs/add')
                      ? 'bg-green-900'
                      : 'hover:bg-gray-900',
                    'text-white',
                    'px-3',
                    'py-2',
                    'rounded-md',
                  ]"
                  >Add Job</RouterLink
                >

                <!-- User Dropdown -->
                <div class="relative" ref="menuRef">
                  <button
                    @click.stop="showUserMenu = !showUserMenu"
                    class="flex items-center space-x-2 text-white hover:bg-gray-900 px-3 py-2 rounded-md"
                  >
                    <div
                      class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      <span class="text-sm font-bold text-green-600">
                        {{
                          currentUser?.displayName?.charAt(0)?.toUpperCase() ||
                          "?"
                        }}
                      </span>
                    </div>
                    <span class="hidden md:block">{{
                      currentUser?.displayName || "User"
                    }}</span>
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
                  <div
                    v-if="showUserMenu"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    @click.stop
                  >
                    <RouterLink
                      to="/profile"
                      @click="showUserMenu = false"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </RouterLink>
                    <button
                      @click="handleLogout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </template>

              <!-- Guest User Links -->
              <template v-else>
                <RouterLink
                  to="/login"
                  :class="[
                    isActiveLink('/login')
                      ? 'bg-green-900'
                      : 'hover:bg-gray-900',
                    'text-white',
                    'px-3',
                    'py-2',
                    'rounded-md',
                  ]"
                  >Login</RouterLink
                >
                <RouterLink
                  to="/signup"
                  :class="[
                    isActiveLink('/signup')
                      ? 'bg-green-900'
                      : 'hover:bg-gray-900',
                    'text-white',
                    'px-3',
                    'py-2',
                    'rounded-md',
                  ]"
                  >Sign Up</RouterLink
                >
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

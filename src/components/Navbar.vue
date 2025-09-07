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
const showMobileMenu = ref(false);
const menuRef = ref(null);

const isActiveLink = (p) => route.path === p;
const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => authStore.currentUser);

const handleLogout = async () => {
  await authStore.logout();
  showUserMenu.value = false;
  showMobileMenu.value = false;
};

const handleProtectedRouteClick = (routePath, event) => {
  if (!isAuthenticated.value) {
    event.preventDefault();
    toast.error("Please login to access this page");
    router.push(`/login?redirect=${encodeURIComponent(routePath)}`);
    return false;
  }
  showMobileMenu.value = false;
  return true;
};

const onDocClick = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    showUserMenu.value = false;
  }
};
const onDocKey = (e) => {
  if (e.key === "Escape") {
    showUserMenu.value = false;
    showMobileMenu.value = false;
  }
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
      <div class="flex h-16 sm:h-20 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink class="flex flex-shrink-0 items-center" to="/">
            <img class="h-8 sm:h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span
              class="hidden sm:block text-white text-xl sm:text-2xl font-bold ml-2"
            >
              Vue Jobs
            </span>
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-2">
            <RouterLink
              to="/"
              @click="handleProtectedRouteClick('/', $event)"
              :class="[
                isActiveLink('/') ? 'bg-green-900' : 'hover:bg-gray-900',
                'text-white px-3 py-2 rounded-md text-sm font-medium',
              ]"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/jobs"
              @click="handleProtectedRouteClick('/jobs', $event)"
              :class="[
                isActiveLink('/jobs') ? 'bg-green-900' : 'hover:bg-gray-900',
                'text-white px-3 py-2 rounded-md text-sm font-medium',
              ]"
            >
              Jobs
            </RouterLink>
            <RouterLink
              to="/review-resume"
              @click="handleProtectedRouteClick('/review-resume', $event)"
              :class="[
                isActiveLink('/review-resume')
                  ? 'bg-green-900'
                  : 'hover:bg-gray-900',
                'text-white px-3 py-2 rounded-md text-sm font-medium',
              ]"
            >
              Review Resume
            </RouterLink>

            <RouterLink
              to="/action-list"
              @click="handleProtectedRouteClick('/action-list', $event)"
              :class="[
                isActiveLink('/action-list')
                  ? 'bg-green-900'
                  : 'hover:bg-gray-900',
                'text-white px-3 py-2 rounded-md text-sm font-medium',
              ]"
            >
              Action List
            </RouterLink>

            <!-- Authenticated User Links -->
            <template v-if="isAuthenticated">
              <RouterLink
                to="/jobs/add"
                @click="handleProtectedRouteClick('/jobs/add', $event)"
                :class="[
                  isActiveLink('/jobs/add')
                    ? 'bg-green-900'
                    : 'hover:bg-gray-900',
                  'text-white px-3 py-2 rounded-md text-sm font-medium',
                ]"
              >
                Add Job
              </RouterLink>

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
                  <span class="hidden lg:block">{{
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
                  isActiveLink('/login') ? 'bg-green-900' : 'hover:bg-gray-900',
                  'text-white px-3 py-2 rounded-md text-sm font-medium',
                ]"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/signup"
                :class="[
                  isActiveLink('/signup')
                    ? 'bg-green-900'
                    : 'hover:bg-gray-900',
                  'text-white px-3 py-2 rounded-md text-sm font-medium',
                ]"
              >
                Sign Up
              </RouterLink>
            </template>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            :aria-expanded="showMobileMenu"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Hamburger icon -->
            <svg
              v-if="!showMobileMenu"
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Close icon -->
            <svg
              v-else
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="showMobileMenu" class="md:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-800">
        <RouterLink
          to="/"
          @click="handleProtectedRouteClick('/', $event)"
          :class="[
            isActiveLink('/') ? 'bg-green-900' : 'hover:bg-green-600',
            'text-white block px-3 py-2 rounded-md text-base font-medium',
          ]"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/jobs"
          @click="handleProtectedRouteClick('/jobs', $event)"
          :class="[
            isActiveLink('/jobs') ? 'bg-green-900' : 'hover:bg-green-600',
            'text-white block px-3 py-2 rounded-md text-base font-medium',
          ]"
        >
          Jobs
        </RouterLink>
        <RouterLink
          to="/review-resume"
          @click="handleProtectedRouteClick('/review-resume', $event)"
          :class="[
            isActiveLink('/review-resume')
              ? 'bg-green-900'
              : 'hover:bg-green-600',
            'text-white block px-3 py-2 rounded-md text-base font-medium',
          ]"
        >
          Review Resume
        </RouterLink>

        <!-- Authenticated User Mobile Links -->
        <template v-if="isAuthenticated">
          <RouterLink
            to="/jobs/add"
            @click="handleProtectedRouteClick('/jobs/add', $event)"
            :class="[
              isActiveLink('/jobs/add') ? 'bg-green-900' : 'hover:bg-green-600',
              'text-white block px-3 py-2 rounded-md text-base font-medium',
            ]"
          >
            Add Job
          </RouterLink>
          <RouterLink
            to="/profile"
            @click="showMobileMenu = false"
            :class="[
              isActiveLink('/profile') ? 'bg-green-900' : 'hover:bg-green-600',
              'text-white block px-3 py-2 rounded-md text-base font-medium',
            ]"
          >
            Profile Settings
          </RouterLink>
          <button
            @click="handleLogout"
            class="text-white hover:bg-green-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
          >
            Sign Out
          </button>
        </template>

        <!-- Guest User Mobile Links -->
        <template v-else>
          <RouterLink
            to="/login"
            @click="showMobileMenu = false"
            :class="[
              isActiveLink('/login') ? 'bg-green-900' : 'hover:bg-green-600',
              'text-white block px-3 py-2 rounded-md text-base font-medium',
            ]"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/signup"
            @click="showMobileMenu = false"
            :class="[
              isActiveLink('/signup') ? 'bg-green-900' : 'hover:bg-green-600',
              'text-white block px-3 py-2 rounded-md text-base font-medium',
            ]"
          >
            Sign Up
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

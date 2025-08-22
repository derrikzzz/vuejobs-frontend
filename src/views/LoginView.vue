<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const email = ref("");
const password = ref("");
const loading = ref(false);
const showForgotPassword = ref(false);
const forgotPasswordEmail = ref("");

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.error("Please fill in all fields");
    return;
  }

  loading.value = true;
  try {
    const result = await authStore.login({
      email: email.value,
      password: password.value,
    });

    if (result.success) {
      toast.success("Login successful!");
      const redirectPath = route.query.redirect || "/";
      router.push(redirectPath);
    } else {
      toast.error(result.error || "Login failed");
    }
  } catch (error) {
    toast.error("An error occurred during login");
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  loading.value = true;
  try {
    const result = await authStore.loginWithGoogle();

    if (result.success) {
      toast.success("Login successful!");
      const redirectPath = route.query.redirect || "/";
      router.push(redirectPath);
    } else {
      toast.error(result.error || "Google login failed");
    }
  } catch (error) {
    toast.error("An error occurred during Google login");
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = async () => {
  if (!forgotPasswordEmail.value) {
    toast.error("Please enter your email address");
    return;
  }

  try {
    const result = await authStore.resetPassword(forgotPasswordEmail.value);

    if (result.success) {
      toast.success("Password reset email sent! Check your inbox.");
      showForgotPassword.value = false;
      forgotPasswordEmail.value = "";
    } else {
      toast.error(result.error || "Failed to send reset email");
    }
  } catch (error) {
    toast.error("An error occurred while sending reset email");
  }
};
</script>

<template>
  <div class="flex flex-col container mx-auto px-4">
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h1>

        <!-- Login Form -->
        <form
          v-if="!showForgotPassword"
          @submit.prevent="handleLogin"
          class="space-y-4"
        >
          <div>
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              required
              class="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              required
              class="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div class="flex justify-center">
            <InteractiveHoverButton
              :text="loading ? 'Logging in...' : 'Login'"
              :disabled="loading"
              type="submit"
              class="w-full bg-green-600 text-white border-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>

        <!-- Forgot Password Form -->
        <form v-else @submit.prevent="handleForgotPassword" class="space-y-4">
          <div>
            <input
              v-model="forgotPasswordEmail"
              type="email"
              placeholder="Enter your email address"
              required
              class="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div class="flex space-x-2">
            <InteractiveHoverButton
              text="Send Reset Email"
              type="submit"
              class="flex-1 bg-green-600 text-white border-green-600 hover:bg-green-700"
            />
            <InteractiveHoverButton
              text="Cancel"
              type="button"
              @click="
                showForgotPassword = false;
                forgotPasswordEmail = '';
              "
              class="flex-1 bg-gray-500 text-white border-gray-500 hover:bg-gray-600"
            />
          </div>
        </form>

        <!-- Divider -->
        <div v-if="!showForgotPassword" class="my-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>

        <!-- Google Login -->
        <div v-if="!showForgotPassword" class="mb-4">
          <InteractiveHoverButton
            text="Continue with Google"
            :disabled="loading"
            @click="handleGoogleLogin"
            class="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template #icon>
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </template>
          </InteractiveHoverButton>
        </div>

        <!-- Links -->
        <div v-if="!showForgotPassword" class="text-center space-y-2">
          <button
            @click="
              showForgotPassword = true;
              forgotPasswordEmail = email;
            "
            class="text-sm text-green-600 hover:underline"
          >
            Forgot your password?
          </button>
          <p class="text-gray-600">
            Don't have an account?
            <router-link to="/signup" class="text-green-600 hover:underline">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

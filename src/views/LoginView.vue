<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const email = ref("");
const password = ref("");
const loading = ref(false);

const handleLogin = async () => {
  console.log("Logging in with:", email.value, password.value);
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
      router.push("/");
    } else {
      toast.error(result.error || "Login failed");
    }
  } catch (error) {
    toast.error("An error occurred during login");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h1>

        <form @submit.prevent="handleLogin" class="space-y-4">
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

        <div class="text-center mt-4">
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

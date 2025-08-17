<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const validateForm = () => {
  if (
    !name.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password.value !== confirmPassword.value) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.value.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return false;
  }
  return true;
};

const handleSignup = async () => {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const result = await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    if (result.success) {
      toast.success("Account created successfully");
      router.push("/");
    } else {
      toast.error(result.error || "Registration failed");
    }
  } catch (error) {
    toast.error("An error occurred during registration");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h1>

        <form @submit.prevent="handleSignup" class="space-y-4">
          <div>
            <input
              v-model="name"
              type="text"
              placeholder="Name"
              required
              class="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
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
          <div>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              class="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div class="flex justify-center">
            <InteractiveHoverButton
              :text="loading ? 'Creating account...' : 'Create Account'"
              :disabled="loading"
              type="submit"
              class="w-full bg-green-600 text-white border-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

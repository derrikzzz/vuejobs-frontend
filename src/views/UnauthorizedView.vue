<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <svg
          class="mx-auto h-12 w-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="space-y-4">
            <button
              @click="goHome"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Go to Home
            </button>
            <button
              @click="goBack"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit", "cancel"]);

const formData = ref({
  title: "",
  priority: "upcoming",
  dueDate: new Date().toISOString().split("T")[0],
});

const handleSubmit = () => {
  if (formData.value.title.trim()) {
    emit("submit", { ...formData.value });
    // Reset form
    formData.value = {
      title: "",
      priority: "upcoming",
      dueDate: new Date().toISOString().split("T")[0],
    };
  }
};

const handleCancel = () => {
  emit("cancel");
};
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-900">Add New Action</h2>
      <button
        @click="handleCancel"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Action Title *
        </label>
        <input
          v-model="formData.title"
          type="text"
          id="title"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g., Apply to Frontend Developer position"
          required
        />
      </div>
    </form>
  </div>
</template>

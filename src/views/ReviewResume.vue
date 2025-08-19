<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import ResumeReviewComponent from "@/components/ResumeReviewComponent.vue";

const authStore = useAuthStore();
const router = useRouter();
const resumeReviewRef = ref(null);

// Component configuration
const title = "Resume Reviewer";
const description = "Get AI-powered feedback on your resume";

// Event handlers
const handleReviewComplete = (result) => {
  console.log("Review completed:", result);
  // You can add additional logic here, like saving to database
};

const handleReviewError = (error) => {
  console.error("Review failed:", error);
  // You can add additional error handling here
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ title }}</h1>
      <p class="text-gray-600">{{ description }}</p>
    </div>

    <ResumeReviewComponent
      :title="title"
      :description="description"
      @review-complete="handleReviewComplete"
      @review-error="handleReviewError"
      ref="resumeReviewRef"
    />
  </div>
</template>

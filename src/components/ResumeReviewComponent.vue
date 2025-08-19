<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import ResumeReviewer from "@/services/resumeReviewer";

// Props
const props = defineProps({
  title: {
    type: String,
    default: "Resume Reviewer",
  },
  description: {
    type: String,
    default: "Get AI-powered feedback on your resume",
  },
});

// Emits
const emit = defineEmits(["review-complete", "review-error"]);

// Reactive state
const resumeText = ref("");
const jobDescription = ref("");
const loading = ref(false);
const review = ref("");
const error = ref("");

const toast = useToast();

// Methods
const onSubmit = async () => {
  if (!resumeText.value.trim()) {
    toast.error("Please enter your resume text");
    return;
  }

  loading.value = true;
  error.value = "";
  review.value = "";

  try {
    const reviewer = new ResumeReviewer();
    const result = await reviewer.reviewResume({
      text: resumeText.value,
      jobDescription: jobDescription.value,
    });

    review.value = result;
    toast.success("Resume review completed!");
    emit("review-complete", result);
  } catch (err) {
    console.error("Review error:", err);
    error.value = "Failed to review resume. Please try again.";
    toast.error("Failed to review resume. Please try again.");
    emit("review-error", err);
  } finally {
    loading.value = false;
  }
};

// Expose methods for parent component
defineExpose({
  clearForm: () => {
    resumeText.value = "";
    jobDescription.value = "";
    review.value = "";
    error.value = "";
  },
  setResumeText: (text) => {
    resumeText.value = text;
  },
  setJobDescription: (description) => {
    jobDescription.value = description;
  },
});
</script>

<template>
  <div class="space-y-6">
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Resume Text *
        </label>
        <textarea
          v-model="resumeText"
          class="w-full border border-gray-300 rounded-lg p-4 min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Paste your resume text here..."
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Job Description (Optional)
        </label>
        <textarea
          v-model="jobDescription"
          class="w-full border border-gray-300 rounded-lg p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Paste the target job description here for tailored feedback..."
        />
      </div>

      <div class="flex justify-center">
        <button
          type="submit"
          :disabled="loading"
          class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="loading">Reviewing...</span>
          <span v-else>Review Resume</span>
        </button>
      </div>
    </form>

    <div v-if="review" class="mt-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Review Results</h2>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <pre
          class="whitespace-pre-wrap text-gray-800 font-mono text-sm leading-relaxed"
          >{{ review }}</pre
        >
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center space-x-2">
        <svg
          class="w-5 h-5 text-red-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class="text-red-800 font-medium">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

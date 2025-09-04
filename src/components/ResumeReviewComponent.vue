<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import ResumeReviewer from "@/services/resumeReviewer";
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";

// Create FilePond component
const FilePond = vueFilePond();

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
const uploadLoading = ref(false);
const filePondRef = ref(null);

const toast = useToast();

// FilePond event handlers
const handleFileAdd = (error, file) => {
  if (error) {
    console.error("File add error:", error);
    toast.error("Error adding file");
    return;
  }
  console.log("File added:", file.filename);
};

const handleFileProcess = async (error, file) => {
  if (error) {
    console.error("File process error:", error);
    toast.error("Error processing file");
    return;
  }

  uploadLoading.value = true;
  error.value = "";

  try {
    // Get the actual file from FilePond
    const actualFile = file.file;

    const reviewer = new ResumeReviewer();
    const extractedText = await reviewer.extractTextFromPDF(actualFile);
    resumeText.value = extractedText;
    toast.success("PDF uploaded and text extracted successfully!");
  } catch (err) {
    console.error("File processing error:", err);
    error.value = err.message || "Failed to process PDF file";
    toast.error(error.value);

    // Remove the file from FilePond on error
    if (filePondRef.value) {
      filePondRef.value.removeFile(file.id);
    }
  } finally {
    uploadLoading.value = false;
  }
};

const handleFileRemove = (error, file) => {
  if (error) {
    console.error("File remove error:", error);
    return;
  }

  // Clear the extracted text when file is removed
  resumeText.value = "";
  console.log("File removed:", file.filename);
};

// Clear resume text and FilePond
const clearResumeInput = () => {
  resumeText.value = "";
  if (filePondRef.value) {
    filePondRef.value.removeFiles();
  }
};

// Submit handler
const onSubmit = async () => {
  if (!resumeText.value.trim()) {
    toast.error("Please enter your resume text or upload a PDF");
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
    if (filePondRef.value) {
      filePondRef.value.removeFiles();
    }
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
      <!-- PDF Upload Section with FilePond -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Upload Resume (PDF)
        </label>

        <FilePond
          ref="filePondRef"
          name="resume"
          :label-idle="`Drag & Drop your PDF resume or <span class='filepond--label-action'>Browse</span>`"
          :accepted-file-types="['application/pdf']"
          :allow-multiple="false"
          :max-files="1"
          :max-file-size="'20MB'"
          :check-validity="true"
          :instant-upload="false"
          :allow-revert="true"
          :allow-remove="true"
          :credits="false"
          @addfile="handleFileAdd"
          @processfile="handleFileProcess"
          @removefile="handleFileRemove"
          :style-panel-layout="'compact'"
          :style-load-indicator-position="'center bottom'"
          :style-progress-indicator-position="'right bottom'"
          :style-button-remove-item-position="'left bottom'"
          :style-button-process-item-position="'right bottom'"
        />

        <!-- Upload Loading Indicator -->
        <div v-if="uploadLoading" class="mt-2 flex items-center justify-center">
          <div
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"
          ></div>
          <span class="text-sm text-gray-600">Processing PDF with AI...</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      <!-- Text Input Section -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">
            Resume Text *
          </label>
          <button
            type="button"
            @click="clearResumeInput"
            v-if="resumeText"
            class="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        </div>
        <textarea
          v-model="resumeText"
          class="w-full border border-gray-300 rounded-lg p-4 min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Paste your resume text here or upload a PDF above..."
          required
        />
      </div>

      <!-- Job Description -->
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
          :disabled="loading || uploadLoading"
          class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="loading">Reviewing...</span>
          <span v-else>Review Resume</span>
        </button>
      </div>
    </form>

    <!-- Review Results -->
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

<style>
/* Custom FilePond styling to match your design */
.filepond--root {
  font-family: inherit;
}

.filepond--panel-root {
  border-radius: 0.5rem;
  background-color: #f9fafb;
  border: 2px dashed #d1d5db;
  transition: border-color 0.15s ease-in-out;
}

.filepond--panel-root:hover {
  border-color: #9ca3af;
}

.filepond--drop-label {
  color: #374151;
}

.filepond--label-action {
  color: #2563eb;
  text-decoration: none;
}

.filepond--label-action:hover {
  color: #1d4ed8;
}

.filepond--item-panel {
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.filepond--file-action-button {
  border-radius: 0.25rem;
}

/* Progress indicator styling */
.filepond--file-status-main {
  color: #374151;
}

.filepond--file-status-sub {
  color: #6b7280;
}
</style>

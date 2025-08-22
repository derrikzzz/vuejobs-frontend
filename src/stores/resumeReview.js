import { defineStore } from "pinia";
import { ref } from "vue";

export const useResumeReviewStore = defineStore("resumeReview", () => {
  const resumeText = ref("");
  const jobDescription = ref("");
  const reviewResults = ref(null);
  const loading = ref(false);
  const error = ref("");

  const setResumeText = (text) => {
    resumeText.value = text;
  };

  const setJobDescription = (description) => {
    jobDescription.value = description;
  };

  const setReviewResults = (results) => {
    reviewResults.value = results;
  };

  const setLoading = (isLoading) => {
    loading.value = isLoading;
  };

  const setError = (errorMessage) => {
    error.value = errorMessage;
  };

  const clearForm = () => {
    resumeText.value = "";
    jobDescription.value = "";
    reviewResults.value = null;
    loading.value = false;
    error.value = "";
  };

  return {
    resumeText,
    jobDescription,
    reviewResults,
    loading,
    error,
    setResumeText,
    setJobDescription,
    setReviewResults,
    setLoading,
    setError,
    clearForm,
  };
});

<script setup>
import { reactive, defineProps, onMounted, ref } from "vue";
import JobListing from "@/components/JobListing.vue";
import SearchBar from "@/components/SearchBar.vue";
import { RouterLink } from "vue-router";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import apiService from "@/services/api.js";

defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
});

const state = reactive({
  jobs: [],
  isLoading: true,
});

// Add this for filtered jobs
const filteredJobs = ref([]);

onMounted(async () => {
  try {
    const data = await apiService.getJobs();
    state.jobs = data;
    filteredJobs.value = data; // Initialize filtered jobs
    state.isLoading = false;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  } finally {
    state.isLoading = false;
  }
});

// Add this function to handle search results
const handleSearchResults = (results) => {
  filteredJobs.value = results;
};
</script>

<template>
  <section className="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-blue-500 mb-6 text-center">
        Browse Jobs
      </h2>

      <!-- Add SearchBar here with jobs data -->
      <div class="mb-6">
        <SearchBar :jobs="state.jobs" @search-results="handleSearchResults" />
      </div>

      <!-- Loading Spinner while loading is true -->
      <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
        <PulseLoader color="#000" :size="10" :margin="2" />
      </div>

      <!-- Show job listing when done loading -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing
          v-for="job in filteredJobs.slice(0, limit || filteredJobs.length)"
          :key="job.id"
          :job="job"
        />
      </div>
    </div>
  </section>

  <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
    <RouterLink
      to="/jobs"
      class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
      >View All Jobs</RouterLink
    >
  </section>
</template>

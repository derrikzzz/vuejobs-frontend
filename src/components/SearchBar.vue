<script setup>
import { ref, computed, watch, defineProps } from "vue";

const props = defineProps({
  jobs: {
    type: Array,
    required: true,
  },
});

//emit search event when search term changes
const emit = defineEmits(["search"]);

const searchTerm = ref("");
const searchTimeout = ref(null);
const debouncedSearch = ref("");

watch(searchTerm, (newVal) => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    debouncedSearch.value = newVal;
  }, 300);
});

//need computed property that react to changes in debouncedSearch
const filteredJobs = computed(() => {
  if (!debouncedSearch.value.trim()) {
    //return all jobs if no search term
    return props.jobs;
  }

  const searchLower = debouncedSearch.value.toLowerCase();

  return props.jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.type.toLowerCase().includes(searchLower)
    );
  });
});

// Emit filtered results whenever they change, emitting event to parent component
watch(
  filteredJobs,
  (newResults) => {
    emit("search-results", newResults);
  },
  { immediate: true }
);

const clearSearch = () => {
  searchTerm.value = "";
  debouncedSearch.value = "";
};
</script>

<template>
  <div class="search-container mb-6">
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <div class="relative flex-1">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search jobs by title, company, location..."
          class="w-full p-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          v-if="searchTerm"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search results count -->
    <div v-if="searchTerm" class="mt-2 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
      Found {{ filteredJobs.length }} job{{ filteredJobs.length !== 1 ? "s" : "" }}
      <span v-if="searchTerm"> for "{{ searchTerm }}"</span>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  max-width: 100%;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .search-container {
    max-width: 600px;
  }
}
</style>

<script setup>
import { ref, computed, watch, defineProps, nextTick } from "vue";

const H_BASE = 48; // Tailwind h-12
const H_MAX = 320; // Tailwind h-80
const CHARS_PER_LINE = 60;
const CHAR_HEIGHT = 24;

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
const textareaRef = ref(null); //hold a reference to a real DOM element like <textarea>
const isExpanded = ref(false);

//only update when searchTerm updates
const characterCount = computed(() => {
  return searchTerm.value.length;
});

const shouldExpand = computed(() => {
  return searchTerm.value.length > 60;
});

// Dynamic height calculation
const searchBarHeight = computed(() => {
  if (!shouldExpand.value) return "48px"; // Always return a fixed height

  // Calculate height based on content length
  const baseHeight = H_BASE; // Base height in pixels
  const charHeight = CHAR_HEIGHT; // Height per line
  const charsPerLine = CHARS_PER_LINE; // Approximate characters per line
  const maxHeight = H_MAX; // Maximum height in pixels

  const lines = Math.ceil(searchTerm.value.length / charsPerLine);
  const expandedHeight = Math.max(baseHeight, lines * charHeight);

  return `${expandedHeight}px`;
});

//automatically adjust a <textarea> height based on content length
const autoResize = async () => {
  //only proceed if expansion is requested and element exists
  if (shouldExpand.value && textareaRef.value) {
    //waiting here guarantees that any reactive changes have already been applied to the DOM before measurement
    await nextTick();

    // Reset height to auto to get the correct scrollHeight, cleans any previous fixed heights
    textareaRef.value.style.height = "auto";

    // Get the natural height needed, scrollHeight = content's full height (include padding, not borders)
    const scrollHeight = textareaRef.value.scrollHeight;
    const minHeight = H_BASE; // Minimum height

    // Set the new height
    const newHeight = Math.max(minHeight, scrollHeight);
    textareaRef.value.style.height = `${newHeight}px`;

    // Update the expanded state
    isExpanded.value = newHeight > minHeight;
  }
};

// Watch for changes in search term to trigger resize
watch(
  searchTerm,
  async () => {
    await autoResize();
  },
  { immediate: false }
);

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
  // Reset height when clearing
  if (textareaRef.value) {
    textareaRef.value.style.height = "48px";
  }
  isExpanded.value = false;
};
</script>

<template>
  <div class="search-container mb-6">
    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <textarea
          ref="textareaRef"
          v-model="searchTerm"
          placeholder="Search jobs by title, company, location, or keywords..."
          class="w-full p-3 pl-10 pr-20 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none overflow-hidden transition-all duration-300 ease-in-out"
          :style="{ height: searchBarHeight }"
          rows="1"
          @input="autoResize"
        />
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <span class="text-gray-400 text-sm px-8">
            {{ characterCount > 100 ? "100+" : characterCount + " / 100" }}
          </span>
          <button
            v-if="searchTerm"
            @click="clearSearch"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              class="h-5 w-5 text-gray-400 hover:text-gray-600"
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
      </div>
    </div>

    <!-- Search results count -->
    <div v-if="searchTerm" class="mt-2 text-sm text-gray-600">
      <span>
        <span class="break-words whitespace-normal block">
          Found {{ filteredJobs.length }} job{{
            filteredJobs.length !== 1 ? "s" : ""
          }}
          <span v-if="searchTerm"> for "{{ searchTerm }}"</span>
        </span>
      </span>
    </div>
  </div>
</template>

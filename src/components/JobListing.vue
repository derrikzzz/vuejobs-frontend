<script setup>
import { defineProps, ref, computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  job: {
    type: Object,
  },
});

const showFullDescription = ref(false);

const truncatedDescription = computed(() => {
  let description = props.job.description;
  if (!showFullDescription.value) {
    return description.substring(0, 90) + "...";
  }
  return description;
});

const toggleFullDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative h-full flex flex-col">
    <div class="p-4 flex-1 flex flex-col">
      <div class="mb-4">
        <div class="text-gray-600 text-sm mb-1">{{ job.type }}</div>
        <h3 class="text-lg font-bold text-gray-800 line-clamp-2">
          {{ job.title }}
        </h3>
      </div>

      <div class="flex-1 mb-4">
        <div class="text-gray-600 text-sm leading-relaxed min-h-[60px]">
          {{ truncatedDescription }}
        </div>
        <button
          @click="toggleFullDescription"
          class="text-green-500 hover:text-green-600 cursor-pointer text-sm mt-2"
        >
          {{ showFullDescription ? "Read Less" : "Read More" }}
        </button>
      </div>

      <div class="mt-auto">
        <h3 class="text-green-500 font-semibold mb-3">{{ job.salary }}</h3>

        <div class="border border-gray-100 mb-4"></div>

        <div
          class="flex flex-col lg:flex-row justify-between items-start gap-3"
        >
          <div class="text-orange-700 text-sm flex items-center">
            <i class="pi pi-map-marker text-orange-700 mr-1"></i>
            <span class="line-clamp-1">{{ job.location }}</span>
          </div>
          <RouterLink
            :to="`/jobs/${job.id}`"
            class="h-[36px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center text-sm whitespace-nowrap flex-shrink-0"
          >
            Read More
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

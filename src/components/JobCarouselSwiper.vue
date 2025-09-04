<script setup>
import { reactive, onMounted, ref, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import JobListing from "@/components/JobListing.vue";
import { RouterLink } from "vue-router";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const props = defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
  autoPlay: {
    type: Boolean,
    default: true,
  },
  autoPlayInterval: {
    type: Number,
    default: 3000,
  },
});

const state = reactive({
  jobs: [],
  isLoading: true,
});

const swiperRef = ref(null);

onMounted(async () => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";
    const response = await fetch(`${BASE_URL}/api/v1/jobs/`);
    const data = await response.json();
    state.jobs = data;
    state.isLoading = false;

    // Ensure autoplay starts after data is loaded
    if (props.autoPlay && swiperRef.value) {
      setTimeout(() => {
        swiperRef.value?.autoplay?.start();
      }, 100);
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
  } finally {
    state.isLoading = false;
  }
});

// Watch for swiper reference and start autoplay
watch(swiperRef, (newSwiper) => {
  if (newSwiper && props.autoPlay) {
    setTimeout(() => {
      newSwiper.autoplay?.start();
    }, 100);
  }
});
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-blue-500 mb-2">Browse Jobs</h2>
        <div
          v-if="autoPlay"
          class="flex items-center justify-center space-x-2 text-sm text-gray-600"
        >
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <!-- Loading Spinner while loading is true -->
      <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
        <PulseLoader color="#000" :size="10" :margin="2" />
      </div>

      <!-- Swiper Carousel when done loading -->
      <div v-else class="relative">
        <Swiper
          :modules="[Autoplay, Navigation, Pagination]"
          :slides-per-view="1"
          :space-between="24"
          :loop="true"
          :autoplay="{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            stopOnLastSlide: false,
          }"
          :speed="800"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
          :pagination="{
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          }"
          :breakpoints="{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }"
          @swiper="swiperRef = $event"
          @autoplayStart="console.log('Autoplay started')"
          @autoplayStop="console.log('Autoplay stopped')"
          class="job-swiper"
        >
          <SwiperSlide
            v-for="job in state.jobs.slice(0, limit || state.jobs.length)"
            :key="job.id"
            class="pb-8 h-auto"
          >
            <div class="h-full">
              <JobListing :job="job" />
            </div>
          </SwiperSlide>
        </Swiper>

        <!-- Custom Navigation -->
        <div
          class="swiper-button-prev !text-blue-500 !bg-white/80 !w-10 !h-10 !rounded-full !shadow-lg hover:!bg-white transition-all duration-200"
        ></div>
        <div
          class="swiper-button-next !text-blue-500 !bg-white/80 !w-10 !h-10 !rounded-full !shadow-lg hover:!bg-white transition-all duration-200"
        ></div>

        <!-- Custom Pagination -->
        <div class="swiper-pagination !bottom-0"></div>
      </div>
    </div>
  </section>

  <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
    <RouterLink
      to="/jobs"
      class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700 transition-colors duration-200"
    >
      View All Jobs
    </RouterLink>
  </section>
</template>

<style scoped>
/* Custom Swiper Styles */
.job-swiper {
  padding-bottom: 40px; /* Space for pagination */
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  width: 40px !important;
  height: 40px !important;
  margin-top: -20px !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
  border-radius: 50% !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease !important;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background-color: white !important;
  transform: scale(1.1) !important;
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 16px !important;
  font-weight: bold !important;
}

:deep(.swiper-pagination-bullet) {
  background-color: #3b82f6 !important;
  opacity: 0.5 !important;
  transition: all 0.2s ease !important;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1 !important;
  transform: scale(1.2) !important;
}

/* Smooth transitions for slides */
:deep(.swiper-slide) {
  transition: transform 0.3s ease;
  height: auto;
  display: flex;
}

:deep(.swiper-slide:hover) {
  transform: translateY(-4px);
}

/* Ensure consistent card heights */
:deep(.swiper-slide > div) {
  height: 100%;
  width: 100%;
}
</style>

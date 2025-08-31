<script setup>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { reactive, onMounted } from "vue";
import BackButton from "@/components/BackButton.vue";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const jobId = route.params.id;

const state = reactive({
  job: {},
  isLoading: true,
});

onMounted(async () => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`);
    const data = await response.json();
    state.job = data;
    state.isLoading = false;
  } catch (error) {
    console.error("Error fetching job:", error);
  } finally {
    state.isLoading = false;
  }
});

const deleteJob = async () => {
  try {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (confirm) {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete job");
      }
    }

    toast.success("Job deleted successfully");
    router.push("/jobs");
  } catch (error) {
    console.error("Error deleting job:", error);
    toast.error("Error deleting job");
  }
};
</script>

<template>
  <BackButton />
  <section v-if="!state.isLoading" class="bg-green-50 min-h-screen">
    <div class="container m-auto py-6 sm:py-10 px-4 sm:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-70/30 w-full gap-6">
        <main class="order-2 lg:order-1">
          <div
            class="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center sm:text-left"
          >
            <div class="text-gray-500 mb-4 text-sm sm:text-base">
              {{ state.job.type }}
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              {{ state.job.title }}
            </h1>
            <div
              class="text-gray-500 mb-4 flex align-middle justify-center sm:justify-start"
            >
              <i
                class="pi pi-map-marker text-lg sm:text-xl text-orange-700 mr-2"
              ></i>
              <p class="text-orange-700 text-sm sm:text-base">
                {{ state.job.location }}
              </p>
            </div>
          </div>

          <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6">
            <h3
              class="text-green-800 text-lg sm:text-xl font-bold mb-4 sm:mb-6"
            >
              Job Description
            </h3>
            <p class="mb-4 text-sm sm:text-base leading-relaxed">
              {{ state.job.description }}
            </p>
            <h3 class="text-green-800 text-lg sm:text-xl font-bold mb-2">
              Salary
            </h3>
            <p class="mb-4 text-sm sm:text-base font-semibold text-green-600">
              {{ state.job.salary }}
            </p>
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="order-1 lg:order-2">
          <!-- Company Info -->
          <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
              Company Info
            </h3>
            <h2 class="text-xl sm:text-2xl font-bold mb-2">
              {{ state.job.company?.name }}
            </h2>
            <p class="my-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              {{ state.job.company?.description }}
            </p>

            <hr class="my-4" />

            <div class="space-y-3">
              <div>
                <h4 class="text-base sm:text-lg font-semibold mb-1">
                  Contact Email:
                </h4>
                <p
                  class="bg-green-100 p-2 sm:p-3 font-bold text-sm sm:text-base rounded-md break-all"
                >
                  {{ state.job.company?.contactEmail }}
                </p>
              </div>

              <div v-if="state.job.company?.contactPhone">
                <h4 class="text-base sm:text-lg font-semibold mb-1">
                  Contact Phone:
                </h4>
                <p
                  class="bg-green-100 p-2 sm:p-3 font-bold text-sm sm:text-base rounded-md"
                >
                  {{ state.job.company?.contactPhone }}
                </p>
              </div>
            </div>
          </div>

          <!-- Manage -->
          <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
              Manage Job
            </h3>
            <div class="space-y-3">
              <RouterLink
                :to="`/jobs/edit/${state.job.id}`"
                class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-3 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline block transition-colors duration-200"
              >
                Edit Job
              </RouterLink>
              <button
                @click="deleteJob"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                Delete Job
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <div
    v-else
    class="text-center text-gray-500 py-6 min-h-screen flex items-center justify-center"
  >
    <PulseLoader color="#000" :size="10" :margin="2" />
  </div>
</template>

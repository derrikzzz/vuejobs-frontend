<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import Card from "@/components/ui/Card.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardTitle from "@/components/ui/CardTitle.vue";
import CardContent from "@/components/ui/CardContent.vue";

const props = defineProps({
  contributions: {
    type: Array,
    default: () => [],
  },
});

const state = reactive({
  contributions: props.contributions,
});

const isMobile = ref(false);

// Check screen size
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

// Generate last 365 days (or fewer for mobile)
const days = computed(() => {
  const result = [];
  const today = new Date();
  const daysToShow = isMobile.value ? 90 : 365; // Show only 3 months on mobile

  for (let i = daysToShow; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateString = date.toISOString().split("T")[0];
    const contribution = state.contributions.find((c) => c.date === dateString);
    result.push({
      date: dateString,
      count: contribution ? contribution.count : 0,
    });
  }
  return result;
});

// Generate months for header
const months = computed(() => {
  const result = [];
  const today = new Date();
  const monthsToShow = isMobile.value ? 3 : 12;

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    result.push({
      name: date.toLocaleString("default", { month: "short" }),
      days: days.value.filter(
        (d) => new Date(d.date).getMonth() === date.getMonth()
      ).length,
    });
  }
  return result;
});

//generate last 365 days
const totalContributions = computed(() => {
  return days.value.reduce((sum, day) => sum + day.count, 0);
});

//get contribution class
const getContributionClass = (count) => {
  if (count === 0) return "bg-gray-100";
  if (count <= 2) return "bg-green-100";
  if (count <= 4) return "bg-green-200";
  if (count <= 6) return "bg-green-400";
  return "bg-green-600";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const generateRandomContributions = () => {
  const contributions = [];
  const today = new Date();
  const daysToGenerate = isMobile.value ? 90 : 365;

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    if (Math.random() > 0.3) {
      contributions.push({
        date: dateString,
        count: Math.floor(Math.random() * 10) + 1,
      });
    }
  }

  state.contributions = contributions;
};

onMounted(() => {
  generateRandomContributions();
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <Card class="w-full overflow-hidden">
      <CardHeader>
        <CardTitle class="text-xl font-semibold">
          Job Application Streak
        </CardTitle>
        <p class="text-sm text-gray-600">
          {{ totalContributions }} applications in the last
          {{ isMobile ? 90 : 365 }} days
        </p>
      </CardHeader>
      <CardContent>
        <!-- Month labels -->
        <div class="mb-2 overflow-x-auto">
          <div class="flex gap-1 min-w-max">
            <div
              v-for="month in months"
              :key="month.name"
              class="text-xs text-gray-500 flex-shrink-0"
              :style="{ width: `${month.days * 12}px` }"
            >
              {{ month.name }}
            </div>
          </div>
        </div>

        <!-- Heatmap grid -->
        <div class="overflow-x-auto">
          <div
            class="grid gap-1 min-w-max"
            :class="isMobile ? 'grid-cols-13' : 'grid-cols-53'"
          >
            <div
              v-for="day in days"
              :key="day.date"
              :class="getContributionClass(day.count)"
              class="w-3 h-3 rounded-sm border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
              :title="`${day.count} applications on ${formatDate(day.date)}`"
            ></div>
          </div>
        </div>

        <!-- Legend -->
        <div
          class="mt-4 flex items-center justify-between text-sm text-gray-600"
        >
          <span>Less</span>
          <div class="flex gap-1">
            <div
              class="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200"
            ></div>
            <div
              class="w-3 h-3 rounded-sm bg-green-100 border border-gray-200"
            ></div>
            <div
              class="w-3 h-3 rounded-sm bg-green-200 border border-gray-200"
            ></div>
            <div
              class="w-3 h-3 rounded-sm bg-green-400 border border-gray-200"
            ></div>
            <div
              class="w-3 h-3 rounded-sm bg-green-600 border border-gray-200"
            ></div>
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
.grid-cols-53 {
  grid-template-columns: repeat(53, 1fr);
}

.grid-cols-13 {
  grid-template-columns: repeat(13, 1fr);
}
</style>

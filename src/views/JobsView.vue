<script setup>
import JobListings from "@/components/JobListings.vue";
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">All Jobs</h1>
    <div class="mb-6">
      <JobStreakHeatmap :contributions="contributions" />
    </div>
    <JobListings />
  </div>
</template>

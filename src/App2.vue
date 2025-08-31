<script setup>
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router";
import { WarpBackground } from "@/components/ui/warp-background";
import JobStreakHeatmap from "@/components/JobStreakHeatmap.vue";
</script>

<template>
  <Navbar />
  <RouterView />
</template>

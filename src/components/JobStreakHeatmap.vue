<script setup>
import { computed } from "vue";

const props = defineProps({
  contributions: {
    type: Array,
    required: true,
  },
});

//props: contributions: [{ date: '2025-01-01', count: 1 }, { date: '2025-01-02', count: 2 }] e.g
const contributionMap = computed(() => {
  const map = {};
  for (const contribuution of props.contributions) {
    map[contribution.date] = contribution.count;
  }
  return map;
});

//build
</script>

<template></template>

<script setup>
import Hero from "@/components/Hero.vue";
import HomeCards from "@/components/HomeCards.vue";
import JobCarouselSwiper from "@/components/JobCarouselSwiper.vue";
</script>

<template>
  <Hero
    title="Step into the Future of Work"
    subtitle="Work in progress of a job board, experimenting using Vue."
  />
  <HomeCards />
  <JobCarouselSwiper
    :limit="6"
    :showButton="true"
    :autoPlay="true"
    :autoPlayInterval="3000"
  />
</template>

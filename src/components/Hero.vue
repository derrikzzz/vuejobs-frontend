<script setup>
import { defineProps } from "vue";
import { WarpBackground } from "@/components/ui/warp-background";
defineProps({
  title: {
    type: String,
    default: "Become a Vue Dev",
  },
  subtitle: {
    type: String,
    default: "Find the Vue job that fits your skills and needs",
  },
});
</script>

<template>
  <section class="bg-green-700 py-20 mb-4 relative overflow-hidden">
    <WarpBackground 
      :perspective="1200" 
      :beam-size="12" 
      :beams-per-side="5"
      :beam-duration="5"
      :beam-delay-max="6"
      grid-color="rgba(255,255,255,0.15)"
      glow-color="hsl(142, 76%, 60%)"
      class="absolute inset-0"
    />
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10"
    >
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-lg">
          {{ title }}
        </h1>
        <p class="my-4 text-xl text-white drop-shadow-md">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </section>
</template>

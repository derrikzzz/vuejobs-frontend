<template>
  <Motion
    :style="{
      '--x': `${props.x}`,
      '--width': `${props.width}`,
      '--aspect-ratio': `${ar}`,
      '--background': `linear-gradient(${props.glowColor}, transparent)`,
      '--glow': `0 0 20px ${props.glowColor}`,
    }"
    class="absolute left-[var(--x)] top-0 [aspect-ratio:1/var(--aspect-ratio)] [background:var(--background)] [width:var(--width)] [box-shadow:var(--glow)]"
    :initial="{
      x: '-50%',
      y: '100cqmax',
      opacity: 0,
    }"
    :animate="{
      x: '-50%',
      y: '-100%',
      opacity: [0, 1, 1, 0],
    }"
    :transition="{
      duration: props.duration,
      delay: props.delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }"
  ></Motion>
</template>

<script setup>
import { Motion } from "motion-v";
import { computed } from "vue";

const props = defineProps({
  width: { type: [String, Number], required: true },
  x: { type: [String, Number], required: true },
  delay: { type: Number, required: true },
  duration: { type: Number, required: true },
  glowColor: { type: String, required: false, default: "hsl(142, 76%, 36%)" },
});

const ar = computed(() => Math.floor(Math.random() * 8) + 2);
</script>

<style></style>

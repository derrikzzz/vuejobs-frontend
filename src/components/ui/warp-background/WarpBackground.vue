<template>
  <div :class="cn('relative rounded border md:p-20', props.class)">
    <div
      :style="{
        '--perspective': `${props.perspective}px`,
        '--grid-color': props.gridColor,
        '--beam-size': `${props.beamSize}%`,
        '--glow-color': props.glowColor,
      }"
      class="pointer-events-none absolute left-0 top-0 size-full overflow-hidden [clip-path:inset(0)] [container-type:size] [perspective:var(--perspective)] [transform-style:preserve-3d]"
    >
      <!-- Animated Background Gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-green-600/20 via-green-700/30 to-green-800/20 animate-pulse"></div>
      
      <!-- Floating Particles -->
      <div class="absolute inset-0">
        <div
          v-for="i in 20"
          :key="i"
          class="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }"
        ></div>
      </div>

      <!-- TOP -->
      <div
        class="absolute [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:50%_0%] [transform-style:preserve-3d] [transform:rotateX(-90deg)] [width:100cqi]"
      >
        <Beam
          v-for="(beam, index) in topBeams"
          :key="`top-${index}`"
          :width="`${props.beamSize}%`"
          :x="`${beam.x * props.beamSize}%`"
          :delay="beam.delay"
          :duration="beamDuration"
          :glow-color="props.glowColor"
        />
      </div>
      <!-- BOTTOM -->
      <div
        class="absolute top-full [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:50%_0%] [transform-style:preserve-3d] [transform:rotateX(-90deg)] [width:100cqi]"
      >
        <Beam
          v-for="(beam, index) in bottomBeams"
          :key="`bottom-${index}`"
          :width="`${props.beamSize}%`"
          :x="`${beam.x * props.beamSize}%`"
          :delay="beam.delay"
          :duration="beamDuration"
          :glow-color="props.glowColor"
        />
      </div>
      <!-- LEFT -->
      <div
        class="absolute left-0 top-0 [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:0%_0%] [transform-style:preserve-3d] [transform:rotate(90deg)_rotateX(-90deg)] [width:100cqh]"
      >
        <Beam
          v-for="(beam, index) in leftBeams"
          :key="`left-${index}`"
          :width="`${props.beamSize}%`"
          :x="`${beam.x * props.beamSize}%`"
          :delay="beam.delay"
          :duration="beamDuration"
          :glow-color="props.glowColor"
        />
      </div>
      <!-- RIGHT -->
      <div
        class="absolute right-0 top-0 [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:100%_0%] [transform-style:preserve-3d] [transform:rotate(-90deg)_rotateX(-90deg)] [width:100cqh]"
      >
        <Beam
          v-for="(beam, index) in rightBeams"
          :key="`right-${index}`"
          :width="`${props.beamSize}%`"
          :x="`${beam.x * props.beamSize}%`"
          :delay="beam.delay"
          :duration="beamDuration"
          :glow-color="props.glowColor"
        />
      </div>

      <!-- Glow Effect -->
      <div class="absolute inset-0 bg-gradient-radial from-green-400/10 via-transparent to-transparent animate-pulse"></div>
    </div>

    <div class="relative">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { cn } from "@/lib/utils";
import Beam from "./Beam.vue";
import { computed } from "vue";

const props = defineProps({
  perspective: { type: Number, required: false, default: 100 },
  beamsPerSide: { type: Number, required: false, default: 4 },
  beamSize: { type: Number, required: false, default: 8 },
  beamDelayMax: { type: Number, required: false, default: 4 },
  beamDelayMin: { type: Number, required: false, default: 0 },
  beamDuration: { type: Number, required: false, default: 4 },
  gridColor: { type: String, required: false, default: "rgba(255,255,255,0.1)" },
  glowColor: { type: String, required: false, default: "hsl(142, 76%, 36%)" },
  class: { type: String, required: false },
});

const beamDuration = computed(() => props.beamDuration);
const beamDelayMax = computed(() => props.beamDelayMax);
const beamDelayMin = computed(() => props.beamDelayMin);

function generateBeams() {
  const beams = [];
  const cellsPerSide = Math.floor(100 / props.beamSize);
  const step = cellsPerSide / props.beamsPerSide;

  for (let i = 0; i < props.beamsPerSide; i++) {
    const x = Math.floor(i * step);
    const delay =
      Math.random() * (beamDelayMax.value - beamDelayMin.value) +
      beamDelayMin.value;
    beams.push({ x, delay });
  }
  return beams;
}

// generateBeams
const topBeams = generateBeams();
const bottomBeams = generateBeams();
const leftBeams = generateBeams();
const rightBeams = generateBeams();
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.8;
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 4s ease-in-out infinite;
}
</style>

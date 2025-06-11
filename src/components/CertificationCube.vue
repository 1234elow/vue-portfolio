<template>
  <div class="certification-cube-container flex justify-center items-center h-64 sm:h-80 md:h-96 my-8 sm:my-12" style="perspective: 1000px;">
    <div class="cube relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 transition-all duration-300 hover:scale-110" style="transform-style: preserve-3d; animation: rotateCube 20s linear infinite;">
      <!-- Cube faces -->
      <div v-for="(face, index) in faces" :key="index" 
           class="face absolute w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br from-dark-gray/80 to-black/60 border border-primary-green/20 hover:border-primary-green rounded-lg flex flex-col justify-center items-center text-center transition-all duration-300 shadow-lg"
           :style="{ transform: face.transform }">
        <a href="#" class="flex flex-col items-center gap-4 p-4 w-full h-full justify-center text-light-gray hover:text-primary-green transition-colors duration-300">
          <i :class="face.icon" class="text-4xl"></i>
          <span class="text-sm font-semibold leading-tight">{{ face.title }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const faces = ref([
  {
    icon: 'fas fa-robot',
    title: 'Machine Learning',
    transform: 'rotateY(0deg) translateZ(96px)'
  },
  {
    icon: 'fas fa-language',
    title: 'HSK Level 4 Mandarin',
    transform: 'rotateY(180deg) translateZ(96px)'
  },
  {
    icon: 'fas fa-graduation-cap',
    title: 'BSc Software Engineering',
    transform: 'rotateY(90deg) translateZ(96px)'
  },
  {
    icon: 'fas fa-music',
    title: 'Grade 5 Clarinet',
    transform: 'rotateY(-90deg) translateZ(96px)'
  },
  {
    icon: 'fas fa-university',
    title: 'UWI Graduate',
    transform: 'rotateX(90deg) translateZ(96px)'
  },
  {
    icon: 'fas fa-award',
    title: '4-Year Scholarship',
    transform: 'rotateX(-90deg) translateZ(96px)'
  }
])
</script>

<style scoped>
.certification-cube-container {
  perspective: 1000px;
}

.cube {
  transform-style: preserve-3d;
  animation: rotateCube 20s linear infinite;
}

.face {
  backface-visibility: hidden;
}

@keyframes rotateCube {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  16.66% { transform: rotateX(0deg) rotateY(-90deg); }
  33.33% { transform: rotateX(0deg) rotateY(-180deg); }
  50% { transform: rotateX(0deg) rotateY(-270deg); }
  66.66% { transform: rotateX(-90deg) rotateY(-270deg); }
  83.33% { transform: rotateX(90deg) rotateY(-270deg); }
  100% { transform: rotateX(0deg) rotateY(-360deg); }
}

.cube:hover {
  animation-play-state: paused;
}

/* Responsive cube face transforms */
@media (max-width: 640px) {
  .face:nth-child(1) { transform: rotateY(0deg) translateZ(64px) !important; }
  .face:nth-child(2) { transform: rotateY(180deg) translateZ(64px) !important; }
  .face:nth-child(3) { transform: rotateY(90deg) translateZ(64px) !important; }
  .face:nth-child(4) { transform: rotateY(-90deg) translateZ(64px) !important; }
  .face:nth-child(5) { transform: rotateX(90deg) translateZ(64px) !important; }
  .face:nth-child(6) { transform: rotateX(-90deg) translateZ(64px) !important; }
}

@media (min-width: 641px) and (max-width: 768px) {
  .face:nth-child(1) { transform: rotateY(0deg) translateZ(80px) !important; }
  .face:nth-child(2) { transform: rotateY(180deg) translateZ(80px) !important; }
  .face:nth-child(3) { transform: rotateY(90deg) translateZ(80px) !important; }
  .face:nth-child(4) { transform: rotateY(-90deg) translateZ(80px) !important; }
  .face:nth-child(5) { transform: rotateX(90deg) translateZ(80px) !important; }
  .face:nth-child(6) { transform: rotateX(-90deg) translateZ(80px) !important; }
}
</style>
<template>
  <div class="certification-cube-container flex justify-center items-center h-64 sm:h-80 md:h-96 my-8 sm:my-12" style="perspective: 1000px;">
    <div 
      ref="cubeRef"
      class="cube relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 transition-all duration-300 hover:scale-110 cursor-grab active:cursor-grabbing" 
      :style="{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${userRotationX + autoRotationY}deg) rotateY(${userRotationY + autoRotationX}deg)`,
        animation: isUserInteracting ? 'none' : 'rotateCube 20s linear infinite'
      }"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
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
import { ref, onMounted, onUnmounted } from 'vue'

const cubeRef = ref(null)
const isDragging = ref(false)
const isUserInteracting = ref(false)
const userRotationX = ref(0)
const userRotationY = ref(0)
const autoRotationX = ref(0)
const autoRotationY = ref(0)
const lastMouseX = ref(0)
const lastMouseY = ref(0)
let animationId = null

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

// Mouse drag handlers
const handleMouseDown = (event) => {
  isDragging.value = true
  isUserInteracting.value = true
  lastMouseX.value = event.clientX
  lastMouseY.value = event.clientY
  event.preventDefault()
}

const handleMouseMove = (event) => {
  if (!isDragging.value) return
  
  const deltaX = event.clientX - lastMouseX.value
  const deltaY = event.clientY - lastMouseY.value
  
  userRotationY.value += deltaX * 0.5
  userRotationX.value -= deltaY * 0.5
  
  lastMouseX.value = event.clientX
  lastMouseY.value = event.clientY
}

const handleMouseUp = () => {
  isDragging.value = false
  setTimeout(() => {
    isUserInteracting.value = false
  }, 2000) // Resume auto rotation after 2 seconds
}

// Touch handlers for mobile
const handleTouchStart = (event) => {
  if (event.touches.length === 1) {
    isDragging.value = true
    isUserInteracting.value = true
    const touch = event.touches[0]
    lastMouseX.value = touch.clientX
    lastMouseY.value = touch.clientY
    event.preventDefault()
  }
}

const handleTouchMove = (event) => {
  if (!isDragging.value || event.touches.length !== 1) return
  
  const touch = event.touches[0]
  const deltaX = touch.clientX - lastMouseX.value
  const deltaY = touch.clientY - lastMouseY.value
  
  userRotationY.value += deltaX * 0.5
  userRotationX.value -= deltaY * 0.5
  
  lastMouseX.value = touch.clientX
  lastMouseY.value = touch.clientY
  event.preventDefault()
}

const handleTouchEnd = () => {
  isDragging.value = false
  setTimeout(() => {
    isUserInteracting.value = false
  }, 2000) // Resume auto rotation after 2 seconds
}

// Auto rotation animation
const updateAutoRotation = () => {
  if (!isUserInteracting.value) {
    autoRotationX.value += 0.03
    autoRotationY.value += 0.03
  }
  animationId = requestAnimationFrame(updateAutoRotation)
}

onMounted(() => {
  updateAutoRotation()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.certification-cube-container {
  perspective: 1000px;
}

.cube {
  transform-style: preserve-3d;
  user-select: none;
}

.face {
  backface-visibility: hidden;
  pointer-events: none;
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
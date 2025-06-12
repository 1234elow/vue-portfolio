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
const velocityX = ref(0)
const velocityY = ref(0)
const isSpinning = ref(false)
let animationId = null
let interactionTimeout = null
let lastMoveTime = 0
let dragHistory = []

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

// Clear any existing timeout
const clearInteractionTimeout = () => {
  if (interactionTimeout) {
    clearTimeout(interactionTimeout)
    interactionTimeout = null
  }
}

// Set interaction end with timeout
const setInteractionEnd = () => {
  clearInteractionTimeout()
  interactionTimeout = setTimeout(() => {
    isUserInteracting.value = false
  }, 5000) // Resume auto rotation after 5 seconds
}

// Mouse drag handlers
const handleMouseDown = (event) => {
  isDragging.value = true
  isUserInteracting.value = true
  lastMouseX.value = event.clientX
  lastMouseY.value = event.clientY
  clearInteractionTimeout()
  event.preventDefault()
  
  // Add global mouse listeners
  document.addEventListener('mousemove', handleGlobalMouseMove)
  document.addEventListener('mouseup', handleGlobalMouseUp)
}

const handleMouseMove = (event) => {
  // This is for the cube element only - global handler takes care of dragging
}

const calculateVelocity = () => {
  const now = Date.now()
  if (dragHistory.length < 2) return
  
  // Use last few positions to calculate velocity
  const recent = dragHistory.slice(-3)
  let totalVelX = 0
  let totalVelY = 0
  
  for (let i = 1; i < recent.length; i++) {
    const dt = recent[i].time - recent[i-1].time
    if (dt > 0) {
      totalVelX += (recent[i].deltaX / dt) * 16 // Convert to per-frame
      totalVelY += (recent[i].deltaY / dt) * 16
    }
  }
  
  velocityX.value = totalVelX / (recent.length - 1)
  velocityY.value = totalVelY / (recent.length - 1)
}

const handleGlobalMouseMove = (event) => {
  if (!isDragging.value) return
  
  const now = Date.now()
  const deltaX = event.clientX - lastMouseX.value
  const deltaY = event.clientY - lastMouseY.value
  
  // Apply rotation with enhanced sensitivity for ragdoll feel
  const sensitivity = 1.2
  userRotationY.value += deltaX * sensitivity
  userRotationX.value -= deltaY * sensitivity
  
  // Track drag history for velocity calculation
  dragHistory.push({
    deltaX: deltaX * sensitivity,
    deltaY: -deltaY * sensitivity,
    time: now
  })
  
  // Keep only recent history
  if (dragHistory.length > 10) {
    dragHistory.shift()
  }
  
  lastMouseX.value = event.clientX
  lastMouseY.value = event.clientY
  lastMoveTime = now
}

const handleMouseUp = () => {
  // This is for the cube element only - global handler takes care of mouse up
}

const handleGlobalMouseUp = () => {
  isDragging.value = false
  
  // Calculate final velocity for momentum
  calculateVelocity()
  
  // Check if user threw the cube fast enough for free spin
  const speed = Math.sqrt(velocityX.value * velocityX.value + velocityY.value * velocityY.value)
  const spinThreshold = 15 // Adjust this to change sensitivity
  
  if (speed > spinThreshold) {
    isSpinning.value = true
    // Don't set interaction end immediately if spinning
    setTimeout(() => {
      isSpinning.value = false
      setInteractionEnd()
    }, Math.min(speed * 200, 5000)) // Spin duration based on speed, max 5 seconds
  } else {
    // Normal release - apply momentum briefly then auto-rotate
    if (speed > 3) {
      setTimeout(() => {
        velocityX.value = 0
        velocityY.value = 0
      }, speed * 50) // Brief momentum
    }
    setInteractionEnd()
  }
  
  // Clear drag history
  dragHistory = []
  
  // Remove global listeners
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseup', handleGlobalMouseUp)
}

// Touch handlers for mobile
const handleTouchStart = (event) => {
  if (event.touches.length === 1) {
    isDragging.value = true
    isUserInteracting.value = true
    const touch = event.touches[0]
    lastMouseX.value = touch.clientX
    lastMouseY.value = touch.clientY
    clearInteractionTimeout()
    event.preventDefault()
  }
}

const handleTouchMove = (event) => {
  if (!isDragging.value || event.touches.length !== 1) return
  
  const now = Date.now()
  const touch = event.touches[0]
  const deltaX = touch.clientX - lastMouseX.value
  const deltaY = touch.clientY - lastMouseY.value
  
  // Apply rotation with enhanced sensitivity for ragdoll feel
  const sensitivity = 1.2
  userRotationY.value += deltaX * sensitivity
  userRotationX.value -= deltaY * sensitivity
  
  // Track drag history for velocity calculation
  dragHistory.push({
    deltaX: deltaX * sensitivity,
    deltaY: -deltaY * sensitivity,
    time: now
  })
  
  // Keep only recent history
  if (dragHistory.length > 10) {
    dragHistory.shift()
  }
  
  lastMouseX.value = touch.clientX
  lastMouseY.value = touch.clientY
  lastMoveTime = now
  event.preventDefault()
}

const handleTouchEnd = () => {
  isDragging.value = false
  
  // Calculate final velocity for momentum
  calculateVelocity()
  
  // Check if user threw the cube fast enough for free spin
  const speed = Math.sqrt(velocityX.value * velocityX.value + velocityY.value * velocityY.value)
  const spinThreshold = 15 // Adjust this to change sensitivity
  
  if (speed > spinThreshold) {
    isSpinning.value = true
    // Don't set interaction end immediately if spinning
    setTimeout(() => {
      isSpinning.value = false
      setInteractionEnd()
    }, Math.min(speed * 200, 5000)) // Spin duration based on speed, max 5 seconds
  } else {
    // Normal release - apply momentum briefly then auto-rotate
    if (speed > 3) {
      setTimeout(() => {
        velocityX.value = 0
        velocityY.value = 0
      }, speed * 50) // Brief momentum
    }
    setInteractionEnd()
  }
  
  // Clear drag history
  dragHistory = []
}

// Auto rotation animation with physics
const updateAutoRotation = () => {
  if (!isUserInteracting.value && !isDragging.value) {
    // Apply momentum/free spin
    if (isSpinning.value || Math.abs(velocityX.value) > 0.1 || Math.abs(velocityY.value) > 0.1) {
      userRotationY.value += velocityY.value
      userRotationX.value += velocityX.value
      
      // Apply friction to slow down momentum
      const friction = isSpinning.value ? 0.995 : 0.92
      velocityX.value *= friction
      velocityY.value *= friction
      
      // Stop momentum when it's very small
      if (Math.abs(velocityX.value) < 0.1 && Math.abs(velocityY.value) < 0.1) {
        velocityX.value = 0
        velocityY.value = 0
      }
    } else {
      // Normal auto rotation when no momentum
      autoRotationX.value += 0.03
      autoRotationY.value += 0.03
    }
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
  clearInteractionTimeout()
  // Clean up physics state
  velocityX.value = 0
  velocityY.value = 0
  isSpinning.value = false
  dragHistory = []
  // Clean up global listeners if component is unmounted during drag
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseup', handleGlobalMouseUp)
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
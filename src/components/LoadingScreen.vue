<template>
  <div 
    v-if="showLoading" 
    class="loading-screen fixed inset-0 bg-black z-[9999] overflow-hidden"
    @click="skipLoading"
  >
    <!-- Particle Canvas -->
    <canvas
      ref="particleCanvas"
      class="absolute inset-0 w-full h-full"
      :width="canvasWidth"
      :height="canvasHeight"
    ></canvas>
    
    <!-- Center Content -->
    <div class="loading-content absolute inset-0 flex flex-col items-center justify-center text-center">
      <!-- Name (Static) -->
      <h1 class="loading-title text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-primary-green bg-clip-text text-transparent opacity-0 transition-opacity duration-1000"
          :class="{ 'opacity-100': showText }">
        Samuel Lowe
      </h1>
      
      <!-- Subtitle (Static) -->
      <h2 class="loading-subtitle text-lg sm:text-xl md:text-2xl text-light-gray mb-8 opacity-0 transition-opacity duration-1000 delay-500"
          :class="{ 'opacity-100': showText }">
        Software Engineer
      </h2>
      
      <!-- Skip Hint -->
      <p 
        v-if="canSkip" 
        class="skip-hint text-primary-green/60 text-xs mt-8 animate-pulse absolute bottom-16"
      >
        Click anywhere to continue
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['loading-complete'])

// Reactive state
const showLoading = ref(true)
const showText = ref(false)
const canSkip = ref(false)
const particleCanvas = ref(null)
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// Matrix system
let drops = []
let animationId = null
let ctx = null

// Matrix characters - Japanese katakana, numbers, and symbols
const matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?"

// Always show loading screen for now (for testing)
const isFirstVisit = () => {
  return true
}

// Mark as visited
const markAsVisited = () => {
  localStorage.setItem('portfolio-visited', 'true')
}

// Skip loading animation
const skipLoading = () => {
  if (!canSkip.value) return
  completeLoading()
}

// Complete loading and show main site
const completeLoading = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  showLoading.value = false
  markAsVisited()
  emit('loading-complete')
}

// Initialize Matrix system
const initMatrixSystem = () => {
  const canvas = particleCanvas.value
  if (!canvas) return
  
  ctx = canvas.getContext('2d')
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
  
  // Matrix settings
  const fontSize = window.innerWidth < 768 ? 12 : 16
  const columns = Math.floor(canvasWidth.value / fontSize)
  
  // Initialize drops array
  drops.length = 0
  for (let i = 0; i < columns; i++) {
    drops[i] = {
      y: Math.random() * canvasHeight.value,
      speed: Math.random() * 3 + 2,
      chars: []
    }
    
    // Initialize character trail for each drop
    for (let j = 0; j < 15; j++) {
      drops[i].chars.push({
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        opacity: Math.max(0, 1 - j * 0.07)
      })
    }
  }
}

// Matrix animation loop
const animate = () => {
  if (!ctx) return
  
  // Semi-transparent black for trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value)
  
  const fontSize = window.innerWidth < 768 ? 12 : 16
  ctx.font = `${fontSize}px 'Courier New', monospace`
  
  for (let i = 0; i < drops.length; i++) {
    const drop = drops[i]
    const x = i * fontSize
    
    // Draw character trail
    for (let j = 0; j < drop.chars.length; j++) {
      const charY = drop.y - j * fontSize
      
      if (charY > 0 && charY < canvasHeight.value) {
        const opacity = drop.chars[j].opacity
        if (j === 0) {
          // Head of trail - bright white
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        } else if (j < 3) {
          // Bright green
          ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`
        } else {
          // Darker green
          ctx.fillStyle = `rgba(0, 200, 100, ${opacity * 0.8})`
        }
        
        ctx.fillText(drop.chars[j].char, x, charY)
      }
    }
    
    // Move drop down
    drop.y += drop.speed
    
    // Reset drop if it goes off screen
    if (drop.y > canvasHeight.value + 100) {
      drop.y = -100
      drop.speed = Math.random() * 3 + 2
      
      // Randomize characters when resetting
      for (let j = 0; j < drop.chars.length; j++) {
        drop.chars[j].char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
      }
    }
    
    // Occasionally change characters
    if (Math.random() < 0.01) {
      const randomIndex = Math.floor(Math.random() * drop.chars.length)
      drop.chars[randomIndex].char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
    }
  }
  
  animationId = requestAnimationFrame(animate)
}

// Handle window resize
const handleResize = () => {
  if (particleCanvas.value) {
    canvasWidth.value = window.innerWidth
    canvasHeight.value = window.innerHeight
  }
}

// Main animation sequence
const startAnimation = () => {
  // Initialize Matrix system
  initMatrixSystem()
  
  // Start animation loop
  animate()
  
  // Show text after slight delay
  setTimeout(() => {
    showText.value = true
  }, 1000)
  
  // Allow skipping after 2 seconds
  setTimeout(() => {
    canSkip.value = true
  }, 2000)
  
  // Auto-complete after 5 seconds
  setTimeout(() => {
    completeLoading()
  }, 5000)
}

onMounted(() => {
  // Only show loading screen on first visit
  if (isFirstVisit()) {
    startAnimation()
  } else {
    showLoading.value = false
    emit('loading-complete')
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.loading-screen {
  cursor: pointer;
}

/* Smooth text transitions */
.loading-title,
.loading-subtitle {
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
}
</style>
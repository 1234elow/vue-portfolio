<template>
  <!-- Top Progress Bar -->
  <div 
    class="fixed top-0 left-0 h-1 bg-gradient-to-r from-green-400 to-green-300 shadow-lg shadow-green-400/50 z-[1001] transition-all duration-100"
    :style="{ width: `${scrollPercent}%` }"
  ></div>

  <!-- Circular Progress Indicator -->
  <div 
    class="fixed bottom-8 right-8 w-16 h-16 bg-gray-800/90 rounded-full flex items-center justify-center border-2 border-green-400/30 backdrop-blur-lg cursor-pointer z-[999] transition-all duration-300 hover:scale-110 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/40"
    :class="{ 'opacity-0 translate-y-5': scrollPercent < 5, 'opacity-100 translate-y-0': scrollPercent >= 5 }"
    @click="scrollToTop"
  >
    <!-- SVG Progress Circle -->
    <svg width="60" height="60" class="absolute transform -rotate-90">
      <circle 
        cx="30" 
        cy="30" 
        r="25" 
        fill="none" 
        stroke="rgba(34, 197, 94, 0.2)" 
        stroke-width="2"
      />
      <circle 
        cx="30" 
        cy="30" 
        r="25" 
        fill="none" 
        stroke="#22c55e" 
        stroke-width="2" 
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        class="transition-all duration-100 drop-shadow-lg"
        style="filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.6))"
      />
    </svg>
    
    <!-- Progress Percentage or Up Arrow -->
    <div class="text-xs font-semibold text-green-400 z-10 flex items-center justify-center">
      <!-- Show arrow when at 100%, percentage otherwise -->
      <i 
        v-if="scrollPercent >= 100" 
        class="fas fa-chevron-up text-green-400 text-lg animate-bounce"
      ></i>
      <span 
        v-else 
        class="text-green-400 font-semibold"
      >{{ Math.round(scrollPercent) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const scrollPercent = ref(0)
const circumference = 2 * Math.PI * 25 // radius = 25

const offset = computed(() => {
  return circumference - (scrollPercent.value / 100) * circumference
})

let scrollTicking = false
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768

const updateProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const newPercent = Math.max(0, Math.min(100, (scrollTop / docHeight) * 100))
  
  // Direct update for mobile for better responsiveness
  scrollPercent.value = newPercent
  scrollTicking = false
}

const handleScroll = () => {
  if (!scrollTicking) {
    // Use direct update on mobile for better responsiveness
    if (isMobile) {
      updateProgress()
    } else {
      requestAnimationFrame(updateProgress)
    }
    scrollTicking = true
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  // Add passive listener for better mobile performance
  window.addEventListener('scroll', handleScroll, { passive: true })
  updateProgress() // Initial call
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, { passive: true })
})
</script>
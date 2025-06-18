<template>
  <!-- Top Progress Bar -->
  <div 
    :style="{ 
      position: 'fixed',
      top: '0',
      left: '0',
      height: '4px',
      width: scrollPercent > 0 ? `${scrollPercent}%` : '0%',
      background: 'linear-gradient(to right, #22c55e, #16a34a)',
      boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
      zIndex: '1001',
      transition: 'width 0.1s ease-out',
      minWidth: scrollPercent > 0 ? '8px' : '0px'
    }"
  ></div>

  <!-- Circular Progress Indicator -->
  <div 
    v-show="scrollPercent > 10"
    :style="{
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(31, 41, 55, 0.9)',
      border: '2px solid rgba(34, 197, 94, 0.3)',
      cursor: 'pointer',
      zIndex: '999',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(12px)'
    }"
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

const updateProgress = () => {
  const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  ) - window.innerHeight
  
  if (docHeight <= 0) {
    scrollPercent.value = 0
    return
  }
  
  const newPercent = Math.max(0, Math.min(100, (scrollTop / docHeight) * 100))
  scrollPercent.value = newPercent
}

const handleScroll = () => {
  updateProgress()
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
  
  // Initial call with slight delay to ensure DOM is ready
  setTimeout(updateProgress, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, { passive: true })
  window.removeEventListener('resize', updateProgress, { passive: true })
})
</script>
<template>
  <div id="app" class="relative">
    <!-- Loading Screen -->
    <LoadingScreen @loading-complete="onLoadingComplete" />
    
    <!-- Main Portfolio Content -->
    <div v-if="showMainContent" class="main-content">
      <!-- Aurora Background -->
      <AuroraBackground />
      
      <!-- Particle Canvas -->
      <ParticleCanvas />
      
      <!-- Scroll Progress -->
      <ScrollProgress />
      
      <!-- Navigation -->
      <NavBar />
      
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- About Section -->
      <AboutSection />
      
      <!-- Skills Section -->
      <SkillsSection />
      
      <!-- Projects Section -->
      <ProjectsSection />
      
      <!-- Contact Section -->
      <ContactSection />
      
      <!-- Playground Section -->
      <PlaygroundSection />
      
      <!-- Footer -->
      <FooterSection />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import AuroraBackground from './components/AuroraBackground.vue'
import ParticleCanvas from './components/ParticleCanvas.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import PlaygroundSection from './components/PlaygroundSection.vue'
import FooterSection from './components/FooterSection.vue'

const showMainContent = ref(false)

const onLoadingComplete = () => {
  showMainContent.value = true
  
  // Enhanced performance optimizations
  setTimeout(() => {
    // Device capability detection
    const isLowEnd = navigator.hardwareConcurrency <= 4 || (navigator.deviceMemory && navigator.deviceMemory <= 4)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
    
    // Reduce motion for users who prefer it or low-end devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isLowEnd) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s')
    }
    
    // Add passive event listeners for better scroll performance
    document.addEventListener('touchstart', () => {}, { passive: true })
    document.addEventListener('touchmove', () => {}, { passive: true })
    document.addEventListener('wheel', () => {}, { passive: true })
    
    // Optimize images loading with intersection observer
    const images = document.querySelectorAll('img')
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (!img.loading) img.loading = 'lazy'
            if (img.dataset.src && !img.src) {
              img.src = img.dataset.src
            }
            imageObserver.unobserve(img)
          }
        })
      })
      images.forEach(img => imageObserver.observe(img))
    } else {
      images.forEach(img => {
        if (!img.loading) img.loading = 'lazy'
      })
    }
    
    // Adaptive hardware acceleration
    const animatedElements = document.querySelectorAll('.animated, .particle-system, .threejs-canvas')
    animatedElements.forEach(el => {
      if (!isLowEnd) {
        el.style.willChange = 'transform'
      }
    })
    
    // Performance monitoring and adaptive quality
    let frameCount = 0
    let lastTime = performance.now()
    
    const monitorPerformance = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount
        frameCount = 0
        lastTime = currentTime
        
        // Adaptive quality based on performance
        if (fps < 30 && !document.documentElement.classList.contains('low-performance')) {
          document.documentElement.classList.add('low-performance')
          // Reduce particle effects, disable some animations
          animatedElements.forEach(el => {
            el.style.willChange = 'auto'
          })
        } else if (fps > 50 && document.documentElement.classList.contains('low-performance')) {
          document.documentElement.classList.remove('low-performance')
        }
      }
      
      requestAnimationFrame(monitorPerformance)
    }
    
    if (!isLowEnd) {
      requestAnimationFrame(monitorPerformance)
    }
    
    // Memory cleanup on page unload
    window.addEventListener('beforeunload', () => {
      // Cancel any running animations
      const runningAnimations = document.getAnimations()
      runningAnimations.forEach(animation => animation.cancel())
    })
    
    // Visibility API for better resource management
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause non-essential animations when tab is hidden
        document.documentElement.classList.add('tab-hidden')
      } else {
        document.documentElement.classList.remove('tab-hidden')
      }
    })
    
  }, 100)
}
</script>
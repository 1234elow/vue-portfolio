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
  
  // Performance optimizations after loading
  setTimeout(() => {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s')
    }
    
    // Add passive event listeners for better scroll performance
    document.addEventListener('touchstart', () => {}, { passive: true })
    document.addEventListener('touchmove', () => {}, { passive: true })
    
    // Optimize images loading
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy'
      }
    })
    
    // Enable hardware acceleration for smooth animations
    const animatedElements = document.querySelectorAll('.animated, .particle-system, .threejs-canvas')
    animatedElements.forEach(el => {
      el.style.willChange = 'transform'
    })
  }, 100)
}
</script>
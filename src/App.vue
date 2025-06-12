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
import FooterSection from './components/FooterSection.vue'

const showMainContent = ref(false)

const onLoadingComplete = () => {
  showMainContent.value = true
}
</script>
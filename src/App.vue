<template>
  <div id="app" class="relative">
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
</template>

<script setup>
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
</script>
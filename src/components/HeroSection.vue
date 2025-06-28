<template>
  <section id="home" class="hero min-h-screen flex items-center bg-black/30 relative overflow-hidden pt-20 sm:pt-24">
    <!-- Background Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary-green/5"></div>
    
    <div class="hero-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto px-5 relative z-10">
      <!-- Text Content -->
      <div class="hero-content">
        <h1 class="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-primary-green bg-clip-text text-transparent">
          {{ displayedTitle }}
          <span class="cursor animate-pulse">|</span>
        </h1>
        
        <h2 class="hero-subtitle text-lg sm:text-xl md:text-2xl text-light-gray mb-6 opacity-0 animate-fade-in-up delay-200">
          {{ displayedSubtitle }}
          <span class="subtitle-cursor animate-pulse">|</span>
        </h2>
        
        <p class="hero-description text-base sm:text-lg text-light-gray mb-8 leading-relaxed opacity-0 animate-fade-in-up delay-400">
          I oversee technology deployment and maintenance with extensive knowledge 
          of web development and backend solutions. Seeking experience in app 
          development, database management, and game world development.
        </p>
        
        <div class="hero-buttons flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up delay-600">
          <a 
            href="#projects" 
            class="btn btn-primary inline-block px-8 py-3 bg-primary-green text-black font-semibold rounded-full hover:bg-dark-green transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-primary-green/30"
          >
            View My Work
          </a>
          <a 
            href="#contact" 
            class="btn btn-secondary inline-block px-8 py-3 bg-transparent text-primary-green border-2 border-primary-green font-semibold rounded-full hover:bg-primary-green hover:text-black transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>
      </div>

      <!-- Profile Image -->
      <div class="hero-image flex justify-center items-center">
        <div class="profile-image relative w-80 h-80 flex justify-center items-center">
          <!-- Animated Borders -->
          <div class="absolute w-80 h-80 rounded-full border-2 border-primary-green/50 animate-spin-slow"></div>
          <div class="absolute w-72 h-72 rounded-full border-2 border-primary-green/40 animate-pulse-ring"></div>
          <div class="absolute w-64 h-64 rounded-full border border-primary-green/30 animate-ping-slow"></div>
          
          <!-- Profile Photo -->
          <img 
            src="/profile-photo-updated-2025.jpg" 
            alt="Samuel Lowe - Software Engineer" 
            class="profile-photo w-60 h-60 rounded-full object-cover object-top border-4 border-primary-green shadow-2xl shadow-primary-green/40 relative z-20 hover:scale-105 transition-transform duration-300"
            loading="lazy"
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const displayedTitle = ref('')
const displayedSubtitle = ref('')
const fullTitle = "Hello! I'm Samuel Lowe"

const subtitles = [
  "Junior Software Engineer",
  "Full Stack Developer", 
  "Backend Specialist",
  "Database Administrator",
  "Applications Specialist",
  "Web Developer",
  "Problem Solver"
]

let currentSubtitleIndex = 0
let isTypingSubtitle = false
let isBackspacing = false

const typeSubtitle = () => {
  const currentSubtitle = subtitles[currentSubtitleIndex]
  
  if (!isBackspacing && displayedSubtitle.value.length < currentSubtitle.length) {
    // Typing forward
    displayedSubtitle.value += currentSubtitle.charAt(displayedSubtitle.value.length)
    setTimeout(typeSubtitle, 100)
  } else if (!isBackspacing && displayedSubtitle.value.length === currentSubtitle.length) {
    // Pause at end of word
    setTimeout(() => {
      isBackspacing = true
      typeSubtitle()
    }, 2000) // Pause for 2 seconds
  } else if (isBackspacing && displayedSubtitle.value.length > 0) {
    // Backspacing
    displayedSubtitle.value = displayedSubtitle.value.slice(0, -1)
    setTimeout(typeSubtitle, 50) // Faster backspace
  } else if (isBackspacing && displayedSubtitle.value.length === 0) {
    // Move to next subtitle
    isBackspacing = false
    currentSubtitleIndex = (currentSubtitleIndex + 1) % subtitles.length
    setTimeout(typeSubtitle, 200) // Short pause before typing next word
  }
}

onMounted(() => {
  // Title typing animation
  let i = 0
  const typeWriter = () => {
    if (i < fullTitle.length) {
      displayedTitle.value += fullTitle.charAt(i)
      i++
      setTimeout(typeWriter, 100)
    } else {
      // Start subtitle animation after title is complete
      setTimeout(() => {
        typeSubtitle()
      }, 800)
    }
  }
  
  setTimeout(typeWriter, 500)
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease forwards;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

/* Force animations on mobile - override reduced motion */
@media (max-width: 768px) {
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite !important;
  }
  
  .animate-pulse-ring {
    animation: pulse-ring 2s ease-in-out infinite !important;
  }
  
  .animate-ping-slow {
    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite !important;
  }
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-400 {
  animation-delay: 0.4s;
}

.delay-600 {
  animation-delay: 0.6s;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes pulse-ring {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.4;
    box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4);
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.8;
    box-shadow: 0 0 20px 5px rgba(0, 255, 136, 0.2);
  }
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-pulse-ring {
  animation: pulse-ring 2s ease-in-out infinite;
  /* Ensure animation plays on mobile */
  animation-play-state: running !important;
}

.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
  /* Ensure animation plays on mobile */
  animation-play-state: running !important;
}
</style>
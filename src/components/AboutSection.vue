<template>
  <section id="about" class="about py-24 bg-dark-gray/70">
    <div class="container max-w-6xl mx-auto px-5">
      <h2 class="section-title text-4xl text-center mb-12 text-white relative">
        About Me
        <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary-green rounded"></div>
      </h2>
      
      <div class="about-content max-w-4xl mx-auto text-center">
        <div class="about-text">
          <p class="text-lg mb-6 text-light-gray leading-relaxed">
            I'm a Junior Software Engineer with a BSc in Software Engineering from 
            The University of The West Indies. I specialize in web development, backend 
            solutions, and have experience building web apps, SQL databases, and native applications.
          </p>
          <p class="text-lg mb-8 text-light-gray leading-relaxed">
            Currently working as an Applications Specialist at The Ministry of Education, I maintain and debug and fix issues with the Ministry's online applications. I'm passionate 
            about learning new technologies and hold certifications in Machine Learning and HSK Level 4 Mandarin.
          </p>
          
          <div ref="statsRef" class="about-stats grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div class="stat text-center p-8 bg-medium-gray rounded-lg border border-primary-green/20 hover:border-primary-green transition-colors duration-300">
              <span class="stat-number block text-4xl font-bold text-primary-green mb-2">{{ animatedStats.years }}+</span>
              <span class="stat-label text-light-gray">Years Experience</span>
            </div>
            <div class="stat text-center p-8 bg-medium-gray rounded-lg border border-primary-green/20 hover:border-primary-green transition-colors duration-300">
              <span class="stat-number block text-4xl font-bold text-primary-green mb-2">{{ animatedStats.gpa }}</span>
              <span class="stat-label text-light-gray">University GPA</span>
            </div>
            <div class="stat text-center p-8 bg-medium-gray rounded-lg border border-primary-green/20 hover:border-primary-green transition-colors duration-300">
              <span class="stat-number block text-4xl font-bold text-primary-green mb-2">{{ animatedStats.certifications }}</span>
              <span class="stat-label text-light-gray">Certifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const statsRef = ref(null)
const animatedStats = ref({
  years: 0,
  gpa: '0.00',
  certifications: 0
})

const animateCounter = (property, target, duration = 1500) => {
  const isDecimal = target.toString().includes('.')
  let start = 0
  const increment = target / (duration / 16)
  
  const updateCounter = () => {
    start += increment
    if (start < target) {
      if (isDecimal) {
        animatedStats.value[property] = start.toFixed(2)
      } else {
        animatedStats.value[property] = Math.ceil(start)
      }
      requestAnimationFrame(updateCounter)
    } else {
      if (isDecimal) {
        animatedStats.value[property] = target.toFixed(2)
      } else {
        animatedStats.value[property] = target
      }
    }
  }
  updateCounter()
}

onMounted(() => {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate each stat with a slight delay
        setTimeout(() => animateCounter('years', 7), 0)
        setTimeout(() => animateCounter('gpa', 3.64), 200)
        setTimeout(() => animateCounter('certifications', 2), 400)
        
        // Only animate once
        statsObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })
  
  if (statsRef.value) {
    statsObserver.observe(statsRef.value)
  }
})
</script>
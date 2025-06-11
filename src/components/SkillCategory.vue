<template>
  <div ref="skillCategoryRef" class="skill-category bg-gradient-to-br from-dark-gray/80 to-black/60 p-8 rounded-2xl border border-primary-green/20 hover:border-primary-green transition-transform duration-300 hover:-translate-y-2">
    <h3 class="text-primary-green text-xl font-semibold mb-6 text-center">{{ title }}</h3>
    
    <div class="skill-progress-list space-y-6">
      <div v-for="(skill, index) in animatedSkills" :key="skill.name" class="skill-progress-item group">
        <div class="skill-progress-header flex justify-between items-center mb-3">
          <span class="skill-name text-white font-medium">{{ skill.name }}</span>
          <span class="skill-percentage text-primary-green font-semibold">{{ skill.currentLevel }}%</span>
        </div>
        
        <div class="skill-progress-bar w-full h-3 bg-dark-gray rounded-full overflow-hidden relative">
          <div 
            class="skill-progress-fill h-full bg-gradient-to-r from-primary-green to-light-green rounded-full relative group-hover:shadow-lg group-hover:shadow-primary-green/50 group-hover:scale-y-110"
            :style="{ 
              width: skill.currentWidth + '%',
              boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              transition: 'transform 0.3s ease'
            }"
          >
            <!-- Shimmer effect -->
            <div class="absolute top-0 right-0 w-5 h-full bg-gradient-to-r from-transparent to-white/30 rounded-full animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  title: String,
  skills: Array
})

const skillCategoryRef = ref(null)
const animatedSkills = ref(props.skills.map(skill => ({ ...skill, currentLevel: 0, currentWidth: 0, isAnimated: false })))

const animateSkillProgress = (index, target) => {
  let start = 0
  const duration = 1500 // Increased duration for better mobile sync
  const increment = target / (duration / 16)
  
  const updateProgress = () => {
    start += increment
    if (start < target) {
      const currentValue = Math.ceil(start)
      animatedSkills.value[index].currentLevel = currentValue
      animatedSkills.value[index].currentWidth = start // Smooth progress bar
      requestAnimationFrame(updateProgress)
    } else {
      animatedSkills.value[index].currentLevel = target
      animatedSkills.value[index].currentWidth = target
    }
  }
  updateProgress()
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate each progress bar with stagger
        animatedSkills.value.forEach((skill, index) => {
          setTimeout(() => {
            skill.isAnimated = true
            animateSkillProgress(index, skill.level)
          }, index * 200) // 200ms stagger between each bar
        })
        
        // Only animate once
        observer.unobserve(entry.target)
      }
    })
  }, { 
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  })
  
  if (skillCategoryRef.value) {
    observer.observe(skillCategoryRef.value)
  }
})
</script>
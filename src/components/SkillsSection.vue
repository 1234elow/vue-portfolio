<template>
  <section id="skills" class="skills py-24 bg-black/60">
    <div class="container max-w-6xl mx-auto px-5 text-center">
      <h2 class="section-title text-4xl text-center mb-12 text-white relative">
        Skills & Technologies
        <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary-green rounded"></div>
      </h2>
      
      <!-- 3D Certification Cube -->
      <CertificationCube />
      
      <!-- Skills with Progress Bars -->
      <div class="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 justify-items-center">
        <SkillCategory 
          v-for="category in skillCategories" 
          :key="category.title"
          :title="category.title"
          :skills="category.skills"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import CertificationCube from './CertificationCube.vue'
import SkillCategory from './SkillCategory.vue'

const skillCategories = ref([
  {
    title: 'Programming Languages',
    skills: [
      { name: 'JavaScript', level: 85, icon: 'fab fa-js-square', color: '#F7DF1E' },
      { name: 'Python', level: 80, icon: 'fab fa-python', color: '#3776AB' },
      { name: 'Java', level: 75, icon: 'fab fa-java', color: '#007396' },
      { name: 'HTML5', level: 90, icon: 'fab fa-html5', color: '#E34F26' },
      { name: 'CSS3', level: 85, icon: 'fab fa-css3-alt', color: '#1572B6' }
    ]
  },
  {
    title: 'Backend & Database',
    skills: [
      { name: 'Node.js', level: 80, icon: 'fab fa-node-js', color: '#339933' },
      { name: 'SQL', level: 95, icon: 'fas fa-database', color: '#336791' },
      { name: 'NoSQL', level: 85, icon: 'fas fa-leaf', color: '#4DB33D' },
      { name: 'Express.js', level: 75, icon: 'fas fa-server', color: '#000000' },
      { name: 'RESTful APIs', level: 80, icon: 'fas fa-exchange-alt', color: '#FF6C37' }
    ]
  },
  {
    title: 'Tools & Technologies',
    skills: [
      { name: 'Git/GitHub', level: 85, icon: 'fab fa-github', color: '#181717' },
      { name: 'GitLab', level: 90, icon: 'fab fa-gitlab', color: '#FCA326' },
      { name: 'Postman', level: 90, icon: 'fas fa-paper-plane', color: '#FF6C37' },
      { name: 'Swagger', level: 75, icon: 'fas fa-code', color: '#85EA2D' },
      { name: 'Microsoft Suite', level: 95, icon: 'fab fa-microsoft', color: '#5E5E5E' },
      { name: 'Machine Learning', level: 95, icon: 'fas fa-brain', color: '#FF6B6B' }
    ]
  }
])
</script>
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
      { name: 'JavaScript', level: 85 },
      { name: 'Python', level: 80 },
      { name: 'Java', level: 75 },
      { name: 'HTML5', level: 90 },
      { name: 'CSS3', level: 85 }
    ]
  },
  {
    title: 'Backend & Database',
    skills: [
      { name: 'Node.js', level: 80 },
      { name: 'SQL', level: 95 },
      { name: 'NoSQL', level: 85 },
      { name: 'Express.js', level: 75 },
      { name: 'RESTful APIs', level: 80 }
    ]
  },
  {
    title: 'Tools & Technologies',
    skills: [
      { name: 'Git/GitHub', level: 85 },
      { name: 'GitLab', level: 90 },
      { name: 'Postman', level: 90 },
      { name: 'Swagger', level: 75 },
      { name: 'Microsoft Suite', level: 95 },
      { name: 'Machine Learning', level: 95 }
    ]
  }
])
</script>
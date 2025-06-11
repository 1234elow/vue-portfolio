<template>
  <div class="aurora-background fixed top-0 left-0 w-full h-full -z-20 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-black/98"></div>
    
    <!-- Aurora Blobs -->
    <div 
      v-for="(blob, index) in blobs" 
      :key="index"
      class="aurora-blob absolute rounded-full animate-float"
      :class="`aurora-blob-${index + 1}`"
      :style="blob.style"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const blobs = ref([
  {
    style: {
      top: '10%',
      left: '10%',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(0, 255, 136, 0.8) 0%, rgba(0, 255, 136, 0.3) 40%, rgba(0, 255, 136, 0.1) 70%, transparent 100%)',
      filter: 'blur(60px)',
      mixBlendMode: 'screen',
      animation: 'float 25s ease-in-out infinite, drift1 30s ease-in-out infinite',
      opacity: '0.8'
    }
  },
  {
    style: {
      top: '60%',
      right: '10%',
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, rgba(0, 204, 106, 0.7) 0%, rgba(0, 204, 106, 0.3) 40%, rgba(0, 204, 106, 0.1) 70%, transparent 100%)',
      filter: 'blur(60px)',
      mixBlendMode: 'screen',
      animation: 'float 20s ease-in-out infinite reverse, drift2 35s ease-in-out infinite',
      opacity: '0.8'
    }
  },
  {
    style: {
      top: '30%',
      left: '50%',
      width: '350px',
      height: '350px',
      background: 'radial-gradient(circle, rgba(102, 255, 170, 0.6) 0%, rgba(102, 255, 170, 0.2) 40%, rgba(102, 255, 170, 0.1) 70%, transparent 100%)',
      filter: 'blur(60px)',
      mixBlendMode: 'screen',
      animation: 'float 22s ease-in-out infinite, drift3 28s ease-in-out infinite',
      opacity: '0.8'
    }
  },
  {
    style: {
      bottom: '20%',
      left: '20%',
      width: '450px',
      height: '450px',
      background: 'radial-gradient(circle, rgba(0, 255, 136, 0.6) 0%, rgba(0, 255, 136, 0.2) 40%, rgba(0, 255, 136, 0.1) 70%, transparent 100%)',
      filter: 'blur(60px)',
      mixBlendMode: 'screen',
      animation: 'float 18s ease-in-out infinite, drift4 32s ease-in-out infinite',
      opacity: '0.8'
    }
  },
  {
    style: {
      top: '80%',
      right: '30%',
      width: '380px',
      height: '380px',
      background: 'radial-gradient(circle, rgba(0, 170, 85, 0.7) 0%, rgba(0, 170, 85, 0.3) 40%, rgba(0, 170, 85, 0.1) 70%, transparent 100%)',
      filter: 'blur(60px)',
      mixBlendMode: 'screen',
      animation: 'float 24s ease-in-out infinite reverse, drift5 26s ease-in-out infinite',
      opacity: '0.8'
    }
  }
])
</script>

<style scoped>
@keyframes drift1 {
  0%, 100% { transform: translateX(0px) rotate(0deg); }
  25% { transform: translateX(100px) rotate(90deg); }
  50% { transform: translateX(200px) rotate(180deg); }
  75% { transform: translateX(50px) rotate(270deg); }
}

@keyframes drift2 {
  0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
  25% { transform: translateX(-150px) translateY(-50px) rotate(60deg); }
  50% { transform: translateX(-100px) translateY(30px) rotate(120deg); }
  75% { transform: translateX(-50px) translateY(-20px) rotate(180deg); }
}

@keyframes drift3 {
  0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
  20% { transform: translateX(-80px) translateY(40px) scale(1.2); }
  40% { transform: translateX(60px) translateY(-30px) scale(0.8); }
  60% { transform: translateX(120px) translateY(50px) scale(1.1); }
  80% { transform: translateX(-40px) translateY(-60px) scale(0.9); }
}

@keyframes drift4 {
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  30% { transform: translateY(-80px) rotate(120deg) scale(1.15); }
  60% { transform: translateY(40px) rotate(240deg) scale(0.85); }
}

@keyframes drift5 {
  0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
  16% { transform: translateX(80px) translateY(-60px) rotate(45deg); }
  33% { transform: translateX(-60px) translateY(-40px) rotate(90deg); }
  50% { transform: translateX(-120px) translateY(20px) rotate(135deg); }
  66% { transform: translateX(40px) translateY(80px) rotate(180deg); }
  83% { transform: translateX(100px) translateY(-20px) rotate(225deg); }
}
</style>
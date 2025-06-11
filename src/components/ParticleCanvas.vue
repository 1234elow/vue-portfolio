<template>
  <canvas 
    ref="canvas"
    class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-80"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useParticleSystem } from '../composables/useParticleSystem'

const canvas = ref(null)
const { initParticles, destroyParticles } = useParticleSystem()

onMounted(() => {
  if (canvas.value) {
    initParticles(canvas.value)
  }
})

onUnmounted(() => {
  destroyParticles()
})
</script>
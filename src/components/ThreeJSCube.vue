<template>
  <div class="threejs-cube-container flex justify-center items-center h-64 sm:h-80 md:h-96 my-8 sm:my-12">
    <div ref="containerRef" class="threejs-canvas relative cursor-grab active:cursor-grabbing"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)
let scene, camera, renderer, cube, animationId, pointLight
let isDragging = false
let mouseX = 0, mouseY = 0
let targetRotationX = 0, targetRotationY = 0
let currentRotationX = 0, currentRotationY = 0
let lightTime = 0
let isVisible = false
let isMobile = false
let lastFrameTime = 0
const targetFPS = 30 // Limit FPS on mobile

const faces = [
  { icon: 'fas fa-robot', title: 'Machine Learning', color: 0x00ff88 },
  { icon: 'fas fa-language', title: 'HSK Level 4 Mandarin', color: 0x00cc6a },
  { icon: 'fas fa-graduation-cap', title: 'BSc Software Engineering', color: 0x66ffaa },
  { icon: 'fas fa-music', title: 'Grade 5 Clarinet', color: 0x00aa55 },
  { icon: 'fas fa-university', title: 'UWI Graduate', color: 0x008844 },
  { icon: 'fas fa-award', title: '4-Year Scholarship', color: 0x004422 }
]

onMounted(() => {
  // Detect mobile devices
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
  
  initThreeJS()
  createCube()
  addEventListeners()
  setupIntersectionObserver()
  animate()
})

const initThreeJS = () => {
  // Scene
  scene = new THREE.Scene()
  
  // Camera
  const aspect = 1 // Square aspect ratio
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  camera.position.set(0, 0, 4)
  
  // Renderer with mobile optimizations
  renderer = new THREE.WebGLRenderer({ 
    antialias: !isMobile, // Disable antialiasing on mobile
    alpha: true,
    premultipliedAlpha: false,
    powerPreference: isMobile ? 'low-power' : 'high-performance'
  })
  
  // Responsive size based on device
  const size = isMobile ? 300 : 400
  renderer.setSize(size, size)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
  renderer.setClearColor(0x000000, 0) // Transparent background
  
  // Disable shadows on mobile for better performance
  if (!isMobile) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }
  
  containerRef.value.appendChild(renderer.domElement)
  
  // Enhanced lighting for space-like effect
  const ambientLight = new THREE.AmbientLight(0x202040, 0.3)
  scene.add(ambientLight)
  
  // Main directional light (like a star)
  const directionalLight = new THREE.DirectionalLight(0x00ff88, 1.2)
  directionalLight.position.set(5, 5, 5)
  directionalLight.castShadow = true
  scene.add(directionalLight)
  
  // Secondary rim light for metallic shine
  const rimLight = new THREE.DirectionalLight(0x66ffaa, 0.6)
  rimLight.position.set(-3, 2, 4)
  scene.add(rimLight)
  
  // Point light for dynamic glow
  pointLight = new THREE.PointLight(0x00ff88, 0.8, 10)
  pointLight.position.set(0, 0, 3)
  scene.add(pointLight)
}

const createCube = () => {
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  
  // Create materials for each face with text
  const materials = faces.map((face, index) => {
    const canvas = document.createElement('canvas')
    // Reduce texture resolution on mobile
    const texSize = isMobile ? 256 : 512
    canvas.width = texSize
    canvas.height = texSize
    const ctx = canvas.getContext('2d')
    
    // Space-like starfield background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, texSize, texSize)
    
    // Reduce star count on mobile
    const starCount = isMobile ? 15 : 30
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * texSize
      const y = Math.random() * texSize
      const size = Math.random() * 2 + 0.5
      const opacity = Math.random() * 0.8 + 0.2
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
      
      // Add twinkling effect to some stars
      if (Math.random() > 0.7) {
        ctx.fillStyle = `rgba(0, 255, 136, ${opacity * 0.5})`
        ctx.beginPath()
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Add nebula-like glow in corners
    const nebulaGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 200)
    nebulaGradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)')
    nebulaGradient.addColorStop(1, 'rgba(0, 255, 136, 0)')
    ctx.fillStyle = nebulaGradient
    ctx.fillRect(0, 0, 200, 200)
    
    const nebulaGradient2 = ctx.createRadialGradient(512, 512, 0, 512, 512, 200)
    nebulaGradient2.addColorStop(0, 'rgba(102, 255, 170, 0.08)')
    nebulaGradient2.addColorStop(1, 'rgba(102, 255, 170, 0)')
    ctx.fillStyle = nebulaGradient2
    ctx.fillRect(312, 312, 200, 200)
    
    // Holographic border effect
    const borderGradient = ctx.createLinearGradient(0, 0, 512, 512)
    borderGradient.addColorStop(0, '#00ff88')
    borderGradient.addColorStop(0.5, '#66ffaa')
    borderGradient.addColorStop(1, '#00cc6a')
    ctx.strokeStyle = borderGradient
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, 508, 508)
    
    // Inner glow with shimmer effect
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)'
    ctx.lineWidth = 1
    ctx.strokeRect(6, 6, 500, 500)
    
    // Add corner accents
    ctx.strokeStyle = '#00ff88'
    ctx.lineWidth = 2
    // Top-left corner
    ctx.beginPath()
    ctx.moveTo(10, 30)
    ctx.lineTo(10, 10)
    ctx.lineTo(30, 10)
    ctx.stroke()
    // Top-right corner
    ctx.beginPath()
    ctx.moveTo(482, 10)
    ctx.lineTo(502, 10)
    ctx.lineTo(502, 30)
    ctx.stroke()
    // Bottom-left corner
    ctx.beginPath()
    ctx.moveTo(10, 482)
    ctx.lineTo(10, 502)
    ctx.lineTo(30, 502)
    ctx.stroke()
    // Bottom-right corner
    ctx.beginPath()
    ctx.moveTo(482, 502)
    ctx.lineTo(502, 502)
    ctx.lineTo(502, 482)
    ctx.stroke()
    
    // Icon (using Unicode symbols as fallback)
    ctx.fillStyle = '#00ff88'
    ctx.font = 'bold 120px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Icon mappings (using Unicode symbols)
    const iconMap = {
      'fas fa-robot': '🤖',
      'fas fa-language': '🗣️', 
      'fas fa-graduation-cap': '🎓',
      'fas fa-music': '🎵',
      'fas fa-university': '🏛️',
      'fas fa-award': '🏆'
    }
    
    const icon = iconMap[face.icon] || '⭐'
    ctx.fillText(icon, 256, 180)
    
    // Title text with better contrast
    ctx.fillStyle = '#ffffff'  // FORCE WHITE TEXT
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    // Split long titles into multiple lines
    const words = face.title.split(' ')
    let lines = []
    let currentLine = words[0]
    
    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > texSize * 0.78) { // Scale with texture size
        lines.push(currentLine)
        currentLine = words[i]
      } else {
        currentLine = testLine
      }
    }
    lines.push(currentLine)
    
    // Enhanced text area with space effects - but keep text white
    const lineHeight = texSize * 0.086 // Scale with texture size (44/512)
    const startY = texSize * 0.625 - ((lines.length - 1) * lineHeight) / 2 // Scale center Y
    const textHeight = lines.length * lineHeight
    const padding = 20
    
    // Subtle gradient background that blends with space
    const textBgGradient = ctx.createRadialGradient(texSize/2, startY + textHeight/2, 0, texSize/2, startY + textHeight/2, texSize * 0.39)
    textBgGradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)')
    textBgGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)')
    textBgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = textBgGradient
    ctx.fillRect(texSize * 0.078, startY - padding - 20, texSize * 0.844, textHeight + padding * 2)
    
    
    // ENSURE WHITE TEXT - no lighting interference
    ctx.fillStyle = '#FFFFFF'
    const fontSize = Math.round(texSize * 0.07) // Scale font size (36/512)
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 3
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    
    // Draw each line with white text and shadows
    lines.forEach((line, i) => {
      ctx.fillStyle = '#FFFFFF'  // Keep text pure white
      ctx.fillText(line, texSize/2, startY + (i * lineHeight))
    })
    
    // Clear shadows for next elements
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    
    return new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true
    })
  })
  
  cube = new THREE.Mesh(geometry, materials)
  cube.castShadow = true
  cube.receiveShadow = true
  scene.add(cube)
  
  // Initial rotation to show 3D
  cube.rotation.x = -0.2
  cube.rotation.y = 0.4
}

const addEventListeners = () => {
  const canvas = renderer.domElement
  
  // Mouse events
  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.addEventListener('mouseup', onMouseUp)
  canvas.addEventListener('mouseleave', onMouseUp)
  
  // Touch events
  canvas.addEventListener('touchstart', onTouchStart, { passive: false })
  canvas.addEventListener('touchmove', onTouchMove, { passive: false })
  canvas.addEventListener('touchend', onTouchEnd, { passive: false })
  
  // Prevent context menu
  canvas.addEventListener('contextmenu', e => e.preventDefault())
}

const onMouseDown = (event) => {
  isDragging = true
  mouseX = event.clientX
  mouseY = event.clientY
}

const onMouseMove = (event) => {
  if (!isDragging) return
  
  const deltaX = event.clientX - mouseX
  const deltaY = event.clientY - mouseY
  
  targetRotationY += deltaX * 0.01
  targetRotationX += deltaY * 0.01
  
  mouseX = event.clientX
  mouseY = event.clientY
}

const onMouseUp = () => {
  isDragging = false
}

const onTouchStart = (event) => {
  event.preventDefault()
  if (event.touches.length === 1) {
    isDragging = true
    mouseX = event.touches[0].clientX
    mouseY = event.touches[0].clientY
  }
}

const onTouchMove = (event) => {
  event.preventDefault()
  if (!isDragging || event.touches.length !== 1) return
  
  const deltaX = event.touches[0].clientX - mouseX
  const deltaY = event.touches[0].clientY - mouseY
  
  // Reduce sensitivity on mobile for smoother control
  const sensitivity = isMobile ? 0.008 : 0.01
  targetRotationY += deltaX * sensitivity
  targetRotationX += deltaY * sensitivity
  
  mouseX = event.touches[0].clientX
  mouseY = event.touches[0].clientY
}

const onTouchEnd = (event) => {
  event.preventDefault()
  isDragging = false
}

const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting
    })
  }, {
    threshold: 0.1 // Start animating when 10% visible
  })
  
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
}

const animate = (currentTime = 0) => {
  animationId = requestAnimationFrame(animate)
  
  // FPS limiting for mobile
  if (isMobile) {
    const frameInterval = 1000 / targetFPS
    if (currentTime - lastFrameTime < frameInterval) {
      return
    }
    lastFrameTime = currentTime
  }
  
  // Only animate if visible to save battery
  if (!isVisible) {
    return
  }
  
  lightTime += isMobile ? 0.01 : 0.02 // Slower animation on mobile
  
  // Smooth rotation interpolation
  const lerpFactor = isMobile ? 0.08 : 0.1 // Slightly slower on mobile for smoother animation
  currentRotationX += (targetRotationX - currentRotationX) * lerpFactor
  currentRotationY += (targetRotationY - currentRotationY) * lerpFactor
  
  cube.rotation.x = currentRotationX
  cube.rotation.y = currentRotationY
  
  // Auto rotation when not dragging
  if (!isDragging) {
    const rotationSpeed = isMobile ? 0.003 : 0.005 // Slower on mobile
    targetRotationY += rotationSpeed
  }
  
  // Reduced lighting animation on mobile
  if (!isMobile) {
    pointLight.position.x = Math.sin(lightTime) * 3
    pointLight.position.z = Math.cos(lightTime) * 3 + 3
    pointLight.intensity = 0.8 + Math.sin(lightTime * 2) * 0.3
  } else {
    // Static lighting on mobile to reduce GPU load
    pointLight.intensity = 0.8
  }
  
  renderer.render(scene, camera)
}

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  // Clean up Three.js resources
  if (renderer) {
    renderer.dispose()
    const canvas = renderer.domElement
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas)
    }
  }
  
  if (scene) {
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }
})
</script>

<style scoped>
.threejs-cube-container {
  perspective: none; /* Three.js handles its own perspective */
}

.threejs-canvas {
  border-radius: 12px;
  overflow: hidden;
}

.threejs-canvas canvas {
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 255, 136, 0.2);
  transition: box-shadow 0.3s ease;
}

.threejs-canvas:hover canvas {
  box-shadow: 0 20px 60px rgba(0, 255, 136, 0.4);
}
</style>
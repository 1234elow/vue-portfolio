<template>
  <section id="playground" class="playground py-24 bg-black/80">
    <div class="container max-w-6xl mx-auto px-5">
      <h2 class="section-title text-4xl text-center mb-12 text-white relative">
        Interactive Playground
        <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary-green rounded"></div>
      </h2>
      
      <p class="text-center text-light-gray mb-8 max-w-2xl mx-auto">
        Hover to watch particles gravitate and form my name using physics simulation.
      </p>
      
      <!-- Gravitational Particle Playground Container -->
      <div 
        class="playground-container relative bg-black rounded-xl overflow-hidden border border-primary-green/20 hover:border-primary-green/40 transition-colors duration-300"
        @mouseenter="activateFormation"
        @mouseleave="deactivateFormation"
      >
        <div ref="playgroundRef" class="playground-canvas w-full relative" style="height: 500px; cursor: crosshair;">
          <!-- Activation Overlay -->
          <div v-if="!isActive" class="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
            <div class="text-center">
              <div class="text-6xl mb-4">🌌</div>
              <div class="text-xl text-primary-green mb-2">Gravitational Text Formation</div>
              <div class="text-light-gray">Hover to see "SAMUEL" form from particles</div>
            </div>
          </div>
        </div>
        
        <!-- Controls Overlay -->
        <div class="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-primary-green/30">
          <div class="text-xs text-primary-green mb-2 font-semibold">GRAVITATIONAL CONTROLS</div>
          <div class="flex flex-col gap-2 text-xs text-light-gray">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-white rounded-full"></span>
              <span>Hover to activate gravity</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-primary-green rounded-full"></span>
              <span>Particles form "SAMUEL"</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Mobile optimized physics</span>
            </div>
          </div>
        </div>
        
        <!-- Performance Stats -->
        <div class="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-primary-green/30">
          <div class="text-xs text-primary-green mb-1 font-semibold">PERFORMANCE</div>
          <div class="text-xs text-light-gray">
            <div>Particles: {{ particleCount }}</div>
            <div>FPS: {{ fps }}</div>
            <div>Mode: {{ isForming ? 'FORMING' : 'FLOATING' }}</div>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-6 text-sm text-light-gray/70">
        <p>This playground demonstrates gravitational particle physics with text formation effects.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const playgroundRef = ref(null)
let scene, camera, renderer, animationId
let particles = []
let targetPositions = []
let particleCount = ref(0)
let fps = ref(60)
let isActive = ref(false)
let isForming = ref(false)
let isInitialized = false
let isMobile = false

// Performance monitoring
let frameCount = 0
let lastTime = performance.now()
let lastFrameTime = 0

// Particle system
let particleGeometry, particleMaterial, particleSystem
const MAX_PARTICLES = 150 // Even fewer particles for cleaner letters

class GravitationalParticle {
  constructor(x, y, z) {
    this.position = new THREE.Vector3(x, y, z)
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    )
    this.targetPosition = new THREE.Vector3(0, 0, 0)
    this.life = 1.0
    this.size = 0.001 + Math.random() * 0.001 // Even tinier particles for precise letters
    this.originalPosition = this.position.clone()
    this.hasTarget = false
    this.isNameParticle = false // Track if this particle forms the name
  }
  
  update(deltaTime, isForming) {
    if (isForming && this.hasTarget) {
      // Gravitational attraction to target
      const direction = this.targetPosition.clone().sub(this.position)
      const distance = direction.length()
      
      if (distance > 0.05) {
        direction.normalize()
        const force = Math.min(distance * 3.0, 8.0) // Much stronger attraction
        this.velocity.add(direction.multiplyScalar(force * deltaTime))
      }
      
      // Strong damping when close to target for precise positioning
      if (distance < 0.2) {
        this.velocity.multiplyScalar(0.7)
      }
    } else {
      if (this.isNameParticle) {
        // Name particles float gently when not forming
        this.velocity.add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ))
        this.velocity.y -= 0.01 * deltaTime
      } else {
        // Non-name particles orbit around the center
        const centerX = 0
        const centerY = 0
        const dx = this.position.x - centerX
        const dy = this.position.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 0.1) {
          // Orbital motion
          const orbitSpeed = 0.3
          this.velocity.x += -dy / distance * orbitSpeed * deltaTime
          this.velocity.y += dx / distance * orbitSpeed * deltaTime
          
          // Keep them at a reasonable distance
          if (distance > 8) {
            this.velocity.x += -dx / distance * 0.5 * deltaTime
            this.velocity.y += -dy / distance * 0.5 * deltaTime
          }
        }
        
        this.velocity.y -= 0.02 * deltaTime
      }
    }
    
    // Apply velocity
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime))
    
    // Boundary constraints - sized for "SAMUEL"
    const bounds = { x: 12, y: 6, z: 3 }
    
    if (this.position.x > bounds.x || this.position.x < -bounds.x) {
      this.velocity.x *= -0.8
      this.position.x = Math.max(-bounds.x, Math.min(bounds.x, this.position.x))
    }
    
    if (this.position.y > bounds.y || this.position.y < -bounds.y) {
      this.velocity.y *= -0.8
      this.position.y = Math.max(-bounds.y, Math.min(bounds.y, this.position.y))
    }
    
    if (this.position.z > bounds.z || this.position.z < -bounds.z) {
      this.velocity.z *= -0.8
      this.position.z = Math.max(-bounds.z, Math.min(bounds.z, this.position.z))
    }
    
    // Velocity damping
    this.velocity.multiplyScalar(0.998)
    
    // Velocity limits
    const maxVel = 3.0
    if (this.velocity.length() > maxVel) {
      this.velocity.normalize().multiplyScalar(maxVel)
    }
  }
  
  getColor(time) {
    if (this.isNameParticle && isForming.value) {
      // Bright, prominent colors for name particles
      return { r: 0.2, g: 1.0, b: 0.4 } // Bright green
    }
    
    // Color cycling for orbiting particles
    const hue = (time * 0.15) % 1
    const sat = isForming.value ? 0.6 : 0.8
    const val = isForming.value ? 0.4 : 0.7 // Dimmer when forming
    
    // HSB to RGB conversion
    const c = val * sat
    const x = c * (1 - Math.abs(((hue * 6) % 2) - 1))
    const m = val - c
    
    let r, g, b
    const h = hue * 6
    
    if (h < 1) { r = c; g = x; b = 0 }
    else if (h < 2) { r = x; g = c; b = 0 }
    else if (h < 3) { r = 0; g = c; b = x }
    else if (h < 4) { r = 0; g = x; b = c }
    else if (h < 5) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    
    return { r: r + m, g: g + m, b: b + m }
  }
}

const activateFormation = () => {
  if (!isInitialized) {
    initGravitationalPlayground()
    isInitialized = true
  }
  isActive.value = true
  isForming.value = true
  assignTargetsToParticles()
  if (!animationId) {
    animate()
  }
}

const deactivateFormation = () => {
  isForming.value = false
  // Don't stop animation, just change mode
}

const initGravitationalPlayground = () => {
  // Detect mobile
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
  
  // Scene setup
  scene = new THREE.Scene()
  
  // Camera
  const aspect = playgroundRef.value.clientWidth / playgroundRef.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  camera.position.z = 16 // Optimized for "SAMUEL"
  
  // Renderer with mobile optimizations
  renderer = new THREE.WebGLRenderer({ 
    antialias: !isMobile,
    alpha: true,
    powerPreference: isMobile ? 'low-power' : 'high-performance'
  })
  renderer.setSize(playgroundRef.value.clientWidth, playgroundRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
  renderer.setClearColor(0x000000, 1)
  
  playgroundRef.value.appendChild(renderer.domElement)
  
  // Generate text targets for "Samuel Lowe"
  generateTextTargets()
  
  // Create particle system
  createParticleSystem()
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
  scene.add(ambientLight)
  
  const pointLight = new THREE.PointLight(0x00ff88, 0.6, 30)
  pointLight.position.set(0, 0, 10)
  scene.add(pointLight)
}

const generateTextTargets = () => {
  // Manually create precise letter positions for "SAMUEL"
  targetPositions = []
  
  // Define letter outlines manually for perfect clarity
  const letterSpacing = 2.0 // Good spacing for readability
  const startX = -9 // Move much more to the left
  
  // S - More defined S shape
  addLetter([
    [0,2], [1,2], [2,2],
    [0,1],
    [0,0], [1,0], [2,0],
    [2,-1],
    [0,-2], [1,-2], [2,-2]
  ], startX + 0 * letterSpacing, 0)
  
  // A - Better A with crossbar
  addLetter([
    [1,2],
    [0,1], [2,1],
    [0,0], [1,0], [2,0],
    [0,-1], [2,-1],
    [0,-2], [2,-2]
  ], startX + 3.2 * letterSpacing, 0)
  
  // M - Cleaner M
  addLetter([
    [0,2], [0,1], [0,0], [0,-1], [0,-2],
    [1,1],
    [2,2], [2,1], [2,0], [2,-1], [2,-2],
    [3,1],
    [4,2], [4,1], [4,0], [4,-1], [4,-2]
  ], startX + 6.0 * letterSpacing, 0)
  
  // U - Perfect U with better bottom
  addLetter([
    [0,2], [0,1], [0,0], [0,-1],
    [1,-2], [2,-2],
    [3,-1], [3,0], [3,1], [3,2]
  ], startX + 10.5 * letterSpacing, 0)
  
  // E - More prominent E
  addLetter([
    [0,2], [0,1], [0,0], [0,-1], [0,-2],
    [1,2], [2,2],
    [1,0], [2,0],
    [1,-2], [2,-2]
  ], startX + 13.8 * letterSpacing, 0)
  
  // L - Clear L
  addLetter([
    [0,2], [0,1], [0,0], [0,-1], [0,-2],
    [1,-2], [2,-2], [3,-2]
  ], startX + 16.8 * letterSpacing, 0)
  
  console.log(`Generated ${targetPositions.length} manual target positions for "SAMUEL"`)
}

const addLetter = (points, offsetX, offsetY) => {
  const scale = 0.5 // Larger letters for better readability
  points.forEach(([x, y]) => {
    targetPositions.push(new THREE.Vector3(
      (offsetX + x) * scale,
      (offsetY + y) * scale,
      0
    ))
  })
}

const createParticleSystem = () => {
  // Initialize particles
  particles = []
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const particle = new GravitationalParticle(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 6
    )
    particles.push(particle)
  }
  
  // Create Three.js geometry
  particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(MAX_PARTICLES * 3)
  const colors = new Float32Array(MAX_PARTICLES * 3)
  const sizes = new Float32Array(MAX_PARTICLES)
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  
  // Create circular particle texture
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(32, 32, 32, 0, Math.PI * 2)
  ctx.fill()
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = false
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  
  // Material
  particleMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.6 : 0.8, // Much smaller particles for precise letters
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    map: texture,
    alphaTest: 0.001,
    depthWrite: false
  })
  
  particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particleSystem)
  
  particleCount.value = MAX_PARTICLES
}

const assignTargetsToParticles = () => {
  // Assign target positions to particles
  particles.forEach((particle, index) => {
    if (index < targetPositions.length) {
      // These particles will form the name
      particle.targetPosition.copy(targetPositions[index])
      particle.hasTarget = true
      particle.isNameParticle = true
    } else {
      // These particles will orbit around
      particle.hasTarget = false
      particle.isNameParticle = false
    }
  })
}

const updateParticleSystem = (deltaTime, currentTime) => {
  // Update all particles
  particles.forEach(particle => {
    particle.update(deltaTime, isForming.value)
  })
  
  // Update geometry buffers
  const positions = particleGeometry.attributes.position.array
  const colors = particleGeometry.attributes.color.array
  const sizes = particleGeometry.attributes.size.array
  
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const particle = particles[i]
    const color = particle.getColor(currentTime)
    
    positions[i * 3] = particle.position.x
    positions[i * 3 + 1] = particle.position.y
    positions[i * 3 + 2] = particle.position.z
    
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
    
    sizes[i] = particle.size
  }
  
  particleGeometry.attributes.position.needsUpdate = true
  particleGeometry.attributes.color.needsUpdate = true
  particleGeometry.attributes.size.needsUpdate = true
}

const animate = (currentTime = 0) => {
  animationId = requestAnimationFrame(animate)
  
  // FPS limiting for mobile
  if (isMobile) {
    const frameInterval = 1000 / 30 // 30 FPS for mobile
    if (currentTime - lastFrameTime < frameInterval) {
      return
    }
    lastFrameTime = currentTime
  }
  
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 1/30) // Cap delta time
  
  // Update particle system
  updateParticleSystem(deltaTime, currentTime * 0.001)
  
  // Performance monitoring
  frameCount++
  if (currentTime - lastTime >= 1000) {
    fps.value = Math.round(frameCount)
    frameCount = 0
    lastTime = currentTime
  }
  
  renderer.render(scene, camera)
}

// Window resize handler
const handleResize = () => {
  if (playgroundRef.value && renderer && camera) {
    const width = playgroundRef.value.clientWidth
    const height = playgroundRef.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
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
.playground-container {
  box-shadow: 0 20px 40px rgba(0, 255, 136, 0.1);
}

.playground-container:hover {
  box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2);
}

.playground-canvas canvas {
  border-radius: 12px;
}
</style>
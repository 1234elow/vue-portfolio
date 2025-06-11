import { ref } from 'vue'

export function useParticleSystem() {
  const particles = ref([])
  const mouse = ref({ x: 0, y: 0 })
  let canvas = null
  let ctx = null
  let animationId = null
  const maxParticles = 100

  const initParticles = (canvasElement) => {
    canvas = canvasElement
    ctx = canvas.getContext('2d')
    
    resizeCanvas()
    createParticles()
    bindEvents()
    animate()
  }

  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const createParticles = () => {
    particles.value = []
    for (let i = 0; i < maxParticles; i++) {
      particles.value.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        originalOpacity: Math.random() * 0.5 + 0.2,
        color: `rgba(0, 255, 136, ${Math.random() * 0.5 + 0.2})`
      })
    }
  }

  const bindEvents = () => {
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', (e) => {
      mouse.value.x = e.clientX
      mouse.value.y = e.clientY
    })
  }

  const updateParticles = () => {
    particles.value.forEach(particle => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Mouse interaction
      const dx = mouse.value.x - particle.x
      const dy = mouse.value.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 150) {
        const force = (150 - distance) / 150
        particle.vx += dx * force * 0.001
        particle.vy += dy * force * 0.001
        particle.opacity = particle.originalOpacity + force * 0.5
      } else {
        particle.opacity = particle.originalOpacity
        particle.vx *= 0.99
        particle.vy *= 0.99
      }

      // Boundary checks
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -1
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -1
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
      }

      // Update color
      particle.color = `rgba(0, 255, 136, ${particle.opacity})`
    })
  }

  const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    particles.value.forEach((particle, i) => {
      for (let j = i + 1; j < particles.value.length; j++) {
        const other = particles.value[j]
        const dx = particle.x - other.x
        const dy = particle.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const opacity = (100 - distance) / 100 * 0.2
          ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
      }
    })

    // Draw particles
    particles.value.forEach(particle => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.fill()

      // Add glow effect
      ctx.shadowBlur = 10
      ctx.shadowColor = particle.color
      ctx.fill()
      ctx.shadowBlur = 0
    })
  }

  const animate = () => {
    updateParticles()
    drawParticles()
    animationId = requestAnimationFrame(animate)
  }

  const destroyParticles = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', resizeCanvas)
    window.removeEventListener('mousemove', () => {})
  }

  return {
    initParticles,
    destroyParticles
  }
}
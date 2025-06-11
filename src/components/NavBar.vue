<template>
  <nav class="navbar fixed top-0 w-full bg-black/95 backdrop-blur-lg z-[1000] transition-all duration-300">
    <div class="nav-container max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
      <!-- Logo -->
      <div class="nav-logo">
        <a href="#home" class="text-xl font-bold text-primary-green hover:text-light-green transition-colors duration-300">
          Portfolio
        </a>
      </div>

      <!-- Desktop Menu -->
      <ul class="nav-menu hidden md:flex space-x-8">
        <li v-for="item in menuItems" :key="item.href">
          <a 
            :href="item.href" 
            class="nav-link relative text-light-gray hover:text-primary-green font-medium transition-colors duration-300 group"
            @click="setActiveLink(item.href)"
          >
            {{ item.label }}
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-green transition-all duration-300 group-hover:w-full"></span>
          </a>
        </li>
      </ul>

      <!-- Mobile Menu Toggle -->
      <div 
        class="nav-toggle md:hidden flex flex-col cursor-pointer"
        @click="toggleMobileMenu"
      >
        <span class="bar w-6 h-0.5 bg-primary-green mb-1 transition-all duration-300" :class="{ 'rotate-45 translate-y-1.5': mobileMenuOpen }"></span>
        <span class="bar w-6 h-0.5 bg-primary-green mb-1 transition-all duration-300" :class="{ 'opacity-0': mobileMenuOpen }"></span>
        <span class="bar w-6 h-0.5 bg-primary-green transition-all duration-300" :class="{ '-rotate-45 -translate-y-1.5': mobileMenuOpen }"></span>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      class="mobile-menu md:hidden fixed left-0 top-16 w-full bg-black/95 backdrop-blur-lg transition-all duration-300 z-50"
      :class="mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'"
    >
      <ul class="flex flex-col text-center py-8 space-y-4">
        <li v-for="item in menuItems" :key="item.href">
          <a 
            :href="item.href" 
            class="block text-light-gray hover:text-primary-green font-medium transition-colors duration-300"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mobileMenuOpen = ref(false)

const menuItems = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' }
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const setActiveLink = (href) => {
  // Smooth scroll implementation
  const element = document.querySelector(href)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  // Handle scroll events for navbar background
  let scrollTicking = false
  
  const updateNavbar = () => {
    const navbar = document.querySelector('.navbar')
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(10, 10, 10, 0.98)'
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)'
    }
    scrollTicking = false
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateNavbar)
      scrollTicking = true
    }
  })
})
</script>
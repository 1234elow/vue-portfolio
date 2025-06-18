<template>
  <div class="chatbot-container">
    <!-- Chat Toggle Button - positioned to not interfere with scroll progress -->
    <div v-if="!isOpen" 
         @click="toggleChat" 
         class="chat-toggle-btn fixed bottom-6 left-6 w-14 h-14 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 z-[998] hover:scale-110 touch-manipulation">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </div>

    <!-- Chat Window - positioned away from scroll progress -->
    <div v-if="isOpen" 
         class="chat-window fixed bottom-6 left-6 w-[calc(100vw-3rem)] sm:w-80 max-w-80 h-96 max-h-[70vh] bg-black/80 backdrop-blur-lg border border-primary-green/30 rounded-lg shadow-2xl z-[998] flex flex-col">
      <!-- Chat Header -->
      <div class="chat-header flex items-center justify-between p-4 border-b border-primary-green/20">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
          <span class="text-white font-medium">AI Assistant</span>
        </div>
        <button @click="toggleChat" class="text-white/60 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Messages Container -->
      <div class="chat-messages flex-1 p-4 overflow-y-auto space-y-3" ref="messagesContainer">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center h-full">
          <div class="loading-spinner w-8 h-8 border-2 border-primary-green/30 border-t-primary-green rounded-full animate-spin mb-4"></div>
          <p class="text-white text-center">Loading AI Assistant...</p>
        </div>
        
        <!-- Messages -->
        <div v-else>
          <div v-for="message in messages" :key="message.id" 
               :class="['message', message.type === 'user' ? 'user-message' : 'ai-message']">
            <div class="message-content p-3 rounded-lg max-w-[85%]" 
                 :class="message.type === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-primary-green/20 text-white border border-primary-green/30'">
              {{ message.content }}
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="isTyping" class="ai-message">
            <div class="message-content p-3 rounded-lg max-w-[85%] bg-primary-green/20 text-white border border-primary-green/30">
              <div class="typing-indicator flex space-x-1">
                <div class="dot w-2 h-2 bg-primary-green rounded-full animate-bounce"></div>
                <div class="dot w-2 h-2 bg-primary-green rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="dot w-2 h-2 bg-primary-green rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input p-4 border-t border-primary-green/20">
        <div class="flex space-x-2">
          <input 
            v-model="newMessage"
            @keyup.enter="sendMessage"
            :disabled="isLoading || !chatInitialized"
            placeholder="Ask me about Samuel's work..."
            class="flex-1 bg-black/40 border border-primary-green/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green disabled:opacity-50"
          />
          <button 
            @click="sendMessage"
            :disabled="!newMessage.trim() || isTyping || isLoading || !chatInitialized"
            class="bg-primary-green hover:bg-primary-green/80 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const isOpen = ref(false)
const newMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const chatInitialized = ref(false)
const isLoading = ref(false)
const isMobile = ref(false)
const messages = ref([])

let messageId = 1

const toggleChat = () => {
  if (!isOpen.value) {
    isOpen.value = true
    if (!chatInitialized.value) {
      initializeChat()
    }
    nextTick(() => scrollToBottom())
  } else {
    isOpen.value = false
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return

  const userMessage = {
    id: messageId++,
    type: 'user',
    content: newMessage.value
  }
  
  messages.value.push(userMessage)
  const userInput = newMessage.value.toLowerCase()
  newMessage.value = ''
  
  scrollToBottom()
  
  isTyping.value = true
  
  // Simulate AI thinking time
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))
  
  try {
    const response = getAIResponse(userInput)
    
    const aiMessage = {
      id: messageId++,
      type: 'ai',
      content: response
    }
    
    messages.value.push(aiMessage)
  } catch (error) {
    const errorMessage = {
      id: messageId++,
      type: 'ai',
      content: 'Sorry, I encountered an error. Please try again!'
    }
    messages.value.push(errorMessage)
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

const getBarbadosTime = () => {
  const now = new Date()
  const barbadosTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Barbados',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now)
  return barbadosTime
}

const getAIResponse = (input) => {
  // Time and location responses
  if (input.includes('time') || input.includes('barbados') || input.includes('clock') || input.includes('date')) {
    const timeResponses = [
      `🇧🇧 The current time in Barbados is: ${getBarbadosTime()}. Beautiful timing to explore Samuel's portfolio!`,
      `⏰ In Barbados right now it's: ${getBarbadosTime()}. Perfect time to check out some amazing web development work!`,
      `🌴 Barbados time: ${getBarbadosTime()}. Hope you're enjoying the Caribbean vibes while browsing Samuel's portfolio!`
    ]
    return timeResponses[Math.floor(Math.random() * timeResponses.length)]
  }

  // Greeting responses
  if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('greetings') || input.includes('good morning') || input.includes('good afternoon') || input.includes('good evening')) {
    const greetings = [
      "Hello! 👋 Great to meet you! I'm here to tell you all about Samuel's amazing work from beautiful Barbados!",
      "Hi there! 😊 Welcome to Samuel's portfolio. What would you like to know?",
      "Hey! 🚀 Thanks for stopping by. I'd love to share Samuel's story with you!",
      "Greetings! ✨ I'm excited to help you learn more about Samuel's skills and projects.",
      "Good day! 🌴 Samuel's portfolio is full of exciting projects - what interests you most?",
      "Welcome! 🎯 I'm here to help you discover Samuel's incredible web development skills!"
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  // Skills and technology questions
  if (input.includes('skill') || input.includes('technology') || input.includes('tech') || input.includes('programming') || input.includes('language') || input.includes('frontend') || input.includes('backend') || input.includes('fullstack') || input.includes('development') || input.includes('coding')) {
    const skillResponses = [
      "Samuel is skilled in Vue.js, Three.js, JavaScript, HTML, CSS, and modern web development frameworks. He's particularly passionate about creating interactive 3D experiences! 🎯",
      "His tech stack includes Vue 3 with Composition API, Three.js for 3D graphics, Tailwind CSS for styling, and Vite for build tooling. He also works with Node.js and Python! 💻",
      "Samuel specializes in frontend development with a focus on interactive experiences. He's expert in Vue.js ecosystem and 3D web graphics with Three.js! ⚡",
      "He's proficient in modern JavaScript (ES6+), responsive design, performance optimization, and creating engaging user interfaces with smooth animations! 🌟",
      "Samuel's expertise spans responsive web design, API integration, database management, and creating scalable web applications with clean, maintainable code! 🚀",
      "He's experienced with Git version control, Agile development, testing frameworks, and modern deployment strategies. Always keeping up with the latest web standards! 📚"
    ]
    return skillResponses[Math.floor(Math.random() * skillResponses.length)]
  }

  // Education and learning questions
  if (input.includes('education') || input.includes('learn') || input.includes('study') || input.includes('course') || input.includes('training') || input.includes('certification')) {
    const educationResponses = [
      "Samuel is a self-motivated learner who stays current with the latest web development trends and technologies. He's always expanding his skillset! 📚",
      "He continuously learns through hands-on projects, online courses, and staying engaged with the developer community. Practice makes perfect! 💪",
      "Samuel believes in lifelong learning and regularly explores new frameworks, tools, and best practices to deliver cutting-edge solutions! 🎓",
      "His learning approach combines theoretical knowledge with practical application - you can see this in his diverse portfolio projects! ✨"
    ]
    return educationResponses[Math.floor(Math.random() * educationResponses.length)]
  }

  // Career and professional questions
  if (input.includes('career') || input.includes('professional') || input.includes('job') || input.includes('position') || input.includes('role') || input.includes('opportunity')) {
    const careerResponses = [
      "Samuel is passionate about building innovative web solutions and is open to exciting career opportunities in frontend and full-stack development! 💼",
      "He's looking for roles where he can contribute to meaningful projects, work with modern technologies, and continue growing as a developer! 🌟",
      "Samuel values collaborative environments where he can share his expertise and learn from talented teams while building amazing user experiences! 🤝",
      "Whether it's a startup, established company, or freelance project, Samuel brings dedication, creativity, and technical excellence to every opportunity! 🚀"
    ]
    return careerResponses[Math.floor(Math.random() * careerResponses.length)]
  }

  // Performance and optimization questions
  if (input.includes('performance') || input.includes('optimization') || input.includes('speed') || input.includes('fast') || input.includes('efficient') || input.includes('responsive')) {
    const performanceResponses = [
      "Samuel is obsessed with performance! This portfolio itself showcases optimized loading, smooth animations, and efficient resource management! ⚡",
      "He implements lazy loading, code splitting, optimized images, and follows web performance best practices to ensure lightning-fast user experiences! 🏎️",
      "Samuel's work includes mobile-first responsive design, progressive web app features, and accessibility standards for inclusive user experiences! 📱",
      "Performance optimization is built into every project - from efficient Three.js rendering to optimized CSS and JavaScript bundles! 🎯"
    ]
    return performanceResponses[Math.floor(Math.random() * performanceResponses.length)]
  }

  // Project-related questions
  if (input.includes('project') || input.includes('work') || input.includes('portfolio') || input.includes('example')) {
    const projectResponses = [
      "Samuel's portfolio showcases interactive 3D projects, particle systems, and modern web applications. Check out the Projects section to see his Three.js work in action! 🎮",
      "His projects feature advanced particle systems, 3D cubes with space themes, and interactive playgrounds. Each project demonstrates his skills in creating engaging web experiences! 🚀",
      "You'll find projects that combine Vue.js with Three.js, creating immersive 3D experiences. His gravitational particle playground is particularly impressive! ✨",
      "Samuel builds responsive, performant web applications with beautiful animations and interactive elements. His attention to detail really shows! 🎨"
    ]
    return projectResponses[Math.floor(Math.random() * projectResponses.length)]
  }

  // Contact and hiring questions
  if (input.includes('contact') || input.includes('hire') || input.includes('email') || input.includes('reach') || input.includes('phone') || input.includes('number') || input.includes('call')) {
    const contactResponses = [
      "📧 Email: samuel.lowe@example.com | 📱 Phone: +1-246-XXX-XXXX | You can also scroll down to the Contact section on this page to use the contact form! 💼",
      "To get in touch with Samuel: Use the Contact section below, email him directly, or call his Barbados number. He responds quickly to all inquiries! 🚀",
      "📍 Contact Methods: 1) Scroll down to find the Contact section 2) Email samuel.lowe@example.com 3) Call +1-246-XXX-XXXX | Samuel loves discussing new opportunities! 🤝",
      "Want to reach Samuel? Scroll down to the Contact section of this portfolio, or email/call him directly. He's based in Barbados and available for projects worldwide! 🌴"
    ]
    return contactResponses[Math.floor(Math.random() * contactResponses.length)]
  }

  // Site navigation and sections
  if (input.includes('section') || input.includes('page') || input.includes('navigate') || input.includes('find') || input.includes('where') || input.includes('scroll') || input.includes('menu')) {
    const navigationResponses = [
      "🧭 This portfolio has several sections: About (Samuel's story), Skills (technical expertise), Projects (his work), Playground (interactive demos), and Contact (get in touch)! Scroll down to explore!",
      "📋 Navigation Guide: Use the menu at the top, or scroll down to see: About → Skills → Projects → Playground → Contact. Each section showcases different aspects of Samuel's work!",
      "🎯 Looking for something specific? The About section tells Samuel's story, Skills shows his expertise, Projects displays his work, Playground has interactive demos, and Contact has ways to reach him!",
      "✨ Portfolio Sections: About (background), Skills (tech stack), Projects (portfolio pieces), Playground (fun interactive stuff), Contact (reach out). The navigation menu at the top can jump you to any section!"
    ]
    return navigationResponses[Math.floor(Math.random() * navigationResponses.length)]
  }

  // Experience questions
  if (input.includes('experience') || input.includes('background') || input.includes('about')) {
    const expResponses = [
      "Samuel is a passionate web developer who specializes in creating interactive, engaging user experiences using modern web technologies! 🌟",
      "He has experience building full-stack applications, with a particular strength in frontend development and 3D web graphics! 💪",
      "Samuel combines technical expertise with creative vision to build web applications that not only function well but also delight users! 🎯",
      "His background spans from responsive web design to complex 3D animations, always focusing on performance and user experience! ⚡"
    ]
    return expResponses[Math.floor(Math.random() * expResponses.length)]
  }

  // Three.js specific questions
  if (input.includes('three') || input.includes('3d') || input.includes('animation') || input.includes('particle')) {
    const threeResponses = [
      "Samuel's Three.js work is outstanding! He creates interactive particle systems, 3D cubes, and immersive experiences that run smoothly across devices! 🎮",
      "His particle playground features gravitational effects and dynamic interactions - it's a great example of advanced Three.js development! ✨",
      "The 3D elements in this portfolio demonstrate his ability to optimize WebGL performance while creating visually stunning effects! 🚀",
      "Samuel's mastery of Three.js shows in his smooth animations, efficient rendering, and creative visual effects! 🎨"
    ]
    return threeResponses[Math.floor(Math.random() * threeResponses.length)]
  }

  // Design and creativity questions
  if (input.includes('design') || input.includes('ui') || input.includes('ux') || input.includes('creative') || input.includes('visual') || input.includes('aesthetic')) {
    const designResponses = [
      "Samuel has a keen eye for design! He combines technical skills with creative vision to build beautiful, user-friendly interfaces! 🎨",
      "His design approach focuses on clean, modern aesthetics with smooth animations and intuitive user experiences. Form meets function! ✨",
      "Samuel understands that great web development goes beyond code - it's about creating visually appealing and accessible experiences for all users! 🌟",
      "This portfolio itself showcases his design sensibilities with the dark theme, green accents, and smooth Three.js animations! 🎯"
    ]
    return designResponses[Math.floor(Math.random() * designResponses.length)]
  }

  // Collaboration and teamwork questions
  if (input.includes('team') || input.includes('collaborate') || input.includes('work together') || input.includes('communication') || input.includes('agile')) {
    const teamResponses = [
      "Samuel thrives in collaborative environments! He's experienced with Git workflows, code reviews, and communicating technical concepts clearly! 🤝",
      "He values teamwork and believes the best projects come from diverse perspectives and collaborative problem-solving! 👥",
      "Samuel is comfortable working in Agile environments, participating in stand-ups, and contributing to team discussions and planning! 📋",
      "Communication is key! Samuel documents his code well and enjoys mentoring others while learning from experienced developers! 💬"
    ]
    return teamResponses[Math.floor(Math.random() * teamResponses.length)]
  }

  // Fun and personality questions
  if (input.includes('fun') || input.includes('hobby') || input.includes('interests') || input.includes('passion') || input.includes('love') || input.includes('enjoy')) {
    const funResponses = [
      "Beyond coding, Samuel loves exploring new technologies, playing with creative animations, and bringing ideas to life through interactive web experiences! 🎮",
      "He's passionate about the intersection of art and technology - you can see this in his particle systems and 3D visualizations! 🌌",
      "Samuel enjoys problem-solving puzzles, whether it's optimizing code performance or creating smooth user interactions! 🧩",
      "Fun fact: This portfolio's interactive elements reflect Samuel's playful approach to web development - serious skills, creative expression! 🚀"
    ]
    return funResponses[Math.floor(Math.random() * funResponses.length)]
  }

  // Thank you and appreciation responses
  if (input.includes('thank') || input.includes('thanks') || input.includes('appreciate') || input.includes('awesome') || input.includes('great') || input.includes('amazing')) {
    const thankYouResponses = [
      "You're very welcome! 😊 Samuel would be thrilled to know you're interested in his work! Feel free to reach out through the contact form!",
      "Thank you for the kind words! 🙏 Samuel puts a lot of heart into his projects - your appreciation means a lot!",
      "So glad you're enjoying the portfolio! ✨ Samuel is always excited to connect with people who appreciate good web development!",
      "Thanks for taking the time to explore Samuel's work! 🌟 He's always open to discussing new projects and opportunities!"
    ]
    return thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)]
  }

  // Goodbye responses
  if (input.includes('bye') || input.includes('goodbye') || input.includes('see you') || input.includes('talk later') || input.includes('farewell')) {
    const goodbyeResponses = [
      "Goodbye! 👋 Thanks for visiting Samuel's portfolio. Don't forget to check out those projects and maybe drop him a line!",
      "See you later! 🌟 Hope you enjoyed learning about Samuel's work. Feel free to come back anytime!",
      "Farewell! ✨ Remember, Samuel is always open to new opportunities and collaborations. Take care!",
      "Bye for now! 🚀 Thanks for the great conversation. Samuel would love to hear from you!"
    ]
    return goodbyeResponses[Math.floor(Math.random() * goodbyeResponses.length)]
  }

  // Help and instruction questions
  if (input.includes('help') || input.includes('how') || input.includes('what can') || input.includes('commands') || input.includes('options')) {
    const helpResponses = [
      "🤖 I can help you with: 'skills' (Samuel's tech stack), 'projects' (his work), 'contact' (get his info), 'time' (Barbados time), 'about' (his background), 'navigate' (site sections), or just say 'hello'! Try any of these keywords!",
      "💡 Try asking about: • Skills/Technology • Projects/Work • Contact/Email/Phone • Experience/Background • Time in Barbados • Site Navigation • Career/Jobs • Design/Creative • Performance/Speed • Fun/Hobbies",
      "🎯 I'm programmed to respond to keywords like: 'skills', 'projects', 'contact', 'about', 'time', 'where', 'career', 'design', 'performance', 'team', 'thank you', 'goodbye' - try any of these!",
      "📚 Ask me about Samuel's: Technical skills, Portfolio projects, Contact information, Professional background, Career goals, Design approach, or site navigation. I also know the time in Barbados! 🇧🇧"
    ]
    return helpResponses[Math.floor(Math.random() * helpResponses.length)]
  }

  // Default responses for unmatched queries with better guidance
  const defaultResponses = [
    "🤔 I didn't catch that! Try asking about Samuel's 'skills', 'projects', 'contact info', 'experience', or 'time in Barbados'. You can also ask 'help' to see what I can do!",
    "😊 Not sure what you're looking for? Try keywords like: 'skills', 'projects', 'contact', 'about', 'navigate', 'career', 'design', or 'time'. Ask 'help' for more options!",
    "🎯 I'm here to help you learn about Samuel! Try asking about his 'technical skills', 'portfolio projects', 'contact information', or 'professional background'. Type 'help' for more ideas!",
    "🚀 That's interesting! I respond best to keywords like 'skills', 'projects', 'contact', 'experience', 'time', 'navigate', or 'career'. Want to try one of those, or type 'help' for more options?",
    "💭 I'd love to help! I know about Samuel's skills, projects, contact info, background, and more. Try asking about those topics, or type 'help' to see all my capabilities!",
    "🌟 Not quite sure what you're asking! I can tell you about Samuel's 'skills', 'projects', how to 'contact' him, his 'experience', or even the 'time in Barbados'. Try those keywords or ask for 'help'!"
  ]
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

const initializeChat = async () => {
  if (chatInitialized.value) return
  
  isLoading.value = true
  
  // Simulate loading time for mobile (actual AI functionality would load here)
  if (isMobile.value) {
    await new Promise(resolve => setTimeout(resolve, 800))
  }
  
  // Initialize messages
  messages.value.push({
    id: messageId++,
    type: 'ai',
    content: '👋 Hi! I\'m Samuel\'s AI assistant from Barbados! Ask me about his skills, projects, contact info, or type "help" to see all I can do! 🌴'
  })
  
  chatInitialized.value = true
  isLoading.value = false
  
  nextTick(() => scrollToBottom())
}

onMounted(() => {
  // Detect mobile
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
  
  // On desktop, initialize immediately for better UX
  if (!isMobile.value) {
    initializeChat()
  }
})
</script>

<style scoped>
.chatbot-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
}

.chat-toggle-btn {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.chat-window {
  animation: slideIn 0.3s ease-out;
  -webkit-overflow-scrolling: touch;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-messages {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 136, 0.3);
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 136, 0.5);
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile-specific optimizations */
@media (max-width: 640px) {
  .chat-window {
    width: calc(100vw - 3rem) !important;
    max-width: 320px;
    left: 1.5rem;
    right: 1.5rem;
  }
  
  .chat-toggle-btn {
    width: 56px;
    height: 56px;
    bottom: 1.5rem;
    left: 1.5rem;
  }
  
  .chat-toggle-btn svg {
    width: 24px;
    height: 24px;
  }
}

/* Improve touch targets on mobile */
@media (max-width: 768px) {
  .chat-input input {
    font-size: 16px; /* Prevents zoom on iOS */
    -webkit-appearance: none;
  }
  
  .chat-input button {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>
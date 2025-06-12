<template>
  <section id="contact" class="contact py-24 bg-black/60">
    <div class="container max-w-6xl mx-auto px-5">
      <h2 class="section-title text-4xl text-center mb-12 text-white relative">
        Get In Touch
        <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary-green rounded"></div>
      </h2>
      
      <div class="contact-content grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
        <!-- Contact Information -->
        <div class="contact-info flex flex-col gap-8">
          <div class="contact-item flex items-center gap-4 p-6 bg-dark-gray rounded-lg border border-primary-green/20 hover:border-primary-green transition-colors duration-300">
            <i class="fas fa-envelope text-2xl text-primary-green w-10"></i>
            <div>
              <h3 class="text-white font-semibold mb-1">Email</h3>
              <p class="text-light-gray">samuellowe90@hotmail.com</p>
            </div>
          </div>
          
          <div class="contact-item flex items-center gap-4 p-6 bg-dark-gray rounded-lg border border-primary-green/20 hover:border-primary-green transition-colors duration-300">
            <i class="fas fa-phone text-2xl text-primary-green w-10"></i>
            <div>
              <h3 class="text-white font-semibold mb-1">Phone</h3>
              <p class="text-light-gray">+1 (246) 239-1515</p>
            </div>
          </div>
          
          <div class="contact-item flex items-center gap-4 p-6 bg-dark-gray rounded-lg border border-primary-green/20 hover:border-primary-green transition-colors duration-300">
            <i class="fas fa-map-marker-alt text-2xl text-primary-green w-10"></i>
            <div>
              <h3 class="text-white font-semibold mb-1">Location</h3>
              <p class="text-light-gray">St. Philip, Barbados</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <form @submit.prevent="handleSubmit" class="contact-form flex flex-col gap-4">
          <div class="form-group">
            <input 
              v-model="form.name"
              type="text" 
              placeholder="Your Name" 
              required
              class="w-full p-4 bg-dark-gray border border-primary-green/30 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-primary-green transition-colors duration-300"
            >
          </div>
          
          <div class="form-group">
            <input 
              v-model="form.email"
              type="email" 
              placeholder="Your Email" 
              required
              class="w-full p-4 bg-dark-gray border border-primary-green/30 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-primary-green transition-colors duration-300"
            >
          </div>
          
          <div class="form-group">
            <input 
              v-model="form.subject"
              type="text" 
              placeholder="Subject" 
              required
              class="w-full p-4 bg-dark-gray border border-primary-green/30 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-primary-green transition-colors duration-300"
            >
          </div>
          
          <div class="form-group">
            <textarea 
              v-model="form.message"
              placeholder="Your Message" 
              rows="5" 
              required
              class="w-full p-4 bg-dark-gray border border-primary-green/30 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-primary-green transition-colors duration-300 resize-none"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-full py-4 bg-primary-green text-black font-semibold rounded-lg hover:bg-dark-green transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary-green/30"
          >
            Send Message
          </button>
        </form>
      </div>

      <!-- Notification -->
      <div 
        v-if="notification.show" 
        :class="[
          'fixed top-5 right-5 sm:top-8 sm:right-8 p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 max-w-xs sm:max-w-sm transform transition-all duration-300',
          notification.type === 'success' ? 'bg-primary-green text-black' : 'bg-red-500 text-white'
        ]"
        style="margin-right: max(1.25rem, env(safe-area-inset-right)); margin-top: max(1.25rem, env(safe-area-inset-top));"
      >
        <span>{{ notification.message }}</span>
        <button @click="notification.show = false" class="text-xl font-bold">&times;</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import emailjs from '@emailjs/browser'

// Initialize EmailJS
onMounted(() => {
  emailjs.init('_AHk61S56x74MUxru')
})

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const showNotification = (message, type = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

const handleSubmit = async () => {
  // Validate form
  if (!form.name || !form.email || !form.subject || !form.message) {
    showNotification('Please fill in all required fields.', 'error')
    return
  }
  
  if (!isValidEmail(form.email)) {
    showNotification('Please enter a valid email address.', 'error')
    return
  }
  
  try {
    // Send email using EmailJS
    await emailjs.send(
      'service_8swiob4',
      'template_49fbrj2',
      {
        from_name: form.name,
        from_email: form.email,
        subject: form.subject,
        message: form.message,
        to_email: 'samuellowe90@hotmail.com'
      }
    )
    
    showNotification('Thank you! Your message has been sent.', 'success')
    
    // Reset form
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
  } catch (error) {
    console.error('EmailJS Error:', error)
    showNotification('Sorry, there was an error sending your message. Please try again.', 'error')
  }
}
</script>
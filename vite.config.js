import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Bundle size optimization
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'vendor': ['vue'],
          'emailjs': ['@emailjs/browser']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['three', 'vue', '@emailjs/browser']
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false
    }
  }
})
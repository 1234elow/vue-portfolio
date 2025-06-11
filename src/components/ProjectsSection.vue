<template>
  <section id="projects" class="projects py-24 bg-dark-gray/70">
    <div class="container max-w-6xl mx-auto px-5">
      <h2 class="section-title text-4xl text-center mb-12 text-white relative">
        Featured Projects
        <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary-green rounded"></div>
      </h2>
      
      <div class="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Mobile App Backend & Web Scraping -->
        <div class="project-card bg-medium-gray rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-2 border border-primary-green/20 hover:border-primary-green">
          <div class="project-image h-48 bg-gradient-to-br from-dark-gray to-medium-gray relative flex items-center justify-center">
            <div class="project-overlay absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div class="project-links flex gap-4">
                <a href="#" class="project-link w-12 h-12 bg-primary-green text-black flex items-center justify-center rounded-full hover:bg-light-green hover:scale-110 transition-all duration-300">
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="#" class="project-link w-12 h-12 bg-primary-green text-black flex items-center justify-center rounded-full hover:bg-light-green hover:scale-110 transition-all duration-300">
                  <i class="fab fa-gitlab"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="project-content p-6">
            <h3 class="project-title text-white text-xl font-semibold mb-4">Mobile App Backend & Web Scraping</h3>
            <p class="project-description text-light-gray mb-6 leading-relaxed">
              Developed mobile application backend and website scraping solutions during 
              internship at Yick Solutions Ltd. Collaborated with senior leaders and debugged code.
            </p>
            <div class="project-tech flex flex-wrap gap-2">
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">Node.js</span>
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">Express EJS</span>
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">Postman</span>
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">Swagger</span>
            </div>
          </div>
        </div>

        <!-- IT Infrastructure Management -->
        <div class="project-card bg-medium-gray rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-2 border border-primary-green/20 hover:border-primary-green">
          <div class="project-image h-48 bg-gradient-to-br from-dark-gray to-medium-gray relative flex items-center justify-center">
            <div class="project-overlay absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div class="project-links flex gap-4">
                <a href="#" class="project-link w-12 h-12 bg-primary-green text-black flex items-center justify-center rounded-full hover:bg-light-green hover:scale-110 transition-all duration-300">
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="#" class="project-link w-12 h-12 bg-primary-green text-black flex items-center justify-center rounded-full hover:bg-light-green hover:scale-110 transition-all duration-300">
                  <i class="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="project-content p-6">
            <h3 class="project-title text-white text-xl font-semibold mb-4">IT Infrastructure Management</h3>
            <p class="project-description text-light-gray mb-6 leading-relaxed">
              Led organizational technology strategy and roadmaps at The Parsley Patch. 
              Managed daily performance of computer systems and resolved network issues.
            </p>
            <div class="project-tech flex flex-wrap gap-2">
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">Network Management</span>
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">System Administration</span>
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">Hardware/Software</span>
            </div>
          </div>
        </div>

        <!-- Mobile & Web Applications -->
        <div class="project-card bg-medium-gray rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-2 border border-primary-green/20 hover:border-primary-green">
          <div class="project-image h-48 bg-gradient-to-br from-dark-gray to-medium-gray relative flex items-center justify-center">
            <div class="project-overlay absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div class="project-links flex gap-4">
                <a href="#" class="project-link w-12 h-12 bg-primary-green text-black flex items-center justify-center rounded-full hover:bg-light-green hover:scale-110 transition-all duration-300">
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="#" class="project-link w-12 h-12 bg-primary-green text-black flex items-center justify-center rounded-full hover:bg-light-green hover:scale-110 transition-all duration-300">
                  <i class="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="project-content p-6">
            <h3 class="project-title text-white text-xl font-semibold mb-4">Mobile & Web Applications</h3>
            <p class="project-description text-light-gray mb-6 leading-relaxed">
              Built various web applications and native mobile apps during university studies. 
              Specialized in iOS and Android application development with database integration.
            </p>
            <div class="project-tech flex flex-wrap gap-2">
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">iOS Development</span>
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">Android Development</span>
              <span class="tech-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm border border-primary-green/30">Database Systems</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Projects logic
</script>
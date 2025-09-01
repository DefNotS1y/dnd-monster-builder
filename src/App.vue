<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-parchment">
    <!-- Navigation Header -->
    <header class="bg-brown-900 text-parchment shadow-lg border-b-2 border-golden">
      <div class="container mx-auto px-4">
        <nav class="flex items-center justify-between h-16">
          <h1 class="text-2xl font-medieval">D&D Monster Builder</h1>
          <div class="flex space-x-4">
            <RouterLink 
              v-for="link in links" 
              :key="link.to" 
              :to="link.to"
              class="nav-link"
              :class="{ 'router-link-active': $route.path === link.to }"
            >
              {{ link.text }}
            </RouterLink>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-brown-900 text-parchment py-4 mt-8">
      <div class="container mx-auto px-4 text-center">
        <p class="font-medieval">Built with Vue.js & D&D 5E API</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { to: '/', text: 'Monster List' },
        { to: '/builder', text: 'Monster Builder' }
      ]
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --color-brown-900: #3d2b1f;
  --color-parchment: #f4e4bc;
  --color-golden: #c9b037;
  --color-red-900: #7c1f1f;
  
  /* Font families */
  --font-heading: 'MedievalSharp', cursive;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Base typography */
body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  letter-spacing: -0.025em;
}

.bg-brown-900 {
  background-color: var(--color-brown-900);
}

.bg-parchment {
  background-color: var(--color-parchment);
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='%23e5d5b3' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.text-parchment {
  color: var(--color-parchment);
}

.border-golden {
  border-color: var(--color-golden);
}

.font-medieval {
  font-family: var(--font-heading);
  letter-spacing: -0.025em;
}

/* Enterprise-friendly text classes */
.font-body {
  font-family: var(--font-body);
}

.text-base {
  font-size: 1rem;
  line-height: 1.5;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  color: var(--color-parchment);
  font-family: 'MedievalSharp', cursive;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.router-link-active {
  color: var(--color-golden);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--color-parchment);
}

::-webkit-scrollbar-thumb {
  background: var(--color-brown-900);
  border-radius: 6px;
  border: 3px solid var(--color-parchment);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-red-900);
}
</style>

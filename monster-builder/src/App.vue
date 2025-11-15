<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const isLoading = ref(false)
const links = [
  { to: '/', text: 'Monster List' },
  { to: '/builder', text: 'Monster Builder' },
]

const setLoading = (value) => {
  isLoading.value = value
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-parchment overflow-x-hidden">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-brown-900/90"
    >
      <div class="text-center">
        <div class="mb-4">
          <svg class="animate-spin-slow mx-auto w-20 h-20" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="var(--color-golden)"
              stroke-width="2"
              d="M12 2 L12 6 M12 18 L12 22 M4.93 4.93 L7.76 7.76 M16.24 16.24 L19.07 19.07 M2 12 L6 12 M18 12 L22 12 M4.93 19.07 L7.76 16.24 M16.24 7.76 L19.07 4.93"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
        <p class="text-parchment font-medieval text-2xl">Rolling for Initiative...</p>
        <div class="mt-4 space-y-1">
          <div class="loading-rune"></div>
          <div class="loading-rune"></div>
          <div class="loading-rune"></div>
        </div>
      </div>
    </div>

    <!-- Navigation Header -->
    <header class="bg-brown-900 text-parchment shadow-lg border-b-2 border-golden">
      <div class="container mx-auto px-4">
        <nav class="relative flex items-center justify-between h-16">
          <img
            src="@/assets/logo_mb.png"
            alt="Monster Builder Logo"
            class="h-12 w-auto absolute left-1"
          />
          <h1
            class="text-2xl font-medieval absolute left-1/2 -translate-x-1/2"
            style="color: #f5e6d3"
          >
            Dungeons and Dragons Monster Builder
          </h1>
          <div class="flex space-x-4 ml-auto">
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
    <main class="container mx-auto px-4 py-8 flex-grow">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" @loading="setLoading" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer class="bg-brown-900 text-parchment py-4 mt-auto">
      <div class="container mx-auto px-4 text-center">
        <p class="font-medieval">Built with Vue.js & D&D 5E API</p>
      </div>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-rune {
  width: 100px;
  height: 4px;
  background: var(--color-golden);
  margin: 0 auto;
  animation: glow 1.5s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    opacity: 0.5;
    box-shadow: 0 0 5px var(--color-golden);
  }
  to {
    opacity: 1;
    box-shadow: 0 0 20px var(--color-golden);
  }
}
</style>

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

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-heading);
  letter-spacing: -0.025em;
}

/* Loading animations */
@keyframes runeGlow {
  0% {
    width: 0%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
}

.loading-rune {
  height: 2px;
  background: var(--color-golden);
  margin: 0 auto;
  max-width: 200px;
  animation: runeGlow 2s ease-in-out infinite;
}

.loading-rune:nth-child(2) {
  animation-delay: 0.5s;
}

.loading-rune:nth-child(3) {
  animation-delay: 1s;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bg-brown-900 {
  background-color: var(--color-brown-900);
}

.bg-parchment {
  background-color: var(--color-parchment);
  background-image:
    linear-gradient(rgba(245, 230, 211, 0.7), rgba(245, 230, 211, 0.7)),
    url('@/assets/faerun_bg.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  min-height: 100vh;
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

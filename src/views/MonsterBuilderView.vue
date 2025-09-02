<template>
  <div class="relative min-h-screen flex flex-col items-center p-4">
    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-black/40 -z-10"></div>
    <div class="w-full">
      <MonsterBuilder />
    </div>
  </div>
</template>

<script setup>
import MonsterBuilder from '../components/MonsterBuilder.vue'
</script>

<style scoped>
/* Add basic styling here */
</style>

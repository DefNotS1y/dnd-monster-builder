<template>
  <div class="relative min-h-screen flex flex-col items-center p-4">
    <div class="absolute inset-0 bg-black/40 -z-10"></div>
    <div class="w-full max-w-4xl">
      <button
        @click="$router.back()"
        class="mb-4 bg-brown-900 text-parchment px-4 py-2 rounded-lg font-semibold hover:bg-red-900 transition-colors duration-200 flex items-center gap-2"
      >
        <span class="text-lg">←</span>
        Back to List
      </button>
      <h1 class="text-2xl font-bold mb-4 text-center">Monster Detail</h1>
      <div class="w-full">
        <MonsterDetail :index="$route.params.index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import MonsterDetail from '../components/MonsterDetail.vue'
</script>

<style scoped>
</style>

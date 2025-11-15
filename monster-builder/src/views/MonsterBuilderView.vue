<template>
  <div class="relative min-h-screen flex flex-col items-center p-4">
    <div class="absolute inset-0 bg-black/40 -z-10"></div>
    <div class="w-full">
      <Suspense>
        <template #default>
          <MonsterBuilder />
        </template>
        <template #fallback>
          <div class="loading-container">
            <div class="relative w-[200px] h-[200px] mx-auto">
              <D20Dice />
            </div>
            <p class="text-center mt-4 font-medieval text-xl text-golden animate-pulse">
              Preparing the forge...
            </p>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import MonsterBuilder from '../components/MonsterBuilder.vue'
import D20Dice from '../components/D20Dice.vue'
</script>

<style scoped>
</style>

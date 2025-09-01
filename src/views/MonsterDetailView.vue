<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Monster Detail</h1>
    <MonsterDetail :index="$route.params.index" />
  </div>
</template>

<script setup>
import MonsterDetail from '../components/MonsterDetail.vue'
</script>

<style scoped>
/* Add basic styling here */
</style>

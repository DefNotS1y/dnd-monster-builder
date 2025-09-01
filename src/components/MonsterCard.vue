<template>
  <div class="border rounded p-3 mb-2 bg-white shadow">
    <h2 class="font-semibold text-lg">{{ monster.name }}</h2>
    <p>Type: {{ monster.type }}</p>
    <router-link :to="`/monster/${monster.index}`" class="text-blue-500 underline">View Details</router-link>
  </div>
</template>

<script setup>
defineProps({ monster: Object })
</script>

<style scoped>
/* Add basic styling here */
</style>

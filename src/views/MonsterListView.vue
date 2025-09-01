<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Monster List</h1>
    <!-- Search/filter UI and monster cards will go here -->
    <div>
      <MonsterCard v-for="monster in monsters" :key="monster.index" :monster="monster" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MonsterCard from '../components/MonsterCard.vue'

const monsters = ref([])

onMounted(async () => {
  const res = await axios.get('https://www.dnd5eapi.co/api/monsters')
  monsters.value = res.data.results
})
</script>

<style scoped>
/* Add basic styling here */
</style>

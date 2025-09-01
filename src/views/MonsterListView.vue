<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Monster List</h1>
    <div v-if="monsterStore.loading" class="text-center py-4">
      Loading monsters...
    </div>
    <div v-else-if="monsterStore.error" class="text-red-500 text-center py-4">
      {{ monsterStore.error }}
    </div>
    <template v-else>
      <!-- Search/filter UI -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search monsters..."
          class="w-full p-2 border rounded"
          @input="filterMonsters"
        />
      </div>
      <!-- Monster cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MonsterCard
          v-for="monster in filteredMonsters"
          :key="monster.index"
          :monster="monster"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMonsterStore } from '../stores/monsters'
import MonsterCard from '../components/MonsterCard.vue'

const monsterStore = useMonsterStore()
const searchQuery = ref('')

const filteredMonsters = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return monsterStore.getAllMonsters.filter(monster => 
    monster.name.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  if (monsterStore.getAllMonsters.length === 0) {
    await monsterStore.fetchMonsters()
  }
})
</script>

<style scoped>
/* Add basic styling here */
</style>

<template>
  <div v-if="displayMonster" class="border rounded p-4 bg-white shadow">
    <h2 class="font-bold text-xl mb-2">{{ displayMonster.name }}</h2>
    <p><strong>Type:</strong> {{ displayMonster.type }}</p>
    <p><strong>Armor Class:</strong> {{ displayMonster.armor_class }}</p>
    <p><strong>Hit Points:</strong> {{ displayMonster.hit_points }}</p>
    <p><strong>Stats:</strong></p>
    <ul>
      <li>STR: {{ displayMonster.strength }}</li>
      <li>DEX: {{ displayMonster.dexterity }}</li>
      <li>CON: {{ displayMonster.constitution }}</li>
      <li>INT: {{ displayMonster.intelligence }}</li>
      <li>WIS: {{ displayMonster.wisdom }}</li>
      <li>CHA: {{ displayMonster.charisma }}</li>
    </ul>
    <div v-if="displayMonster.actions && displayMonster.actions.length">
      <h3 class="mt-4 font-semibold">Actions</h3>
      <ul>
        <li v-for="action in displayMonster.actions" :key="action.name">
          <strong>{{ action.name }}:</strong> {{ action.desc }}
        </li>
      </ul>
    </div>
  </div>
  <div v-else-if="monsterStore.loading">
    Loading...
  </div>
  <div v-else class="text-red-500">
    Monster not found
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMonsterStore } from '../stores/monsters'

const props = defineProps({ 
  index: String,
  monster: {
    type: Object,
    default: null
  }
})

const monsterStore = useMonsterStore()
const displayMonster = computed(() => props.monster || monsterStore.currentMonster)

onMounted(async () => {
  if (props.index && !props.monster) {
    await monsterStore.fetchMonsterDetails(props.index)
  }
})
</script>

<style scoped>
/* Add basic styling here */
</style>

<template>
  <div v-if="monster" class="border rounded p-4 bg-white shadow">
    <h2 class="font-bold text-xl mb-2">{{ monster.name }}</h2>
    <p><strong>Type:</strong> {{ monster.type }}</p>
    <p><strong>Armor Class:</strong> {{ monster.armor_class }}</p>
    <p><strong>Hit Points:</strong> {{ monster.hit_points }}</p>
    <p><strong>Stats:</strong></p>
    <ul>
      <li>STR: {{ monster.strength }}</li>
      <li>DEX: {{ monster.dexterity }}</li>
      <li>CON: {{ monster.constitution }}</li>
      <li>INT: {{ monster.intelligence }}</li>
      <li>WIS: {{ monster.wisdom }}</li>
      <li>CHA: {{ monster.charisma }}</li>
    </ul>
    <div v-if="monster.actions && monster.actions.length">
      <h3 class="mt-4 font-semibold">Actions</h3>
      <ul>
        <li v-for="action in monster.actions" :key="action.name">
          <strong>{{ action.name }}:</strong> {{ action.desc }}
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const props = defineProps({ index: String })
const monster = ref(null)

onMounted(async () => {
  const res = await axios.get(`https://www.dnd5eapi.co/api/monsters/${props.index}`)
  monster.value = res.data
})
</script>

<style scoped>
/* Add basic styling here */
</style>

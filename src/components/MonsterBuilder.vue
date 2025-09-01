<template>
  <div class="border rounded p-4 bg-white shadow">
    <h2 class="font-bold text-xl mb-2">Monster Builder</h2>
    <form @submit.prevent="previewMonster">
      <div class="mb-2">
        <label class="block">Name:</label>
        <input v-model="monster.name" class="border p-1 w-full" required />
      </div>
      <div class="mb-2">
        <label class="block">Type:</label>
        <input v-model="monster.type" class="border p-1 w-full" required />
      </div>
      <div class="mb-2">
        <label class="block">Armor Class:</label>
        <input type="number" v-model.number="monster.armor_class" class="border p-1 w-full" required />
      </div>
      <div class="mb-2">
        <label class="block">Hit Points:</label>
        <input type="number" v-model.number="monster.hit_points" class="border p-1 w-full" required />
      </div>
      <div class="mb-2 grid grid-cols-2 gap-2">
        <div>
          <label>STR:</label>
          <input type="number" v-model.number="monster.strength" class="border p-1 w-full" required />
        </div>
        <div>
          <label>DEX:</label>
          <input type="number" v-model.number="monster.dexterity" class="border p-1 w-full" required />
        </div>
        <div>
          <label>CON:</label>
          <input type="number" v-model.number="monster.constitution" class="border p-1 w-full" required />
        </div>
        <div>
          <label>INT:</label>
          <input type="number" v-model.number="monster.intelligence" class="border p-1 w-full" required />
        </div>
        <div>
          <label>WIS:</label>
          <input type="number" v-model.number="monster.wisdom" class="border p-1 w-full" required />
        </div>
        <div>
          <label>CHA:</label>
          <input type="number" v-model.number="monster.charisma" class="border p-1 w-full" required />
        </div>
      </div>
      <div class="mb-2">
        <label class="block">Actions (comma separated):</label>
        <input v-model="actionsInput" class="border p-1 w-full" />
      </div>
      <div class="flex gap-2">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Preview</button>
        <button 
          type="button" 
          @click="saveMonster" 
          class="bg-green-500 text-white px-4 py-2 rounded"
          :disabled="!preview"
        >
          Save Monster
        </button>
      </div>
    </form>
    <div v-if="preview" class="mt-4">
      <h3 class="font-semibold">Preview</h3>
      <MonsterDetail :monster="monsterPreview" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMonsterStore } from '../stores/monsters'
import MonsterDetail from './MonsterDetail.vue'

const monsterStore = useMonsterStore()
const monster = ref({
  name: '',
  type: '',
  armor_class: 10,
  hit_points: 1,
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  actions: []
})
const actionsInput = ref('')
const preview = ref(false)
const monsterPreview = ref(null)

function previewMonster() {
  monster.value.actions = actionsInput.value
    .split(',')
    .map(a => a.trim())
    .filter(a => a)
    .map(name => ({ name, desc: '' }))
  monsterPreview.value = { ...monster.value }
  preview.value = true
}

function saveMonster() {
  monsterStore.addCustomMonster(monster.value)
  // Reset form
  monster.value = {
    name: '',
    type: '',
    armor_class: 10,
    hit_points: 1,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    actions: []
  }
  actionsInput.value = ''
  preview.value = false
  monsterPreview.value = null
}
</script>

<style scoped>
/* Add basic styling here */
</style>

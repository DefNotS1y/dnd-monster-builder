<template>
  <div class="max-w-3xl mx-auto bg-white/80 rounded-lg border-2 border-brown-900 p-6 shadow-lg">
    <h2 class="text-3xl text-center mb-6 font-medieval text-brown-900">Forge Your Monster</h2>
    
    <form @submit.prevent="previewMonster" class="space-y-6">
      <!-- Basic Info -->
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="block font-medieval mb-2 text-red-900">Name:</label>
          <input 
            v-model="monster.name" 
            class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden" 
            required 
          />
        </div>
        <div>
          <label class="block font-medieval mb-2 text-red-900">Type:</label>
          <input 
            v-model="monster.type" 
            class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden" 
            required 
          />
        </div>
        <div>
          <label class="block font-medieval mb-2 text-red-900">Size:</label>
          <select 
            v-model="monster.size" 
            class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden"
            required
          >
            <option value="Tiny">Tiny</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Huge">Huge</option>
            <option value="Gargantuan">Gargantuan</option>
          </select>
        </div>
      </div>

      <!-- Combat Stats -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medieval mb-2 text-red-900">Armor Class:</label>
          <input 
            type="number" 
            v-model.number="monster.armor_class" 
            class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden" 
            required 
          />
        </div>
        <div>
          <label class="block font-medieval mb-2 text-red-900">Hit Points:</label>
          <input 
            type="number" 
            v-model.number="monster.hit_points" 
            class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden" 
            required 
          />
        </div>
      </div>

      <!-- Ability Scores -->
      <div>
        <h3 class="font-medieval text-xl mb-4 text-center text-brown-900">Ability Scores</h3>
        <div class="grid grid-cols-3 gap-4">
          <div 
            v-for="ability in abilities" 
            :key="ability.key" 
            class="bg-white/50 border-2 border-brown-900 rounded-lg p-4"
          >
            <label class="block font-medieval mb-2 text-red-900">{{ ability.label }}:</label>
            <input 
              type="number" 
              v-model.number="monster[ability.key]" 
              class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-golden" 
              required 
              min="1"
              max="30"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div>
        <label class="block font-medieval mb-2 text-red-900">Actions (comma separated):</label>
        <textarea 
          v-model="actionsInput" 
          class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-golden"
          placeholder="Bite, Claw, Tail Swipe..."
        ></textarea>
      </div>

      <!-- Buttons -->
      <div class="flex justify-center gap-4">
        <button 
          type="submit" 
          class="bg-brown-900 text-parchment px-6 py-2 rounded-lg font-medieval hover:bg-red-900 transition-colors duration-200"
        >
          Preview Monster
        </button>
        <button 
          type="button" 
          @click="saveMonster" 
          class="bg-parchment text-brown-900 px-6 py-2 rounded-lg font-medieval border-2 border-brown-900 hover:bg-golden hover:border-golden transition-colors duration-200"
          :disabled="!preview"
          :class="{'opacity-50 cursor-not-allowed': !preview}"
        >
          Save to Bestiary
        </button>
      </div>
    </form>

    <!-- Preview -->
    <div v-if="preview" class="mt-8">
      <h3 class="font-medieval text-2xl text-center mb-4 text-brown-900">Monster Preview</h3>
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
  size: 'Medium',
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

const abilities = [
  { key: 'strength', label: 'STR' },
  { key: 'dexterity', label: 'DEX' },
  { key: 'constitution', label: 'CON' },
  { key: 'intelligence', label: 'INT' },
  { key: 'wisdom', label: 'WIS' },
  { key: 'charisma', label: 'CHA' }
]

const actionsInput = ref('')
const preview = ref(false)
const monsterPreview = ref(null)

function previewMonster() {
  monster.value.actions = actionsInput.value
    .split(',')
    .map(a => a.trim())
    .filter(a => a)
    .map(name => ({ name, desc: 'Description pending...' }))
  monsterPreview.value = { ...monster.value }
  preview.value = true
}

function saveMonster() {
  monsterStore.addCustomMonster(monster.value)
  // Reset form after saving
  monster.value = {
    name: '',
    type: '',
    size: 'Medium',
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
.stat-input-box {
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--color-brown-900);
  border-radius: 0.5rem;
  padding: 1rem;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

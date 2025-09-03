<template>
  <div
    class="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg border-2 border-golden p-6 shadow-medieval"
  >
    <h1 class="text-3xl font-medieval text-brown-900 mb-6 text-center">Monster Builder</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Builder Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white/50 rounded-lg border border-brown-900 p-4">
          <h2 class="text-xl font-medieval text-red-900 mb-4">Basic Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-medieval text-brown-900 mb-2">Name</label>
              <input v-model="monster.name" type="text" class="input-field" required />
            </div>
            <div>
              <label class="block font-medieval text-brown-900 mb-2">Size</label>
              <select v-model="monster.size" class="input-field" required>
                <option value="">Select Size</option>
                <option value="Tiny">Tiny</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Huge">Huge</option>
                <option value="Gargantuan">Gargantuan</option>
              </select>
            </div>
            <div>
              <label class="block font-medieval text-brown-900 mb-2">Type</label>
              <select v-model="monster.type" class="input-field" required>
                <option value="">Select Type</option>
                <option value="Aberration">Aberration</option>
                <option value="Beast">Beast</option>
                <option value="Celestial">Celestial</option>
                <option value="Construct">Construct</option>
                <option value="Dragon">Dragon</option>
                <option value="Elemental">Elemental</option>
                <option value="Fey">Fey</option>
                <option value="Fiend">Fiend</option>
                <option value="Giant">Giant</option>
                <option value="Humanoid">Humanoid</option>
                <option value="Monstrosity">Monstrosity</option>
                <option value="Ooze">Ooze</option>
                <option value="Plant">Plant</option>
                <option value="Undead">Undead</option>
              </select>
            </div>
            <div>
              <label class="block font-medieval text-brown-900 mb-2">Alignment</label>
              <select v-model="monster.alignment" class="input-field" required>
                <option value="">Select Alignment</option>
                <option value="lawful good">Lawful Good</option>
                <option value="lawful neutral">Lawful Neutral</option>
                <option value="lawful evil">Lawful Evil</option>
                <option value="neutral good">Neutral Good</option>
                <option value="neutral">Neutral</option>
                <option value="neutral evil">Neutral Evil</option>
                <option value="chaotic good">Chaotic Good</option>
                <option value="chaotic neutral">Chaotic Neutral</option>
                <option value="chaotic evil">Chaotic Evil</option>
                <option value="unaligned">Unaligned</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Combat Stats -->
        <div class="bg-white/50 rounded-lg border border-brown-900 p-4">
          <h2 class="text-xl font-medieval text-red-900 mb-4">Combat Stats</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-medieval text-brown-900 mb-2">Armor Class</label>
              <input
                v-model.number="monster.armor_class"
                type="number"
                min="1"
                class="input-field"
                required
              />
            </div>
            <div>
              <label class="block font-medieval text-brown-900 mb-2">Hit Points</label>
              <input
                v-model.number="monster.hit_points"
                type="number"
                min="1"
                class="input-field"
                required
              />
            </div>
          </div>
        </div>

        <!-- Ability Scores -->
        <div class="bg-white/50 rounded-lg border border-brown-900 p-4">
          <h2 class="text-xl font-medieval text-red-900 mb-4">Ability Scores</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div v-for="ability in abilities" :key="ability.key">
              <label class="block font-medieval text-brown-900 mb-2">{{ ability.label }}</label>
              <input
                v-model.number="monster[ability.key]"
                type="number"
                min="1"
                max="30"
                class="input-field text-center"
                required
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white/50 rounded-lg border border-brown-900 p-4">
          <h2 class="text-xl font-medieval text-red-900 mb-4">Actions</h2>
          <div class="space-y-4">
            <div v-for="(action, index) in monster.actions" :key="index" class="space-y-2">
              <div class="flex gap-2">
                <input
                  v-model="action.name"
                  type="text"
                  placeholder="Action Name"
                  class="input-field flex-1"
                />
                <button
                  type="button"
                  @click="removeAction(index)"
                  class="px-2 py-1 bg-red-900 text-parchment rounded hover:bg-red-800"
                >
                  Remove
                </button>
              </div>
              <textarea
                v-model="action.desc"
                placeholder="Action Description"
                rows="2"
                class="input-field w-full"
              ></textarea>
            </div>
            <button type="button" @click="addAction" class="btn-secondary w-full">
              Add Action
            </button>
          </div>
        </div>

        <!-- Damage Modifiers -->
        <div class="bg-white/50 rounded-lg border border-brown-900 p-4">
          <h2 class="text-xl font-medieval text-red-900 mb-4">Damage Modifiers</h2>

          <!-- Vulnerabilities -->
          <div class="mb-4">
            <h3 class="font-medieval text-brown-900 mb-2">Vulnerabilities</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label v-for="type in damageTypes" :key="type" class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :value="type"
                  v-model="monster.damage_vulnerabilities"
                  class="rounded border-brown-900 text-red-900 focus:ring-red-900"
                />
                <span class="font-body">{{ type }}</span>
              </label>
            </div>
          </div>

          <!-- Resistances -->
          <div class="mb-4">
            <h3 class="font-medieval text-brown-900 mb-2">Resistances</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label v-for="type in damageTypes" :key="type" class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :value="type"
                  v-model="monster.damage_resistances"
                  class="rounded border-brown-900 text-red-900 focus:ring-red-900"
                />
                <span class="font-body">{{ type }}</span>
              </label>
            </div>
          </div>

          <!-- Immunities -->
          <div>
            <h3 class="font-medieval text-brown-900 mb-2">Immunities</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label v-for="type in damageTypes" :key="type" class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :value="type"
                  v-model="monster.damage_immunities"
                  class="rounded border-brown-900 text-red-900 focus:ring-red-900"
                />
                <span class="font-body">{{ type }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center">
          <button type="submit" class="btn-primary">Save Monster</button>
        </div>
      </form>

      <!-- Live Preview -->
      <div class="bg-white/95 rounded-lg border-2 border-brown-900 p-6">
        <h2 class="text-2xl font-medieval text-red-900 mb-4">Monster Preview</h2>
        <div class="stat-block">
          <div class="border-b-2 border-brown-900 pb-4 mb-4">
            <h3 class="text-2xl font-medieval text-brown-900">
              {{ monster.name || 'Unnamed Monster' }}
            </h3>
            <p class="font-body italic">
              {{ monster.size || 'Size' }} {{ monster.type || 'type' }},
              {{ monster.alignment || 'alignment' }}
            </p>
          </div>

          <!-- Basic Stats -->
          <div class="space-y-2 mb-4">
            <p class="font-body">
              <span class="font-medieval">Armor Class</span> {{ monster.armor_class || 0 }}
            </p>
            <p class="font-body">
              <span class="font-medieval">Hit Points</span> {{ monster.hit_points || 0 }}
            </p>
            <p class="font-body">
              <span class="font-medieval">Challenge Rating</span> {{ calculatedCR }} ({{
                xpByCR[calculatedCR] || 0
              }}
              XP)
            </p>
          </div>

          <!-- Ability Scores -->
          <div class="grid grid-cols-6 gap-4 mb-4 text-center">
            <div v-for="ability in abilities" :key="ability.key" class="stat-box">
              <div class="stat-label">{{ ability.label }}</div>
              <div class="stat-value">{{ monster[ability.key] || 10 }}</div>
              <div class="stat-modifier">
                {{ formatModifier(calculateModifier(monster[ability.key])) }}
              </div>
            </div>
          </div>

          <!-- Damage Modifiers -->
          <div v-if="hasAnyDamageModifiers" class="space-y-2 mb-4">
            <div v-if="monster.damage_vulnerabilities?.length" class="font-body">
              <span class="font-medieval">Damage Vulnerabilities</span>
              {{ monster.damage_vulnerabilities.join(', ') }}
            </div>
            <div v-if="monster.damage_resistances?.length" class="font-body">
              <span class="font-medieval">Damage Resistances</span>
              {{ monster.damage_resistances.join(', ') }}
            </div>
            <div v-if="monster.damage_immunities?.length" class="font-body">
              <span class="font-medieval">Damage Immunities</span>
              {{ monster.damage_immunities.join(', ') }}
            </div>
          </div>

          <!-- Actions -->
          <div v-if="monster.actions?.length" class="mt-4">
            <h4 class="text-xl font-medieval text-red-900 mb-2">Actions</h4>
            <div class="space-y-2">
              <div v-for="action in monster.actions" :key="action.name" class="action-box">
                <p class="font-medieval">{{ action.name }}</p>
                <p class="font-body">{{ action.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMonsterStore } from '../stores/monsters'

const monsterStore = useMonsterStore()

const abilities = [
  { key: 'strength', label: 'STR' },
  { key: 'dexterity', label: 'DEX' },
  { key: 'constitution', label: 'CON' },
  { key: 'intelligence', label: 'INT' },
  { key: 'wisdom', label: 'WIS' },
  { key: 'charisma', label: 'CHA' },
]

const damageTypes = [
  'Acid',
  'Bludgeoning',
  'Cold',
  'Fire',
  'Force',
  'Lightning',
  'Necrotic',
  'Piercing',
  'Poison',
  'Psychic',
  'Radiant',
  'Slashing',
  'Thunder',
]

const xpByCR = {
  0: 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  1: 200,
  2: 450,
  3: 700,
  4: 1100,
  5: 1800,
  6: 2300,
  7: 2900,
  8: 3900,
  9: 5000,
  10: 5900,
  11: 7200,
  12: 8400,
  13: 10000,
  14: 11500,
  15: 13000,
  16: 15000,
  17: 18000,
  18: 20000,
  19: 22000,
  20: 25000,
  21: 33000,
  22: 41000,
  23: 50000,
  24: 62000,
  25: 75000,
  26: 90000,
  27: 105000,
  28: 120000,
  29: 135000,
  30: 155000,
}

const monster = ref({
  name: '',
  size: '',
  type: '',
  alignment: '',
  armor_class: '',
  hit_points: '',
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  actions: [],
  damage_vulnerabilities: [],
  damage_resistances: [],
  damage_immunities: [],
})

// Helper functions for ability scores and CR calculation
const calculateModifier = (score) => Math.floor((score - 10) / 2)
const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`)

const hasAnyDamageModifiers = computed(() => {
  return (
    monster.value.damage_vulnerabilities?.length > 0 ||
    monster.value.damage_resistances?.length > 0 ||
    monster.value.damage_immunities?.length > 0
  )
})

const calculatedCR = computed(() => {
  // Base CR factors
  let defensiveCR = 0
  let offensiveCR = 0

  // Defensive CR calculation
  if (monster.value.hit_points) {
    const effectiveHP = parseInt(monster.value.hit_points) || 0
    const baseAC = parseInt(monster.value.armor_class) || 10

    // Adjust for defensive abilities
    let hpMultiplier = 1
    if (monster.value.damage_resistances?.length > 0) hpMultiplier *= 1.5
    if (monster.value.damage_immunities?.length > 0) hpMultiplier *= 2
    if (monster.value.damage_vulnerabilities?.length > 0) hpMultiplier *= 0.75

    const effectiveHPWithModifiers = effectiveHP * hpMultiplier

    // Calculate defensive CR
    if (effectiveHPWithModifiers < 7) defensiveCR = 0
    else if (effectiveHPWithModifiers < 36) defensiveCR = 1 / 8
    else if (effectiveHPWithModifiers < 50) defensiveCR = 1 / 4
    else if (effectiveHPWithModifiers < 71) defensiveCR = 1 / 2
    else if (effectiveHPWithModifiers < 86) defensiveCR = 1
    else if (effectiveHPWithModifiers < 101) defensiveCR = 2
    else if (effectiveHPWithModifiers < 116) defensiveCR = 3
    else if (effectiveHPWithModifiers < 131) defensiveCR = 4
    else if (effectiveHPWithModifiers < 146) defensiveCR = 5
    else defensiveCR = Math.min(30, Math.floor(effectiveHPWithModifiers / 15))

    // Adjust for AC
    const acDifference = baseAC - 13 // 13 is the base AC for most CRs
    defensiveCR += Math.floor(acDifference / 2)
  }

  // Offensive CR calculation
  const avgAbilityScore =
    ((monster.value.strength || 10) +
      (monster.value.dexterity || 10) +
      (monster.value.constitution || 10) +
      (monster.value.intelligence || 10) +
      (monster.value.wisdom || 10) +
      (monster.value.charisma || 10)) /
    6

  offensiveCR = Math.max(0, Math.floor((avgAbilityScore - 10) / 2))

  // Final CR calculation
  const averageCR = (defensiveCR + offensiveCR) / 2

  // Convert to fraction string if needed
  if (averageCR === 0.125) return '1/8'
  if (averageCR === 0.25) return '1/4'
  if (averageCR === 0.5) return '1/2'
  return Math.max(0, Math.min(30, Math.round(averageCR))).toString()
})

const addAction = () => {
  monster.value.actions.push({
    name: '',
    desc: '',
  })
}

const removeAction = (index) => {
  monster.value.actions.splice(index, 1)
}

const handleSubmit = () => {
  try {
    // Validate stats
    const errors = monsterStore.validateMonsterStats(monster.value)
    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    // Add calculated CR
    const monsterWithCR = {
      ...monster.value,
      challenge_rating: calculatedCR.value,
      xp: xpByCR[calculatedCR.value] || 0,
    }

    monsterStore.addCustomMonster(monsterWithCR)

    // Reset form
    monster.value = {
      name: '',
      size: '',
      type: '',
      alignment: '',
      armor_class: '',
      hit_points: '',
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      actions: [],
      damage_vulnerabilities: [],
      damage_resistances: [],
      damage_immunities: [],
    }

    alert('Monster saved successfully!')
  } catch (error) {
    alert(error.message)
  }
}
</script>

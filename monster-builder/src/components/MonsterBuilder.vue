<template>
  <div class="monster-builder-container p-6">
    <h1 class="text-4xl font-medieval text-brown-900 mb-8">Monster Builder</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Form Section -->
      <div class="form-section">
        <form @submit.prevent="saveMonster" class="space-y-6">
          <!-- Basic Info -->
          <div class="section bg-white/80 p-6 rounded-lg border-2 border-brown-900">
            <h2 class="text-2xl font-medieval text-brown-900 mb-4">Basic Information</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Name</label>
                <input v-model="monster.name" type="text" required class="input-field" placeholder="Monster Name" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Description</label>
                <textarea
                  v-model="monster.description"
                  rows="4"
                  class="input-field resize-none"
                  placeholder="Describe your monster's appearance, behavior, and lore..."
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-brown-900 mb-2">Type</label>
                  <select v-model="monster.type" required class="input-field">
                    <option value="">Select Type</option>
                    <option v-for="type in monsterTypes" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-brown-900 mb-2">Size</label>
                  <input v-model="monster.size" type="text" class="input-field" placeholder="e.g., Medium" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Alignment</label>
                <input v-model="monster.alignment" type="text" class="input-field" placeholder="e.g., Lawful Evil" />
              </div>

              <!-- Image Upload -->
              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Monster Image</label>
                <div class="space-y-3">
                  <input
                    type="file"
                    @change="handleImageUpload"
                    accept="image/*"
                    class="input-field"
                    :disabled="imageUploading"
                  />
                  <p v-if="imageUploading" class="text-sm text-golden">
                    ⏳ Uploading image...
                  </p>
                  <div v-if="monster.image" class="relative inline-block">
                    <img
                      :src="monster.image"
                      alt="Monster preview"
                      class="w-32 h-32 object-cover rounded border-2 border-brown-900"
                    />
                    <button
                      type="button"
                      @click="removeImage"
                      class="absolute -top-2 -right-2 bg-red-900 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Combat Stats -->
          <div class="section bg-white/80 p-6 rounded-lg border-2 border-brown-900">
            <h2 class="text-2xl font-medieval text-brown-900 mb-4">Combat Stats</h2>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Armor Class</label>
                <input v-model.number="monster.armor_class.value" type="number" class="input-field" placeholder="13" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">AC Type</label>
                <input v-model="monster.armor_class.type" type="text" class="input-field" placeholder="natural armor" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Hit Points</label>
                <input v-model.number="monster.hit_points.value" type="number" class="input-field" placeholder="45" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">HP Formula</label>
                <input v-model="monster.hit_points.formula" type="text" class="input-field" placeholder="6d8 + 12" />
              </div>
            </div>
          </div>

          <!-- Speed -->
          <div class="section bg-white/80 p-6 rounded-lg border-2 border-brown-900">
            <h2 class="text-2xl font-medieval text-brown-900 mb-4">Speed</h2>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Walk</label>
                <input v-model="monster.speed.walk" type="text" class="input-field" placeholder="30 ft" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Fly</label>
                <input v-model="monster.speed.fly" type="text" class="input-field" placeholder="60 ft" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Swim</label>
                <input v-model="monster.speed.swim" type="text" class="input-field" placeholder="20 ft" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Climb</label>
                <input v-model="monster.speed.climb" type="text" class="input-field" placeholder="15 ft" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">Burrow</label>
                <input v-model="monster.speed.burrow" type="text" class="input-field" placeholder="10 ft" />
              </div>
            </div>
          </div>

          <!-- Ability Scores -->
          <div class="section bg-white/80 p-6 rounded-lg border-2 border-brown-900">
            <h2 class="text-2xl font-medieval text-brown-900 mb-4">Ability Scores</h2>

            <div class="grid grid-cols-3 gap-4">
              <div v-for="ability in abilities" :key="ability.key">
                <label class="block text-sm font-semibold text-brown-900 mb-2">{{ ability.name }}</label>
                <input v-model.number="monster[ability.key]" type="number" class="input-field" placeholder="10" />
              </div>
            </div>
          </div>

          <!-- Challenge Rating -->
          <div class="section bg-white/80 p-6 rounded-lg border-2 border-brown-900">
            <h2 class="text-2xl font-medieval text-brown-900 mb-4">Challenge Rating</h2>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">CR</label>
                <select v-model.number="monster.challenge_rating" class="input-field">
                  <option v-for="cr in challengeRatings" :key="cr.value" :value="cr.value">
                    {{ cr.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-brown-900 mb-2">XP</label>
                <input v-model.number="monster.xp" type="number" class="input-field" readonly />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="section bg-white/80 p-6 rounded-lg border-2 border-brown-900">
            <h2 class="text-2xl font-medieval text-brown-900 mb-4">Actions</h2>

            <div v-for="(action, index) in monster.actions" :key="index" class="mb-4 p-4 bg-parchment rounded border border-brown-900">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <label class="block text-sm font-semibold text-brown-900 mb-2">Action Name</label>
                  <input v-model="action.name" type="text" class="input-field" placeholder="Bite" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-brown-900 mb-2">Description</label>
                  <textarea v-model="action.description" rows="3" class="input-field resize-none" placeholder="Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage."></textarea>
                </div>
                <button type="button" @click="removeAction(index)" class="btn-secondary self-start">Remove Action</button>
              </div>
            </div>

            <button type="button" @click="addAction" class="btn-primary">Add Action</button>
          </div>

          <!-- Damage Properties -->
          <div class="section bg-white/80 p-6 rounded-lg border-2 border-brown-900">
            <h2 class="text-2xl font-medieval text-brown-900 mb-4">Damage Properties</h2>

            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-brown-900 mb-2">Vulnerabilities</h3>
                <div class="grid grid-cols-3 gap-2">
                  <label v-for="damageType in damageTypes" :key="`vuln-${damageType}`" class="flex items-center">
                    <input
                      type="checkbox"
                      :value="damageType"
                      v-model="monster.damage_vulnerabilities"
                      class="filter-checkbox"
                    />
                    <span class="filter-label">{{ capitalize(damageType) }}</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-brown-900 mb-2">Resistances</h3>
                <div class="grid grid-cols-3 gap-2">
                  <label v-for="damageType in damageTypes" :key="`resist-${damageType}`" class="flex items-center">
                    <input
                      type="checkbox"
                      :value="damageType"
                      v-model="monster.damage_resistances"
                      class="filter-checkbox"
                    />
                    <span class="filter-label">{{ capitalize(damageType) }}</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-brown-900 mb-2">Immunities</h3>
                <div class="grid grid-cols-3 gap-2">
                  <label v-for="damageType in damageTypes" :key="`immun-${damageType}`" class="flex items-center">
                    <input
                      type="checkbox"
                      :value="damageType"
                      v-model="monster.damage_immunities"
                      class="filter-checkbox"
                    />
                    <span class="filter-label">{{ capitalize(damageType) }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-4">
            <button type="submit" class="btn-primary flex-1" :disabled="monsterStore.loading">
              {{ monsterStore.loading ? 'Saving...' : 'Save Monster' }}
            </button>
            <button type="button" @click="exportMonster" class="btn-secondary">
              Export as JSON
            </button>
          </div>
        </form>
      </div>

      <!-- Preview Section -->
      <div class="preview-section sticky top-4">
        <div class="stat-block">
          <h2 class="text-3xl font-medieval text-red-900 mb-2">{{ monster.name || 'Monster Name' }}</h2>
          <p class="text-sm italic mb-4">{{ monster.size }} {{ monster.type }}, {{ monster.alignment }}</p>

          <div v-if="monster.description" class="mb-4 p-3 bg-parchment/50 rounded border border-brown-900">
            <p class="text-sm italic">{{ monster.description }}</p>
          </div>

          <div v-if="monster.image" class="mb-4">
            <img :src="monster.image" alt="Monster" class="w-full h-48 object-cover rounded border-2 border-brown-900" />
          </div>

          <hr class="border-t-2 border-brown-900 my-4" />

          <div class="space-y-2 mb-4">
            <p><strong>Armor Class</strong> {{ monster.armor_class.value }} ({{ monster.armor_class.type }})</p>
            <p><strong>Hit Points</strong> {{ monster.hit_points.value }} ({{ monster.hit_points.formula }})</p>
            <p><strong>Speed</strong> {{ formatSpeed(monster.speed) }}</p>
          </div>

          <hr class="border-t-2 border-brown-900 my-4" />

          <div class="grid grid-cols-6 gap-2 text-center mb-4">
            <div v-for="ability in abilities" :key="ability.key">
              <p class="font-semibold text-xs">{{ ability.name.slice(0, 3).toUpperCase() }}</p>
              <p>{{ monster[ability.key] }} ({{ getModifier(monster[ability.key]) }})</p>
            </div>
          </div>

          <hr class="border-t-2 border-brown-900 my-4" />

          <div v-if="monster.damage_vulnerabilities.length" class="mb-2">
            <strong>Damage Vulnerabilities</strong> {{ monster.damage_vulnerabilities.join(', ') }}
          </div>

          <div v-if="monster.damage_resistances.length" class="mb-2">
            <strong>Damage Resistances</strong> {{ monster.damage_resistances.join(', ') }}
          </div>

          <div v-if="monster.damage_immunities.length" class="mb-2">
            <strong>Damage Immunities</strong> {{ monster.damage_immunities.join(', ') }}
          </div>

          <div class="mb-4">
            <p><strong>Challenge</strong> {{ monster.challenge_rating }} ({{ monster.xp }} XP)</p>
          </div>

          <div v-if="monster.actions.length" class="mt-4">
            <h3 class="text-xl font-medieval text-red-900 mb-2 border-b-2 border-brown-900 pb-1">Actions</h3>
            <div v-for="(action, index) in monster.actions" :key="index" class="mb-3">
              <p><strong>{{ action.name }}.</strong> {{ action.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useMonsterStore } from '../stores/monsters'
import { useRoute } from 'vue-router'

const monsterStore = useMonsterStore()
const route = useRoute()

const abilities = [
  { name: 'Strength', key: 'strength' },
  { name: 'Dexterity', key: 'dexterity' },
  { name: 'Constitution', key: 'constitution' },
  { name: 'Intelligence', key: 'intelligence' },
  { name: 'Wisdom', key: 'wisdom' },
  { name: 'Charisma', key: 'charisma' },
]

const damageTypes = [
  'acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning',
  'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'
]

const monsterTypes = [
  'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
  'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'
]

const challengeRatings = [
  { value: 0, label: '0', xp: 0 },
  { value: 0.125, label: '1/8', xp: 25 },
  { value: 0.25, label: '1/4', xp: 50 },
  { value: 0.5, label: '1/2', xp: 100 },
  { value: 1, label: '1', xp: 200 },
  { value: 2, label: '2', xp: 450 },
  { value: 3, label: '3', xp: 700 },
  { value: 4, label: '4', xp: 1100 },
  { value: 5, label: '5', xp: 1800 },
  { value: 6, label: '6', xp: 2300 },
  { value: 7, label: '7', xp: 2900 },
  { value: 8, label: '8', xp: 3900 },
  { value: 9, label: '9', xp: 5000 },
  { value: 10, label: '10', xp: 5900 },
  { value: 11, label: '11', xp: 7200 },
  { value: 12, label: '12', xp: 8400 },
  { value: 13, label: '13', xp: 10000 },
  { value: 14, label: '14', xp: 11500 },
  { value: 15, label: '15', xp: 13000 },
  { value: 16, label: '16', xp: 15000 },
  { value: 17, label: '17', xp: 18000 },
  { value: 18, label: '18', xp: 20000 },
  { value: 19, label: '19', xp: 22000 },
  { value: 20, label: '20', xp: 25000 },
  { value: 21, label: '21', xp: 33000 },
  { value: 22, label: '22', xp: 41000 },
  { value: 23, label: '23', xp: 50000 },
  { value: 24, label: '24', xp: 62000 },
  { value: 25, label: '25', xp: 75000 },
  { value: 26, label: '26', xp: 90000 },
  { value: 27, label: '27', xp: 105000 },
  { value: 28, label: '28', xp: 120000 },
  { value: 29, label: '29', xp: 135000 },
  { value: 30, label: '30', xp: 155000 },
]

const imageUploading = ref(false)

const monster = ref({
  name: '',
  description: '',
  type: '',
  size: 'Medium',
  alignment: '',
  armor_class: {
    value: 10,
    type: 'natural armor',
  },
  hit_points: {
    value: 10,
    formula: '2d8',
  },
  speed: {
    walk: '30 ft',
    fly: '',
    swim: '',
    climb: '',
    burrow: '',
  },
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  challenge_rating: 0,
  xp: 0,
  actions: [],
  special_abilities: [],
  damage_vulnerabilities: [],
  damage_resistances: [],
  damage_immunities: [],
  condition_immunities: [],
  proficiencies: [],
  senses: {},
  languages: '',
  image: '',
  source: 'custom',
})

// Watch CR to update XP
watch(() => monster.value.challenge_rating, (newCR) => {
  const cr = challengeRatings.find(c => c.value === newCR)
  if (cr) {
    monster.value.xp = cr.xp
  }
})

const getModifier = (score) => {
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : mod
}

const formatSpeed = (speed) => {
  const parts = []
  if (speed.walk) parts.push(`walk ${speed.walk}`)
  if (speed.fly) parts.push(`fly ${speed.fly}`)
  if (speed.swim) parts.push(`swim ${speed.swim}`)
  if (speed.climb) parts.push(`climb ${speed.climb}`)
  if (speed.burrow) parts.push(`burrow ${speed.burrow}`)
  return parts.join(', ') || 'None'
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const addAction = () => {
  monster.value.actions.push({ name: '', description: '' })
}

const removeAction = (index) => {
  monster.value.actions.splice(index, 1)
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file')
    return
  }

  imageUploading.value = true
  try {
    const imageUrl = await monsterStore.uploadImage(file)
    monster.value.image = imageUrl
    alert('Image uploaded successfully!')
  } catch (error) {
    alert('Failed to upload image: ' + error.message)
  } finally {
    imageUploading.value = false
  }
}

const removeImage = () => {
  monster.value.image = ''
}

const saveMonster = async () => {
  try {
    await monsterStore.createMonster(monster.value)
    alert('Monster saved successfully!')
    resetForm()
  } catch (error) {
    alert('Failed to save monster: ' + error.message)
  }
}

const exportMonster = () => {
  const dataStr = JSON.stringify(monster.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${monster.value.name || 'monster'}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const resetForm = () => {
  monster.value = {
    name: '',
    description: '',
    type: '',
    size: 'Medium',
    alignment: '',
    armor_class: { value: 10, type: 'natural armor' },
    hit_points: { value: 10, formula: '2d8' },
    speed: { walk: '30 ft', fly: '', swim: '', climb: '', burrow: '' },
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    challenge_rating: 0,
    xp: 0,
    actions: [],
    special_abilities: [],
    damage_vulnerabilities: [],
    damage_resistances: [],
    damage_immunities: [],
    condition_immunities: [],
    proficiencies: [],
    senses: {},
    languages: '',
    image: '',
    source: 'custom',
  }
}

// Load monster if editing
onMounted(async () => {
  const editId = route.query.edit
  if (editId) {
    try {
      const monsterToEdit = await monsterStore.fetchMonster(editId)
      if (monsterToEdit) {
        // Populate form with existing monster data
        Object.assign(monster.value, monsterToEdit)
      }
    } catch (error) {
      console.error('Error loading monster for edit:', error)
    }
  }
})
</script>

<template>
  <div v-if="loading" class="loading-container">
    <div class="relative w-[200px] h-[200px] mx-auto">
      <D20Dice />
    </div>
    <p class="text-center mt-4 font-medieval text-xl text-golden animate-pulse">
      Summoning Monster...
    </p>
  </div>
  <div
    v-else-if="displayMonster"
    class="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg border-2 border-golden p-6 shadow-medieval"
  >
    <!-- Header with Image -->
    <div class="md:flex gap-6 items-start mb-6">
      <!-- Monster Info -->
      <div class="flex-1">
        <h2 class="text-3xl font-medieval text-brown-900 mb-4">{{ displayMonster.name }}</h2>

        <div class="flex flex-wrap gap-4 border-b-2 border-brown-900 pb-4">
          <p class="font-body flex items-center gap-2">
            <span class="font-semibold text-red-900">Type:</span>
            {{ displayMonster.type }}
          </p>
          <p v-if="displayMonster.size" class="font-body flex items-center gap-2">
            <span class="font-semibold text-red-900">Size:</span>
            {{ displayMonster.size }}
          </p>
        </div>
      </div>

      <!-- Monster Image -->
      <div
        v-if="monsterImageUrl"
        class="mt-4 md:mt-0 rounded-lg overflow-hidden border-2 border-brown-900 shadow-lg bg-brown-900/5 w-full md:w-48 h-48 shrink-0"
      >
        <img
          :src="monsterImageUrl"
          :alt="displayMonster.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>
    </div>

    <!-- Combat Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div class="stat-item flex flex-col">
        <span class="font-semibold text-red-900 mb-1">Armor Class</span>
        <span class="font-body">{{
          Array.isArray(displayMonster.armor_class)
            ? displayMonster.armor_class.map((ac) => `${ac.value} (${ac.type})`).join(', ')
            : displayMonster.armor_class
        }}</span>
      </div>
      <div class="stat-item flex flex-col">
        <span class="font-semibold text-red-900 mb-1">Hit Points</span>
        <span class="font-body">{{ displayMonster.hit_points }}</span>
      </div>
    </div>

    <!-- Ability Scores -->
    <div class="stats-grid mb-6">
      <div class="stat-box">
        <div class="stat-label">STR</div>
        <div class="stat-value">{{ displayMonster.strength }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">DEX</div>
        <div class="stat-value">{{ displayMonster.dexterity }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">CON</div>
        <div class="stat-value">{{ displayMonster.constitution }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">INT</div>
        <div class="stat-value">{{ displayMonster.intelligence }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">WIS</div>
        <div class="stat-value">{{ displayMonster.wisdom }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">CHA</div>
        <div class="stat-value">{{ displayMonster.charisma }}</div>
      </div>
    </div>

    <!-- Speed -->
    <div class="mb-6">
      <h3 class="text-xl font-medieval text-red-900 mb-3">Speed</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div
          v-for="(value, type) in displayMonster.speed"
          :key="type"
          class="stat-item flex flex-col"
        >
          <span class="font-semibold text-brown-900 capitalize">{{ type }}</span>
          <span class="font-body">{{ value }}</span>
        </div>
      </div>
    </div>

    <!-- Proficiencies -->
    <div v-if="displayMonster.proficiencies?.length" class="mb-6">
      <h3 class="text-xl font-medieval text-red-900 mb-3">Proficiencies</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
          v-for="prof in displayMonster.proficiencies"
          :key="prof.proficiency.index"
          class="stat-item"
        >
          <span class="font-semibold text-brown-900">{{ prof.proficiency.name }}:</span>
          <span class="font-body"> +{{ prof.value }}</span>
        </div>
      </div>
    </div>

    <!-- Senses -->
    <div v-if="displayMonster.senses" class="mb-6">
      <h3 class="text-xl font-medieval text-red-900 mb-3">Senses</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div v-for="(value, sense) in displayMonster.senses" :key="sense" class="stat-item">
          <span class="font-semibold text-brown-900 capitalize">{{ formatSenseName(sense) }}:</span>
          <span class="font-body"> {{ value }}</span>
        </div>
      </div>
    </div>

    <!-- Languages -->
    <div v-if="displayMonster.languages" class="mb-6">
      <h3 class="text-xl font-medieval text-red-900 mb-3">Languages</h3>
      <div class="stat-item">
        <span class="font-body">{{ displayMonster.languages }}</span>
      </div>
    </div>

    <!-- Special Abilities -->
    <div v-if="displayMonster.special_abilities?.length" class="mb-6">
      <h3 class="text-xl font-medieval text-red-900 mb-3">Special Abilities</h3>
      <div class="space-y-4">
        <div
          v-for="ability in displayMonster.special_abilities"
          :key="ability.name"
          class="action-box"
        >
          <h4 class="font-semibold text-brown-900">{{ ability.name }}</h4>
          <p class="mt-1 font-body">{{ ability.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="displayMonster.actions?.length" class="mb-6">
      <h3 class="text-xl font-medieval text-red-900 mb-3">Actions</h3>
      <div class="space-y-4">
        <div v-for="action in displayMonster.actions" :key="action.name" class="action-box">
          <h4 class="font-semibold text-brown-900">{{ action.name }}</h4>
          <p class="mt-1 font-body">{{ action.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Legendary Actions -->
    <div v-if="displayMonster.legendary_actions?.length" class="mb-6">
      <h3 class="text-xl font-medieval text-red-900 mb-3">Legendary Actions</h3>
      <div class="space-y-4">
        <div
          v-for="action in displayMonster.legendary_actions"
          :key="action.name"
          class="action-box"
        >
          <h4 class="font-semibold text-brown-900">{{ action.name }}</h4>
          <p class="mt-1 font-body">{{ action.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Condition Immunities -->
    <div v-if="displayMonster.condition_immunities?.length" class="mb-6">
      <h3 class="text-xl font-medieval text-red-900 mb-3">Condition Immunities</h3>
      <div class="stat-item">
        <span class="font-body">{{
          displayMonster.condition_immunities.map((c) => c.name).join(', ')
        }}</span>
      </div>
    </div>

    <!-- Damage Vulnerabilities, Resistances, and Immunities -->
    <template
      v-if="
        displayMonster.damage_vulnerabilities?.length ||
        displayMonster.damage_resistances?.length ||
        displayMonster.damage_immunities?.length
      "
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div v-if="displayMonster.damage_vulnerabilities?.length" class="stat-item">
          <h4 class="font-semibold text-red-900 mb-2">Damage Vulnerabilities</h4>
          <span class="font-body">{{ displayMonster.damage_vulnerabilities.join(', ') }}</span>
        </div>
        <div v-if="displayMonster.damage_resistances?.length" class="stat-item">
          <h4 class="font-semibold text-red-900 mb-2">Damage Resistances</h4>
          <span class="font-body">{{ displayMonster.damage_resistances.join(', ') }}</span>
        </div>
        <div v-if="displayMonster.damage_immunities?.length" class="stat-item">
          <h4 class="font-semibold text-red-900 mb-2">Damage Immunities</h4>
          <span class="font-body">{{ displayMonster.damage_immunities.join(', ') }}</span>
        </div>
      </div>
    </template>
  </div>
  <div v-else-if="monsterStore.loading" class="text-center py-8">
    <div class="d20-wrapper mx-auto" ref="d20Wrapper">
      <div class="d20-loader" :style="diceRotationStyle">
        <!-- Top face -->
        <div class="d20-face"><span class="d20-number">20</span></div>

        <!-- Upper ring -->
        <div class="d20-face"><span class="d20-number">2</span></div>
        <div class="d20-face"><span class="d20-number">6</span></div>
        <div class="d20-face"><span class="d20-number">8</span></div>
        <div class="d20-face"><span class="d20-number">12</span></div>
        <div class="d20-face"><span class="d20-number">14</span></div>

        <!-- Middle ring -->
        <div class="d20-face"><span class="d20-number">10</span></div>
        <div class="d20-face"><span class="d20-number">16</span></div>
        <div class="d20-face"><span class="d20-number">4</span></div>
        <div class="d20-face"><span class="d20-number">18</span></div>
        <div class="d20-face"><span class="d20-number">3</span></div>

        <!-- Bottom face -->
        <div class="d20-face"><span class="d20-number">1</span></div>
      </div>
      <div class="d20-glow"></div>
    </div>
    <p class="mt-6 font-medieval text-lg text-brown-900">Rolling for initiative...</p>
  </div>
  <div v-else class="text-center py-8 text-red-900 font-medieval">
    Monster not found in the realm
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

.stat-box {
  text-align: center;
  border: 2px solid var(--color-brown-900);
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.5);
}

.stat-label {
  font-family: 'MedievalSharp', cursive;
  color: var(--color-red-900);
  font-size: 1.2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-brown-900);
}

.action-box {
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--color-brown-900);
  border-radius: 0.5rem;
  padding: 1rem;
}

.stat-item {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-brown-900);
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useMonsterStore } from '../stores/monsters'
import D20Dice from './D20Dice.vue'

const props = defineProps({
  index: String,
  monster: {
    type: Object,
    default: null,
  },
})

// Component state
const loading = ref(true)
const imageError = ref(false)

// Store
const monsterStore = useMonsterStore()
const displayMonster = computed(() => props.monster || monsterStore.currentMonster)

const monsterImageUrl = computed(() => {
  if (displayMonster.value?.image && !imageError.value) {
    return `https://www.dnd5eapi.co${displayMonster.value.image}`
  }
  return null
})

const handleImageError = () => {
  imageError.value = true
  console.warn(`Failed to load image for monster: ${displayMonster.value?.name}`)
}

const formatSenseName = (name) => {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Lifecycle hooks
onMounted(async () => {
  if (props.index && !props.monster) {
    loading.value = true
    try {
      await monsterStore.fetchMonsterDetails(props.index)
    } catch (error) {
      console.error('Error loading monster:', error)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})

onUnmounted(() => {
  // Clear monster details when component is unmounted
  monsterStore.currentMonster = null
  imageError.value = false
  loading.value = true
})
</script>

<style scoped>
/* Add basic styling here */
</style>

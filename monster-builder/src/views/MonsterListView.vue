<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-4xl font-medieval text-brown-900 mb-2">Monster Compendium</h1>
      <p class="text-lg text-red-900 font-body">
        Discover and filter through the realm's creatures
      </p>
    </div>

    <div v-if="monsterStore.loading" class="loading-container">
      <div class="relative w-[200px] h-[200px] mx-auto">
        <D20Dice />
      </div>
      <p class="text-center mt-4 font-medieval text-xl text-golden animate-pulse">
        Summoning monsters from the realm...
      </p>
    </div>

    <div
      v-else-if="monsterStore.error"
      class="bg-red-100 border-2 border-red-900 text-red-900 p-4 rounded-lg text-center"
    >
      {{ monsterStore.error }}
    </div>

    <div v-else>
      <!-- Filters Bar -->
      <div
        class="flex flex-wrap items-center gap-2 bg-white/90 rounded border border-brown-900 p-2 shadow-sm mb-4"
      >
        <!-- Search Input -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search monsters..."
              class="w-full h-7 bg-parchment/50 border border-brown-900 rounded px-7 text-sm focus:outline-none focus:ring-1 focus:ring-golden transition-shadow duration-200"
            />
            <svg
              class="absolute left-2 top-1.5 h-4 w-4 text-brown-900/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Type Filter -->
        <div class="w-[150px]">
          <select
            v-model="selectedType"
            class="w-full h-7 bg-parchment/50 border border-brown-900 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-golden transition-shadow duration-200"
          >
            <option value="">All Types</option>
            <option v-for="type in monsterTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <!-- Challenge Rating Filter -->
        <div class="w-[120px]">
          <select
            v-model="selectedCR"
            class="w-full h-7 bg-parchment/50 border border-brown-900 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-golden transition-shadow duration-200"
          >
            <option value="">All CR</option>
            <option v-for="cr in challengeRatings" :key="cr.value" :value="cr.value">
              CR {{ cr.label }}
            </option>
          </select>
        </div>

        <!-- View Mode Toggle -->
        <div class="flex items-center gap-1 ml-auto">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-1.5 rounded transition-colors',
              viewMode === 'grid'
                ? 'bg-brown-900 text-parchment'
                : 'text-brown-900 hover:bg-brown-900/10',
            ]"
            title="Grid View"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'p-1.5 rounded transition-colors',
              viewMode === 'list'
                ? 'bg-brown-900 text-parchment'
                : 'text-brown-900 hover:bg-brown-900/10',
            ]"
            title="List View"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-4 text-sm text-brown-900">
        Showing <strong>{{ filteredMonsters.length }}</strong> monster{{ filteredMonsters.length !== 1 ? 's' : '' }}
      </div>

      <!-- Monster Cards -->
      <div
        :class="[
          'grid gap-4',
          viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
        ]"
      >
        <MonsterCard
          v-for="monster in filteredMonsters"
          :key="monster._id || monster.index"
          :monster="monster"
          :viewMode="viewMode"
        />
      </div>

      <!-- No Results Message -->
      <div
        v-if="filteredMonsters.length === 0"
        class="text-center py-12"
      >
        <svg class="w-16 h-16 mx-auto text-brown-900/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xl text-brown-900 font-medieval mb-2">
          No monsters found
        </p>
        <p class="text-brown-700">
          Try adjusting your search or filters
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMonsterStore } from '../stores/monsters'
import MonsterCard from '../components/MonsterCard.vue'
import D20Dice from '../components/D20Dice.vue'

const monsterStore = useMonsterStore()
const viewMode = ref('grid')

const searchQuery = ref('')
const selectedType = ref('')
const selectedCR = ref('')

// Challenge Ratings array
const challengeRatings = [
  { value: 0, label: '0' },
  { value: 0.125, label: '1/8' },
  { value: 0.25, label: '1/4' },
  { value: 0.5, label: '1/2' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15' },
  { value: 16, label: '16' },
  { value: 17, label: '17' },
  { value: 18, label: '18' },
  { value: 19, label: '19' },
  { value: 20, label: '20' },
  { value: 21, label: '21' },
  { value: 22, label: '22' },
  { value: 23, label: '23' },
  { value: 24, label: '24' },
  { value: 25, label: '25' },
  { value: 26, label: '26' },
  { value: 27, label: '27' },
  { value: 28, label: '28' },
  { value: 29, label: '29' },
  { value: 30, label: '30' },
]

// Filtered monsters with safety checks
const filteredMonsters = computed(() => {
  // Safety check - ensure monsters is an array
  if (!monsterStore.monsters || !Array.isArray(monsterStore.monsters)) {
    return []
  }

  return monsterStore.monsters.filter(monster => {
    // Ensure monster exists and has required properties
    if (!monster || !monster.name) return false

    // Search filter
    const matchesSearch = !searchQuery.value ||
      monster.name?.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Type filter
    const matchesType = !selectedType.value ||
      monster.type?.toLowerCase() === selectedType.value.toLowerCase()

    // Challenge Rating filter
    const matchesCR = !selectedCR.value ||
      monster.challenge_rating === parseFloat(selectedCR.value)

    return matchesSearch && matchesType && matchesCR
  })
})

// Get unique monster types for filter dropdown
const monsterTypes = computed(() => {
  if (!monsterStore.monsters || !Array.isArray(monsterStore.monsters)) {
    return []
  }

  const types = [...new Set(
    monsterStore.monsters
      .map(m => m.type)
      .filter(Boolean)
  )]

  return types.sort()
})

// Fetch monsters on mount
onMounted(async () => {
  await monsterStore.fetchMonsters()
})
</script>

<style scoped>
.text-parchment {
  color: #F2EBDC;
}

.loading-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.grid {
  transition: grid-template-columns 0.3s ease;
}
</style>

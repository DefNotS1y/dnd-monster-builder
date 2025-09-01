<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-medieval text-brown-900 mb-2">Monster Compendium</h1>
      <p class="text-lg text-red-900 font-body">Discover and filter through the realm's creatures</p>
    </div>

    <div v-if="monsterStore.loading" class="text-center py-8">
      <div class="d20-wrapper mx-auto">
        <div class="d20-loader">
          <div class="d20-face">20</div>
          <div class="d20-face">1</div>
          <div class="d20-face">15</div>
          <div class="d20-face">7</div>
          <div class="d20-face">13</div>
          <div class="d20-face">9</div>
          <div class="d20-face">11</div>
        </div>
        <div class="d20-glow"></div>
      </div>
      <p class="mt-6 font-medieval text-lg text-brown-900">Summoning monsters from the realm...</p>
    </div>
    
    <div v-else-if="monsterStore.error" 
         class="bg-red-100 border-2 border-red-900 text-red-900 p-4 rounded-lg text-center">
      {{ monsterStore.error }}
    </div>

    <template v-else>
      <!-- Filters Section -->
      <div class="bg-white/80 rounded-lg border-2 border-brown-900 p-6 shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search Input -->
          <div class="col-span-1 md:col-span-2">
            <label class="block font-medieval text-red-900 mb-2">Search</label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search monsters..."
                class="w-full bg-parchment border-2 border-brown-900 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden transition-shadow duration-200"
              />
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-brown-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="block font-medieval text-red-900 mb-2">Type</label>
            <select 
              v-model="filters.type"
              class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden transition-shadow duration-200"
            >
              <option value="">All Types</option>
              <option v-for="type in uniqueTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Challenge Rating Filter -->
          <div>
            <label class="block font-medieval text-red-900 mb-2">Challenge Rating</label>
            <select 
              v-model="filters.cr"
              class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden transition-shadow duration-200"
            >
              <option value="">All CR</option>
              <option v-for="cr in challengeRatings" :key="cr" :value="cr">
                CR {{ cr }}
              </option>
            </select>
          </div>
        </div>

        <!-- Advanced Filters Toggle -->
        <div class="mt-4">
          <button 
            @click="showAdvancedFilters = !showAdvancedFilters"
            class="flex items-center text-brown-900 hover:text-red-900 transition-colors duration-200"
          >
            <span class="font-medieval">Advanced Filters</span>
            <svg 
              class="w-5 h-5 ml-2 transform transition-transform duration-200"
              :class="{ 'rotate-180': showAdvancedFilters }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Advanced Filters Panel -->
        <div v-if="showAdvancedFilters" 
             class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-brown-900">
          <div>
            <label class="block font-medieval text-red-900 mb-2">Size</label>
            <select 
              v-model="filters.size"
              class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden transition-shadow duration-200"
            >
              <option value="">All Sizes</option>
              <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
          
          <div>
            <label class="block font-medieval text-red-900 mb-2">Alignment</label>
            <select 
              v-model="filters.alignment"
              class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden transition-shadow duration-200"
            >
              <option value="">All Alignments</option>
              <option v-for="align in alignments" :key="align" :value="align">
                {{ align }}
              </option>
            </select>
          </div>

          <div>
            <label class="block font-medieval text-red-900 mb-2">Sort By</label>
            <select 
              v-model="filters.sortBy"
              class="w-full bg-parchment border-2 border-brown-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden transition-shadow duration-200"
            >
              <option value="name">Name</option>
              <option value="cr">Challenge Rating</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="mb-4 flex justify-between items-center">
        <p class="font-medieval text-brown-900">
          Found {{ filteredMonsters.length }} monsters
        </p>
        <button 
          @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
          class="bg-brown-900 text-parchment px-4 py-2 rounded-lg font-medieval hover:bg-red-900 transition-colors duration-200 flex items-center gap-2"
        >
          <span>View as {{ viewMode === 'grid' ? 'List' : 'Grid' }}</span>
          <svg 
            v-if="viewMode === 'grid'"
            class="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg 
            v-else
            class="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>

      <!-- Monster Cards -->
      <div :class="{
        'grid gap-6': true,
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': viewMode === 'grid',
        'grid-cols-1': viewMode === 'list'
      }">
        <MonsterCard
          v-for="monster in filteredMonsters"
          :key="monster.index"
          :monster="monster"
          :view-mode="viewMode"
        />
      </div>

      <!-- No Results Message -->
      <div v-if="filteredMonsters.length === 0" 
           class="text-center py-8">
        <p class="font-medieval text-red-900 text-xl">No monsters match your search criteria</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMonsterStore } from '../stores/monsters'
import MonsterCard from '../components/MonsterCard.vue'

const monsterStore = useMonsterStore()
const showAdvancedFilters = ref(false)
const viewMode = ref('grid')

const filters = ref({
  search: '',
  type: '',
  cr: '',
  size: '',
  alignment: '',
  sortBy: 'name'
})

// Computed properties for filter options
const uniqueTypes = computed(() => {
  const types = new Set(monsterStore.getAllMonsters
    .map(m => m.type)
    .filter(type => type !== undefined && type !== null)
  )
  return Array.from(types).sort()
})

const challengeRatings = computed(() => {
  const crs = new Set(monsterStore.getAllMonsters.map(m => m.challenge_rating))
  return Array.from(crs).filter(cr => cr !== undefined).sort((a, b) => a - b)
})

const sizes = computed(() => {
  const sizeSet = new Set(monsterStore.getAllMonsters.map(m => m.size))
  return Array.from(sizeSet).filter(Boolean).sort()
})

const alignments = computed(() => {
  const alignSet = new Set(monsterStore.getAllMonsters.map(m => m.alignment))
  return Array.from(alignSet).filter(Boolean).sort()
})

// Filtered and sorted monsters
const filteredMonsters = computed(() => {
  let result = [...monsterStore.getAllMonsters]

  // Text search
  if (filters.value.search) {
    const query = filters.value.search.toLowerCase()
    result = result.filter(monster => 
      (monster.name?.toLowerCase().includes(query)) ||
      (monster.type?.toLowerCase().includes(query)) ||
      (monster.description?.toLowerCase().includes(query))
    )
  }

  // Type filter
  if (filters.value.type) {
    result = result.filter(monster => monster.type === filters.value.type)
  }

  // CR filter
  if (filters.value.cr !== '') {
    const targetCR = parseFloat(filters.value.cr)
    result = result.filter(monster => {
      const monsterCR = parseFloat(monster.challenge_rating)
      return !isNaN(monsterCR) && monsterCR === targetCR
    })
  }

  // Size filter
  if (filters.value.size) {
    result = result.filter(monster => monster.size === filters.value.size)
  }

  // Alignment filter
  if (filters.value.alignment) {
    result = result.filter(monster => monster.alignment === filters.value.alignment)
  }

  // Sorting
  result.sort((a, b) => {
    switch (filters.value.sortBy) {
      case 'cr': {
        const aCR = parseFloat(a.challenge_rating) || 0
        const bCR = parseFloat(b.challenge_rating) || 0
        return aCR - bCR
      }
      case 'type':
        return (a.type || '').localeCompare(b.type || '')
      default: // name
        return (a.name || '').localeCompare(b.name || '')
    }
  })

  return result
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

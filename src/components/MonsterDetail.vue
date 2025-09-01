<template>
  <div v-if="displayMonster" class="max-w-3xl mx-auto bg-white/80 rounded-lg border-2 border-brown-900 p-6 shadow-lg">
    <h2 class="text-3xl text-center mb-4 font-medieval text-brown-900">{{ displayMonster.name }}</h2>
    
    <div class="flex justify-between border-b-2 border-brown-900 pb-2 mb-4">
      <p class="font-body">
        <span class="font-medieval text-red-900">Type:</span> 
        {{ displayMonster.type }}
      </p>
      <p v-if="displayMonster.size" class="font-body">
        <span class="font-medieval text-red-900">Size:</span> 
        {{ displayMonster.size }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="stat-item">
        <span class="font-medieval">Armor Class:</span> {{ displayMonster.armor_class }}
      </div>
      <div class="stat-item">
        <span class="font-medieval">Hit Points:</span> {{ displayMonster.hit_points }}
      </div>
    </div>

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

    <div v-if="displayMonster.actions?.length" class="mt-6">
      <h3 class="text-2xl font-medieval text-red-900 mb-3">Actions</h3>
      <div class="space-y-4">
        <div v-for="action in displayMonster.actions" :key="action.name" class="action-box">
          <h4 class="font-medieval text-brown-900">{{ action.name }}</h4>
          <p class="mt-1">{{ action.desc }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="monsterStore.loading" class="text-center py-8">
    <div class="loading-spinner"></div>
    <p class="mt-4 font-medieval">Summoning monster...</p>
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

.loading-spinner {
  border: 4px solid var(--color-parchment);
  border-top: 4px solid var(--color-brown-900);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stat-item {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-brown-900);
}
</style>

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

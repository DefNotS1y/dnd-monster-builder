<template>
  <div class="monster-detail-container p-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-xl text-brown-900">Loading monster...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-xl text-red-900">{{ error }}</p>
      <p class="text-sm text-brown-700 mt-2">Monster ID: {{ route.params.id }}</p>
      <router-link to="/monsters" class="btn-primary mt-4 inline-block">
        Back to Monster List
      </router-link>
    </div>

    <!-- Monster Details -->
    <div v-else-if="monster" class="max-w-4xl mx-auto">
      <div class="stat-block">
        <h1 class="text-4xl font-medieval text-red-900 mb-2">{{ monster.name }}</h1>
        <p class="text-sm italic mb-4 text-brown-700">
          {{ monster.size }} {{ monster.type }}, {{ monster.alignment }}
        </p>

        <!-- Description (Custom monsters only) -->
        <div v-if="monster.description" class="mb-4 p-4 bg-brown-900/10 rounded border border-brown-900">
          <p class="text-sm text-brown-900">{{ monster.description }}</p>
        </div>

        <!-- Image with fallback message -->
        <div v-if="monsterImage" class="mb-4">
          <img
            :src="monsterImage"
            :alt="monster.name"
            class="w-full max-h-96 object-contain rounded border-2 border-brown-900 bg-white"
            @error="handleImageError"
          />
        </div>
        <div v-else-if="monster.source === 'api'" class="mb-4 p-4 bg-brown-900/5 rounded border border-brown-900 text-center">
          <p class="text-sm text-brown-700 italic">No image available for this monster</p>
        </div>

        <hr class="border-t-2 border-red-900 my-4" />

        <!-- Stats -->
        <div class="space-y-2 mb-4 text-brown-900">
          <p><strong>Armor Class</strong> {{ armorClass }}</p>
          <p><strong>Hit Points</strong> {{ hitPoints }}</p>
          <p><strong>Speed</strong> {{ monsterSpeed }}</p>
        </div>

        <hr class="border-t-2 border-red-900 my-4" />

        <!-- Ability Scores -->
        <div class="grid grid-cols-6 gap-2 text-center mb-4 text-brown-900">
          <div>
            <p class="font-semibold text-xs text-red-900">STR</p>
            <p>{{ monster.strength || 10 }} ({{ getModifier(monster.strength || 10) }})</p>
          </div>
          <div>
            <p class="font-semibold text-xs text-red-900">DEX</p>
            <p>{{ monster.dexterity || 10 }} ({{ getModifier(monster.dexterity || 10) }})</p>
          </div>
          <div>
            <p class="font-semibold text-xs text-red-900">CON</p>
            <p>{{ monster.constitution || 10 }} ({{ getModifier(monster.constitution || 10) }})</p>
          </div>
          <div>
            <p class="font-semibold text-xs text-red-900">INT</p>
            <p>{{ monster.intelligence || 10 }} ({{ getModifier(monster.intelligence || 10) }})</p>
          </div>
          <div>
            <p class="font-semibold text-xs text-red-900">WIS</p>
            <p>{{ monster.wisdom || 10 }} ({{ getModifier(monster.wisdom || 10) }})</p>
          </div>
          <div>
            <p class="font-semibold text-xs text-red-900">CHA</p>
            <p>{{ monster.charisma || 10 }} ({{ getModifier(monster.charisma || 10) }})</p>
          </div>
        </div>

        <hr class="border-t-2 border-red-900 my-4" />

        <!-- Damage Properties -->
        <div v-if="monster.damage_vulnerabilities?.length" class="mb-2 text-brown-900">
          <strong>Damage Vulnerabilities</strong> {{ monster.damage_vulnerabilities.join(', ') }}
        </div>
        <div v-if="monster.damage_resistances?.length" class="mb-2 text-brown-900">
          <strong>Damage Resistances</strong> {{ monster.damage_resistances.join(', ') }}
        </div>
        <div v-if="monster.damage_immunities?.length" class="mb-2 text-brown-900">
          <strong>Damage Immunities</strong> {{ monster.damage_immunities.join(', ') }}
        </div>
        <div v-if="monster.condition_immunities?.length" class="mb-2 text-brown-900">
          <strong>Condition Immunities</strong> {{ monster.condition_immunities.join(', ') }}
        </div>

        <!-- Senses -->
        <div v-if="monster.senses" class="mb-2 text-brown-900">
          <strong>Senses</strong>
          <span v-if="typeof monster.senses === 'string'">{{ monster.senses }}</span>
          <span v-else>
            <span v-if="monster.senses.darkvision">darkvision {{ monster.senses.darkvision }}, </span>
            <span v-if="monster.senses.blindsight">blindsight {{ monster.senses.blindsight }}, </span>
            <span v-if="monster.senses.tremorsense">tremorsense {{ monster.senses.tremorsense }}, </span>
            passive Perception {{ monster.senses.passive_perception || 10 }}
          </span>
        </div>

        <!-- Languages -->
        <div v-if="monster.languages" class="mb-4 text-brown-900">
          <strong>Languages</strong> {{ monster.languages }}
        </div>

        <!-- Challenge Rating -->
        <div class="mb-4 text-brown-900">
          <p><strong>Challenge</strong> {{ monster.challenge_rating }} ({{ monster.xp || 0 }} XP)</p>
        </div>

        <hr class="border-t-2 border-red-900 my-4" />

        <!-- Special Abilities -->
        <div v-if="specialAbilities.length" class="mt-4">
          <h3 class="text-2xl font-medieval text-red-900 mb-2">Special Abilities</h3>
          <div v-for="(ability, index) in specialAbilities" :key="index" class="mb-3 text-brown-900">
            <p><strong class="text-red-900">{{ ability.name }}.</strong> {{ ability.desc || ability.description }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="monsterActions.length" class="mt-4">
          <h3 class="text-2xl font-medieval text-red-900 mb-2 border-b-2 border-red-900 pb-1">Actions</h3>
          <div v-for="(action, index) in monsterActions" :key="index" class="mb-3 text-brown-900">
            <p><strong class="text-red-900">{{ action.name }}.</strong> {{ action.desc || action.description }}</p>
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-8">
          <router-link to="/monsters" class="btn-primary">
            ← Back to Monster List
          </router-link>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <p class="text-xl text-brown-900">Monster not found</p>
      <router-link to="/monsters" class="btn-primary mt-4 inline-block">
        Back to Monster List
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMonsterStore } from '../stores/monsters'

const route = useRoute()
const monsterStore = useMonsterStore()
const monster = ref(null)
const loading = ref(true)
const error = ref(null)


const monsterImage = computed(() => {
  if (!monster.value) return null


  if (monster.value.image && monster.value.source === 'custom') {
    return monster.value.image
  }


  if (monster.value.source === 'api') {

    if (monster.value.image) {
      return `https://www.dnd5eapi.co${monster.value.image}`
    }

    if (monster.value.index) {

      return `https://www.dnd5eapi.co/api/images/monsters/${monster.value.index}.png`
    }
  }

  return null
})

const armorClass = computed(() => {
  if (!monster.value) return 'N/A'

  const ac = monster.value.armor_class


  if (ac && typeof ac === 'object' && !Array.isArray(ac)) {
    return `${ac.value} ${ac.type ? `(${ac.type})` : ''}`
  }


  if (Array.isArray(ac) && ac.length > 0) {
    const primary = ac[0]
    return `${primary.value} ${primary.type ? `(${primary.type})` : ''}`
  }


  if (typeof ac === 'number') {
    return ac
  }

  return 'N/A'
})

const hitPoints = computed(() => {
  if (!monster.value) return 'N/A'

  const hp = monster.value.hit_points


  if (hp && typeof hp === 'object') {
    return `${hp.value || hp.hit_points || 0} ${hp.formula || hp.hit_dice ? `(${hp.formula || hp.hit_dice})` : ''}`
  }


  if (typeof hp === 'number') {
    const dice = monster.value.hit_dice
    return `${hp} ${dice ? `(${dice})` : ''}`
  }

  return 'N/A'
})

const monsterSpeed = computed(() => {
  if (!monster.value || !monster.value.speed) return 'None'

  const speed = monster.value.speed

  // Handle string format
  if (typeof speed === 'string') return speed

  // Handle object format
  const parts = []
  if (speed.walk) parts.push(`walk ${speed.walk}`)
  if (speed.fly) parts.push(`fly ${speed.fly}`)
  if (speed.swim) parts.push(`swim ${speed.swim}`)
  if (speed.climb) parts.push(`climb ${speed.climb}`)
  if (speed.burrow) parts.push(`burrow ${speed.burrow}`)

  return parts.join(', ') || 'None'
})

const monsterActions = computed(() => {
  if (!monster.value) return []

  if (monster.value.actions && Array.isArray(monster.value.actions)) {
    return monster.value.actions
  }

  return []
})

const specialAbilities = computed(() => {
  if (!monster.value) return []

  if (monster.value.special_abilities && Array.isArray(monster.value.special_abilities)) {
    return monster.value.special_abilities
  }

  return []
})

const loadMonster = async () => {
  try {
    loading.value = true
    error.value = null

    const monsterId = route.params.id

    console.log('Loading monster with ID:', monsterId)

    if (!monsterId) {
      throw new Error('No monster ID provided')
    }

    monster.value = await monsterStore.fetchMonster(monsterId)

    console.log('Monster loaded:', monster.value)
    console.log('Monster image URL:', monsterImage.value)

  } catch (err) {
    console.error('Error loading monster:', err)
    error.value = err.message || 'Failed to load monster details'
  } finally {
    loading.value = false
  }
}

const getModifier = (score) => {
  if (!score) return '+0'
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : mod
}

onMounted(() => {
  loadMonster()
})

watch(() => route.params.id, () => {
  if (route.params.id) {
    loadMonster()
  }
})
</script>

<style scoped>
.stat-block {
  background: linear-gradient(to bottom,
    rgb(242, 235, 220) 0%,
    rgb(250, 245, 235) 50%,
    rgb(242, 235, 220) 100%
  );
  padding: 2rem;
  border-radius: 0.5rem;
  border: 4px solid rgb(101, 67, 33);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.5);
  position: relative;
}

.stat-block::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 1px solid rgb(139, 69, 19);
  border-radius: 0.25rem;
  pointer-events: none;
}
</style>

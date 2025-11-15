<template>
  <div
    :class="[
      'group bg-white/80 rounded-lg border-2 border-brown-900 shadow-lg transition-all duration-300',
      viewMode === 'grid'
        ? 'p-4 hover:-translate-y-1 hover:shadow-xl'
        : 'p-6 hover:bg-white/90'
    ]"
  >
    <div :class="{ 'md:flex md:justify-between md:items-start gap-6': viewMode === 'list' }">
      <!-- Monster Info with Image Beside Name -->
      <div class="flex gap-4 flex-1">
        <!-- Monster Image - Smaller, beside name -->
        <div class="relative overflow-hidden rounded-lg border-2 border-brown-900 bg-brown-900/10 w-24 h-24 shrink-0">
          <img
            v-if="monsterImageUrl"
            :src="monsterImageUrl"
            :alt="monster.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-8 h-8 text-brown-900/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
            </svg>
          </div>
        </div>

        <!-- Monster Details -->
        <div class="flex-1 min-w-0">
          <h2 class="text-xl font-medieval mb-2 text-brown-900 group-hover:text-red-900 transition-colors duration-200 tracking-wide truncate">
            {{ monster.name }}
          </h2>

          <div :class="{ 'md:flex md:gap-6': viewMode === 'list' }">
            <!-- Basic Info -->
            <div class="space-y-1">
              <p class="text-sm text-brown-900 flex items-center gap-2">
                <span class="font-semibold text-red-900">Type:</span>
                <span class="font-body">{{ monster.type }}</span>
              </p>
              <p v-if="monster.size" class="text-sm text-brown-900 flex items-center gap-2">
                <span class="font-semibold text-red-900">Size:</span>
                <span class="font-body">{{ monster.size }}</span>
              </p>
            </div>

            <!-- Stats -->
            <div class="space-y-1 mt-1 md:mt-0">
              <p v-if="monster.challenge_rating !== undefined" class="text-sm text-brown-900 flex items-center gap-2">
                <span class="font-semibold text-red-900">CR:</span>
                <span class="font-body font-medium">{{ monster.challenge_rating }}</span>
              </p>
              <p v-if="monster.alignment" class="text-sm text-brown-900 flex items-center gap-2">
                <span class="font-semibold text-red-900">Alignment:</span>
                <span class="font-body">{{ monster.alignment }}</span>
              </p>
            </div>
          </div>

          <!-- Source Badge -->
          <div class="mt-2">
            <span
              :class="[
                'inline-block px-2 py-0.5 text-xs font-semibold rounded',
                monster.source === 'custom'
                  ? 'bg-golden/20 text-golden border border-golden'
                  : 'bg-blue-900/20 text-blue-900 border border-blue-900'
              ]"
            >
              {{ monster.source === 'custom' ? '✨ Custom' : '📖 API' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div :class="{
        'flex justify-end mt-4 gap-2': true,
        'md:mt-0 md:ml-4 md:flex-col': viewMode === 'list'
      }">
        <!-- View Details Button -->
        <router-link
          :to="{ name: 'monster-detail', params: { id: monsterId } }"
          class="bg-brown-900 text-parchment px-3 py-2 rounded font-medieval hover:bg-red-900 transition-colors duration-200 inline-flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>View</span>
        </router-link>

        <!-- Update Button - Only for custom monsters -->
        <router-link
          v-if="monster.source === 'custom'"
          :to="{ name: 'builder', query: { edit: monsterId } }"
          class="bg-golden text-brown-900 px-3 py-2 rounded font-medieval hover:bg-golden/80 transition-colors duration-200 inline-flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit</span>
        </router-link>

        <!-- Delete Button - Only for custom monsters -->
        <button
          v-if="monster.source === 'custom'"
          @click="handleDelete"
          class="bg-red-900 text-parchment px-3 py-2 rounded font-medieval hover:bg-red-800 transition-colors duration-200 inline-flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>

    <!-- Additional Info for List View -->
    <div v-if="viewMode === 'list' && monster.hit_points"
         class="mt-4 pt-4 border-t border-brown-900/20">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-red-900 tracking-wide text-sm">HP:</span>
          <span class="font-body font-medium text-sm">{{ formatHP }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-red-900 tracking-wide text-sm">AC:</span>
          <span class="font-body font-medium text-sm">{{ formatAC }}</span>
        </div>
        <div v-if="formatSpeed" class="flex items-center gap-2">
          <span class="font-semibold text-red-900 tracking-wide text-sm">Speed:</span>
          <span class="font-body text-sm">{{ formatSpeed }}</span>
        </div>
        <div v-if="monster.languages" class="flex items-center gap-2">
          <span class="font-semibold text-red-900 tracking-wide text-sm">Languages:</span>
          <span class="font-body text-sm truncate">{{ monster.languages }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMonsterStore } from '../stores/monsters'
import { useRouter } from 'vue-router'

const props = defineProps({
  monster: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  }
})

const monsterStore = useMonsterStore()
const router = useRouter()
const imageError = ref(false)

// Compute the correct monster ID for routing
const monsterId = computed(() => {
  // For custom monsters (from database), use _id
  if (props.monster._id) {
    return props.monster._id
  }
  // For API monsters, use index
  if (props.monster.index) {
    return props.monster.index
  }
  // Fallback
  return props.monster.id || props.monster.name
})

// Compute the monster image URL
const monsterImageUrl = computed(() => {
  if (imageError.value) return null

  // Custom monsters have full URL in 'image' field
  if (props.monster.source === 'custom' && props.monster.image) {
    return props.monster.image
  }

  // API monsters - construct URL from image path
  if (props.monster.source === 'api' && props.monster.image) {
    return `https://www.dnd5eapi.co${props.monster.image}`
  }

  return null
})

// Format Hit Points
const formatHP = computed(() => {
  const hp = props.monster.hit_points

  if (hp && typeof hp === 'object') {
    return `${hp.value || 0} ${hp.formula ? `(${hp.formula})` : ''}`
  }

  return hp || 'N/A'
})

// Format Armor Class
const formatAC = computed(() => {
  const ac = props.monster.armor_class

  // Array format from API: [{type: "natural", value: 17}]
  if (Array.isArray(ac) && ac.length > 0) {
    return ac[0].value
  }

  // Object format from custom: {value: 10, type: 'natural armor'}
  if (ac && typeof ac === 'object') {
    return ac.value
  }

  // Simple number
  return ac || 'N/A'
})

// Format Speed
const formatSpeed = computed(() => {
  const speed = props.monster.speed

  if (!speed) return null

  // String format
  if (typeof speed === 'string') return speed

  // Object format - show walk speed primarily
  if (speed.walk) return speed.walk

  return null
})

const handleImageError = () => {
  imageError.value = true
}

const handleDelete = async () => {
  if (!confirm(`Are you sure you want to delete "${props.monster.name}"? This action cannot be undone.`)) {
    return
  }

  try {
    await monsterStore.deleteMonster(monsterId.value)
    // Show success message (you could use a toast notification here)
    alert(`Successfully deleted "${props.monster.name}"`)
  } catch (error) {
    console.error('Error deleting monster:', error)
    alert(`Failed to delete monster: ${error.message}`)
  }
}
</script>

<style scoped>
/* Parchment color for text on buttons */
.text-parchment {
  color: #F2EBDC;
}

/* Golden color */
.bg-golden {
  background-color: #D4AF37;
}

.text-golden {
  color: #D4AF37;
}

.border-golden {
  border-color: #D4AF37;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Image fade in */
img {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Hover effects for buttons */
button, a {
  position: relative;
  overflow: hidden;
}

button::before, a::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

button:hover::before, a:hover::before {
  width: 300px;
  height: 300px;
}
</style>

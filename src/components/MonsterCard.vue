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
      <!-- Monster Image -->
      <div :class="[
        'relative overflow-hidden rounded-lg border-2 border-brown-900 bg-brown-900/10',
        viewMode === 'grid' ? 'mb-4 h-48' : 'h-32 w-32 shrink-0'
      ]">
        <img
          v-if="monsterImageUrl"
          :src="monsterImageUrl"
          :alt="monster.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-12 h-12 text-brown-900/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
          </svg>
        </div>
      </div>

      <!-- Monster Info -->
      <div :class="{ 'md:flex-1': viewMode === 'list' }">
        <h2 class="text-xl font-medieval mb-3 text-brown-900 group-hover:text-red-900 transition-colors duration-200 tracking-wide">
          {{ monster.name }}
        </h2>
        
        <div :class="{ 'md:flex md:gap-6': viewMode === 'list' }">
          <!-- Basic Info -->
          <div class="space-y-2">
            <p class="text-brown-900 flex items-center gap-2">
              <span class="font-semibold text-red-900 tracking-wide">Type:</span> 
              <span class="font-body">{{ monster.type }}</span>
            </p>
            <p v-if="monster.size" class="text-brown-900 flex items-center gap-2">
              <span class="font-semibold text-red-900 tracking-wide">Size:</span> 
              <span class="font-body">{{ monster.size }}</span>
            </p>
          </div>

          <!-- Stats -->
          <div class="space-y-2 mt-2 md:mt-0">
            <p v-if="monster.challenge_rating" class="text-brown-900 flex items-center gap-2">
              <span class="font-semibold text-red-900 tracking-wide">CR:</span> 
              <span class="font-body font-medium">{{ monster.challenge_rating }}</span>
            </p>
            <p v-if="monster.alignment" class="text-brown-900 flex items-center gap-2">
              <span class="font-semibold text-red-900 tracking-wide">Alignment:</span> 
              <span class="font-body">{{ monster.alignment }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div :class="{ 
        'flex justify-end mt-4 space-x-4': true,
        'md:mt-0 md:ml-4': viewMode === 'list'
      }">
        <router-link 
          :to="`/monster/${monster.index}`" 
          class="bg-brown-900 text-parchment px-4 py-2 rounded font-medieval hover:bg-red-900 transition-colors duration-200 inline-flex items-center gap-2"
        >
          <span>View Details</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Additional Info for List View -->
    <div v-if="viewMode === 'list' && monster.hit_points" 
         class="mt-4 pt-4 border-t border-brown-900/20">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-red-900 tracking-wide">HP:</span>
          <span class="font-body font-medium">{{ monster.hit_points }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-red-900 tracking-wide">AC:</span>
          <span class="font-body font-medium">{{ 
            Array.isArray(monster.armor_class)
              ? monster.armor_class[0]?.value
              : monster.armor_class
          }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-red-900 tracking-wide">Speed:</span>
          <span class="font-body">{{ monster.speed }}</span>
        </div>
        <div v-if="monster.languages" class="flex items-center gap-2">
          <span class="font-semibold text-red-900 tracking-wide">Languages:</span>
          <span class="font-body">{{ monster.languages }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ 
  monster: Object,
  viewMode: {
    type: String,
    default: 'grid'
  }
})

const monsterImageUrl = computed(() => {
  if (props.monster.image) {
    return `https://www.dnd5eapi.co${props.monster.image}`
  }
  return null
})
</script>

<template>
  <div 
    :class="[
      'group bg-white/80 rounded-lg border-2 border-brown-900 shadow-lg transition-all duration-300',
      viewMode === 'grid' 
        ? 'p-4 hover:-translate-y-1 hover:shadow-xl' 
        : 'p-6 hover:bg-white/90'
    ]"
  >
    <div :class="{ 'md:flex md:justify-between md:items-center': viewMode === 'list' }">
      <!-- Monster Info -->
      <div :class="{ 'md:flex-1': viewMode === 'list' }">
        <h2 class="text-xl font-medieval mb-2 text-brown-900 group-hover:text-red-900 transition-colors duration-200">
          {{ monster.name }}
        </h2>
        
        <div :class="{ 'md:flex md:gap-6': viewMode === 'list' }">
          <!-- Basic Info -->
          <div class="space-y-1">
            <p class="text-brown-900">
              <span class="font-medieval">Type:</span> 
              <span class="font-body">{{ monster.type }}</span>
            </p>
            <p v-if="monster.size" class="text-brown-900">
              <span class="font-medieval">Size:</span> 
              <span class="font-body">{{ monster.size }}</span>
            </p>
          </div>

          <!-- Stats -->
          <div class="space-y-1 mt-2 md:mt-0">
            <p v-if="monster.challenge_rating" class="text-red-900">
              <span class="font-medieval">CR:</span> 
              <span class="font-body">{{ monster.challenge_rating }}</span>
            </p>
            <p v-if="monster.alignment" class="text-brown-900">
              <span class="font-medieval">Alignment:</span> 
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
        <div>
          <span class="font-medieval text-red-900">HP:</span>
          <span class="font-body">{{ monster.hit_points }}</span>
        </div>
        <div>
          <span class="font-medieval text-red-900">AC:</span>
          <span class="font-body">{{ monster.armor_class }}</span>
        </div>
        <div>
          <span class="font-medieval text-red-900">Speed:</span>
          <span class="font-body">{{ monster.speed }}</span>
        </div>
        <div v-if="monster.languages">
          <span class="font-medieval text-red-900">Languages:</span>
          <span class="font-body">{{ monster.languages }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ 
  monster: Object,
  viewMode: {
    type: String,
    default: 'grid'
  }
})
</script>

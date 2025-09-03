import { defineStore } from 'pinia'
import axios from 'axios'

export const useMonsterStore = defineStore('monsters', {
  state: () => ({
    monsters: [],
    currentMonster: null,
    loading: false,
    error: null,
    // For monster builder
    customMonsters: JSON.parse(localStorage.getItem('customMonsters') || '[]'),
    // Cache for monster details
    monsterCache: new Map(),
  }),

  getters: {
    getMonsterByIndex: (state) => {
      return (index) => {
        // Check custom monsters first
        const customMonster = state.customMonsters.find((m) => m.index === index)
        if (customMonster) return customMonster

        // Then check API monsters
        return state.monsters.find((m) => m.index === index)
      }
    },
    getAllMonsters: (state) => [...state.monsters, ...state.customMonsters],
    getCustomMonsters: (state) => state.customMonsters,
    getAPIMonsters: (state) => state.monsters,
    // Add a getter for monster stats validation
    validateMonsterStats: () => (monster) => {
      const errors = []

      // Basic stat validation
      const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
      stats.forEach((stat) => {
        const value = parseInt(monster[stat])
        if (isNaN(value) || value < 1 || value > 30) {
          errors.push(`${stat.charAt(0).toUpperCase() + stat.slice(1)} must be between 1 and 30`)
        }
      })

      // Challenge rating validation
      const cr = parseFloat(monster.challenge_rating)
      if (isNaN(cr) || cr < 0 || cr > 30) {
        errors.push('Challenge rating must be between 0 and 30')
      }

      // HP validation
      const hp = parseInt(monster.hit_points)
      if (isNaN(hp) || hp < 1) {
        errors.push('Hit points must be greater than 0')
      }

      // AC validation
      if (Array.isArray(monster.armor_class)) {
        if (!monster.armor_class.every((ac) => ac.value > 0 && ac.type)) {
          errors.push('Invalid armor class configuration')
        }
      } else {
        const ac = parseInt(monster.armor_class)
        if (isNaN(ac) || ac < 1) {
          errors.push('Armor class must be greater than 0')
        }
      }

      return errors
    },
  },

  actions: {
    async fetchMonsters() {
      this.loading = true
      try {
        // First get the list of all monsters
        const response = await axios.get('https://www.dnd5eapi.co/api/monsters')
        const monsterList = response.data.results

        // Then fetch full details for each monster
        const detailedMonsters = await Promise.all(
          monsterList.map(async (monster) => {
            try {
              const detailResponse = await axios.get(
                `https://www.dnd5eapi.co/api/monsters/${monster.index}`,
              )
              return detailResponse.data
            } catch (err) {
              console.error(`Error fetching details for ${monster.name}:`, err)
              return {
                ...monster,
                error: true,
                errorMessage: err.message || 'Failed to load monster details',
              }
            }
          }),
        )

        this.monsters = detailedMonsters
        this.error = null
      } catch (err) {
        this.error = 'Failed to fetch monsters'
        console.error('Error fetching monsters:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchMonsterDetails(index) {
      this.loading = true
      try {
        // Check cache first
        if (this.monsterCache.has(index)) {
          this.currentMonster = this.monsterCache.get(index)
          this.loading = false
          return this.currentMonster
        }

        const response = await axios.get(`https://www.dnd5eapi.co/api/monsters/${index}`)
        const monsterData = response.data

        // Basic data sanitization
        const sanitizeString = (str) => (str ? String(str).trim() : '')
        monsterData.name = sanitizeString(monsterData.name)
        monsterData.type = sanitizeString(monsterData.type)
        monsterData.size = sanitizeString(monsterData.size)
        monsterData.alignment = sanitizeString(monsterData.alignment)

        // Try to fetch the image if available
        if (monsterData.image) {
          // Don't need to await this, it's just pre-caching the image
          const img = new Image()
          img.src = `https://www.dnd5eapi.co${monsterData.image}`
        }

        this.currentMonster = monsterData
        this.monsterCache.set(index, monsterData)
        this.error = null
        return monsterData
      } catch (err) {
        this.error = 'Failed to fetch monster details'
        console.error('Error fetching monster details:', err)
        return null
      } finally {
        this.loading = false
      }
    },

    addCustomMonster(monster) {
      if (!monster || typeof monster !== 'object') {
        throw new Error('Invalid monster data')
      }

      // Validate required fields
      const requiredFields = ['name', 'type', 'size', 'alignment', 'armor_class', 'hit_points']
      const missingFields = requiredFields.filter((field) => !monster[field])

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      // Add a unique ID to custom monsters
      const newMonster = {
        ...monster,
        id: Date.now(),
        custom: true,
        index: `custom-${Date.now()}`, // Add index for consistency with API monsters
      }

      this.customMonsters.push(newMonster)
      this.saveCustomMonsters()
      return newMonster
    },

    saveCustomMonsters() {
      try {
        localStorage.setItem('customMonsters', JSON.stringify(this.customMonsters))
      } catch (error) {
        console.error('Error saving custom monsters:', error)
      }
    },

    updateCustomMonster(id, updatedMonster) {
      if (!id || !updatedMonster || typeof updatedMonster !== 'object') {
        throw new Error('Invalid update parameters')
      }

      const index = this.customMonsters.findIndex((m) => m.id === id)
      if (index === -1) {
        throw new Error('Monster not found')
      }

      // Validate required fields
      const requiredFields = ['name', 'type', 'size', 'alignment', 'armor_class', 'hit_points']
      const missingFields = requiredFields.filter((field) => !updatedMonster[field])

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      // Preserve custom properties
      this.customMonsters[index] = {
        ...updatedMonster,
        id,
        custom: true,
        index: this.customMonsters[index].index,
      }

      this.saveCustomMonsters()
      return this.customMonsters[index]
    },

    deleteCustomMonster(id) {
      if (!id) {
        throw new Error('Invalid monster ID')
      }

      const index = this.customMonsters.findIndex((m) => m.id === id)
      if (index === -1) {
        throw new Error('Monster not found')
      }

      const deletedMonster = this.customMonsters[index]
      this.customMonsters = this.customMonsters.filter((m) => m.id !== id)

      // If the deleted monster was currently selected, clear it
      if (this.currentMonster?.id === id) {
        this.currentMonster = null
      }

      this.saveCustomMonsters()
      return deletedMonster
    },
  },
})

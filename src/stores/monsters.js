import { defineStore } from 'pinia'
import axios from 'axios'

export const useMonsterStore = defineStore('monsters', {
  state: () => ({
    monsters: [],
    currentMonster: null,
    loading: false,
    error: null,
    // For monster builder
    customMonsters: [],
  }),

  getters: {
    getMonsterByIndex: (state) => {
      return (index) => state.monsters.find(m => m.index === index)
    },
    getAllMonsters: (state) => state.monsters,
    getCustomMonsters: (state) => state.customMonsters
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
              const detailResponse = await axios.get(`https://www.dnd5eapi.co/api/monsters/${monster.index}`)
              return detailResponse.data
            } catch (err) {
              console.error(`Error fetching details for ${monster.name}:`, err)
              return monster // fallback to basic info if detail fetch fails
            }
          })
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
        const response = await axios.get(`https://www.dnd5eapi.co/api/monsters/${index}`)
        const monsterData = response.data
        
        // Try to fetch the image if available
        if (monsterData.image) {
          // Don't need to await this, it's just pre-caching the image
          const img = new Image()
          img.src = `https://www.dnd5eapi.co${monsterData.image}`
        }

        this.currentMonster = monsterData
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
      // Add a unique ID to custom monsters
      const newMonster = {
        ...monster,
        id: Date.now(),
        custom: true
      }
      this.customMonsters.push(newMonster)
    },

    updateCustomMonster(id, updatedMonster) {
      const index = this.customMonsters.findIndex(m => m.id === id)
      if (index !== -1) {
        this.customMonsters[index] = {
          ...updatedMonster,
          id,
          custom: true
        }
      }
    },

    deleteCustomMonster(id) {
      this.customMonsters = this.customMonsters.filter(m => m.id !== id)
    }
  }
})

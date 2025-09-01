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
        const response = await axios.get('https://www.dnd5eapi.co/api/monsters')
        this.monsters = response.data.results
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
        this.currentMonster = response.data
        this.error = null
        return response.data
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

import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

export const useMonsterStore = defineStore('monsters', {
  state: () => ({
    monsters: [], // Initialize as empty array
    currentMonster: null,
    loading: false,
    error: null,
  }),

  getters: {
    allMonsters: (state) => state.monsters || [], // Safety check
    customMonsters: (state) => (state.monsters || []).filter(m => m.source === 'custom'),
    apiMonsters: (state) => (state.monsters || []).filter(m => m.source === 'api'),
  },

  actions: {
    // Fetch all monsters from backend
    async fetchMonsters() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_BASE_URL}/monsters`)
        this.monsters = response.data || [] // Ensure it's always an array
      } catch (error) {
        this.error = error.message
        this.monsters = [] // Set to empty array on error
        console.error('Error fetching monsters:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch single monster
    async fetchMonster(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_BASE_URL}/monsters/${id}`)
        this.currentMonster = response.data
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Error fetching monster:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Create custom monster
    async createMonster(monsterData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_BASE_URL}/monsters`, monsterData)
        this.monsters.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Error creating monster:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update monster
    async updateMonster(id, monsterData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put(`${API_BASE_URL}/monsters/${id}`, monsterData)
        const index = this.monsters.findIndex(m => m._id === id)
        if (index !== -1) {
          this.monsters[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Error updating monster:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete monster
    async deleteMonster(id) {
      try {
        await axios.delete(`${API_BASE_URL}/monsters/${id}`)

        // Remove from local state
        this.monsters = this.monsters.filter(m => m._id !== id)

        return true
      } catch (error) {
        console.error('Error deleting monster:', error)
        throw error
      }
    },

    // Upload image
    async uploadImage(file) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        return response.data.url
      } catch (error) {
        this.error = error.message
        console.error('Error uploading image:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Export monster
    async exportMonster(id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/monsters/${id}/export`, {
          responseType: 'blob'
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `monster-${id}.json`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (error) {
        this.error = error.message
        console.error('Error exporting monster:', error)
        throw error
      }
    },
  },
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGameStore } from './gameStore'
import { createDecimal } from '@/utils/decimalUtils'

// Save key for localStorage
const SAVE_KEY = 'idle-ant-farm-save'
const AUTO_SAVE_INTERVAL = 60000 // 1 minute

export const useSaveSystem = defineStore('saveSystem', () => {
  // Settings
  const autoSaveEnabled = ref(true)
  const offlineProgressEnabled = ref(true)

  // Save metadata
  const lastSaveTime = ref(Date.now())
  const lastLoadTime = ref(Date.now())

  // Offline progress calculation state
  const isCalculatingOfflineProgress = ref(false)
  const offlineProgressTotalTicks = ref(0)
  const offlineProgressTicksProcessed = ref(0)
  const offlineProgressElapsedTime = ref(0)

  // Auto-save interval reference
  let autoSaveIntervalId: number | null = null

  // Get all stores that need to be saved
  const getStores = () => {
    return {
      gameStore: useGameStore(),
    }
  }

  // Collect state from all stores
  const collectState = () => {
    const stores = getStores()
    const state = {
      saveTime: Date.now(),
      gameStore: {
        totalTicks: stores.gameStore.totalTicks.toString(),
      },
      // Add more stores as they are created
    }

    return state
  }

  // Apply state to all stores
  const applyState = (state: any) => {
    if (!state) return false

    try {
      const stores = getStores()

      // Load game store state
      if (state.gameStore) {
        if (state.gameStore.totalTicks) {
          stores.gameStore.totalTicks = createDecimal(state.gameStore.totalTicks)
        }
      }

      // Add more stores as they are created

      // Update load time
      lastLoadTime.value = Date.now()
      return true
    } catch (error) {
      console.error('Error applying save state:', error)
      return false
    }
  }

  // Calculate offline progress
  const calculateOfflineProgress = (lastSaveTime: number) => {
    if (!offlineProgressEnabled.value) return

    const now = Date.now()
    const elapsedMs = now - lastSaveTime
    const elapsedSeconds = elapsedMs / 1000

    if (elapsedSeconds < 10) return // Don't calculate for very short periods

    const stores = getStores()
    const tickDuration = stores.gameStore.tickDuration

    // Calculate how many ticks would have occurred while offline
    const offlineTicks = Math.floor(elapsedSeconds / tickDuration)

    if (offlineTicks > 0) {
      // Set up offline progress calculation state
      isCalculatingOfflineProgress.value = true
      offlineProgressTotalTicks.value = offlineTicks
      offlineProgressTicksProcessed.value = 0
      offlineProgressElapsedTime.value = elapsedSeconds

      // We'll use a batch size to avoid freezing the UI for very long offline periods
      const BATCH_SIZE = 100
      let ticksProcessed = 0

      // Process ticks in batches with a small delay between batches
      const processBatch = () => {
        const batchSize = Math.min(BATCH_SIZE, offlineTicks - ticksProcessed)

        // Process a batch of ticks
        for (let i = 0; i < batchSize; i++) {
          // Call the tick function for each tick to properly simulate game progression
          stores.gameStore.tick()
          ticksProcessed++
          offlineProgressTicksProcessed.value = ticksProcessed
        }

        // If there are more ticks to process, schedule the next batch
        if (ticksProcessed < offlineTicks) {
          setTimeout(processBatch, 10) // Small delay to allow UI updates
        }
      }

      // Start processing batches
      processBatch()

      return {
        elapsedTime: elapsedSeconds,
        ticks: offlineTicks,
      }
    }

    return null
  }

  // Save game to localStorage
  const saveGame = () => {
    try {
      const state = collectState()
      localStorage.setItem(SAVE_KEY, JSON.stringify(state))
      lastSaveTime.value = Date.now()
      console.log('Game saved successfully')
      return true
    } catch (error) {
      console.error('Error saving game:', error)
      return false
    }
  }

  // Load game from localStorage
  const loadGame = () => {
    try {
      const saveData = localStorage.getItem(SAVE_KEY)
      if (!saveData) return false

      const state = JSON.parse(saveData)
      const success = applyState(state)

      if (success && offlineProgressEnabled.value) {
        // Calculate offline progress since last save
        return calculateOfflineProgress(state.saveTime)
      }

      return success
    } catch (error) {
      console.error('Error loading game:', error)
      return false
    }
  }

  // Export save as base64 string
  const exportSave = () => {
    try {
      const state = collectState()
      const jsonString = JSON.stringify(state)
      const base64Save = btoa(jsonString)
      return base64Save
    } catch (error) {
      console.error('Error exporting save:', error)
      return null
    }
  }

  // Import save from base64 string
  const importSave = (base64Save: string) => {
    try {
      const jsonString = atob(base64Save)
      const state = JSON.parse(jsonString)
      return applyState(state)
    } catch (error) {
      console.error('Error importing save:', error)
      return false
    }
  }

  // Reset game (delete save and reload)
  const resetGame = () => {
    try {
      localStorage.removeItem(SAVE_KEY)
      window.location.reload()
      return true
    } catch (error) {
      console.error('Error resetting game:', error)
      return false
    }
  }

  // Start auto-save interval
  const startAutoSave = () => {
    if (autoSaveIntervalId) return

    autoSaveIntervalId = window.setInterval(() => {
      if (autoSaveEnabled.value) {
        saveGame()
      }
    }, AUTO_SAVE_INTERVAL)
  }

  // Stop auto-save interval
  const stopAutoSave = () => {
    if (autoSaveIntervalId) {
      clearInterval(autoSaveIntervalId)
      autoSaveIntervalId = null
    }
  }

  // Toggle auto-save
  const toggleAutoSave = () => {
    autoSaveEnabled.value = !autoSaveEnabled.value
    if (autoSaveEnabled.value) {
      startAutoSave()
    }
  }

  // Toggle offline progress
  const toggleOfflineProgress = () => {
    offlineProgressEnabled.value = !offlineProgressEnabled.value
  }

  // Time since last save
  const timeSinceLastSave = computed(() => {
    const elapsed = (Date.now() - lastSaveTime.value) / 1000
    return elapsed.toFixed(0)
  })

  return {
    autoSaveEnabled,
    offlineProgressEnabled,
    lastSaveTime,
    lastLoadTime,
    timeSinceLastSave,
    isCalculatingOfflineProgress,
    offlineProgressTotalTicks,
    offlineProgressTicksProcessed,
    offlineProgressElapsedTime,
    saveGame,
    loadGame,
    exportSave,
    importSave,
    resetGame,
    startAutoSave,
    stopAutoSave,
    toggleAutoSave,
    toggleOfflineProgress,
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGameStore } from './gameStore'
import { useGeneratorStore } from './generatorStore'
import { usePrestigeStore } from './prestigeStore'
import { useGeneratorUpgradeStore } from './generatorUpgradeStore'
import { useDebounceFn } from '@vueuse/core'
import { useInventoryStore } from './inventoryStore'
import { useAdventureStore } from './adventureStore'

// Save key for localStorage
const SAVE_KEY = 'idle-ant-farm-save'
const AUTO_SAVE_INTERVAL = 60000 // 1 minute
const DEBOUNCE_DELAY = 2000 // 2 seconds

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
      generatorStore: useGeneratorStore(),
      prestigeStore: usePrestigeStore(),
      generatorUpgradeStore: useGeneratorUpgradeStore(),
      inventoryStore: useInventoryStore(),
      adventureStore: useAdventureStore(),
    }
  }

  // Collect state from all stores
  const collectState = () => {
    const stores = getStores()
    const state = {
      saveTime: Date.now(),
      gameStore: stores.gameStore.getState(),
      generatorStore: stores.generatorStore.getState(),
      prestigeStore: stores.prestigeStore.getState(),
      generatorUpgradeStore: stores.generatorUpgradeStore.getState(),
      inventoryStore: stores.inventoryStore.getState(),
      adventureStore: stores.adventureStore.getState(),
    }

    return state
  }

  // Apply saved state to all stores
  const applyState = (state: any) => {
    if (!state) return false

    try {
      const stores = getStores()

      // Apply state to each store
      if (state.gameStore) {
        stores.gameStore.loadState(state.gameStore)
      }

      if (state.generatorStore) {
        stores.generatorStore.loadState(state.generatorStore)
      }

      if (state.prestigeStore) {
        stores.prestigeStore.loadState(state.prestigeStore)
      }

      if (state.generatorUpgradeStore) {
        stores.generatorUpgradeStore.loadState(state.generatorUpgradeStore)
      }

      if (state.inventoryStore) {
        stores.inventoryStore.loadState(state.inventoryStore)
      }

      if (state.adventureStore) {
        stores.adventureStore.loadState(state.adventureStore)
      }

      // Update last load time
      lastLoadTime.value = Date.now()
      return true
    } catch (error) {
      console.error('Error applying save state:', error)
      return false
    }
  }

  /**
   * Calculate and apply offline progress
   * @param timeParam Either a timestamp (Date.now()) or elapsed time in seconds
   * @param isElapsedTime Whether the timeParam is already an elapsed time in seconds
   */
  const calculateOfflineProgress = (timeParam: number, isElapsedTime = false) => {
    if (!offlineProgressEnabled.value) return

    let elapsedSeconds: number

    if (isElapsedTime) {
      // If timeParam is already elapsed time in seconds
      elapsedSeconds = timeParam
    } else {
      // If timeParam is a timestamp
      const now = Date.now()
      const elapsedMs = now - timeParam
      elapsedSeconds = elapsedMs / 1000
    }

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

  // Reset game state
  const resetGame = () => {
    try {
      // Clear localStorage
      localStorage.removeItem(SAVE_KEY)
      window.location.reload()
      console.log('Game reset successfully')
      return true
    } catch (error) {
      console.error('Error resetting game:', error)
      return false
    }
  }

  // Create a debounced version of saveGame
  const debouncedSave = useDebounceFn(() => {
    if (autoSaveEnabled.value) {
      saveGame()
    }
  }, DEBOUNCE_DELAY)

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
    calculateOfflineProgress,
    debouncedSave,
  }
})

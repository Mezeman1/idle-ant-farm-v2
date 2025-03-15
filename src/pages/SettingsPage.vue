<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSaveSystem } from '@/stores/saveSystem'
import { useGameStore } from '@/stores/gameStore'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const saveSystem = useSaveSystem()
const gameStore = useGameStore()

// Debug mode check
const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true'
const gameVersion = import.meta.env.VITE_VERSION || '0.1.0'

// Game speed controls (for debug mode)
const gameSpeed = ref(1)
const availableSpeeds = [0.5, 1, 2, 5, 10, 25, 50, 100]

// Function to change game speed
const setGameSpeed = (speed: number) => {
  gameSpeed.value = speed
  gameStore.setGameSpeed(speed)
}

// For import/export functionality
const exportedSave = ref('')
const importSave = ref('')
const importError = ref('')
const importSuccess = ref(false)
const exportSuccess = ref(false)

// For manual save/load
const saveSuccess = ref(false)
const loadSuccess = ref(false)
const resetConfirm = ref(false)

// For offline progress display
const offlineProgress = ref<{ elapsedTime: number; ticks: number } | null>(null)

// Watch for completion of offline progress calculation
watch(() => saveSystem.isCalculatingOfflineProgress, (isCalculating) => {
  if (!isCalculating && saveSystem.offlineProgressTotalTicks > 0) {
    // When calculation completes, show the notification
    offlineProgress.value = {
      elapsedTime: saveSystem.offlineProgressElapsedTime,
      ticks: saveSystem.offlineProgressTotalTicks
    }
  }
})

// Handle export save
const handleExportSave = () => {
  const saveData = saveSystem.exportSave()
  if (saveData) {
    exportedSave.value = saveData
    exportSuccess.value = true
    setTimeout(() => {
      exportSuccess.value = false
    }, 3000)
  }
}

// Handle import save
const handleImportSave = () => {
  importError.value = ''
  importSuccess.value = false

  if (!importSave.value) {
    importError.value = 'Please enter a save code'
    return
  }

  try {
    const success = saveSystem.importSave(importSave.value)
    if (success) {
      importSuccess.value = true
      importSave.value = ''
      setTimeout(() => {
        importSuccess.value = false
      }, 3000)
    } else {
      importError.value = 'Invalid save code'
    }
  } catch (error) {
    importError.value = 'Error importing save'
    console.error(error)
  }
}

// Handle manual save
const handleManualSave = () => {
  const success = saveSystem.saveGame()
  if (success) {
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  }
}

// Handle manual load
const handleManualLoad = () => {
  const result = saveSystem.loadGame()
  if (result) {
    // Store offline progress info for display
    offlineProgress.value = result as { elapsedTime: number; ticks: number }
    loadSuccess.value = true
    setTimeout(() => {
      loadSuccess.value = false
    }, 3000)
  }
}

// Handle game reset
const handleResetGame = () => {
  if (resetConfirm.value) {
    saveSystem.resetGame()
  } else {
    resetConfirm.value = true
    setTimeout(() => {
      resetConfirm.value = false
    }, 5000)
  }
}

// Copy export code to clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(exportedSave.value)
    alert('Save code copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

// Format time duration in a human-readable way
const formatDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${Math.floor(seconds)} seconds`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `and ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`
  }
}

// Start auto-save on component mount
onMounted(() => {
  saveSystem.startAutoSave()

  // Check if offline progress was just calculated
  if (saveSystem.offlineProgressTotalTicks > 0 && !saveSystem.isCalculatingOfflineProgress) {
    offlineProgress.value = {
      elapsedTime: saveSystem.offlineProgressElapsedTime,
      ticks: saveSystem.offlineProgressTotalTicks
    }
  }

  // Initialize game speed from store if in debug mode
  if (isDebugMode) {
    gameSpeed.value = gameStore.gameSpeed
  }
})
</script>

<template>
  <div class="space-y-4 dark:bg-gray-900 dark:text-gray-100">
    <!-- Offline Progress Notification -->
    <section v-if="offlineProgress"
      class="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center text-green-800 dark:text-green-200">
        <span class="i-heroicons-clock text-green-700 dark:text-green-300 mr-2"></span>
        Offline Progress Applied
      </h2>

      <div
        class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
        <p class="text-xs text-green-800 dark:text-green-200">
          While you were away for {{ formatDuration(offlineProgress.elapsedTime) }}, your colony continued to
          work!
        </p>
        <p class="text-xs font-medium mt-1">
          <span class="i-heroicons-check-circle text-green-600 dark:text-green-400 mr-1"></span>
          {{ offlineProgress.ticks }} game cycles completed
        </p>
      </div>

      <div class="mt-2 flex justify-end">
        <button @click="offlineProgress = null"
          class="text-xs text-green-800 dark:text-green-200 bg-green-200 dark:bg-green-700 hover:bg-green-300 dark:hover:bg-green-600 px-2 py-1 rounded-md">
          Dismiss
        </button>
      </div>
    </section>

    <section
      class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center">
        <span class="i-heroicons-cog-6-tooth text-gray-700 dark:text-gray-300 mr-2"></span>
        Colony Settings
      </h2>

      <div class="space-y-2">
        <!-- Dark Mode Toggle -->
        <div
          class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <DarkModeToggle />
        </div>

        <!-- Auto-save -->
        <div
          class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium">Pheromone Trail Preservation</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Automatically save your colony progress every minute
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="saveSystem.autoSaveEnabled" class="sr-only peer">
              <div
                class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
        </div>

        <!-- Offline progress -->
        <div
          class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium">Hibernation Progress</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Calculate colony progress while you're away</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="saveSystem.offlineProgressEnabled" class="sr-only peer">
              <div
                class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>

    <section
      class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center">
        <span class="i-heroicons-document-text text-gray-700 dark:text-gray-300 mr-2"></span>
        Colony Memory Management
      </h2>

      <div class="space-y-2">
        <!-- Manual save/load -->
        <div class="grid grid-cols-2 gap-2">
          <button @click="handleManualSave"
            class="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium flex items-center justify-center">
            <span class="i-heroicons-document-arrow-down text-base mr-1"></span>
            Save Colony
          </button>

          <button @click="handleManualLoad"
            class="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium flex items-center justify-center">
            <span class="i-heroicons-document-arrow-up text-base mr-1"></span>
            Load Colony
          </button>
        </div>

        <!-- Success messages -->
        <div v-if="saveSuccess || loadSuccess"
          class="bg-green-100 dark:bg-green-900 p-2 rounded-lg border border-green-200 dark:border-green-700">
          <p class="text-xs text-green-800 dark:text-green-200 flex items-center">
            <span class="i-heroicons-check-circle text-green-600 dark:text-green-400 mr-1"></span>
            <span>{{ saveSuccess ? 'Colony saved successfully!' : 'Colony loaded successfully!' }}</span>
          </p>
        </div>

        <!-- Export/Import -->
        <div
          class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <div class="text-sm font-medium mb-1">Export/Import Colony Data</div>

          <!-- Export -->
          <div class="mb-2">
            <button @click="handleExportSave"
              class="w-full py-1.5 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs font-medium flex items-center justify-center">
              <span class="i-heroicons-arrow-down-tray text-base mr-1"></span>
              Export Colony Data
            </button>

            <div v-if="exportedSave" class="mt-1">
              <div class="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Copy this code to save your colony data:
              </div>
              <textarea readonly
                class="w-full p-1.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md h-16 font-mono dark:text-gray-200"
                v-model="exportedSave"></textarea>
              <div v-if="exportSuccess" class="text-xs text-green-600 dark:text-green-400 mt-0.5">
                Colony data exported successfully!
              </div>
            </div>
          </div>

          <!-- Import -->
          <div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Paste your colony data here:</div>
            <textarea
              class="w-full p-1.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md h-16 font-mono mb-1 dark:text-gray-200"
              v-model="importSave" placeholder="Paste your colony data here..."></textarea>

            <button @click="handleImportSave"
              class="w-full py-1.5 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs font-medium flex items-center justify-center">
              <span class="i-heroicons-arrow-up-tray text-base mr-1"></span>
              Import Colony Data
            </button>

            <div v-if="importError" class="text-xs text-red-600 dark:text-red-400 mt-0.5">
              {{ importError }}
            </div>

            <div v-if="importSuccess" class="text-xs text-green-600 dark:text-green-400 mt-0.5">
              Colony data imported successfully!
            </div>
          </div>
        </div>

        <!-- Reset game -->
        <div
          class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <div class="text-sm font-medium mb-1">Reset Colony</div>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
            This will completely reset your colony progress. This action cannot be undone.
          </p>

          <button v-if="!resetConfirm" @click="resetConfirm = true"
            class="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium flex items-center justify-center">
            <span class="i-heroicons-trash text-base mr-1"></span>
            Reset Colony
          </button>

          <div v-else class="space-y-1">
            <p class="text-xs text-red-600 dark:text-red-400 font-medium">Are you sure you want to reset your colony?
            </p>
            <div class="grid grid-cols-2 gap-2">
              <button @click="resetConfirm = false"
                class="py-1.5 px-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-xs font-medium">
                Cancel
              </button>
              <button @click="handleResetGame"
                class="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium">
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Debug Mode Section (only visible in debug mode) -->
    <section v-if="isDebugMode"
      class="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center text-purple-800 dark:text-purple-200">
        <span class="i-heroicons-bug-ant text-purple-700 dark:text-purple-300 mr-2"></span>
        Debug Controls
      </h2>

      <div
        class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
        <div class="text-sm font-medium mb-1 text-purple-800 dark:text-purple-200">Game Speed</div>
        <div class="text-xs text-purple-600 dark:text-purple-400 mb-2">
          Adjust game speed for faster development and testing
        </div>

        <div class="flex flex-wrap gap-1">
          <button v-for="speed in availableSpeeds" :key="speed" @click="setGameSpeed(speed)"
            class="py-1 px-2 text-xs rounded-md font-medium transition-colors"
            :class="gameSpeed === speed ?
              'bg-purple-600 text-white' :
              'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-800 dark:text-purple-200 dark:hover:bg-purple-700'">
            {{ speed }}x
          </button>
        </div>

        <div class="mt-2 text-xs text-purple-700 dark:text-purple-300 font-medium">
          Current speed: {{ gameSpeed }}x
        </div>
      </div>
    </section>

    <section
      class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center">
        <span class="i-heroicons-information-circle text-gray-700 dark:text-gray-300 mr-2"></span>
        Game Information
      </h2>

      <div class="grid grid-cols-2 gap-2">
        <div
          class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <div class="text-xs text-gray-800 dark:text-gray-400">Game Version:</div>
          <div class="text-sm font-medium">v{{ gameVersion }}</div>
        </div>

        <div
          class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <div class="text-xs text-gray-800 dark:text-gray-400">Total Ticks:</div>
          <div class="text-sm font-medium">{{ gameStore.formattedTotalTicks }}</div>
        </div>
      </div>
    </section>
  </div>

  <ScrollToTopButton :threshold="400" />
</template>

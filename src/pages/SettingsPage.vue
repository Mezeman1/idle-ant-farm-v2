<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSaveSystem } from '@/stores/saveSystem'
import { useGameStore } from '@/stores/gameStore'

const saveSystem = useSaveSystem()
const gameStore = useGameStore()

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
const offlineProgress = ref(null)

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
        offlineProgress.value = result
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
const formatDuration = (seconds) => {
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
})
</script>

<template>
    <div class="space-y-4">
        <!-- Offline Progress Notification -->
        <section v-if="offlineProgress" class="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-3 shadow-md">
            <h2 class="text-base font-bold mb-2 flex items-center text-green-800">
                <span class="i-heroicons-clock text-green-700 mr-2"></span>
                Offline Progress Applied
            </h2>

            <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-green-200">
                <p class="text-xs text-green-800">
                    While you were away for {{ formatDuration(offlineProgress.elapsedTime) }}, your colony continued to
                    work!
                </p>
                <p class="text-xs font-medium mt-1">
                    <span class="i-heroicons-check-circle text-green-600 mr-1"></span>
                    {{ offlineProgress.ticks }} game cycles completed
                </p>
            </div>

            <div class="mt-2 flex justify-end">
                <button @click="offlineProgress = null"
                    class="text-xs text-green-800 bg-green-200 hover:bg-green-300 px-2 py-1 rounded-md">
                    Dismiss
                </button>
            </div>
        </section>

        <section class="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-3 shadow-md">
            <h2 class="text-base font-bold mb-2 flex items-center">
                <span class="i-heroicons-cog-6-tooth text-gray-700 mr-2"></span>
                Colony Settings
            </h2>

            <div class="space-y-2">
                <!-- Auto-save -->
                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-medium">Pheromone Trail Preservation</div>
                            <div class="text-xs text-gray-600">Automatically save your colony progress every minute
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="saveSystem.autoSaveEnabled" class="sr-only peer">
                            <div
                                class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600">
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Offline progress -->
                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-medium">Hibernation Progress</div>
                            <div class="text-xs text-gray-600">Calculate colony progress while you're away</div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="saveSystem.offlineProgressEnabled" class="sr-only peer">
                            <div
                                class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600">
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-3 shadow-md">
            <h2 class="text-base font-bold mb-2 flex items-center">
                <span class="i-heroicons-document-text text-gray-700 mr-2"></span>
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
                <div v-if="saveSuccess || loadSuccess" class="bg-green-100 p-2 rounded-lg border border-green-200">
                    <p class="text-xs text-green-800 flex items-center">
                        <span class="i-heroicons-check-circle text-green-600 mr-1"></span>
                        <span>{{ saveSuccess ? 'Colony saved successfully!' : 'Colony loaded successfully!' }}</span>
                    </p>
                </div>

                <!-- Export/Import -->
                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-sm font-medium mb-1">Export/Import Colony Data</div>

                    <!-- Export -->
                    <div class="mb-2">
                        <button @click="handleExportSave"
                            class="w-full py-1.5 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs font-medium flex items-center justify-center">
                            <span class="i-heroicons-arrow-down-tray text-base mr-1"></span>
                            Export Colony Data
                        </button>

                        <div v-if="exportedSave" class="mt-1">
                            <div class="text-xs text-gray-600 mb-0.5">Copy this code to save your colony data:</div>
                            <textarea readonly
                                class="w-full p-1.5 text-xs bg-gray-100 border border-gray-300 rounded-md h-16 font-mono"
                                v-model="exportedSave"></textarea>
                            <div v-if="exportSuccess" class="text-xs text-green-600 mt-0.5">
                                Colony data exported successfully!
                            </div>
                        </div>
                    </div>

                    <!-- Import -->
                    <div>
                        <div class="text-xs text-gray-600 mb-0.5">Paste your colony data here:</div>
                        <textarea
                            class="w-full p-1.5 text-xs bg-gray-100 border border-gray-300 rounded-md h-16 font-mono mb-1"
                            v-model="importSave" placeholder="Paste your colony data here..."></textarea>

                        <button @click="handleImportSave"
                            class="w-full py-1.5 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs font-medium flex items-center justify-center">
                            <span class="i-heroicons-arrow-up-tray text-base mr-1"></span>
                            Import Colony Data
                        </button>

                        <div v-if="importError" class="text-xs text-red-600 mt-0.5">
                            {{ importError }}
                        </div>

                        <div v-if="importSuccess" class="text-xs text-green-600 mt-0.5">
                            Colony data imported successfully!
                        </div>
                    </div>
                </div>

                <!-- Reset game -->
                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-sm font-medium mb-1">Reset Colony</div>
                    <p class="text-xs text-gray-600 mb-2">
                        This will completely reset your colony progress. This action cannot be undone.
                    </p>

                    <button v-if="!resetConfirm" @click="resetConfirm = true"
                        class="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium flex items-center justify-center">
                        <span class="i-heroicons-trash text-base mr-1"></span>
                        Reset Colony
                    </button>

                    <div v-else class="space-y-1">
                        <p class="text-xs text-red-600 font-medium">Are you sure you want to reset your colony?</p>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="resetConfirm = false"
                                class="py-1.5 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-xs font-medium">
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

        <section class="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-3 shadow-md">
            <h2 class="text-base font-bold mb-2 flex items-center">
                <span class="i-heroicons-information-circle text-gray-700 mr-2"></span>
                Game Information
            </h2>

            <div class="grid grid-cols-2 gap-2">
                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-xs text-gray-800">Game Version:</div>
                    <div class="text-sm font-medium">v0.1.0</div>
                </div>

                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-xs text-gray-800">Total Ticks:</div>
                    <div class="text-sm font-medium">{{ gameStore.formattedTotalTicks }}</div>
                </div>
            </div>
        </section>
    </div>
</template>

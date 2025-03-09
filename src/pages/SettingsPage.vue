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
    <div class="space-y-6">
        <!-- Offline Progress Notification -->
        <section v-if="offlineProgress" class="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-5 shadow-md">
            <h2 class="text-lg font-bold mb-3 flex items-center text-green-800">
                <span class="i-heroicons-clock text-green-700 mr-2"></span>
                Offline Progress Applied
            </h2>

            <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-green-200">
                <p class="text-sm text-green-800">
                    While you were away for {{ formatDuration(offlineProgress.elapsedTime) }}, your colony continued to
                    work!
                </p>
                <p class="text-sm font-medium mt-2">
                    <span class="i-heroicons-check-circle text-green-600 mr-1"></span>
                    {{ offlineProgress.ticks }} game cycles completed
                </p>
            </div>

            <div class="mt-3 flex justify-end">
                <button @click="offlineProgress = null"
                    class="text-xs text-green-800 bg-green-200 hover:bg-green-300 px-2 py-1 rounded-md">
                    Dismiss
                </button>
            </div>
        </section>

        <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
            <h2 class="text-lg font-bold mb-3 flex items-center">
                <span class="i-heroicons-cog-6-tooth text-amber-700 mr-2"></span>
                Game Settings
            </h2>

            <div class="space-y-4">
                <!-- Auto-save toggle -->
                <div
                    class="flex items-center justify-between bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
                    <div>
                        <div class="font-medium">Auto-Save</div>
                        <div class="text-xs text-amber-700">Game saves automatically every minute</div>
                    </div>
                    <button @click="saveSystem.toggleAutoSave" class="px-3 py-1.5 rounded-md text-sm font-medium"
                        :class="saveSystem.autoSaveEnabled ?
                            'bg-green-100 text-green-800 border border-green-300' :
                            'bg-gray-100 text-gray-800 border border-gray-300'">
                        {{ saveSystem.autoSaveEnabled ? 'Enabled' : 'Disabled' }}
                    </button>
                </div>

                <!-- Offline progress toggle -->
                <div
                    class="flex items-center justify-between bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
                    <div>
                        <div class="font-medium">Offline Progress</div>
                        <div class="text-xs text-amber-700">Continue earning resources while away</div>
                    </div>
                    <button @click="saveSystem.toggleOfflineProgress" class="px-3 py-1.5 rounded-md text-sm font-medium"
                        :class="saveSystem.offlineProgressEnabled ?
                            'bg-green-100 text-green-800 border border-green-300' :
                            'bg-gray-100 text-gray-800 border border-gray-300'">
                        {{ saveSystem.offlineProgressEnabled ? 'Enabled' : 'Disabled' }}
                    </button>
                </div>

                <!-- Last save info -->
                <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
                    <div class="text-sm text-amber-800">Last saved:</div>
                    <div class="font-medium">{{ saveSystem.timeSinceLastSave }} seconds ago</div>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
            <h2 class="text-lg font-bold mb-3 flex items-center">
                <span class="i-heroicons-document-arrow-down text-amber-700 mr-2"></span>
                Save & Load
            </h2>

            <div class="space-y-4">
                <!-- Manual save/load buttons -->
                <div class="flex gap-3">
                    <button @click="handleManualSave"
                        class="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md shadow flex items-center justify-center">
                        <span class="i-heroicons-document-arrow-down text-lg mr-1.5"></span>
                        Save Game
                        <span v-if="saveSuccess" class="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded">Saved!</span>
                    </button>

                    <button @click="handleManualLoad"
                        class="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md shadow flex items-center justify-center">
                        <span class="i-heroicons-document-arrow-up text-lg mr-1.5"></span>
                        Load Game
                        <span v-if="loadSuccess" class="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded">Loaded!</span>
                    </button>
                </div>

                <!-- Export save -->
                <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
                    <div class="font-medium mb-2">Export Save</div>
                    <div class="text-xs text-amber-700 mb-2">Copy this code to backup your game or transfer to another
                        device</div>

                    <div class="flex gap-2">
                        <button @click="handleExportSave"
                            class="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-3 rounded-md shadow text-sm">
                            Generate Code
                        </button>

                        <button v-if="exportedSave" @click="copyToClipboard"
                            class="bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium py-1.5 px-3 rounded-md shadow text-sm border border-amber-300">
                            Copy to Clipboard
                        </button>
                    </div>

                    <div v-if="exportedSave" class="mt-2">
                        <textarea v-model="exportedSave" readonly
                            class="w-full h-20 p-2 text-xs bg-gray-50 border border-amber-200 rounded-md"></textarea>
                        <div v-if="exportSuccess" class="text-xs text-green-600 mt-1">Save code generated successfully!
                        </div>
                    </div>
                </div>

                <!-- Import save -->
                <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
                    <div class="font-medium mb-2">Import Save</div>
                    <div class="text-xs text-amber-700 mb-2">Paste a save code to restore your game</div>

                    <textarea v-model="importSave" placeholder="Paste save code here..."
                        class="w-full h-20 p-2 text-xs bg-gray-50 border border-amber-200 rounded-md"></textarea>

                    <div class="mt-2">
                        <button @click="handleImportSave"
                            class="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-3 rounded-md shadow text-sm">
                            Import Save
                        </button>
                        <div v-if="importError" class="text-xs text-red-600 mt-1">{{ importError }}</div>
                        <div v-if="importSuccess" class="text-xs text-green-600 mt-1">Save imported successfully!</div>
                    </div>
                </div>

                <!-- Reset game -->
                <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
                    <div class="font-medium mb-2">Reset Game</div>
                    <div class="text-xs text-amber-700 mb-2">This will delete all progress and start a new game</div>

                    <button @click="handleResetGame"
                        class="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-md shadow text-sm"
                        :class="{ 'animate-pulse': resetConfirm }">
                        {{ resetConfirm ? 'Click again to confirm' : 'Reset Game' }}
                    </button>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
            <h2 class="text-lg font-bold mb-3 flex items-center">
                <span class="i-heroicons-information-circle text-amber-700 mr-2"></span>
                Game Information
            </h2>

            <div class="space-y-3">
                <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
                    <div class="text-sm text-amber-800">Game Version:</div>
                    <div class="font-medium">v0.1.0</div>
                </div>

                <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
                    <div class="text-sm text-amber-800">Total Ticks:</div>
                    <div class="font-medium">{{ gameStore.formattedTotalTicks }}</div>
                </div>
            </div>
        </section>
    </div>
</template>

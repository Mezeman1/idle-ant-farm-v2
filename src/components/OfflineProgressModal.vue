<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props for the modal
const props = defineProps<{
    isVisible: boolean
    totalTicks: number
    ticksProcessed: number
    elapsedTime: number
}>()

// Emit events back to parent
const emit = defineEmits(['close'])

// Computed properties
const progressPercentage = computed(() => {
    if (props.totalTicks === 0) return 0
    return Math.min(100, Math.round((props.ticksProcessed / props.totalTicks) * 100))
})

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

// Close the modal
const handleClose = () => {
    emit('close')
}

// Prevent touch events from propagating when modal is visible
const preventTouchMove = (e: TouchEvent) => {
    if (props.isVisible) {
        e.preventDefault()
        e.stopPropagation()
    }
}
</script>

<template>
    <div v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 touch-none"
        @touchmove.prevent
    >
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-amber-700 to-amber-600 p-4 text-white">
                <h2 class="text-lg font-bold flex items-center">
                    <span class="i-heroicons-clock-circle text-amber-300 mr-2"></span>
                    Calculating Offline Progress
                </h2>
            </div>

            <!-- Content -->
            <div class="p-5 space-y-4">
                <p class="text-amber-900">
                    Your colony has been working while you were away for {{ formatDuration(elapsedTime) }}!
                </p>

                <div class="space-y-2">
                    <div class="flex justify-between text-sm text-amber-800">
                        <span>Processing game cycles...</span>
                        <span>{{ ticksProcessed }} / {{ totalTicks }}</span>
                    </div>

                    <!-- Progress bar -->
                    <div class="h-4 bg-amber-100 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-300 ease-out"
                            :style="{ width: `${progressPercentage}%` }"></div>
                    </div>

                    <div class="text-right text-sm font-medium text-amber-800">
                        {{ progressPercentage }}% complete
                    </div>
                </div>

                <div class="bg-amber-50 p-3 rounded-lg border border-amber-200 text-sm text-amber-800">
                    <p class="flex items-start">
                        <span class="i-heroicons-information-circle text-amber-600 mr-1.5 mt-0.5"></span>
                        <span>Please wait while we calculate what happened in your colony during your absence. This may
                            take a moment for longer offline periods.</span>
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 p-4 flex justify-end border-t border-gray-200">
                <button @click="handleClose" :disabled="ticksProcessed < totalTicks"
                    class="px-4 py-2 rounded-md font-medium text-sm transition-colors select-none" :class="ticksProcessed < totalTicks ?
                        'bg-gray-200 text-gray-500 cursor-not-allowed' :
                        'bg-amber-600 hover:bg-amber-700 text-white'">
                    {{ ticksProcessed < totalTicks ? 'Processing...' : 'Continue' }} </button>
            </div>
        </div>
    </div>
</template>

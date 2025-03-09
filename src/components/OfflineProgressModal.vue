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
    <div v-if="isVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden"
        @touchmove="preventTouchMove">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-5 mx-auto">
            <h3 class="text-lg font-bold mb-3 flex items-center text-amber-800">
                <span class="i-heroicons-clock text-amber-600 mr-2"></span>
                Colony Hibernation Progress
            </h3>

            <p class="text-sm text-gray-700 mb-4">
                Your colony has been hibernating for <span class="font-bold text-amber-600">{{
                    formatDuration(elapsedTime) }}</span>.
                We're calculating the progress made during this time.
            </p>

            <!-- Progress bar -->
            <div class="h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
                <div class="h-full bg-amber-500 transition-all duration-300 ease-out"
                    :style="{ width: `${progressPercentage}%` }"></div>
            </div>

            <div class="text-xs text-gray-600 mb-4 flex justify-between">
                <span>Processing foraging trips: {{ ticksProcessed }} / {{ totalTicks }}</span>
                <span>{{ progressPercentage }}% complete</span>
            </div>

            <div class="flex justify-end">
                <button @click="handleClose"
                    class="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium">
                    Continue
                </button>
            </div>
        </div>
    </div>
</template>

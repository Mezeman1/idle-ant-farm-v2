<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import HoldableButton from '@/components/HoldableButton.vue'

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
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-hidden"
        @touchmove="preventTouchMove">
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-5 mx-auto border border-amber-200 dark:border-amber-700">
            <h3
                class="text-base font-bold mb-3 flex items-center text-amber-800 dark:text-amber-300 pb-2 border-b border-amber-200 dark:border-amber-700">
                <span class="i-heroicons-clock text-amber-600 dark:text-amber-400 mr-2"></span>
                Colony Hibernation Progress
            </h3>

            <p class="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Your colony has been hibernating for <span class="font-bold text-amber-600 dark:text-amber-400">{{
                    formatDuration(elapsedTime) }}</span>.
                We're calculating the progress made during this time.
            </p>

            <!-- Progress bar -->
            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
                <div class="h-full bg-amber-500 dark:bg-amber-400 transition-all duration-300 ease-out"
                    :style="{ width: `${progressPercentage}%` }"></div>
            </div>

            <div class="text-xs text-gray-600 dark:text-gray-400 mb-4 flex justify-between">
                <span>Processing foraging trips: {{ ticksProcessed }} / {{ totalTicks }}</span>
                <span>{{ progressPercentage }}% complete</span>
            </div>

            <div class="flex justify-end">
                <HoldableButton @action="handleClose"
                    :class="'py-2 px-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white rounded-lg text-sm font-medium transition-colors'"
                    :initial-delay="300" :repeat-interval="100">
                    Continue
                </HoldableButton>
            </div>
        </div>
    </div>
</template>

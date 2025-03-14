<script setup lang="ts">
import { usePrestigeStore } from '@/stores/prestigeStore'

const props = defineProps<{
    show: boolean
}>()

const emit = defineEmits<{
    (e: 'confirm'): void
    (e: 'cancel'): void
}>()

const prestigeStore = usePrestigeStore()
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-5 mx-auto border border-purple-200 dark:border-purple-700">
            <h3 class="text-base font-bold mb-3 flex items-center text-purple-800 dark:text-purple-300 pb-2 border-b border-purple-200 dark:border-purple-700">
                <span class="i-heroicons-sparkles text-purple-600 dark:text-purple-400 mr-2"></span>
                Confirm Metamorphosis
            </h3>

            <p class="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                You are about to metamorphose your colony. You will gain <span class="font-bold text-purple-600 dark:text-purple-400">{{
                    prestigeStore.formatPotentialEPGain() }} Evolution Points</span>.
                <br>Your progress will reset, but your evolutionary adaptations will remain.
            </p>

            <div class="flex space-x-3">
                <button @click="emit('cancel')"
                    class="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Cancel
                </button>
                <button @click="emit('confirm')"
                    class="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 rounded-lg text-white text-sm font-medium transition-colors">
                    Metamorphose
                </button>
            </div>
        </div>
    </div>
</template>

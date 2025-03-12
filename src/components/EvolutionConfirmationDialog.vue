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
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 mx-auto border border-purple-200">
            <h3 class="text-base font-bold mb-3 flex items-center text-purple-800 pb-2 border-b border-purple-200">
                <span class="i-heroicons-sparkles text-purple-600 mr-2"></span>
                Confirm Metamorphosis
            </h3>

            <p class="text-sm text-gray-700 mb-4 leading-relaxed">
                You are about to metamorphose your colony. You will gain <span class="font-bold text-purple-600">{{
                    prestigeStore.formatPotentialEPGain() }} Evolution Points</span>.
                <br>Your progress will reset, but your evolutionary adaptations will remain.
            </p>

            <div class="flex space-x-3">
                <button @click="emit('cancel')"
                    class="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
                <button @click="emit('confirm')"
                    class="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors">
                    Metamorphose
                </button>
            </div>
        </div>
    </div>
</template>

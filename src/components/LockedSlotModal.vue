<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventoryStore'

const props = defineProps<{
    onClose: () => void
}>()

const inventoryStore = useInventoryStore()
</script>

<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-5 mx-auto border border-purple-200 dark:border-purple-700">
            <h3
                class="text-base font-bold mb-3 flex items-center text-purple-800 dark:text-purple-300 pb-2 border-b border-purple-200 dark:border-purple-700">
                <span class="i-heroicons-lock-closed text-purple-600 dark:text-purple-400 mr-2"></span>
                Locked Equipment Slot
            </h3>

            <div class="space-y-3">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                    This equipment slot is currently locked. You can unlock additional equipment slots through the
                    prestige
                    upgrade "Equipment Mastery".
                </div>

                <div
                    class="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div class="text-xs text-purple-700 dark:text-purple-400 font-medium mb-1">Current Progress</div>
                    <div class="text-sm font-bold text-purple-600 dark:text-purple-500">
                        {{ inventoryStore.unlockedEquipmentSlots }}/{{ inventoryStore.maxEquipmentSlots }} slots
                        unlocked
                    </div>
                </div>

                <div class="text-xs text-gray-500 dark:text-gray-400">
                    Tip: Each level of Equipment Mastery unlocks one additional slot, up to a maximum of 10 bonus slots.
                </div>
            </div>

            <div class="flex justify-end mt-4">
                <button @click="onClose"
                    class="py-2 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 rounded-lg text-white text-sm font-medium transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

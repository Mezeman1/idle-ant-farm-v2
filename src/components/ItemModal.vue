<script setup lang="ts">
import { createDecimal } from '@/utils/decimalUtils'

const props = defineProps<{
    item: any
    isItemEquipped: (itemId: string) => boolean
    onEquipAction: (item: any) => void
    onClose: () => void
}>()
</script>

<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-5 mx-auto border border-purple-200 dark:border-purple-700">
            <h3
                class="text-base font-bold mb-3 flex items-center text-purple-800 dark:text-purple-300 pb-2 border-b border-purple-200 dark:border-purple-700">
                <span class="i-heroicons-squares-2x2 text-purple-600 dark:text-purple-400 mr-2"></span>
                {{ item.name }}
            </h3>

            <div class="space-y-3">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                    {{ item.description }}
                </div>

                <!-- Item Stats -->
                <div v-if="item.stats" class="space-y-2">
                    <div v-if="item.stats.damage" class="text-sm text-red-400">
                        Damage: +{{ item.stats.damage }}
                    </div>
                    <div v-if="item.stats.health" class="text-sm text-green-400">
                        Health: +{{ item.stats.health }}
                    </div>
                    <div v-if="item.stats.regen" class="text-sm text-blue-400">
                        Regen: +{{ item.stats.regen }}
                    </div>
                </div>

                <!-- Production Modifiers -->
                <div v-if="item.productionModifiers" class="space-y-2">
                    <div class="text-sm font-medium text-purple-600 dark:text-purple-400">Production Bonuses:</div>
                    <div v-for="(modifier, generatorId) in item.productionModifiers" :key="generatorId"
                        class="text-sm text-purple-500 dark:text-purple-300">
                        {{ String(generatorId).charAt(0).toUpperCase() + String(generatorId).slice(1) }}: +{{
                            createDecimal(modifier).minus(1).mul(100) }}%
                    </div>
                </div>

                <!-- Quantity -->
                <div v-if="item.quantity" class="text-sm text-gray-600 dark:text-gray-400">
                    Quantity: {{ item.quantity }}
                </div>
            </div>

            <div class="flex space-x-3 mt-4">
                <button v-if="item.type === 'equipment'"
                    class="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 rounded-lg text-white text-sm font-medium transition-colors"
                    @click="onEquipAction(item)">
                    {{ isItemEquipped(item.id) ? 'Unequip' : 'Equip' }}
                </button>
                <button @click="onClose"
                    class="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

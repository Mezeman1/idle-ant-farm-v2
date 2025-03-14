<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventoryStore'
import { useItemStore } from '@/stores/itemStore'

const props = defineProps<{
    onItemClick: (item: any) => void
    isItemEquipped: (itemId: string) => boolean
}>()

const inventoryStore = useInventoryStore()
const itemStore = useItemStore()
</script>

<template>
    <section
        class="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/30 rounded-xl p-3 shadow-md">
        <h2 class="text-base font-bold mb-3 flex items-center">
            <span class="i-heroicons-shopping-bag text-purple-700 dark:text-purple-500 mr-2"></span>
            Inventory
        </h2>

        <!-- Inventory Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <div v-for="(item, index) in inventoryStore.inventory" :key="index"
                class="relative aspect-square rounded-lg border-2 border-gray-700 overflow-hidden cursor-pointer hover:border-yellow-500"
                :class="itemStore.getRarityBackground(item.rarity)" @click="onItemClick(item)">
                <div class="absolute inset-0 flex flex-col items-center justify-center p-2">
                    <div class="text-lg font-bold" :class="itemStore.getRarityColor(item.rarity)">
                        {{ item.name }}
                    </div>
                    <div class="text-sm text-gray-400">
                        {{ item.type }}
                    </div>
                    <div v-if="item.quantity" class="absolute top-2 right-2 bg-gray-900 rounded-full px-2 py-1 text-sm">
                        x{{ item.quantity }}
                    </div>
                    <div v-if="isItemEquipped(item.id)"
                        class="absolute bottom-2 right-2 bg-green-600 dark:bg-green-500 rounded-full px-2 py-1 text-xs text-white">
                        Equipped
                    </div>
                </div>
            </div>

            <!-- Empty Slots -->
            <div v-for="i in inventoryStore.maxInventorySlots.toNumber() - inventoryStore.inventory.length"
                :key="`empty-${i}`" class="relative aspect-square rounded-lg border-2 border-gray-700 overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center text-gray-600">
                    <div class="i-heroicons-plus text-2xl" />
                </div>
            </div>
        </div>
    </section>
</template>

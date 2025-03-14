<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventoryStore'
import { useItemStore } from '@/stores/itemStore'
import { createDecimal } from '@/utils/decimalUtils'

const props = defineProps<{
  onSlotClick: (slot: any, index: number) => void
}>()

const inventoryStore = useInventoryStore()
const itemStore = useItemStore()

watch(inventoryStore.unlockedEquipmentSlots, (newSlots) => {
  inventoryStore.initializeEquipmentSlots()
})

const getItemDetails = (itemId: string) => {
  return itemStore.getItem(itemId)
}
</script>

<template>
  <section
    class="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/30 rounded-xl p-3 shadow-md">
    <h2
      class="text-base font-bold mb-3 flex items-center bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/30 py-2 z-10">
      <span class="i-heroicons-shield-check text-purple-700 dark:text-purple-500 mr-2"></span>
      Equipment
      <div class="ml-2 text-xs text-gray-600 dark:text-gray-400">
        ({{ inventoryStore.unlockedEquipmentSlots }}/{{ inventoryStore.maxEquipmentSlots }} slots unlocked)
      </div>
    </h2>

    <!-- Equipment Slots -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      <div v-for="(slot, index) in inventoryStore.equipmentSlots" :key="index"
        class="relative aspect-square rounded-lg border-2 border-gray-700 overflow-hidden" :class="{
          'opacity-50': slot.locked,
          'cursor-pointer hover:border-blue-500': !slot.locked && !slot.item,
          'cursor-pointer hover:border-yellow-500': slot.item,
        }" @click="onSlotClick(slot, index)">
        <div v-if="slot.locked" class="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div class="i-heroicons-lock-closed text-2xl text-gray-600" />
        </div>
        <div v-else-if="slot.item" class="absolute inset-0 flex flex-col items-center justify-center p-2"
          :class="itemStore.getRarityBackground(getItemDetails(slot.item)?.rarity || 'common')">
          <div class="text-lg font-bold"
            :class="itemStore.getRarityColor(getItemDetails(slot.item)?.rarity || 'common')">
            {{ getItemDetails(slot.item)?.name }}
          </div>
          <div class="text-sm text-gray-400">
            {{ getItemDetails(slot.item)?.type }}
          </div>
        </div>
        <div v-else class="absolute inset-0 flex items-center justify-center text-gray-600">
          <div class="i-heroicons-plus text-2xl" />
        </div>
      </div>
    </div>

    <!-- Equipment Stats -->
    <div class="mt-3 grid grid-cols-3 gap-2">
      <div
        class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
        <div class="text-xs text-purple-700 dark:text-purple-400 font-medium">Damage</div>
        <div class="text-sm font-bold text-purple-600 dark:text-purple-500">
          +{{ inventoryStore.totalStats.damage }}
        </div>
      </div>
      <div
        class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
        <div class="text-xs text-purple-700 dark:text-purple-400 font-medium">Health</div>
        <div class="text-sm font-bold text-purple-600 dark:text-purple-500">
          +{{ inventoryStore.totalStats.health }}
        </div>
      </div>
      <div
        class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
        <div class="text-xs text-purple-700 dark:text-purple-400 font-medium">Regen</div>
        <div class="text-sm font-bold text-purple-600 dark:text-purple-500">
          +{{ inventoryStore.totalStats.regen }}
        </div>
      </div>
    </div>

    <!-- Production Modifiers -->
    <div v-if="inventoryStore.totalProductionModifiers" class="mt-3">
      <div class="text-xs text-purple-700 dark:text-purple-400 font-medium mb-2">Production Bonuses</div>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="(modifier, generatorId) in inventoryStore.totalProductionModifiers" :key="generatorId"
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
          <div class="text-xs text-purple-700 dark:text-purple-400 font-medium capitalize">{{ generatorId }}
          </div>
          <div class="text-sm font-bold text-purple-600 dark:text-purple-500">
            +{{ modifier.minus(1).mul(100) }}%
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

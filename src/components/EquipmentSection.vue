<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventoryStore'
import { useItemStore } from '@/stores/itemStore'
import { useGeneratorStore } from '@/stores/generatorStore'
import { useAdventureStore } from '@/stores/adventureStore'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'
import { computed, watch } from 'vue'
import Decimal from 'break_infinity.js'

const props = defineProps<{
  onSlotClick: (slot: any, index: number) => void
}>()

const inventoryStore = useInventoryStore()
const itemStore = useItemStore()
const generatorStore = useGeneratorStore()
const adventureStore = useAdventureStore()

// Get worker ant count for calculations
const workerCount = computed(() => generatorStore.generators[0].count)

// Format worker count for display
const formattedWorkerCount = computed(() => {
  return formatStat(workerCount.value)
})

// Calculate boosted stats based on worker ants
const boostedDamage = computed(() => {
  return inventoryStore.totalStats.damage.mul(workerCount.value)
})

const boostedHealth = computed(() => {
  return inventoryStore.totalStats.health.mul(workerCount.value)
})

const boostedRegen = computed(() => {
  return inventoryStore.totalStats.regen.mul(workerCount.value)
})

// Get total player stats (including base stats)
const totalPlayerDamage = computed(() => adventureStore.playerDamage)
const totalPlayerHealth = computed(() => adventureStore.playerMaxHealth)
const totalPlayerRegen = computed(() => adventureStore.playerRegen)

// Format decimal values for display
const formatStat = (value: Decimal) => {
  return formatDecimal(value, 0)
}

// Check if worker count is greater than zero
const hasWorkers = computed(() => {
  const count = workerCount.value
  return count.gt(0)
})

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
    <!-- Equipment Stats -->
    <div class="mt-3">
      <div class="text-xs text-purple-700 dark:text-purple-400 font-medium mb-2">Equipment Stats</div>
      <div class="grid grid-cols-3 gap-2">
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
          <div class="text-xs text-purple-700 dark:text-purple-400 font-medium">Damage</div>
          <div class="text-sm font-bold text-purple-600 dark:text-purple-500">
            +{{ formatStat(inventoryStore.totalStats.damage) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1" v-if="hasWorkers">
            Boosted: +{{ formatStat(boostedDamage) }}
          </div>
        </div>
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
          <div class="text-xs text-purple-700 dark:text-purple-400 font-medium">Health</div>
          <div class="text-sm font-bold text-purple-600 dark:text-purple-500">
            +{{ formatStat(inventoryStore.totalStats.health) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1" v-if="hasWorkers">
            Boosted: +{{ formatStat(boostedHealth) }}
          </div>
        </div>
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
          <div class="text-xs text-purple-700 dark:text-purple-400 font-medium">Regen</div>
          <div class="text-sm font-bold text-purple-600 dark:text-purple-500">
            +{{ formatStat(inventoryStore.totalStats.regen) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1" v-if="hasWorkers">
            Boosted: +{{ formatStat(boostedRegen) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Total Combat Stats -->
    <div class="mt-3" v-if="hasWorkers">
      <div class="text-xs text-purple-700 dark:text-purple-400 font-medium mb-2">Total Combat Stats</div>
      <div class="grid grid-cols-2 gap-2">
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
          <div class="text-xs text-green-700 dark:text-green-400 font-medium">Total Damage</div>
          <div class="text-sm font-bold text-green-600 dark:text-green-500">
            {{ formatStat(totalPlayerDamage) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ formatStat(workerCount) }} worker ants
          </div>
        </div>
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
          <div class="text-xs text-green-700 dark:text-green-400 font-medium">Total Health</div>
          <div class="text-sm font-bold text-green-600 dark:text-green-500">
            {{ formatStat(totalPlayerHealth) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ formatStat(adventureStore.currentHealth) }}/{{ formatStat(totalPlayerHealth) }}
          </div>
        </div>
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
          <div class="text-xs text-green-700 dark:text-green-400 font-medium">Total Regen</div>
          <div class="text-sm font-bold text-green-600 dark:text-green-500">
            {{ formatStat(totalPlayerRegen) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            per second
          </div>
        </div>
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
          <div class="text-xs text-green-700 dark:text-green-400 font-medium">Defense</div>
          <div class="text-sm font-bold text-green-600 dark:text-green-500">
            {{ formatStat(adventureStore.playerDefense) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            damage reduction
          </div>
        </div>
      </div>
    </div>

    <!-- Equipment Boost Explanation -->
    <div class="mt-3 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm" v-if="hasWorkers">
      <div class="font-medium text-blue-700 dark:text-blue-400 mb-1">
        <span class="i-heroicons-information-circle mr-1"></span>
        Equipment Boost
      </div>
      <p class="text-blue-600 dark:text-blue-300 text-xs">
        Your equipment stats are boosted by your worker ants! Each stat is multiplied by your worker ant count
        (currently {{ formattedWorkerCount }}), giving you a significant combat advantage.
      </p>
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
  </section>
</template>

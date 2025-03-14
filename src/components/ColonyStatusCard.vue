<script setup lang="ts">
import type Decimal from 'break_infinity.js'

const props = defineProps<{
  className?: string
}>()

const gameStore = useGameStore()
const generatorStore = useGeneratorStore()

// Food per second (formatted)
const formattedFoodPerSecond = computed(() => {
  return formatDecimal(generatorStore.foodPerSecond, 2)
})

// Get worker ants
const workerAnts = computed(() => {
  return generatorStore.getGenerator('worker')
})

// Calculate auto-generated worker ants
const autoGeneratedWorkers = computed<Decimal | 0>(() => {
  if (!workerAnts.value) return 0
  return workerAnts.value.count.sub(workerAnts.value.manualPurchases)
})

// Check if auto-generated workers are greater than 0
const hasAutoGeneratedWorkers = computed(() => {
  return typeof autoGeneratedWorkers.value !== 'number' && autoGeneratedWorkers.value.gt(0)
})

// Format auto-generated workers for display
const formattedAutoGeneratedWorkers = computed(() => {
  return generatorStore.formatGeneratorCount('worker')
})

// Manual food collection
const collectFood = () => {
  generatorStore.food = generatorStore.food.add(1)
}
</script>

<template>
  <section
    :class="['bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-3 shadow-md dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-50', className]">
    <h2 class="text-base font-bold mb-2 flex items-center">
      <span class="i-heroicons-chart-bar text-amber-700 dark:text-amber-400 mr-2"></span>
      Colony Status
    </h2>

    <div class="grid grid-cols-3 gap-2">
      <div
        class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200 dark:bg-gray-800/80 dark:border-amber-700">
        <div class="text-xs text-amber-700 dark:text-amber-300 font-medium">Food</div>
        <div class="text-sm font-bold flex items-center">
          <span class="i-heroicons-cake text-amber-600 dark:text-amber-400 mr-1 text-xs"></span>
          {{ generatorStore.formatFood() }}
        </div>
      </div>

      <div
        class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200 dark:bg-gray-800/80 dark:border-amber-700">
        <div class="text-xs text-amber-700 dark:text-amber-300 font-medium">Food/Trip</div>
        <div class="text-sm font-bold flex items-center">
          <span class="i-heroicons-arrow-trending-up text-amber-600 dark:text-amber-400 mr-1 text-xs"></span>
          {{ formattedFoodPerSecond }}
        </div>
      </div>

      <div
        class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200 dark:bg-gray-800/80 dark:border-amber-700">
        <div class="text-xs text-amber-700 dark:text-amber-300 font-medium">Worker Ants</div>
        <div class="text-sm font-bold flex items-center">
          <span class="i-heroicons-bug-ant text-amber-600 dark:text-amber-400 mr-1 text-xs"></span>
          {{ generatorStore.formatGeneratorCount('worker') }}
        </div>
        <div class="text-xs text-amber-600 dark:text-amber-400" v-if="hasAutoGeneratedWorkers">
          ({{ formattedAutoGeneratedWorkers }} auto)
        </div>
      </div>
    </div>

    <!-- Progress Bars Row -->
    <div class="grid grid-cols-2 gap-2 mt-2">
      <div
        class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200 dark:bg-gray-800/80 dark:border-amber-700">
        <div class="text-xs text-amber-700 dark:text-amber-300 font-medium flex justify-between">
          <span>Ant Types</span>
          <span>{{ generatorStore.unlockedGenerators.length }}</span>
        </div>
        <div class="h-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-full mt-1 overflow-hidden">
          <div class="h-full bg-amber-500 dark:bg-amber-600 transition-all duration-300 ease-out"
            :style="{ width: `${(generatorStore.unlockedGenerators.length / 7) * 100}%` }"></div>
        </div>
        <div class="text-xs text-amber-600 dark:text-amber-400 mt-1">
          {{ generatorStore.unlockedGenerators.length }} / 7 ant types unlocked
        </div>
      </div>

      <div
        class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200 dark:bg-gray-800/80 dark:border-amber-700">
        <div class="text-xs text-amber-700 dark:text-amber-300 font-medium flex justify-between">
          <span>Adaptation Progress</span>
          <span>{{ generatorStore.totalPointsAvailable }} points</span>
        </div>
        <div class="h-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-full mt-1 overflow-hidden">
          <div class="h-full bg-amber-500 dark:bg-amber-600 transition-all duration-300 ease-out"
            :style="{ width: `${Math.min(100, generatorStore.totalPointsAvailable)}%` }"></div>
        </div>
        <div class="text-xs text-amber-600 dark:text-amber-400 mt-1">
          Spend points to adapt your colony
        </div>
      </div>
    </div>

    <!-- Info and Button Row -->
    <div class="flex gap-2 mt-2">
      <div
        class="bg-amber-50 dark:bg-gray-800/80 p-2 rounded-lg border border-amber-200 dark:border-amber-700 flex-grow text-xs text-amber-800 dark:text-amber-300">
        <span class="i-heroicons-information-circle text-amber-600 dark:text-amber-400 mr-1 inline-block"></span>
        Each ant type can be specialized with adaptation points. Level up your ants to earn more points!
      </div>

      <HoldableButton @action="collectFood"
        class="px-3 py-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center whitespace-nowrap">
        <span class="i-heroicons-hand-raised text-base mr-1"></span>
        Collect Food
      </HoldableButton>
    </div>
  </section>
</template>

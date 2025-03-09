<script setup lang="ts">
// Home page for the idle ant farm game
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

// Computed property to check if any ticks have occurred
const hasTicksOccurred = computed(() => !gameStore.totalTicks.eq(0))
const hasMultipleTicksOccurred = computed(() => gameStore.totalTicks.gt(1))
const additionalTicks = computed(() => gameStore.totalTicks.sub(1).toString())
</script>

<template>
  <div class="space-y-6">
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-2">Welcome to your Ant Colony!</h2>
      <p class="text-sm text-amber-800">Tap to collect food and grow your colony of industrious ants.</p>

      <div class="mt-6 flex justify-center">
        <button
          class="bg-gradient-to-br from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transform transition-all active:scale-95 active:shadow-md flex items-center">
          <span class="i-heroicons-hand-raised text-2xl mr-2"></span>
          Tap to Collect
        </button>
      </div>
    </section>

    <!-- Game Tick Information -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-clock-circle text-amber-700 mr-2"></span>
        Game Cycle
      </h2>
      <div class="space-y-3">
        <div class="flex justify-between items-center bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-sm text-amber-800">Tick Duration:</div>
          <div class="font-medium">{{ gameStore.tickDuration }} seconds</div>
        </div>
        <div class="flex justify-between items-center bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-sm text-amber-800">Current Progress:</div>
          <div class="font-medium">{{ gameStore.progressPercentage }}%</div>
        </div>
        <div class="flex justify-between items-center bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-sm text-amber-800">Time Until Next Tick:</div>
          <div class="font-medium">{{ gameStore.timeRemaining }} seconds</div>
        </div>
        <div class="flex justify-between items-center bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-sm text-amber-800">Total Ticks:</div>
          <div class="font-medium">{{ gameStore.formattedTotalTicks }}</div>
        </div>
      </div>
    </section>

    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-clock text-amber-700 mr-2"></span>
        Recent Activities
      </h2>
      <ul class="space-y-2.5">
        <li class="text-sm border-b border-amber-200 pb-2.5 flex items-start">
          <span class="i-heroicons-plus-circle text-green-600 mr-2 mt-0.5"></span>
          <span>Game started</span>
        </li>
        <li v-if="hasTicksOccurred" class="text-sm border-b border-amber-200 pb-2.5 flex items-start">
          <span class="i-heroicons-plus-circle text-green-600 mr-2 mt-0.5"></span>
          <span>First game tick completed</span>
        </li>
        <li v-if="hasMultipleTicksOccurred" class="text-sm flex items-start">
          <span class="i-heroicons-plus-circle text-green-600 mr-2 mt-0.5"></span>
          <span>{{ additionalTicks }} additional ticks completed</span>
        </li>
      </ul>
    </section>
  </div>
</template>

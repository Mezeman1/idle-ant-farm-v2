<script setup lang="ts">
import { computed } from 'vue'
import { usePrestigeStore } from '@/stores/prestigeStore'
import { formatDecimal } from '@/utils/decimalUtils'
import { useWindowSize } from '@vueuse/core'

const props = defineProps<{
  className?: string
}>()

const prestigeStore = usePrestigeStore()
const { width } = useWindowSize()

// Determine if we're on a small screen
const isSmallScreen = computed(() => width.value < 640)
</script>

<template>
  <section
    :class="['bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/30 rounded-xl p-2 sm:p-3 shadow-md', className]">
    <h2 class="text-sm sm:text-base font-bold mb-1 sm:mb-2 flex items-center">
      <span class="i-heroicons-sparkles text-purple-700 dark:text-purple-500 mr-1 sm:mr-2"></span>
      Metamorphosis
    </h2>

    <div class="space-y-1 sm:space-y-2">
      <div class="grid grid-cols-2 gap-1 sm:gap-2">
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
          <div class="text-2xs sm:text-xs text-purple-700 dark:text-purple-400 font-medium">
            <span v-if="isSmallScreen">Meta Count</span>
            <span v-else>Metamorphosis Count</span>
          </div>
          <div class="text-xs sm:text-sm font-bold flex items-center">
            <span
              class="i-heroicons-sparkles text-purple-600 dark:text-purple-500 mr-0.5 sm:mr-1 text-2xs sm:text-xs"></span>
            {{ prestigeStore.formatEvolutionCount() }}
          </div>
        </div>

        <div
          class="bg-white/80 dark:bg-gray-800/80 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
          <div class="text-2xs sm:text-xs text-purple-700 dark:text-purple-400 font-medium">
            <span v-if="isSmallScreen">Evo Points</span>
            <span v-else>Evolution Points</span>
          </div>
          <div class="text-xs sm:text-sm font-bold flex items-center">
            <span
              class="i-heroicons-sparkles text-purple-600 dark:text-purple-500 mr-0.5 sm:mr-1 text-2xs sm:text-xs"></span>
            {{ prestigeStore.formatEP() }}
          </div>
        </div>
      </div>  

      <div
        class="bg-white/80 dark:bg-gray-800/80 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
        <div class="text-2xs sm:text-xs text-purple-700 dark:text-purple-400 font-medium flex justify-between">
          <span v-if="isSmallScreen">Cycles Done</span>
          <span v-else>Foraging Cycles Completed</span>
          <span>{{ Math.min(100,
            Math.round((prestigeStore.loopsCompleted.div(prestigeStore.requiredLoops).toNumber() * 100)))
          }}%</span>
        </div>
        <div class="h-1 sm:h-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-full mt-0.5 sm:mt-1 overflow-hidden">
          <div class="h-full bg-purple-500 dark:bg-purple-400 transition-all duration-300 ease-out"
            :style="{ width: `${Math.min(100, (prestigeStore.loopsCompleted.div(prestigeStore.requiredLoops).toNumber() * 100))}%` }">
          </div>
        </div>
        <div class="text-2xs sm:text-xs text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-1">
          {{ prestigeStore.formatLoopsCompleted() }} / {{ formatDecimal(prestigeStore.requiredLoops, 1) }}
          <span v-if="isSmallScreen">cyc</span>
          <span v-else>cycles</span>
        </div>
      </div>

      <div
        class="bg-white/80 dark:bg-gray-800/80 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
        <div class="text-2xs sm:text-xs text-purple-700 dark:text-purple-400 font-medium">
          <span v-if="isSmallScreen">Cycle Reqs</span>
          <span v-else>Cycle Requirements</span>
        </div>
        <div class="grid grid-cols-2 gap-1 mt-0.5 sm:mt-1">
          <div class="text-2xs sm:text-xs font-medium flex items-center">
            <span
              class="i-heroicons-clock text-purple-600 dark:text-purple-500 mr-0.5 sm:mr-1 text-2xs sm:text-xs"></span>
            {{ formatDecimal(prestigeStore.ticksPerLoop, 1) }}
            <span v-if="isSmallScreen">tr</span>
            <span v-else>trips</span>
          </div>
          <div class="text-2xs sm:text-xs font-medium flex items-center">
            <span
              class="i-heroicons-cake text-purple-600 dark:text-purple-500 mr-0.5 sm:mr-1 text-2xs sm:text-xs"></span>
            {{ formatDecimal(prestigeStore.foodForNextLoop, 0) }} food
          </div>
        </div>
      </div>

      <router-link to="/upgrades"
        class="block w-full px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-md text-2xs sm:text-xs font-medium text-center">
        <span v-if="isSmallScreen">View Adaptations</span>
        <span v-else>View Evolutionary Adaptations</span>
      </router-link>
    </div>
  </section>
</template>

<style>
/* Add text-2xs utility class for extremely small text */
.text-2xs {
  font-size: 0.65rem;
  line-height: 0.85rem;
}
</style>

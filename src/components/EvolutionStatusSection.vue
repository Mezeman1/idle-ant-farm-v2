<script setup lang="ts">
import { computed } from 'vue'
import { usePrestigeStore } from '@/stores/prestigeStore'
import { useGeneratorStore } from '@/stores/generatorStore'
import { formatDecimal } from '@/utils/decimalUtils'
import { useWindowSize } from '@vueuse/core'

const props = defineProps<{
  showAboutEvolution: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleAboutEvolution'): void
  (e: 'confirmEvolution'): void
}>()

const prestigeStore = usePrestigeStore()
const generatorStore = useGeneratorStore()
const { width } = useWindowSize()

// Determine if we're on a small screen
const isSmallScreen = computed(() => width.value < 640)

// Check if evolution is possible
const canEvolve = computed(() => prestigeStore.canEvolve)

// Loop progress percentage
const loopProgressPercentage = computed(() => {
  return Math.round((prestigeStore.currentLoopTicks.div(prestigeStore.ticksPerLoop)).mul(100).toNumber())
})

// Food progress percentage
const foodProgressPercentage = computed(() => {
  return Math.min(100, Math.round(generatorStore.food.div(prestigeStore.foodForNextLoop).mul(100).toNumber()))
})

// Format required loops
const formattedRequiredLoops = computed(() => {
  return formatDecimal(prestigeStore.requiredLoops, 1)
})

// Format current ticks
const formattedCurrentTicks = computed(() => {
  return formatDecimal(prestigeStore.currentLoopTicks, 0)
})

// Format ticks per loop
const formattedTicksPerLoop = computed(() => {
  return formatDecimal(prestigeStore.ticksPerLoop, 1)
})
</script>

<template>
  <section
    class="bg-gradient-to-br from-purple-200 to-purple-100 rounded-xl p-2 sm:p-4 shadow-md border border-purple-300/50">
    <div class="flex flex-col space-y-2 sm:space-y-3">
      <!-- Header with collapsible option -->
      <div class="flex items-center justify-between">
        <h2 class="text-sm sm:text-base font-bold flex items-center text-purple-800">
          <span class="i-heroicons-sparkles text-purple-700 mr-1 sm:mr-2"></span>
          <span v-if="isSmallScreen">Meta Status</span>
          <span v-else>Metamorphosis Status</span>
        </h2>
        <div class="flex items-center space-x-1 sm:space-x-2">
          <button @click="emit('toggleAboutEvolution')"
            class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-300 hover:bg-purple-400 flex items-center justify-center text-purple-800 transition-colors">
            <span class="i-heroicons-question-mark-circle text-sm sm:text-base"></span>
          </button>
        </div>
      </div>

      <!-- Main content in a more compact layout -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <!-- Stats section - full width on mobile, 2/3 on desktop -->
        <div class="sm:col-span-2 grid grid-cols-2 gap-2 sm:gap-3">
          <div class="bg-white/90 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-300">
            <div class="flex justify-between items-center">
              <div class="text-2xs sm:text-xs text-purple-800 font-medium">
                <span v-if="isSmallScreen">Evo Points</span>
                <span v-else>Evolution Points</span>
              </div>
              <div class="text-xs sm:text-sm font-bold flex items-center">
                <span class="i-heroicons-sparkles text-purple-600 mr-0.5 sm:mr-1 text-2xs sm:text-xs"></span>
                {{ prestigeStore.formatEP() }}
              </div>
            </div>
          </div>

          <div class="bg-white/90 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-300">
            <div class="flex justify-between items-center">
              <div class="text-2xs sm:text-xs text-purple-800 font-medium">
                <span v-if="isSmallScreen">Meta</span>
                <span v-else>Metamorphosis</span>
              </div>
              <div class="text-xs sm:text-sm font-bold flex items-center">
                <span class="i-heroicons-arrow-path text-purple-600 mr-0.5 sm:mr-1 text-2xs sm:text-xs"></span>
                {{ prestigeStore.formatEvolutionCount() }}
              </div>
            </div>
          </div>

          <div class="bg-white/90 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-300 col-span-2">
            <div class="flex justify-between items-center mb-0.5 sm:mb-1">
              <div class="text-2xs sm:text-xs text-purple-800 font-medium">
                <span v-if="isSmallScreen">Forage Cycles</span>
                <span v-else>Foraging Cycles</span>
              </div>
              <div class="text-2xs sm:text-xs text-purple-800">
                {{ prestigeStore.formatLoopsCompleted() }} / {{ formattedRequiredLoops }}
              </div>
            </div>
            <div class="h-1.5 sm:h-2 bg-purple-100 rounded-full overflow-hidden">
              <div class="h-full bg-purple-600 transition-all duration-300 ease-out"
                :style="{ width: `${Math.min(100, (prestigeStore.loopsCompleted.div(prestigeStore.requiredLoops).toNumber() * 100))}%` }">
              </div>
            </div>
          </div>

          <div class="bg-white/90 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-300">
            <div class="flex justify-between items-center mb-0.5 sm:mb-1">
              <div class="text-2xs sm:text-xs text-purple-800 font-medium">
                <span v-if="isSmallScreen">Cycle Prog</span>
                <span v-else>Cycle Progress</span>
              </div>
              <div class="text-2xs sm:text-xs text-purple-800">{{ loopProgressPercentage }}%</div>
            </div>
            <div class="h-1.5 sm:h-2 bg-purple-100 rounded-full overflow-hidden">
              <div class="h-full bg-purple-600 transition-all duration-300 ease-out"
                :style="{ width: `${loopProgressPercentage}%` }">
              </div>
            </div>
          </div>

          <div class="bg-white/90 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-300">
            <div class="flex justify-between items-center mb-0.5 sm:mb-1">
              <div class="text-2xs sm:text-xs text-purple-800 font-medium">
                <span v-if="isSmallScreen">Food Prog</span>
                <span v-else>Food Progress</span>
              </div>
              <div class="text-2xs sm:text-xs text-purple-800">{{ foodProgressPercentage }}%</div>
            </div>
            <div class="h-1.5 sm:h-2 bg-purple-100 rounded-full overflow-hidden">
              <div class="h-full bg-purple-600 transition-all duration-300 ease-out"
                :style="{ width: `${foodProgressPercentage}%` }">
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Metamorphose button and potential gain - horizontal on mobile -->
        <div class="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
          <div v-if="canEvolve"
            class="bg-white/90 p-1.5 sm:p-2 rounded-lg shadow-sm border border-purple-300 flex-grow">
            <div class="text-2xs sm:text-xs text-purple-800 font-medium">
              <span v-if="isSmallScreen">Potential</span>
              <span v-else>Potential Gain</span>
            </div>
            <div class="text-xs sm:text-sm font-bold flex items-center text-purple-700">
              <span class="i-heroicons-sparkles text-purple-600 mr-0.5 sm:mr-1 text-2xs sm:text-xs"></span>
              +{{ prestigeStore.formatPotentialEPGain() }} EP
            </div>
          </div>

          <button @click="emit('confirmEvolution')"
            class="py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-white font-bold transition-colors duration-200 flex items-center justify-center flex-grow"
            :class="canEvolve ? 'bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'"
            :disabled="!canEvolve">
            <span class="i-heroicons-sparkles text-sm sm:text-base mr-1 sm:mr-1.5"></span>
            <span v-if="canEvolve" class="text-2xs sm:text-sm">
              <span v-if="isSmallScreen">Transform</span>
              <span v-else>Metamorphose</span>
            </span>
            <span v-else class="text-2xs sm:text-xs">
              <span v-if="isSmallScreen">Need {{ formattedRequiredLoops }} Cyc</span>
              <span v-else>Need {{ formattedRequiredLoops }} Cycles</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* Add text-2xs utility class for extremely small text if not already defined elsewhere */
.text-2xs {
  font-size: 0.65rem;
  line-height: 0.85rem;
}
</style>

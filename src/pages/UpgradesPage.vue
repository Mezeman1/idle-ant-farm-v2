<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePrestigeStore } from '@/stores/prestigeStore'
import { useGeneratorStore } from '@/stores/generatorStore'
import EvolutionUpgradeItem from '@/components/EvolutionUpgradeItem.vue'
import { formatDecimal } from '@/utils/decimalUtils'

const prestigeStore = usePrestigeStore()
const generatorStore = useGeneratorStore()

// Get all evolution upgrades
const evolutionUpgrades = computed(() => prestigeStore.evolutionUpgrades)

// Check if evolution is possible
const canEvolve = computed(() => prestigeStore.canEvolve)

// Loop progress percentage
const loopProgressPercentage = computed(() => {
  return Math.min(100, Math.round(prestigeStore.currentLoopProgress * 100))
})

// Food progress percentage
const foodProgressPercentage = computed(() => {
  const currentFood = generatorStore.food.toNumber()
  const requiredFood = prestigeStore.foodForNextLoop.toNumber()
  const ratio = currentFood / requiredFood
  return Math.min(100, Math.round(ratio * 100))
})

// Format required loops
const formattedRequiredLoops = computed(() => {
  return formatDecimal(prestigeStore.requiredLoops, 1)
})

// Confirmation dialog state
const showConfirmation = ref(false)

// About evolution dialog state
const showAboutEvolution = ref(false)

// Show confirmation dialog
const confirmEvolution = () => {
  if (canEvolve.value) {
    showConfirmation.value = true
  }
}

// Perform evolution
const performEvolution = () => {
  if (canEvolve.value) {
    prestigeStore.evolve()
    showConfirmation.value = false
  }
}

// Cancel evolution
const cancelEvolution = () => {
  showConfirmation.value = false
}

// Toggle about evolution dialog
const toggleAboutEvolution = () => {
  showAboutEvolution.value = !showAboutEvolution.value
}
</script>

<template>
  <div class="space-y-6">
    <!-- Evolution Status -->
    <section class="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center justify-between">
        <div class="flex items-center">
          <span class="i-heroicons-sparkles text-purple-700 mr-2"></span>
          Evolution Status
        </div>
        <button @click="toggleAboutEvolution"
          class="w-6 h-6 rounded-full bg-purple-200 hover:bg-purple-300 flex items-center justify-center text-purple-700 transition-colors">
          <span class="i-heroicons-question-mark-circle text-lg"></span>
        </button>
      </h2>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">Evolution Points</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-sparkles text-purple-600 mr-2 text-sm"></span>
            {{ prestigeStore.formatEP() }}
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">Evolution Count</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-arrow-path text-purple-600 mr-2 text-sm"></span>
            {{ prestigeStore.formatEvolutionCount() }}
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">Current Loop Progress</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-arrow-path-rounded-square text-purple-600 mr-2 text-sm"></span>
            {{ loopProgressPercentage }}%
          </div>

          <!-- Loop progress bar -->
          <div class="h-1.5 bg-purple-100 rounded-full mt-2 overflow-hidden">
            <div class="h-full bg-purple-500 transition-all duration-300 ease-out"
              :style="{ width: `${loopProgressPercentage}%` }"></div>
          </div>
          <div class="text-xs text-purple-600 mt-1">
            {{ Math.round(prestigeStore.currentLoopProgress * prestigeStore.ticksPerLoop.toNumber() * 10) /
              10 }} / {{ prestigeStore.formatTicksPerLoop() }} ticks
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">Loops Completed</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-arrow-path-rounded-square text-purple-600 mr-2 text-sm"></span>
            {{ prestigeStore.formatLoopsCompleted() }} / {{ formattedRequiredLoops }}
          </div>

          <!-- Loops completed progress bar -->
          <div class="h-1.5 bg-purple-100 rounded-full mt-2 overflow-hidden">
            <div class="h-full bg-purple-500 transition-all duration-300 ease-out"
              :style="{ width: `${Math.min(100, (prestigeStore.loopsCompleted.div(prestigeStore.requiredLoops).toNumber() * 100))}%` }">
            </div>
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">Food for Next Loop</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-cake text-purple-600 mr-2 text-sm"></span>
            {{ generatorStore.formatFood() }} / {{ prestigeStore.formatFoodForNextLoop() }}
          </div>
          <div class="text-xs text-purple-600 mt-1">
            Need {{ prestigeStore.formatFoodForNextLoop() }} food to complete a loop
          </div>

          <!-- Food for next loop progress bar -->
          <div class="h-1.5 bg-purple-100 rounded-full mt-2 overflow-hidden">
            <div class="h-full bg-purple-500 transition-all duration-300 ease-out"
              :style="{ width: `${foodProgressPercentage}%` }">
            </div>
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">Ticks per Loop</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-clock text-purple-600 mr-2 text-sm"></span>
            {{ prestigeStore.formatTicksPerLoop() }}
          </div>
          <div class="text-xs text-purple-600 mt-1">
            Increases by 0.5 with each loop completion
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">Required Loops</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-arrow-path-rounded-square text-purple-600 mr-2 text-sm"></span>
            {{ formattedRequiredLoops }}
          </div>
          <div class="text-xs text-purple-600 mt-1">
            Next evolution: {{ formattedRequiredLoops }} loops
          </div>
        </div>
      </div>

      <!-- Potential EP gain -->
      <div v-if="canEvolve" class="bg-white/80 p-3 rounded-lg shadow-sm border border-purple-200 mb-4">
        <div class="text-xs text-purple-700 font-medium">Potential EP Gain</div>
        <div class="text-lg font-bold flex items-center text-purple-600">
          <span class="i-heroicons-sparkles text-purple-600 mr-2 text-sm"></span>
          +{{ prestigeStore.formatPotentialEPGain() }} EP
        </div>
      </div>

      <!-- Evolution button -->
      <button @click="confirmEvolution"
        class="w-full py-3 px-4 rounded-lg text-white font-bold transition-colors duration-200 flex items-center justify-center"
        :class="canEvolve ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg' : 'bg-gray-300 cursor-not-allowed'"
        :disabled="!canEvolve">
        <span class="i-heroicons-sparkles text-xl mr-2"></span>
        <span v-if="canEvolve">Evolve for +{{ prestigeStore.formatPotentialEPGain() }} EP</span>
        <span v-else>Evolve Your Colony</span>
      </button>

      <div class="mt-3 text-xs text-purple-700" v-if="!canEvolve">
        <p class="flex items-start">
          <span class="i-heroicons-information-circle text-purple-600 mr-1.5 mt-0.5"></span>
          <span>Complete {{ formattedRequiredLoops }} loops to evolve.</span>
        </p>
      </div>
    </section>

    <!-- Evolution Confirmation Dialog -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-5 mx-auto">
        <h3 class="text-lg font-bold mb-3 flex items-center text-purple-800">
          <span class="i-heroicons-sparkles text-purple-600 mr-2"></span>
          Confirm Evolution
        </h3>

        <p class="text-sm text-gray-700 mb-4">
          You are about to evolve your colony. You will gain <span class="font-bold text-purple-600">{{
            prestigeStore.formatPotentialEPGain() }} Evolution Points</span>.
          Your progress will reset, but your evolution upgrades will remain.
        </p>

        <div class="flex space-x-3">
          <button @click="cancelEvolution"
            class="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button @click="performEvolution"
            class="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium">
            Evolve
          </button>
        </div>
      </div>
    </div>

    <!-- About Evolution Dialog -->
    <div v-if="showAboutEvolution" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-5 mx-auto max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold flex items-center text-purple-800">
            <span class="i-heroicons-information-circle text-purple-600 mr-2"></span>
            About Evolution
          </h3>
          <button @click="toggleAboutEvolution" class="text-gray-500 hover:text-gray-700">
            <span class="i-heroicons-x-mark text-xl"></span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-purple-50 p-4 rounded-lg">
            <p class="text-sm text-purple-800 mb-2">
              Evolution allows your ant colony to grow stronger with each reset. When you evolve:
            </p>

            <ul class="text-sm text-purple-800 list-disc pl-5 space-y-1">
              <li>You gain Evolution Points (EP) based on the number of loops completed</li>
              <li>Each loop provides more EP than the previous one (10% increase per loop)</li>
              <li>EP can be spent on permanent upgrades to enhance your colony</li>
              <li>Your progress and resources reset, but your upgrades remain</li>
              <li>Each evolution increases the loop requirement, following a scaling pattern</li>
              <li>Higher evolution counts provide a bonus to EP gain</li>
            </ul>
          </div>

          <div class="bg-purple-50 p-4 rounded-lg">
            <p class="text-sm text-purple-800 mb-2">
              <strong>How Loops Work:</strong>
            </p>

            <ul class="text-sm text-purple-800 list-disc pl-5 space-y-1">
              <li>Loops can be completed in two ways:</li>
              <li class="ml-4">1. Time-based: Accumulate enough ticks to fill the loop</li>
              <li class="ml-4">2. Food-based: Have enough food to instantly complete a loop</li>
              <li>The base requirement is 3 ticks per loop or 1,000 food</li>
              <li>Each completed loop increases the ticks required by 0.5</li>
              <li>Each completed loop increases the food required exponentially (^1.1)</li>
              <li>Evolution resets both requirements back to their base values</li>
              <li>The "Shorter Loop Duration" upgrade reduces the time needed to complete loops</li>
            </ul>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button @click="toggleAboutEvolution"
            class="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Evolution Upgrades -->
    <section class="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-adjustments-horizontal text-purple-700 mr-2"></span>
        Evolution Upgrades
      </h2>

      <div class="space-y-4">
        <EvolutionUpgradeItem v-for="upgrade in evolutionUpgrades" :key="upgrade.id" :upgrade="upgrade" />
      </div>
    </section>
  </div>
</template>

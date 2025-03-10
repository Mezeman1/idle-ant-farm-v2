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

// Group upgrades by category
const upgradeCategories = computed(() => {
  const categories = {
    production: [] as typeof evolutionUpgrades.value,
    efficiency: [] as typeof evolutionUpgrades.value,
    advanced: [] as typeof evolutionUpgrades.value,
  }

  evolutionUpgrades.value.forEach(upgrade => {
    if (upgrade.id.startsWith('unlock')) {
      categories.advanced.push(upgrade)
    } else if (['foodProcessing', 'efficientQueens', 'mutatedWorkers'].includes(upgrade.id)) {
      categories.production.push(upgrade)
    } else {
      categories.efficiency.push(upgrade)
    }
  })

  return categories
})

// Check if evolution is possible
const canEvolve = computed(() => prestigeStore.canEvolve)

// Loop progress percentage
const loopProgressPercentage = computed(() => {
  return Math.round((prestigeStore.currentLoopTicks.div(prestigeStore.ticksPerLoop)).mul(100).toNumber())
})

// Food progress percentage
const foodProgressPercentage = computed(() => {
  const currentFood = generatorStore.food
  const requiredFood = prestigeStore.foodForNextLoop
  const ratio = currentFood.div(requiredFood)
  return Math.min(100, Math.round(ratio.mul(100).toNumber()))
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
  <div class="space-y-4">
    <!-- Evolution Status -->
    <section class="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center justify-between">
        <div class="flex items-center">
          <span class="i-heroicons-sparkles text-purple-700 mr-2"></span>
          Metamorphosis Status
        </div>
        <button @click="toggleAboutEvolution"
          class="w-5 h-5 rounded-full bg-purple-200 hover:bg-purple-300 flex items-center justify-center text-purple-700 transition-colors">
          <span class="i-heroicons-question-mark-circle text-base"></span>
        </button>
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
        <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">Evolution Points</div>
          <div class="text-sm font-bold flex items-center">
            <span class="i-heroicons-sparkles text-purple-600 mr-1 text-xs"></span>
            {{ prestigeStore.formatEP() }}
          </div>
        </div>

        <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">Metamorphosis Count</div>
          <div class="text-sm font-bold flex items-center">
            <span class="i-heroicons-arrow-path text-purple-600 mr-1 text-xs"></span>
            {{ prestigeStore.formatEvolutionCount() }}
          </div>
        </div>

        <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200 md:col-span-1 col-span-2">
          <div class="text-xs text-purple-700 font-medium flex justify-between">
            <span>Foraging Cycles</span>
            <span>{{ prestigeStore.formatLoopsCompleted() }} / {{ formattedRequiredLoops }}</span>
          </div>
          <div class="h-1.5 bg-purple-100 rounded-full mt-1 overflow-hidden">
            <div class="h-full bg-purple-500 transition-all duration-300 ease-out"
              :style="{ width: `${Math.min(100, (prestigeStore.loopsCompleted.div(prestigeStore.requiredLoops).toNumber() * 100))}%` }">
            </div>
          </div>
        </div>
      </div>

      <!-- Current Cycle Progress -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium flex justify-between">
            <span>Current Cycle Progress</span>
            <span>{{ loopProgressPercentage }}%</span>
          </div>
          <div class="h-1.5 bg-purple-100 rounded-full mt-1 overflow-hidden">
            <div class="h-full bg-purple-500 transition-all duration-300 ease-out"
              :style="{ width: `${loopProgressPercentage}%` }">
            </div>
          </div>
          <div class="text-xs text-purple-600 mt-1">
            {{ formattedCurrentTicks }} / {{ formattedTicksPerLoop }} trips
          </div>
        </div>

        <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200">
          <div class="text-xs text-purple-700 font-medium flex justify-between">
            <span>Food Progress</span>
            <span>{{ foodProgressPercentage }}%</span>
          </div>
          <div class="h-1.5 bg-purple-100 rounded-full mt-1 overflow-hidden">
            <div class="h-full bg-purple-500 transition-all duration-300 ease-out"
              :style="{ width: `${foodProgressPercentage}%` }">
            </div>
          </div>
          <div class="text-xs text-purple-600 mt-1">
            {{ generatorStore.formatFood() }} / {{ formatDecimal(prestigeStore.foodForNextLoop, 0) }} food
          </div>
        </div>
      </div>

      <!-- Potential EP gain and Evolution button -->
      <div class="flex flex-col md:flex-row gap-2 items-center">
        <div v-if="canEvolve" class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200 flex-grow w-full">
          <div class="text-xs text-purple-700 font-medium">Potential Genetic Advancement</div>
          <div class="text-sm font-bold flex items-center text-purple-600">
            <span class="i-heroicons-sparkles text-purple-600 mr-1 text-xs"></span>
            +{{ prestigeStore.formatPotentialEPGain() }} EP
          </div>
        </div>

        <button @click="confirmEvolution"
          class="py-2 px-3 rounded-lg text-white font-bold transition-colors duration-200 flex items-center justify-center md:w-auto w-full"
          :class="canEvolve ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg' : 'bg-gray-300 cursor-not-allowed'"
          :disabled="!canEvolve">
          <span class="i-heroicons-sparkles text-base mr-1"></span>
          <span v-if="canEvolve">Metamorphose</span>
          <span v-else>Need {{ formattedRequiredLoops }} Cycles</span>
        </button>
      </div>
    </section>

    <!-- Evolution Upgrades -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Production Upgrades -->
      <section class="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 shadow-md">
        <h2 class="text-base font-bold mb-2 flex items-center">
          <span class="i-heroicons-bolt text-purple-700 mr-2"></span>
          Production Upgrades
        </h2>

        <div class="space-y-2">
          <EvolutionUpgradeItem v-for="upgrade in upgradeCategories.production" :key="upgrade.id" :upgrade="upgrade" />
        </div>
      </section>

      <!-- Efficiency Upgrades -->
      <section class="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 shadow-md">
        <h2 class="text-base font-bold mb-2 flex items-center">
          <span class="i-heroicons-cog-6-tooth text-purple-700 mr-2"></span>
          Efficiency Upgrades
        </h2>

        <div class="space-y-2">
          <EvolutionUpgradeItem v-for="upgrade in upgradeCategories.efficiency" :key="upgrade.id" :upgrade="upgrade" />
        </div>
      </section>

      <!-- Advanced Generator Upgrades -->
      <section class="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 shadow-md">
        <h2 class="text-base font-bold mb-2 flex items-center">
          <span class="i-heroicons-beaker text-purple-700 mr-2"></span>
          Advanced Research
        </h2>

        <div class="space-y-2">
          <EvolutionUpgradeItem v-for="upgrade in upgradeCategories.advanced" :key="upgrade.id" :upgrade="upgrade" />
        </div>
      </section>
    </div>

    <!-- Evolution Confirmation Dialog -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-4 mx-auto">
        <h3 class="text-base font-bold mb-2 flex items-center text-purple-800">
          <span class="i-heroicons-sparkles text-purple-600 mr-2"></span>
          Confirm Metamorphosis
        </h3>

        <p class="text-xs text-gray-700 mb-3">
          You are about to metamorphose your colony. You will gain <span class="font-bold text-purple-600">{{
            prestigeStore.formatPotentialEPGain() }} Evolution Points</span>.
          Your progress will reset, but your evolutionary adaptations will remain.
        </p>

        <div class="flex space-x-2">
          <button @click="cancelEvolution"
            class="flex-1 py-1.5 px-3 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button @click="performEvolution"
            class="flex-1 py-1.5 px-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-xs font-medium">
            Metamorphose
          </button>
        </div>
      </div>
    </div>

    <!-- About Evolution Dialog -->
    <div v-if="showAboutEvolution" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-4 mx-auto max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-base font-bold flex items-center text-purple-800">
            <span class="i-heroicons-information-circle text-purple-600 mr-2"></span>
            About Metamorphosis
          </h3>
          <button @click="toggleAboutEvolution" class="text-gray-500 hover:text-gray-700">
            <span class="i-heroicons-x-mark text-lg"></span>
          </button>
        </div>

        <div class="space-y-3">
          <div class="bg-purple-50 p-3 rounded-lg">
            <p class="text-xs text-purple-800 mb-1">
              Metamorphosis allows your ant colony to grow stronger with each generation. When you metamorphose:
            </p>

            <ul class="text-xs text-purple-800 list-disc pl-4 space-y-0.5">
              <li>You gain Evolution Points (EP) based on the number of foraging cycles completed</li>
              <li>Each cycle provides more EP than the previous one (10% increase per cycle)</li>
              <li>EP can be spent on permanent genetic adaptations to enhance your colony</li>
              <li>Your progress and resources reset, but your adaptations remain</li>
              <li>Each metamorphosis increases the cycle requirement, following natural selection patterns</li>
              <li>Higher metamorphosis counts provide a bonus to EP gain</li>
            </ul>
          </div>

          <div class="bg-purple-50 p-3 rounded-lg">
            <p class="text-xs text-purple-800 mb-1">
              <strong>How Foraging Cycles Work:</strong>
            </p>

            <ul class="text-xs text-purple-800 list-disc pl-4 space-y-0.5">
              <li>Foraging cycles can be completed in two ways:</li>
              <li class="ml-3">1. Activity-based: Accumulate enough foraging trips to complete the cycle</li>
              <li class="ml-3">2. Food-based: Gather enough food to instantly complete a cycle</li>
              <li>The base requirement is 3 foraging trips per cycle or 1,000 food</li>
              <li>Each completed cycle increases the trips required by 0.5</li>
              <li>Each completed cycle increases the food required exponentially (^1.1)</li>
              <li>Metamorphosis resets both requirements back to their base values</li>
              <li>The "Efficient Foraging" adaptation reduces the time needed to complete cycles</li>
            </ul>
          </div>
        </div>

        <div class="mt-3 flex justify-end">
          <button @click="toggleAboutEvolution"
            class="py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animation for active scale */
.transform {
  transition: transform 0.1s ease-in-out;
}

.active\:scale-98:active {
  transform: scale(0.98);
}
</style>

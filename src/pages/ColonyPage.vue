<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useGeneratorStore } from '@/stores/generatorStore'
import { useGeneratorUpgradeStore } from '@/stores/generatorUpgradeStore'
import { formatDecimal } from '@/utils/decimalUtils'
import GeneratorItem from '@/components/GeneratorItem.vue'
import GeneratorLevelCard from '@/components/GeneratorLevelCard.vue'
import GeneratorUpgradeItem from '@/components/GeneratorUpgradeItem.vue'

const gameStore = useGameStore()
const generatorStore = useGeneratorStore()
const generatorUpgradeStore = useGeneratorUpgradeStore()

// Get unlocked generators
const unlockedGenerators = computed(() => generatorStore.unlockedGenerators)

// Food per second (formatted)
const formattedFoodPerSecond = computed(() => {
  return formatDecimal(generatorStore.foodPerSecond, 2)
})

// Selected generator for upgrades
const selectedGenerator = ref('worker')

// Get upgrades for selected generator
const selectedGeneratorUpgrades = computed(() => {
  return generatorUpgradeStore.getUpgradesForGenerator(selectedGenerator.value)
})

// Change selected generator
const selectGenerator = (generatorId: string) => {
  selectedGenerator.value = generatorId
}

// Get total points available
const totalPointsAvailable = computed(() => {
  let total = 0
  Object.values(generatorUpgradeStore.generatorPoints).forEach(points => {
    total += points.toNumber()
  })
  return total
})

// Show/hide generator info dialog
const showGeneratorInfo = ref(false)
const toggleGeneratorInfo = () => {
  showGeneratorInfo.value = !showGeneratorInfo.value
}
</script>

<template>
  <div class="space-y-6">
    <!-- Colony Overview -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-home text-amber-700 mr-2"></span>
        Colony Overview
      </h2>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Food</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-cake text-amber-600 mr-2 text-sm"></span>
            {{ generatorStore.formatFood() }}
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Food per Tick</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-arrow-trending-up text-amber-600 mr-2 text-sm"></span>
            {{ formattedFoodPerSecond }}
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Total Upgrade Points</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-star text-amber-600 mr-2 text-sm"></span>
            {{ totalPointsAvailable }}
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Total Generators</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-building-storefront text-amber-600 mr-2 text-sm"></span>
            {{ unlockedGenerators.length }}
          </div>
        </div>
      </div>
    </section>

    <!-- Generator Upgrades -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-adjustments-horizontal text-amber-700 mr-2"></span>
        Generator Upgrades
      </h2>

      <!-- Generator Selector Tabs -->
      <div class="flex border-b border-amber-200 mb-4 overflow-x-auto">
        <button @click="selectGenerator('worker')"
          class="py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap"
          :class="selectedGenerator === 'worker' ? 'border-b-2 border-amber-500 text-amber-700' : 'text-amber-600 hover:text-amber-700'">
          <span class="i-heroicons-bug-ant mr-1"></span>
          Worker Ants
        </button>
        <button v-if="generatorStore.getGenerator('nursery')?.unlocked" @click="selectGenerator('nursery')"
          class="py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap"
          :class="selectedGenerator === 'nursery' ? 'border-b-2 border-amber-500 text-amber-700' : 'text-amber-600 hover:text-amber-700'">
          <span class="i-heroicons-home-modern mr-1"></span>
          Nurseries
        </button>
        <button v-if="generatorStore.getGenerator('queenChamber')?.unlocked" @click="selectGenerator('queenChamber')"
          class="py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap"
          :class="selectedGenerator === 'queenChamber' ? 'border-b-2 border-amber-500 text-amber-700' : 'text-amber-600 hover:text-amber-700'">
          <span class="i-heroicons-crown mr-1"></span>
          Queen Chambers
        </button>
        <button v-if="generatorStore.getGenerator('colony')?.unlocked" @click="selectGenerator('colony')"
          class="py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap"
          :class="selectedGenerator === 'colony' ? 'border-b-2 border-amber-500 text-amber-700' : 'text-amber-600 hover:text-amber-700'">
          <span class="i-heroicons-building-storefront mr-1"></span>
          Colonies
        </button>
      </div>

      <!-- Points Available -->
      <div class="mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
        <div class="flex justify-between items-center">
          <div class="text-sm font-medium text-amber-800">
            <span class="i-heroicons-star text-amber-600 mr-1.5"></span>
            {{ generatorUpgradeStore.formatPoints(selectedGenerator) }} points available
          </div>
          <div class="text-xs text-amber-700">
            Level {{ generatorUpgradeStore.formatLevel(selectedGenerator) }}
          </div>
        </div>

        <!-- Level Progress -->
        <div class="mt-2">
          <div class="flex justify-between items-center text-xs text-amber-700 mb-1">
            <span>Progress to next level:</span>
            <span>{{ generatorUpgradeStore.formatProgressPercentage(selectedGenerator) }}%</span>
          </div>
          <div class="h-1.5 bg-amber-200 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 transition-all duration-300 ease-out"
              :style="{ width: `${generatorUpgradeStore.formatProgressPercentage(selectedGenerator)}%` }"></div>
          </div>
          <div class="text-xs text-amber-600 mt-1 flex justify-between">
            <span>
              <span class="font-medium">{{ selectedGenerator.charAt(0).toUpperCase() + selectedGenerator.slice(1)
              }}</span>
              levels up based on
              <span v-if="selectedGenerator === 'worker'">ticks</span>
              <span v-else-if="selectedGenerator === 'nursery'">food gained</span>
              <span v-else-if="selectedGenerator === 'queenChamber'">manual purchases</span>
              <span v-else-if="selectedGenerator === 'colony'">upgrades purchased</span>
            </span>
            <span>
              Next level: {{ generatorUpgradeStore.formatNextLevelRequirement(selectedGenerator) }}
              <span v-if="selectedGenerator === 'worker'">ticks</span>
              <span v-else-if="selectedGenerator === 'nursery'">food</span>
              <span v-else-if="selectedGenerator === 'queenChamber'">purchases</span>
              <span v-else-if="selectedGenerator === 'colony'">upgrades</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Generator Upgrades -->
      <div class="space-y-4">
        <GeneratorUpgradeItem v-for="upgrade in selectedGeneratorUpgrades" :key="upgrade.id" :upgradeId="upgrade.id" />
      </div>

      <!-- No Upgrades Message -->
      <div v-if="selectedGeneratorUpgrades.length === 0" class="text-center py-8 text-amber-700">
        <span class="i-heroicons-exclamation-circle text-2xl mb-2 block mx-auto"></span>
        <p>No upgrades available for this generator.</p>
      </div>
    </section>

    <!-- Generators -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-building-storefront text-amber-700 mr-2"></span>
        Expand Your Colony
      </h2>

      <div class="space-y-4">
        <GeneratorItem v-for="generator in unlockedGenerators" :key="generator.id" :generator="generator" />
      </div>
    </section>

    <!-- Generator Info Dialog -->
    <div v-if="showGeneratorInfo" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-5 mx-auto max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold flex items-center text-amber-800">
            <span class="i-heroicons-information-circle text-amber-600 mr-2"></span>
            About Generator Levels
          </h3>
          <button @click="toggleGeneratorInfo" class="text-gray-500 hover:text-gray-700">
            <span class="i-heroicons-x-mark text-xl"></span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-amber-50 p-4 rounded-lg">
            <p class="text-sm text-amber-800 mb-2">
              <strong>How Generator Levels Work:</strong>
            </p>

            <ul class="text-sm text-amber-800 list-disc pl-5 space-y-1">
              <li>Each generator has its own level that increases based on different metrics:</li>
              <li class="ml-4"><strong>Worker Ants:</strong> Level up based on ticks in current evolution (50% increase
                per level)</li>
              <li class="ml-4"><strong>Nurseries:</strong> Level up based on amount of food gained (100% increase per
                level)</li>
              <li class="ml-4"><strong>Queen Chambers:</strong> Level up based on total manual purchases (30% increase
                per level)</li>
              <li class="ml-4"><strong>Colonies:</strong> Level up based on amount of upgrades purchased (20% increase
                per level)</li>
              <li>Each level-up awards 1 upgrade point for that generator type</li>
              <li>Upgrade points can be spent on upgrades specific to that generator</li>
              <li>Generator levels and upgrades reset when you evolve</li>
            </ul>
          </div>

          <div class="bg-amber-50 p-4 rounded-lg">
            <p class="text-sm text-amber-800 mb-2">
              <strong>Types of Generator Upgrades:</strong>
            </p>

            <ul class="text-sm text-amber-800 list-disc pl-5 space-y-1">
              <li><strong>Efficiency Upgrades:</strong> Increase production (+20% per level)</li>
              <li><strong>Cost Reduction Upgrades:</strong> Decrease cost (-5% per level)</li>
              <li><strong>Special Upgrades:</strong> Add a chance for generators to reproduce themselves</li>
            </ul>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button @click="toggleGeneratorInfo"
            class="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

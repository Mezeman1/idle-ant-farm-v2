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
          <div class="text-xs text-amber-700 font-medium">Food per Foraging Trip</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-arrow-trending-up text-amber-600 mr-2 text-sm"></span>
            {{ formattedFoodPerSecond }}
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Total Adaptation Points</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-star text-amber-600 mr-2 text-sm"></span>
            {{ totalPointsAvailable }}
          </div>
        </div>

        <div class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Ant Types</div>
          <div class="text-lg font-bold flex items-center">
            <span class="i-heroicons-building-storefront text-amber-600 mr-2 text-sm"></span>
            {{ unlockedGenerators.length }}
          </div>
        </div>
      </div>
    </section>

    <!-- Generator Levels -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-star text-amber-700 mr-2"></span>
        Ant Specialization Levels
      </h2>

      <div class="grid grid-cols-2 gap-4">
        <GeneratorLevelCard generatorId="worker" />
        <GeneratorLevelCard generatorId="nursery" />
        <GeneratorLevelCard generatorId="queenChamber" />
        <GeneratorLevelCard generatorId="colony" />
      </div>
    </section>

    <!-- Worker Upgrades -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-bug-ant text-amber-700 mr-2"></span>
        Worker Ant Adaptations
      </h2>

      <div class="space-y-4">
        <GeneratorUpgradeItem upgradeId="workerEfficiency" />
        <GeneratorUpgradeItem upgradeId="workerTraining" />
        <GeneratorUpgradeItem upgradeId="workerReproduction" />
      </div>
    </section>

    <!-- Nursery Upgrades -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-home-modern text-amber-700 mr-2"></span>
        Nursery Adaptations
      </h2>

      <div class="space-y-4">
        <GeneratorUpgradeItem upgradeId="nurseryEfficiency" />
        <GeneratorUpgradeItem upgradeId="nurseryExpansion" />
        <GeneratorUpgradeItem upgradeId="nurseryAutomation" />
      </div>
    </section>

    <!-- Queen Chamber Upgrades -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-crown text-amber-700 mr-2"></span>
        Queen Chamber Adaptations
      </h2>

      <div class="space-y-4">
        <GeneratorUpgradeItem upgradeId="queenChamberEfficiency" />
        <GeneratorUpgradeItem upgradeId="queenChamberLongevity" />
        <GeneratorUpgradeItem upgradeId="queenChamberFertility" />
      </div>
    </section>

    <!-- Colony Upgrades -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-5 shadow-md">
      <h2 class="text-lg font-bold mb-3 flex items-center">
        <span class="i-heroicons-building-office-2 text-amber-700 mr-2"></span>
        Colony Adaptations
      </h2>

      <div class="space-y-4">
        <GeneratorUpgradeItem upgradeId="colonyEfficiency" />
        <GeneratorUpgradeItem upgradeId="colonyExpansion" />
        <GeneratorUpgradeItem upgradeId="colonyDominance" />
      </div>
    </section>

    <!-- Ant Types -->
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
            About Ant Specialization
          </h3>
          <button @click="toggleGeneratorInfo" class="text-gray-500 hover:text-gray-700">
            <span class="i-heroicons-x-mark text-xl"></span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-amber-50 p-4 rounded-lg">
            <p class="text-sm text-amber-800 mb-2">
              <strong>How Ant Specialization Works:</strong>
            </p>

            <ul class="text-sm text-amber-800 list-disc pl-5 space-y-1">
              <li>Each ant type has its own specialization level that increases based on different metrics:</li>
              <li class="ml-4"><strong>Worker Ants:</strong> Level up based on foraging trips in current evolution (50%
                increase
                per level)</li>
              <li class="ml-4"><strong>Nurseries:</strong> Level up based on amount of food gathered (100% increase per
                level)</li>
              <li class="ml-4"><strong>Queen Chambers:</strong> Level up based on total manual purchases (30% increase
                per level)</li>
              <li class="ml-4"><strong>Colonies:</strong> Level up based on amount of adaptations developed (20%
                increase
                per level)</li>
              <li>Each level-up awards 1 adaptation point for that ant type</li>
              <li>Adaptation points can be spent on specialized traits for that ant type</li>
              <li>Specialization levels and adaptations reset when your colony undergoes metamorphosis</li>
            </ul>
          </div>

          <div class="bg-amber-50 p-4 rounded-lg">
            <p class="text-sm text-amber-800 mb-2">
              <strong>Types of Ant Adaptations:</strong>
            </p>

            <ul class="text-sm text-amber-800 list-disc pl-5 space-y-1">
              <li><strong>Efficiency Adaptations:</strong> Increase production (+20% per level)</li>
              <li><strong>Resource Adaptations:</strong> Decrease resource requirements (-5% per level)</li>
              <li><strong>Special Adaptations:</strong> Add a chance for ants to reproduce themselves</li>
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

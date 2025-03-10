<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useGeneratorStore } from '@/stores/generatorStore'
import { useGeneratorUpgradeStore } from '@/stores/generatorUpgradeStore'
import { formatDecimal } from '@/utils/decimalUtils'
import GeneratorItem from '@/components/GeneratorItem.vue'
import GeneratorUpgradeItem from '@/components/GeneratorUpgradeItem.vue'
import type { GeneratorId } from '@/types/generators'

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
const selectedGenerator = ref<GeneratorId>('')

// Get upgrades for selected generator
const selectedGeneratorUpgrades = computed(() => {
  return generatorUpgradeStore.getUpgradesForGenerator(selectedGenerator.value)
})

// Show/hide upgrade modal
const showUpgradeModal = ref(false)
const isClosing = ref(false)

// Open upgrade modal for a specific generator
const openUpgradeModal = (generatorId: GeneratorId) => {
  selectedGenerator.value = generatorId
  isClosing.value = false
  showUpgradeModal.value = true
}

// Close upgrade modal with animation
const closeUpgradeModal = () => {
  isClosing.value = true
  setTimeout(() => {
    showUpgradeModal.value = false
    isClosing.value = false
  }, 250) // Match this with the animation duration
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

// Generator names and icons mapping
const generatorInfo: Record<GeneratorId, { name: string; icon: string }> = {
  worker: { name: 'Worker Ants', icon: 'i-heroicons-bug-ant' },
  nursery: { name: 'Nursery', icon: 'i-heroicons-home-modern' },
  queenChamber: { name: 'Queen Chamber', icon: 'i-heroicons-crown' },
  colony: { name: 'Colony', icon: 'i-heroicons-building-storefront' },
  megacolony: { name: 'Mega Colony', icon: 'i-heroicons-building-office-2' },
  hivemind: { name: 'Hive Mind', icon: 'i-heroicons-cpu-chip' },
  antopolis: { name: 'Antopolis', icon: 'i-heroicons-building-library' }
}

// Get unlocked generator IDs for level cards
const unlockedGeneratorIds = computed(() => {
  return unlockedGenerators.value.map(generator => generator.id as GeneratorId)
})

// Get level requirement description
const levelRequirementDescription = computed(() => {
  if (!selectedGenerator.value) return ''
  switch (selectedGenerator.value) {
    case 'worker':
      return 'Levels up based on ticks in current evolution'
    case 'nursery':
      return 'Levels up based on amount of food gained'
    case 'queenChamber':
      return 'Levels up based on total manual purchases'
    case 'colony':
      return 'Levels up based on amount of upgrades purchased'
    default:
      return ''
  }
})

// Get level requirement unit
const levelRequirementUnit = computed(() => {
  if (!selectedGenerator.value) return ''
  switch (selectedGenerator.value) {
    case 'worker':
      return 'ticks'
    case 'nursery':
      return 'food'
    case 'queenChamber':
      return 'purchases'
    case 'colony':
      return 'upgrades'
    default:
      return ''
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Colony Overview -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center">
        <span class="i-heroicons-home text-amber-700 mr-2"></span>
        Colony Overview
      </h2>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Food</div>
          <div class="text-sm font-bold flex items-center">
            <span class="i-heroicons-cake text-amber-600 mr-1 text-xs"></span>
            {{ generatorStore.formatFood() }}
          </div>
        </div>

        <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Food per Foraging Trip</div>
          <div class="text-sm font-bold flex items-center">
            <span class="i-heroicons-arrow-trending-up text-amber-600 mr-1 text-xs"></span>
            {{ formattedFoodPerSecond }}
          </div>
        </div>

        <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Total Adaptation Points</div>
          <div class="text-sm font-bold flex items-center">
            <span class="i-heroicons-star text-amber-600 mr-1 text-xs"></span>
            {{ totalPointsAvailable }}
          </div>
        </div>

        <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">Ant Types</div>
          <div class="text-sm font-bold flex items-center">
            <span class="i-heroicons-building-storefront text-amber-600 mr-1 text-xs"></span>
            {{ unlockedGenerators.length }}
          </div>
        </div>
      </div>
    </section>

    <!-- Generator Levels -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center justify-between">
        <div class="flex items-center">
          <span class="i-heroicons-star text-amber-700 mr-2"></span>
          Ant Specialization Levels
        </div>
        <button @click="toggleGeneratorInfo"
          class="w-5 h-5 rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center text-amber-700 transition-colors">
          <span class="i-heroicons-question-mark-circle text-base"></span>
        </button>
      </h2>

      <div class="grid grid-cols-2 gap-3">
        <button v-for="generatorId in unlockedGeneratorIds" :key="generatorId" @click="openUpgradeModal(generatorId)"
          class="bg-white/80 p-2 rounded-lg shadow-md border border-amber-300 active:bg-amber-100 transition-all duration-200 text-left transform active:scale-98">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <span :class="[generatorInfo[generatorId]?.icon, 'text-amber-600 mr-1.5 text-base']"></span>
              <span class="text-sm font-medium">{{ generatorInfo[generatorId]?.name }}</span>
            </div>
            <span class="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
              Lvl {{ generatorUpgradeStore.generatorLevels[generatorId]?.toNumber() }}
            </span>
          </div>
          <div class="mt-1.5">
            <div class="h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div class="h-full bg-amber-500 transition-all duration-700 ease-out"
                :style="{ width: `${generatorUpgradeStore.formatProgressPercentage(generatorId)}%` }"></div>
            </div>
            <div class="flex justify-between mt-0.5 text-xs text-amber-700">
              <span>{{ generatorUpgradeStore.formatPoints(generatorId) }} points</span>
              <span>{{ generatorUpgradeStore.formatProgressPercentage(generatorId) }}%</span>
            </div>
          </div>
          <div class="mt-2 flex justify-end">
            <span class="text-xs bg-amber-600 text-white px-2 py-1 rounded-md flex items-center">
              <span class="i-heroicons-arrow-up-circle text-xs mr-1"></span>
              Upgrade
            </span>
          </div>
        </button>
      </div>
    </section>

    <!-- Ant Types -->
    <section class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center">
        <span class="i-heroicons-building-storefront text-amber-700 mr-2"></span>
        Expand Your Colony
      </h2>

      <div class="space-y-3">
        <GeneratorItem v-for="generator in unlockedGenerators" :key="generator.id" :generator="generator" />
      </div>
    </section>

    <!-- Generator Info Dialog -->
    <div v-if="showGeneratorInfo" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-4 mx-auto max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-base font-bold flex items-center text-amber-800">
            <span class="i-heroicons-information-circle text-amber-600 mr-2"></span>
            About Ant Specialization
          </h3>
          <button @click="toggleGeneratorInfo" class="text-gray-500 hover:text-gray-700">
            <span class="i-heroicons-x-mark text-lg"></span>
          </button>
        </div>

        <div class="space-y-3">
          <div class="bg-amber-50 p-3 rounded-lg">
            <p class="text-xs text-amber-800 mb-1">
              <strong>How Ant Specialization Works:</strong>
            </p>

            <ul class="text-xs text-amber-800 list-disc pl-4 space-y-0.5">
              <li>Each ant type has its own specialization level that increases based on different metrics:</li>
              <li class="ml-3"><strong>Worker Ants:</strong> Level up based on foraging trips in current evolution (50%
                increase
                per level)</li>
              <li class="ml-3"><strong>Nurseries:</strong> Level up based on amount of food gathered (100% increase per
                level)</li>
              <li class="ml-3"><strong>Queen Chambers:</strong> Level up based on total manual purchases (30% increase
                per level)</li>
              <li class="ml-3"><strong>Colonies:</strong> Level up based on amount of adaptations developed (20%
                increase
                per level)</li>
              <li>Each level-up awards 1 adaptation point for that ant type</li>
              <li>Adaptation points can be spent on specialized traits for that ant type</li>
              <li>Specialization levels and adaptations reset when your colony undergoes metamorphosis</li>
            </ul>
          </div>

          <div class="bg-amber-50 p-3 rounded-lg">
            <p class="text-xs text-amber-800 mb-1">
              <strong>Types of Ant Adaptations:</strong>
            </p>

            <ul class="text-xs text-amber-800 list-disc pl-4 space-y-0.5">
              <li><strong>Efficiency Adaptations:</strong> Increase production (+20% per level)</li>
              <li><strong>Resource Adaptations:</strong> Decrease resource requirements (-5% per level)</li>
              <li><strong>Special Adaptations:</strong> Add a chance for ants to reproduce themselves</li>
            </ul>
          </div>
        </div>

        <div class="mt-3 flex justify-end">
          <button @click="toggleGeneratorInfo"
            class="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-medium">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Generator Upgrade Modal -->
    <div v-if="showUpgradeModal" class="fixed inset-0 z-50">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 animate-fadeIn" :class="{ 'animate-fadeOut': isClosing }"></div>

      <!-- Modal Content -->
      <div class="relative w-full h-full flex flex-col overflow-hidden animate-slideUp"
        :class="{ 'animate-slideDown': isClosing }">
        <!-- Header -->
        <div class="bg-gradient-to-r from-amber-600 to-amber-500 p-3 shadow-md flex justify-between items-center">
          <h3 class="text-lg font-bold flex items-center text-white">
            <span :class="[generatorInfo[selectedGenerator]?.icon, 'text-white mr-2 text-xl']"></span>
            {{ generatorInfo[selectedGenerator]?.name }} Adaptations
          </h3>
          <button @click="closeUpgradeModal" class="text-white hover:text-amber-200 transition-colors p-2">
            <span class="i-heroicons-x-mark text-xl"></span>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-grow overflow-y-auto bg-amber-50/95 p-4">
          <!-- Stats Card -->
          <div
            class="bg-white rounded-lg shadow-md border border-amber-200 p-3 mb-4 animate-fadeIn animation-delay-100">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm text-amber-800 font-medium">Current Level</div>
                <div class="text-xl font-bold text-amber-800 flex items-center">
                  <span class="i-heroicons-star text-amber-500 mr-1"></span>
                  Level {{ generatorUpgradeStore.generatorLevels[selectedGenerator]?.toNumber() }}
                </div>
              </div>
              <div>
                <div class="text-sm text-amber-800 font-medium">Available Points</div>
                <div class="text-xl font-bold text-amber-800 flex items-center">
                  <span class="i-heroicons-bolt text-amber-500 mr-1"></span>
                  {{ generatorUpgradeStore.formatPoints(selectedGenerator) }} points
                </div>
              </div>
            </div>

            <div class="mt-3">
              <div class="text-sm text-amber-800 font-medium mb-1 flex justify-between">
                <span>Progress to Next Level</span>
                <span>{{ generatorUpgradeStore.formatProgressPercentage(selectedGenerator) }}%</span>
              </div>
              <div class="h-2.5 bg-amber-100 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 transition-all duration-700 ease-out"
                  :style="{ width: `${generatorUpgradeStore.formatProgressPercentage(selectedGenerator)}%` }"></div>
              </div>
              <div class="flex justify-between mt-1 text-xs text-amber-700">
                <span>Current: {{ generatorUpgradeStore.levelProgress[selectedGenerator]?.toFixed(0) }}</span>
                <span>Next: {{ generatorUpgradeStore.formatNextLevelRequirement(selectedGenerator) }} {{
                  levelRequirementUnit }}</span>
              </div>
            </div>

            <!-- Level Requirement Description -->
            <div class="mt-3 pt-3 border-t border-amber-200">
              <div class="text-xs text-amber-700">{{ levelRequirementDescription }}</div>
            </div>
          </div>
          <!-- Upgrades -->
          <h4 class="text-base font-bold text-amber-800 mb-3 flex items-center animate-fadeIn animation-delay-100">
            <span class="i-heroicons-adjustments-horizontal text-amber-600 mr-2"></span>
            Available Adaptations
          </h4>

          <div class="space-y-3 animate-fadeIn animation-delay-150">
            <GeneratorUpgradeItem v-for="upgrade in selectedGeneratorUpgrades" :key="upgrade.id"
              :upgradeId="upgrade.id" />
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-white p-3 shadow-md flex justify-end">
          <button @click="closeUpgradeModal"
            class="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium flex items-center transition-all duration-200 active:scale-95">
            <span class="i-heroicons-arrow-left text-base mr-1"></span>
            Return to Colony
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animation keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(15px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }

  to {
    transform: translateY(15px);
    opacity: 0;
  }
}

/* Animation classes */
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fadeOut {
  animation: fadeOut 0.25s ease-out forwards;
}

.animate-slideDown {
  animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Animation delays */
.animation-delay-100 {
  animation-delay: 100ms;
}

.animation-delay-150 {
  animation-delay: 150ms;
}

/* Scale effect for buttons */
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>

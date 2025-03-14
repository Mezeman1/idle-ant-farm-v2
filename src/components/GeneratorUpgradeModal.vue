<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGeneratorUpgradeStore } from '@/stores/generatorUpgradeStore'
import GeneratorUpgradeItem from '@/components/GeneratorUpgradeItem.vue'
import type { GeneratorId } from '@/types/generators'
import { getLevelRequirementDescription, getLevelRequirementUnit } from '@/constants/generatorInfo'

const props = defineProps<{
  show: boolean
  selectedGenerator: GeneratorId | null
  generatorInfo: Record<GeneratorId, { name: string; icon: string }>
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const generatorUpgradeStore = useGeneratorUpgradeStore()
const isClosing = ref(false)
const isVisible = ref(false)

// Get upgrades for selected generator
const selectedGeneratorUpgrades = computed(() => {
  if (!props.selectedGenerator) return []
  return generatorUpgradeStore.getUpgradesForGenerator(props.selectedGenerator)
})

// Handle visibility with animation sequence
watch(() => props.show, (newValue) => {
  if (newValue) {
    // Show immediately when opening
    isVisible.value = true
  } else {
    // Wait for animations to complete before hiding
    isClosing.value = false
  }
})

// Handle close with animation
const handleClose = () => {
  isClosing.value = true
  setTimeout(() => {
    emit('close')
    isVisible.value = false
  }, 400) // Match this with the longest animation duration
}

// Get level requirement description
const levelRequirementDescription = computed(() => {
  return getLevelRequirementDescription(props.selectedGenerator)
})

// Get level requirement unit
const levelRequirementUnit = computed(() => {
  return getLevelRequirementUnit(props.selectedGenerator)
})
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 z-50">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 animate-fadeIn" :class="{ 'animate-fadeOut': isClosing }"></div>

    <!-- Modal Content -->
    <div class="fixed inset-0 flex flex-col animate-fadeIn" :class="{ 'animate-fadeOut': isClosing }"
      v-if="selectedGenerator">
      <div
        class="w-full h-full flex flex-col bg-amber-50 dark:bg-gray-900 text-amber-900 dark:text-amber-100 font-sans animate-slideUp"
        :class="{ 'animate-slideDown': isClosing }">
        <!-- Header -->
        <header
          class="bg-gradient-to-r from-amber-800 to-amber-700 dark:from-amber-900 dark:to-amber-800 text-amber-50 shadow-lg">
          <!-- Main Header Content -->
          <div class="p-2 md:p-3">
            <!-- Title Row -->
            <div class="flex items-center justify-between">
              <h1 class="text-lg md:text-xl font-bold tracking-tight flex items-center opacity-0 animate-fadeIn"
                :style="{ animationDelay: '150ms', animationFillMode: 'forwards' }">
                <span
                  :class="[generatorInfo[selectedGenerator]?.icon, 'text-amber-300 dark:text-amber-200 mr-2']"></span>
                {{ generatorInfo[selectedGenerator]?.name }} Adaptations
              </h1>
              <button @click="handleClose"
                class="text-amber-50 hover:text-amber-300 transition-colors p-1.5 rounded-full hover:bg-amber-900/30 dark:hover:bg-amber-950/40">
                <span class="i-heroicons-x-mark text-lg"></span>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content (Scrollable) -->
        <main class="flex-1 overflow-y-auto p-4 pb-6 scroll-smooth">
          <!-- Stats Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-amber-200 dark:border-amber-700 p-3 mb-4 opacity-0 animate-fadeIn"
            :style="{ animationDelay: '200ms', animationFillMode: 'forwards' }">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div>
                <div class="text-sm text-amber-800 dark:text-amber-300 font-medium">Current Level</div>
                <div class="text-xl font-bold text-amber-800 dark:text-amber-300 flex items-center">
                  <span class="i-heroicons-star text-amber-500 dark:text-amber-400 mr-1"></span>
                  Level {{ generatorUpgradeStore.generatorLevels[selectedGenerator]?.toNumber() }}
                </div>
              </div>
              <div>
                <div class="text-sm text-amber-800 dark:text-amber-300 font-medium">Available Points</div>
                <div class="text-xl font-bold text-amber-800 dark:text-amber-300 flex items-center">
                  <span class="i-heroicons-bolt text-amber-500 dark:text-amber-400 mr-1"></span>
                  {{ generatorUpgradeStore.formatPoints(selectedGenerator) }} points
                </div>
              </div>
            </div>

            <div class="mt-3">
              <div class="text-sm text-amber-800 dark:text-amber-300 font-medium mb-1 flex justify-between">
                <span>Progress to Next Level</span>
                <span>{{ generatorUpgradeStore.formatProgressPercentage(selectedGenerator) }}%</span>
              </div>
              <div class="h-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 dark:bg-amber-600 transition-all duration-300 ease-out"
                  :style="{ width: `${generatorUpgradeStore.formatProgressPercentage(selectedGenerator)}%` }">
                </div>
              </div>
              <div class="flex justify-between mt-1 text-xs text-amber-700 dark:text-amber-400">
                <span>Current: {{ generatorUpgradeStore.levelProgress[selectedGenerator]?.toFixed(0)
                }}</span>
                <span>Next: {{ generatorUpgradeStore.formatNextLevelRequirement(selectedGenerator) }} {{
                  levelRequirementUnit }}</span>
              </div>
            </div>

            <!-- Level Requirement Description -->
            <div class="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
              <div class="text-xs text-amber-700 dark:text-amber-400">{{ levelRequirementDescription }}</div>
            </div>
          </div>
          <!-- Upgrades -->
          <h4
            class="text-base font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center opacity-0 animate-fadeIn"
            :style="{ animationDelay: '250ms', animationFillMode: 'forwards' }">
            <span class="i-heroicons-adjustments-horizontal text-amber-600 dark:text-amber-500 mr-2"></span>
            Available Adaptations
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 opacity-0 animate-fadeIn"
            :style="{ animationDelay: '300ms', animationFillMode: 'forwards' }">
            <GeneratorUpgradeItem v-for="upgrade in selectedGeneratorUpgrades" :key="upgrade.id"
              :upgradeId="upgrade.id" />
          </div>
        </main>

        <!-- Footer -->
        <footer
          class="bg-gradient-to-r from-amber-800 to-amber-700 dark:from-amber-900 dark:to-amber-800 text-amber-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div class="flex justify-end p-3">
            <button @click="handleClose"
              class="px-3 py-2 bg-amber-900/20 dark:bg-amber-950/40 hover:bg-amber-900/30 dark:hover:bg-amber-950/50 rounded-lg text-amber-50 font-medium transition-colors duration-200 flex items-center justify-center active:scale-95 border border-amber-600 dark:border-amber-700">
              <span class="i-heroicons-arrow-left text-base mr-1"></span>
              Return to Colony
            </button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for the main content */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background-color: rgb(254 243 199);
  /* amber-100 */
}

.dark main::-webkit-scrollbar-track {
  background-color: rgb(31 41 55);
  /* gray-800 */
}

main::-webkit-scrollbar-thumb {
  background-color: rgb(251 191 36);
  /* amber-400 */
  border-radius: 9999px;
}

.dark main::-webkit-scrollbar-thumb {
  background-color: rgb(180 83 9);
  /* amber-700 */
  border-radius: 9999px;
}

main::-webkit-scrollbar-thumb:hover {
  background-color: rgb(245 158 11);
  /* amber-500 */
}

.dark main::-webkit-scrollbar-thumb:hover {
  background-color: rgb(146 64 14);
  /* amber-800 */
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useGeneratorStore } from '@/stores/generatorStore'
import type { Generator } from '@/stores/generatorStore'

const props = defineProps<{
  generator: Generator | undefined
}>()

// Get production type based on tier
const productionType = computed(() => {
  if (!props.generator) return ''

  switch (props.generator.tier) {
    case 1: return 'food'
    case 2: return 'worker ants'
    case 3: return 'nurseries'
    case 4: return 'queen chambers'
    default: return 'colonies'
  }
})

// Calculate how many of the previous tier are needed to unlock
const requiredCount = computed(() => {
  return 10 // Based on the unlockNextTier function which requires 10
})

// Get the previous tier generator
const generatorStore = useGeneratorStore()
const previousTierGenerator = computed(() => {
  if (!props.generator) return undefined
  const previousTier = props.generator.tier - 1
  return generatorStore.unlockedGenerators.find(g => g.tier === previousTier)
})

// Calculate progress percentage
const unlockProgress = computed(() => {
  if (!previousTierGenerator.value || !props.generator) return 0
  const count = previousTierGenerator.value.count.toNumber()
  return Math.min(100, Math.round((count / requiredCount.value) * 100))
})
</script>

<template>
  <div v-if="generator"
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-300 dark:border-gray-700 transition-all duration-200 opacity-75 relative">
    <!-- Locked overlay -->
    <div class="absolute inset-0 bg-gray-100/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
      <div class="text-center p-3">
        <span class="i-heroicons-lock-closed text-2xl text-gray-500 mb-2 inline-block"></span>
        <h4 class="text-sm font-bold text-gray-700">Unlock {{ generator.name }}</h4>
        <p class="text-xs text-gray-600 mt-1">
          Requires {{ requiredCount }} {{ previousTierGenerator?.name || 'previous tier' }}
        </p>

        <!-- Progress bar -->
        <div class="mt-2 w-full">
          <div class="text-xs text-gray-700 flex justify-between">
            <span>Progress:</span>
            <span>{{ unlockProgress }}%</span>
          </div>
          <div class="h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div class="h-full bg-amber-500 transition-all duration-300 ease-out"
              :style="{ width: `${unlockProgress}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generator header and content in a more compact layout -->
    <div class="flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-500 to-gray-400 py-1.5 px-2 flex items-center justify-between text-white">
        <div class="flex items-center">
          <span :class="[generator.icon, 'text-xl mr-1.5 text-gray-300']"></span>
          <h3 class="font-bold text-sm">{{ generator.name }}</h3>
        </div>
        <div class="text-xs font-medium bg-gray-600/30 px-1.5 py-0.5 rounded">
          0
        </div>
      </div>

      <!-- Content -->
      <div class="p-2 text-gray-700">
        <!-- Two-column layout for generator details -->
        <div class="flex mb-1.5">
          <!-- Left column: Description -->
          <div class="flex-grow pr-2">
            <p class="text-xs mb-1">{{ generator.description }}</p>
            <div class="text-xs text-gray-600">
              <div class="flex justify-between">
                <span>Base Production:</span>
                <span>{{ generator.baseProduction.toString() }} {{ productionType }}/trip</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Buy button - disabled -->
        <button disabled
          class="w-full py-1.5 px-3 rounded text-xs font-medium bg-gray-200 text-gray-500 cursor-not-allowed">
          <span class="i-heroicons-lock-closed text-sm mr-1"></span>
          Locked
        </button>
      </div>
    </div>
  </div>
</template>

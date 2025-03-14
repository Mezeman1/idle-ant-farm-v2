<script setup lang="ts">
import type { GeneratorId } from '@/types/generators'

const props = defineProps<{
  generatorId: GeneratorId
  name: string
  icon: string
}>()

const emit = defineEmits<{
  (e: 'upgrade', generatorId: GeneratorId): void
}>()

const generatorUpgradeStore = useGeneratorUpgradeStore()

// Get current level
const currentLevel = computed(() => {
  return generatorUpgradeStore.generatorLevels[props.generatorId]?.toNumber() || 0
})

// Get progress percentage
const progressPercentage = computed(() => {
  return generatorUpgradeStore.formatProgressPercentage(props.generatorId)
})

// Get available points
const availablePoints = computed(() => {
  return generatorUpgradeStore.formatPoints(props.generatorId)
})

// Handle upgrade click
const handleUpgradeClick = () => {
  emit('upgrade', props.generatorId)
}
</script>

<template>
  <button @click="handleUpgradeClick"
    class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-md border border-amber-300 dark:border-amber-700 active:bg-amber-100 dark:active:bg-amber-900/50 transition-all duration-200 text-left transform active:scale-98">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <span :class="[icon, 'text-amber-600 dark:text-amber-400 mr-1.5 text-base']"></span>
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ name }}</span>
      </div>
      <span
        class="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded-full">
        Lvl {{ currentLevel }}
      </span>
    </div>
    <div class="mt-1.5">
      <div class="h-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-full overflow-hidden">
        <div class="h-full bg-amber-500 dark:bg-amber-600 transition-all duration-700 ease-out"
          :style="{ width: `${progressPercentage}%` }"></div>
      </div>
      <div class="flex justify-between mt-0.5 text-xs text-amber-700 dark:text-amber-400">
        <span>{{ availablePoints }} points</span>
        <span>{{ progressPercentage }}%</span>
      </div>
    </div>
    <div class="mt-2 flex justify-end">
      <span class="text-xs bg-amber-600 dark:bg-amber-700 text-white px-2 py-1 rounded-md flex items-center">
        <span class="i-heroicons-arrow-up-circle text-xs mr-1"></span>
        Upgrade
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
interface MultiplierItem {
  name: string
  formatted: string
}

const props = defineProps<{
  show: boolean
  multiplierBreakdown: MultiplierItem[]
  totalMultiplier: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    @click="emit('close')">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col mx-auto border border-amber-200 dark:border-amber-700"
      @click.stop>
      <h3
        class="text-base font-bold mb-3 flex items-center text-amber-800 dark:text-amber-300 p-5 pb-2 border-b border-amber-200 dark:border-amber-700">
        <span class="i-heroicons-chart-bar text-amber-600 dark:text-amber-400 mr-2"></span>
        Multiplier Breakdown
      </h3>

      <div class="overflow-y-auto px-5 flex-grow">
        <div class="space-y-2 mb-4">
          <div v-for="(item, index) in multiplierBreakdown" :key="index"
            class="flex justify-between items-center py-2 px-3 rounded-lg bg-amber-50 dark:bg-amber-900/30">
            <span class="text-amber-700 dark:text-amber-400">{{ item.name }}</span>
            <span class="font-medium text-amber-900 dark:text-amber-200">{{ item.formatted }}</span>
          </div>
        </div>
      </div>

      <div
        class="border-t-2 border-amber-200 dark:border-amber-700 pt-3 flex justify-between items-center font-bold text-amber-900 dark:text-amber-200 px-5">
        <span>Total Multiplier</span>
        <span class="bg-amber-200 dark:bg-amber-700 px-3 py-1 rounded-lg">{{ totalMultiplier }}</span>
      </div>

      <div class="mt-4 flex justify-end px-5 pb-5">
        <button @click="emit('close')"
          class="py-2 px-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 rounded-lg text-white text-sm font-medium transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

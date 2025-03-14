<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-5 mx-auto max-h-[80vh] overflow-y-auto border border-purple-200 dark:border-purple-700">
      <div class="flex justify-between items-center mb-3 pb-2 border-b border-purple-200 dark:border-purple-700">
        <h3 class="text-base font-bold flex items-center text-purple-800 dark:text-purple-300">
          <span class="i-heroicons-information-circle text-purple-600 dark:text-purple-400 mr-2"></span>
          About Metamorphosis
        </h3>
        <button @click="emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <span class="i-heroicons-x-mark text-lg"></span>
        </button>
      </div>

      <div class="space-y-4">
        <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 class="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2">Metamorphosis Basics</h4>
          <p class="text-sm text-purple-800 dark:text-purple-300 mb-2">
            Metamorphosis allows your ant colony to grow stronger with each generation. When you
            metamorphose:
          </p>

          <ul class="text-sm text-purple-800 dark:text-purple-300 list-disc pl-5 space-y-1">
            <li>You gain Evolution Points (EP) based on the number of foraging cycles completed</li>
            <li>Each cycle provides more EP than the previous one (10% increase per cycle)</li>
            <li>EP can be spent on permanent genetic adaptations to enhance your colony</li>
            <li>Your progress and resources reset, but your adaptations remain</li>
            <li>Each metamorphosis increases the cycle requirement, following natural selection patterns
            </li>
            <li>Higher metamorphosis counts provide a bonus to EP gain</li>
          </ul>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">How Foraging Cycles Work</h4>

          <ul class="text-sm text-blue-800 dark:text-blue-300 list-disc pl-5 space-y-1">
            <li>Foraging cycles can be completed in two ways:</li>
            <li class="ml-5">1. Activity-based: Accumulate enough foraging trips to complete the cycle</li>
            <li class="ml-5">2. Food-based: Gather enough food to instantly complete a cycle</li>
            <li>The base requirement is 3 foraging trips per cycle or 1,000 food</li>
            <li>Each completed cycle increases the trips required by 0.5</li>
            <li>Each completed cycle increases the food required exponentially (^1.1)</li>
            <li>Metamorphosis resets both requirements back to their base values</li>
            <li>The "Efficient Foraging" adaptation reduces the time needed to complete cycles</li>
          </ul>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button @click="emit('close')"
          class="py-2 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg text-sm font-medium transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

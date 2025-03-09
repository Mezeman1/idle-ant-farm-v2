<script setup lang="ts">
import { computed } from 'vue'
import { useGeneratorStore } from '@/stores/generatorStore'
import type { Generator } from '@/stores/generatorStore'
import { formatDecimal } from '@/utils/decimalUtils'

const props = defineProps<{
  generator: Generator
}>()

const generatorStore = useGeneratorStore()

// Computed properties
const cost = computed(() => {
  return generatorStore.getGeneratorCost(props.generator.id)
})

const formattedCost = computed(() => {
  return formatDecimal(cost.value, 0)
})

const canAfford = computed(() => {
  return generatorStore.food.gte(cost.value)
})

const formattedCount = computed(() => {
  return formatDecimal(props.generator.count, 0)
})

const formattedProduction = computed(() => {
  return formatDecimal(props.generator.baseProduction, 1)
})

// Methods
const buyGenerator = () => {
  if (canAfford.value) {
    generatorStore.buyGenerator(props.generator.id)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 transition-all duration-200"
    :class="{ 'opacity-75': !canAfford }">
    <!-- Generator header -->
    <div class="bg-gradient-to-r from-amber-600 to-amber-500 p-3 flex items-center justify-between text-white">
      <div class="flex items-center">
        <span :class="[generator.icon, 'text-2xl mr-2 text-amber-200']"></span>
        <h3 class="font-bold">{{ generator.name }}</h3>
      </div>
      <div class="text-sm font-medium bg-amber-700/30 px-2 py-0.5 rounded">
        {{ formattedCount }}
      </div>
    </div>

    <!-- Generator details -->
    <div class="p-3 text-amber-900">
      <p class="text-sm mb-2">{{ generator.description }}</p>

      <div class="text-xs text-amber-700 mb-3">
        <div class="flex justify-between mb-1">
          <span>Production:</span>
          <span>{{ formattedProduction }} {{ generator.tier === 1 ? 'food' : generator.tier === 2 ? 'workerants' :
            generator.tier === 3 ? 'nurseries' : 'queen chambers' }} per tick</span>
        </div>
      </div>

      <!-- Buy button -->
      <button @click="buyGenerator"
        class="w-full py-2 px-4 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center"
        :class="canAfford ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
        :disabled="!canAfford">
        <span class="i-heroicons-shopping-cart text-lg mr-1.5"></span>
        Buy for {{ formattedCost }} food
      </button>
    </div>
  </div>
</template>

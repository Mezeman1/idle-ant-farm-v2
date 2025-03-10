<script setup lang="ts">
import { computed } from 'vue'
import { useGeneratorStore } from '@/stores/generatorStore'
import type { Generator } from '@/stores/generatorStore'
import { formatDecimal } from '@/utils/decimalUtils'
import HoldableButton from '@/components/HoldableButton.vue'

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

const formattedManualPurchases = computed(() => {
  return formatDecimal(props.generator.manualPurchases, 0)
})

const autoGenerated = computed(() => {
  return props.generator.count.sub(props.generator.manualPurchases)
})

const formattedAutoGenerated = computed(() => {
  return formatDecimal(autoGenerated.value, 0)
})

const formattedProduction = computed(() => {
  return formatDecimal(props.generator.baseProduction, 1)
})

// Get the production multiplier
const productionMultiplier = computed(() => {
  return generatorStore.getProductionMultiplier(props.generator.id)
})

// Format the production multiplier
const formattedProductionMultiplier = computed(() => {
  return generatorStore.formatProductionMultiplier(props.generator.id)
})

// Calculate actual production with multipliers
const actualProduction = computed(() => {
  return props.generator.baseProduction.mul(productionMultiplier.value)
})

// Format actual production
const formattedActualProduction = computed(() => {
  return formatDecimal(actualProduction.value, 1)
})

// Methods
const buyGenerator = () => {
  if (canAfford.value && !hasMissingDependency.value) {
    generatorStore.buyGenerator(props.generator.id)
  }
}

// Check if this generator has dependencies that aren't met
const hasMissingDependency = computed(() => {
  if (props.generator.id === 'hivemind') {
    const megacolony = generatorStore.getGenerator('megacolony')
    return !megacolony || megacolony.count.eq(0)
  } else if (props.generator.id === 'antopolis') {
    const hivemind = generatorStore.getGenerator('hivemind')
    return !hivemind || hivemind.count.eq(0)
  }
  return false
})

// Get dependency message if applicable
const dependencyMessage = computed(() => {
  if (props.generator.id === 'hivemind') {
    return 'Requires at least one Mega Colony'
  } else if (props.generator.id === 'antopolis') {
    return 'Requires at least one Hive Mind'
  }
  return ''
})

// Get production type based on tier
const productionType = computed(() => {
  switch (props.generator.tier) {
    case 1: return 'food'
    case 2: return 'worker ants'
    case 3: return 'nurseries'
    case 4: return 'queen chambers'
    case 5: return 'colonies'
    case 6: return 'mega colonies'
    case 7: return 'hive minds'
    default: return 'resources'
  }
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-amber-200 transition-all duration-200"
    :class="{ 'opacity-75': !canAfford }">
    <!-- Generator header and content in a more compact layout -->
    <div class="flex flex-col">
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-amber-600 to-amber-500 py-1.5 px-2 flex items-center justify-between text-white">
        <div class="flex items-center">
          <span :class="[generator.icon, 'text-xl mr-1.5 text-amber-200']"></span>
          <h3 class="font-bold text-sm">{{ generator.name }}</h3>
        </div>
        <div class="text-xs font-medium bg-amber-700/30 px-1.5 py-0.5 rounded">
          {{ formattedCount }}
        </div>
      </div>

      <!-- Content -->
      <div class="p-2 text-amber-900">
        <!-- Two-column layout for generator details -->
        <div class="flex mb-1.5">
          <!-- Left column: Description -->
          <div class="flex-grow pr-2">
            <p class="text-xs mb-1">{{ generator.description }}</p>
            <div class="text-xs text-amber-700">
              <div class="flex justify-between">
                <span>Production:</span>
                <span>{{ formattedActualProduction }} {{ productionType }}/trip</span>
              </div>
              <div class="flex justify-between text-xs text-amber-600">
                <span>Base × Multiplier:</span>
                <span>{{ formattedProduction }} × {{ formattedProductionMultiplier }}</span>
              </div>
            </div>
          </div>

          <!-- Right column: Stats -->
          <div class="flex-shrink-0 w-24 text-xs text-amber-700 space-y-0.5">
            <div class="flex justify-between">
              <span>Bought:</span>
              <span>{{ formattedManualPurchases }}</span>
            </div>
            <div class="flex justify-between">
              <span>Auto:</span>
              <span>{{ formattedAutoGenerated }}</span>
            </div>
          </div>
        </div>

        <!-- Buy button - replaced with HoldableButton -->
        <div>
          <!-- Dependency warning message -->
          <div v-if="hasMissingDependency" class="text-xs text-red-600 mb-1 flex items-center">
            <span class="i-heroicons-exclamation-triangle text-sm mr-1"></span>
            {{ dependencyMessage }}
          </div>

          <HoldableButton @action="buyGenerator" :disabled="!canAfford || hasMissingDependency" :class="canAfford && !hasMissingDependency
            ? 'w-full py-1.5 px-3 rounded text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white'
            : 'w-full py-1.5 px-3 rounded text-xs font-medium bg-gray-200 text-gray-500 cursor-not-allowed'"
            :initial-delay="400" :repeat-interval="150" :accelerate="true" :min-interval="30">
            <span class="i-heroicons-shopping-cart text-sm mr-1"></span>
            Buy for {{ formattedCost }} food
          </HoldableButton>
        </div>
      </div>
    </div>
  </div>
</template>

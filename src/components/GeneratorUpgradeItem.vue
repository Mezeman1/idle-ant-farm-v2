<script setup lang="ts">
import { computed } from 'vue'
import { useGeneratorUpgradeStore } from '@/stores/generatorUpgradeStore'
import type { GeneratorUpgrade } from '@/stores/generatorUpgradeStore'
import { formatDecimal } from '@/utils/decimalUtils'
import HoldableButton from '@/components/HoldableButton.vue'

const props = defineProps({
  upgradeId: {
    type: String,
    required: true
  }
})

const generatorUpgradeStore = useGeneratorUpgradeStore()

// Get the upgrade
const upgrade = computed(() => {
  return generatorUpgradeStore.getUpgrade(props.upgradeId)
})

// Check if upgrade can be purchased
const canPurchase = computed(() => {
  if (!upgrade.value) return false

  // Check if max level reached
  if (upgrade.value.maxLevel !== null && upgrade.value.level.gte(upgrade.value.maxLevel)) {
    return false
  }

  // Check if enough points
  const points = generatorUpgradeStore.generatorPoints[upgrade.value.generatorId]
  return points.gte(upgrade.value.cost)
})

// Format effect for display
const formattedEffect = computed(() => {
  if (!upgrade.value) return ''

  const effect = upgrade.value.effect(upgrade.value.level)

  // Different formatting based on upgrade type
  if (upgrade.value.id.includes('Efficiency')) {
    return `+${formatDecimal(effect.sub(1).mul(100), 0)}%`
  } else if (upgrade.value.id.includes('Training') || upgrade.value.id.includes('Expansion') || upgrade.value.id.includes('Longevity')) {
    return `-${formatDecimal(effect.sub(1).abs().mul(100), 0)}%`
  } else if (upgrade.value.id.includes('Reproduction') || upgrade.value.id.includes('Automation') || upgrade.value.id.includes('Fertility') || upgrade.value.id.includes('Dominance')) {
    return `${formatDecimal(effect.mul(100), 1)}%`
  }

  return formatDecimal(effect, 2)
})

// Format next level effect for display
const formattedNextEffect = computed(() => {
  if (!upgrade.value) return ''

  const nextLevel = upgrade.value.level.add(1)
  const nextEffect = upgrade.value.effect(nextLevel)

  // Different formatting based on upgrade type
  if (upgrade.value.id.includes('Efficiency')) {
    return `+${formatDecimal(nextEffect.sub(1).mul(100), 0)}%`
  } else if (upgrade.value.id.includes('Training') || upgrade.value.id.includes('Expansion') || upgrade.value.id.includes('Longevity')) {
    return `-${formatDecimal(nextEffect.sub(1).abs().mul(100), 0)}%`
  } else if (upgrade.value.id.includes('Reproduction') || upgrade.value.id.includes('Automation') || upgrade.value.id.includes('Fertility') || upgrade.value.id.includes('Dominance')) {
    return `${formatDecimal(nextEffect.mul(100), 1)}%`
  }

  return formatDecimal(nextEffect, 2)
})

// Purchase the upgrade
const purchase = () => {
  if (canPurchase.value && upgrade.value) {
    generatorUpgradeStore.purchaseUpgrade(upgrade.value.id)
  }
}
</script>

<template>
  <div v-if="upgrade"
    class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200 hover:border-amber-300 transition-colors">
    <div class="flex justify-between items-start">
      <div>
        <div class="flex items-center">
          <span :class="upgrade.icon + ' text-amber-600 mr-2'"></span>
          <span class="font-medium">{{ upgrade.name }}</span>
        </div>
        <div class="text-xs text-gray-600 mt-1">{{ upgrade.description }}</div>
      </div>

      <div class="text-right">
        <div class="text-xs text-amber-700">
          Level: <span class="font-medium">{{ formatDecimal(upgrade.level, 0) }}</span>
          <span v-if="upgrade.maxLevel !== null">/{{ formatDecimal(upgrade.maxLevel, 0) }}</span>
        </div>
        <div class="text-xs text-amber-700 mt-1">
          Effect: <span class="font-medium">{{ formattedEffect }}</span>
        </div>
      </div>
    </div>

    <div class="mt-3 flex justify-between items-center">
      <div class="text-xs text-amber-700">
        <span v-if="upgrade.maxLevel === null || upgrade.level.lt(upgrade.maxLevel)">
          Next: <span class="font-medium">{{ formattedNextEffect }}</span>
        </span>
        <span v-else class="text-green-600 font-medium">MAX LEVEL</span>
      </div>

      <HoldableButton @action="purchase" :disabled="!canPurchase" :class="canPurchase
        ? 'px-3 py-1 text-xs rounded-md font-medium bg-amber-500 hover:bg-amber-600 text-white'
        : 'px-3 py-1 text-xs rounded-md font-medium bg-gray-200 text-gray-500 cursor-not-allowed'"
        :initial-delay="400" :repeat-interval="200" :accelerate="true">
        <span v-if="upgrade.maxLevel === null || upgrade.level.lt(upgrade.maxLevel)">
          Adapt ({{ formatDecimal(upgrade.cost, 0) }} pts)
        </span>
        <span v-else>Maxed</span>
      </HoldableButton>
    </div>
  </div>
</template>

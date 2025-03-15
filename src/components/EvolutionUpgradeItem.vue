<script setup lang="ts">
import { computed } from 'vue'
import { usePrestigeStore } from '@/stores/prestigeStore'
import type { PrestigeUpgrade } from '@/types/prestige'
import { formatDecimal, formatPercentage } from '@/utils/decimalUtils'
import HoldableButton from '@/components/HoldableButton.vue'
import { useGeneratorStore } from '@/stores/generatorStore'

const props = defineProps<{
  upgrade: PrestigeUpgrade
}>()

const prestigeStore = usePrestigeStore()

// Computed properties
const formattedCost = computed(() => {
  return formatDecimal(props.upgrade.cost, 2)
})

const formattedLevel = computed(() => {
  return formatDecimal(props.upgrade.level, 0)
})

const formattedMaxLevel = computed(() => {
  if (!props.upgrade.maxLevel) return '∞'
  return formatDecimal(props.upgrade.maxLevel, 0)
})

const formattedEffect = computed(() => {
  const effect = props.upgrade.effect(props.upgrade.level)
  return props.upgrade.formatEffect(effect)
})

const canAfford = computed(() => {
  return prestigeStore.evolutionPoints.gte(props.upgrade.cost)
})

const isMaxLevel = computed(() => {
  if (!props.upgrade.maxLevel) return false
  return props.upgrade.level.gte(props.upgrade.maxLevel)
})

// Check if this upgrade has dependencies that aren't met or is not unlocked
const hasDependencies = computed(() => {
  // First check if the upgrade is unlocked by its own criteria
  if (!props.upgrade.isUnlocked()) {
    return true
  }

  // Then check for advanced generator unlocks
  if (props.upgrade.id === 'unlockHivemind') {
    // Check if player has at least one Mega Colony
    const generatorStore = useGeneratorStore()
    const megacolony = generatorStore.getGenerator('megacolony')
    return !megacolony || megacolony.count.eq(0)
  } else if (props.upgrade.id === 'unlockAntopolis') {
    // Check if player has at least one Hive Mind
    const generatorStore = useGeneratorStore()
    const hivemind = generatorStore.getGenerator('hivemind')
    return !hivemind || hivemind.count.eq(0)
  }

  return false
})

// Get dependency message if applicable
const dependencyMessage = computed(() => {
  // First check if the upgrade is unlocked by its own criteria
  if (!props.upgrade.isUnlocked()) {
    return 'Upgrade not yet unlocked'
  }

  if (props.upgrade.id === 'unlockHivemind') {
    return 'Requires at least one Mega Colony'
  } else if (props.upgrade.id === 'unlockAntopolis') {
    return 'Requires at least one Hive Mind'
  }
  return ''
})

// Methods
const purchaseUpgrade = () => {
  // Check if the upgrade can be purchased
  if (canAfford.value && !isMaxLevel.value && !hasDependencies.value) {
    prestigeStore.purchaseUpgrade(props.upgrade.id)
  }
}

// Helper methods for styling based on category
const getBorderColorClass = () => {
  switch (props.upgrade.category) {
    case 'production': return 'border-purple-200 dark:border-purple-800'
    case 'efficiency': return 'border-blue-200 dark:border-blue-800'
    case 'automation': return 'border-red-200 dark:border-red-800'
    case 'research': return 'border-amber-200 dark:border-amber-800'
    case 'synergy': return 'border-green-200 dark:border-green-800'
    case 'prestige': return 'border-indigo-200 dark:border-indigo-800'
    default: return 'border-gray-200 dark:border-gray-700'
  }
}

const getIconColorClass = () => {
  switch (props.upgrade.category) {
    case 'production': return 'text-purple-600 dark:text-purple-400'
    case 'efficiency': return 'text-blue-600 dark:text-blue-400'
    case 'automation': return 'text-red-600 dark:text-red-400'
    case 'research': return 'text-amber-600 dark:text-amber-400'
    case 'synergy': return 'text-green-600 dark:text-green-400'
    case 'prestige': return 'text-indigo-600 dark:text-indigo-400'
    default: return 'text-gray-600 dark:text-gray-400'
  }
}

const getTitleColorClass = () => {
  switch (props.upgrade.category) {
    case 'production': return 'text-purple-900 dark:text-purple-200'
    case 'efficiency': return 'text-blue-900 dark:text-blue-200'
    case 'automation': return 'text-red-900 dark:text-red-200'
    case 'research': return 'text-amber-900 dark:text-amber-200'
    case 'synergy': return 'text-green-900 dark:text-green-200'
    case 'prestige': return 'text-indigo-900 dark:text-indigo-200'
    default: return 'text-gray-900 dark:text-gray-200'
  }
}

const getDescriptionColorClass = () => {
  switch (props.upgrade.category) {
    case 'production': return 'text-purple-700 dark:text-purple-300'
    case 'efficiency': return 'text-blue-700 dark:text-blue-300'
    case 'automation': return 'text-red-700 dark:text-red-300'
    case 'research': return 'text-amber-700 dark:text-amber-300'
    case 'synergy': return 'text-green-700 dark:text-green-300'
    case 'prestige': return 'text-indigo-700 dark:text-indigo-300'
    default: return 'text-gray-700 dark:text-gray-300'
  }
}

const getEffectColorClass = () => {
  switch (props.upgrade.category) {
    case 'production': return 'text-purple-600 dark:text-purple-400'
    case 'efficiency': return 'text-blue-600 dark:text-blue-400'
    case 'automation': return 'text-red-600 dark:text-red-400'
    case 'research': return 'text-amber-600 dark:text-amber-400'
    case 'synergy': return 'text-green-600 dark:text-green-400'
    case 'prestige': return 'text-indigo-600 dark:text-indigo-400'
    default: return 'text-gray-600 dark:text-gray-400'
  }
}

const getLevelBadgeClasses = () => {
  switch (props.upgrade.category) {
    case 'production': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    case 'efficiency': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    case 'automation': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case 'research': return 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
    case 'synergy': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    case 'prestige': return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
  }
}

const getButtonClasses = () => {
  switch (props.upgrade.category) {
    case 'production': return 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white'
    case 'efficiency': return 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white'
    case 'automation': return 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white'
    case 'research': return 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white'
    case 'synergy': return 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white'
    case 'prestige': return 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white'
    default: return 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white'
  }
}

const buttonClasses = computed(() => {
  if (canAfford.value && !isMaxLevel.value && !hasDependencies.value) {
    return getButtonClasses()
  } else {
    return 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
  }
})
</script>

<template>
  <div
    class="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-sm overflow-hidden border transition-all duration-200 hover:shadow-md"
    :class="[
      getBorderColorClass(),
      { 'opacity-75': !canAfford || isMaxLevel || hasDependencies }
    ]">
    <!-- Compact layout -->
    <div class="p-2.5">
      <div class="flex justify-between items-center mb-1.5">
        <div class="flex items-center">
          <span :class="[upgrade.icon, 'text-lg mr-1.5', getIconColorClass()]"></span>
          <h3 class="font-medium text-sm" :class="getTitleColorClass()">{{ upgrade.name }}</h3>
        </div>
        <div class="text-xs font-medium px-1.5 py-0.5 rounded" :class="getLevelBadgeClasses()">
          Lv. {{ formattedLevel }}<span v-if="upgrade.maxLevel">/{{ formattedMaxLevel }}</span>
        </div>
      </div>

      <p class="text-xs mb-2" :class="getDescriptionColorClass()">{{ upgrade.description }}</p>

      <div class="flex justify-between items-center">
        <div class="text-xs" :class="getEffectColorClass()">
          <span v-if="props.upgrade.level.gt(0)">Effect: {{ formattedEffect }}</span>
        </div>

        <HoldableButton @action="purchaseUpgrade" :disabled="!canAfford || isMaxLevel || hasDependencies"
          class="py-1 px-2 rounded text-xs font-medium transition-colors" :class="buttonClasses">
          <span v-if="isMaxLevel">Max</span>
          <template v-else>
            {{ formattedCost }} EP
          </template>
        </HoldableButton>
      </div>

      <div v-if="hasDependencies" class="text-xs text-red-500 dark:text-red-400 mt-1">
        {{ dependencyMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrestigeStore } from '@/stores/prestigeStore'
import type { EvolutionUpgrade } from '@/stores/prestigeStore'
import { formatDecimal } from '@/utils/decimalUtils'
import HoldableButton from '@/components/HoldableButton.vue'
import { useGeneratorStore } from '@/stores/generatorStore'

const props = defineProps<{
    upgrade: EvolutionUpgrade
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
    // Convert to percentage increase
    const percentage = (effect.toNumber() - 1) * 100
    return `+${percentage.toFixed(0)}%`
})

const canAfford = computed(() => {
    return prestigeStore.evolutionPoints.gte(props.upgrade.cost)
})

const isMaxLevel = computed(() => {
    if (!props.upgrade.maxLevel) return false
    return props.upgrade.level.gte(props.upgrade.maxLevel)
})

// Check if this upgrade has dependencies that aren't met
const hasMissingDependency = computed(() => {
    if (props.upgrade.id === 'unlockHivemind') {
        // Check if Mega Colony upgrade has been purchased
        const megaColonyUpgrade = prestigeStore.evolutionUpgrades.find(u => u.id === 'unlockMegacolony')
        if (!megaColonyUpgrade || megaColonyUpgrade.level.eq(0)) {
            return true // Missing Mega Colony upgrade
        }

        // Also check if player has at least one Mega Colony
        const generatorStore = useGeneratorStore()
        const megacolony = generatorStore.getGenerator('megacolony')
        if (!megacolony || megacolony.count.eq(0)) {
            return true // Missing Mega Colony generator
        }
    } else if (props.upgrade.id === 'unlockAntopolis') {
        // Check if Hive Mind upgrade has been purchased
        const hiveMindUpgrade = prestigeStore.evolutionUpgrades.find(u => u.id === 'unlockHivemind')
        if (!hiveMindUpgrade || hiveMindUpgrade.level.eq(0)) {
            return true // Missing Hive Mind upgrade
        }

        // Also check if player has at least one Hive Mind
        const generatorStore = useGeneratorStore()
        const hivemind = generatorStore.getGenerator('hivemind')
        if (!hivemind || hivemind.count.eq(0)) {
            return true // Missing Hive Mind generator
        }
    }
    return false
})

// Get dependency message if applicable
const dependencyMessage = computed(() => {
    if (props.upgrade.id === 'unlockHivemind') {
        const generatorStore = useGeneratorStore()
        const megacolony = generatorStore.getGenerator('megacolony')
        if (!megacolony || megacolony.count.eq(0)) {
            return 'Requires at least one Mega Colony'
        }
        return 'Requires Mega Colony Research'
    } else if (props.upgrade.id === 'unlockAntopolis') {
        const generatorStore = useGeneratorStore()
        const hivemind = generatorStore.getGenerator('hivemind')
        if (!hivemind || hivemind.count.eq(0)) {
            return 'Requires at least one Hive Mind'
        }
        return 'Requires Hive Mind Research'
    }
    return ''
})

// Methods
const purchaseUpgrade = () => {
    if (canAfford.value && !isMaxLevel.value && !hasMissingDependency.value) {
        prestigeStore.purchaseUpgrade(props.upgrade.id)
    }
}
</script>

<template>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-purple-200 transition-all duration-200"
        :class="{ 'opacity-75': !canAfford || isMaxLevel || hasMissingDependency }">
        <!-- Compact layout -->
        <div class="p-2">
            <div class="flex justify-between items-center mb-1">
                <div class="flex items-center">
                    <span :class="[upgrade.icon, 'text-lg mr-1.5 text-purple-600']"></span>
                    <h3 class="font-medium text-sm text-purple-900">{{ upgrade.name }}</h3>
                </div>
                <div class="text-xs font-medium bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                    Lv. {{ formattedLevel }}<span v-if="upgrade.maxLevel">/{{ formattedMaxLevel }}</span>
                </div>
            </div>

            <p class="text-xs text-purple-700 mb-1.5">{{ upgrade.description }}</p>

            <div class="flex justify-between items-center">
                <div class="text-xs text-purple-600">
                    <span v-if="props.upgrade.level.gt(0)">Effect: {{ formattedEffect }}</span>
                </div>

                <HoldableButton @action="purchaseUpgrade" :disabled="!canAfford || isMaxLevel || hasMissingDependency"
                    class="py-1 px-2 rounded text-xs font-medium transition-colors"
                    :class="canAfford && !isMaxLevel && !hasMissingDependency
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'">
                    <span v-if="isMaxLevel">Max</span>
                    <template v-else>
                        {{ formattedCost }} EP
                    </template>
                </HoldableButton>
            </div>

            <div v-if="hasMissingDependency" class="text-xs text-red-500 mt-1">
                {{ dependencyMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrestigeStore } from '@/stores/prestigeStore'
import type { EvolutionUpgrade } from '@/stores/prestigeStore'
import { formatDecimal, formatPercentage } from '@/utils/decimalUtils'
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

    // Handle special cases for different upgrade types
    if (props.upgrade.id === 'exponentialGrowth' || props.upgrade.id === 'compoundEvolution') {
        // For exponential upgrades, show the actual multiplier
        return `${formatDecimal(effect, 2)}x`
    } else if (props.upgrade.id === 'startingFood') {
        // For starting food, show the actual multiplier
        return `${formatDecimal(effect, 0)}x`
    } else if (props.upgrade.id === 'prestigeAcceleration' ||
        props.upgrade.id.startsWith('auto') ||
        props.upgrade.id === 'bulkAutomation') {
        // For automation upgrades, show the actual value
        return `${formatDecimal(effect, 0)}`
    } else if (props.upgrade.id === 'cycleTimeReduction') {
        // For cycle time reduction, show seconds
        return `${formatDecimal(effect, 1)}s`
    } else {
        // For percentage-based upgrades, convert to percentage
        const percentage = (effect.toNumber() - 1) * 100
        if (percentage >= 1000) {
            return `+${formatPercentage(percentage)}`
        } else {
            return `+${percentage.toFixed(0)}%`
        }
    }
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

// Helper methods for styling based on category
const getBorderColorClass = () => {
    switch (props.upgrade.category) {
        case 'production': return 'border-purple-200'
        case 'efficiency': return 'border-blue-200'
        case 'automation': return 'border-red-200'
        case 'research': return 'border-amber-200'
        case 'synergy': return 'border-green-200'
        case 'prestige': return 'border-indigo-200'
        default: return 'border-gray-200'
    }
}

const getIconColorClass = () => {
    switch (props.upgrade.category) {
        case 'production': return 'text-purple-600'
        case 'efficiency': return 'text-blue-600'
        case 'automation': return 'text-red-600'
        case 'research': return 'text-amber-600'
        case 'synergy': return 'text-green-600'
        case 'prestige': return 'text-indigo-600'
        default: return 'text-gray-600'
    }
}

const getTitleColorClass = () => {
    switch (props.upgrade.category) {
        case 'production': return 'text-purple-900'
        case 'efficiency': return 'text-blue-900'
        case 'automation': return 'text-red-900'
        case 'research': return 'text-amber-900'
        case 'synergy': return 'text-green-900'
        case 'prestige': return 'text-indigo-900'
        default: return 'text-gray-900'
    }
}

const getDescriptionColorClass = () => {
    switch (props.upgrade.category) {
        case 'production': return 'text-purple-700'
        case 'efficiency': return 'text-blue-700'
        case 'automation': return 'text-red-700'
        case 'research': return 'text-amber-700'
        case 'synergy': return 'text-green-700'
        case 'prestige': return 'text-indigo-700'
        default: return 'text-gray-700'
    }
}

const getEffectColorClass = () => {
    switch (props.upgrade.category) {
        case 'production': return 'text-purple-600'
        case 'efficiency': return 'text-blue-600'
        case 'automation': return 'text-red-600'
        case 'research': return 'text-amber-600'
        case 'synergy': return 'text-green-600'
        case 'prestige': return 'text-indigo-600'
        default: return 'text-gray-600'
    }
}

const getLevelBadgeClasses = () => {
    switch (props.upgrade.category) {
        case 'production': return 'bg-purple-100 text-purple-800'
        case 'efficiency': return 'bg-blue-100 text-blue-800'
        case 'automation': return 'bg-red-100 text-red-800'
        case 'research': return 'bg-amber-100 text-amber-800'
        case 'synergy': return 'bg-green-100 text-green-800'
        case 'prestige': return 'bg-indigo-100 text-indigo-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const getButtonClasses = () => {
    switch (props.upgrade.category) {
        case 'production': return 'bg-purple-600 hover:bg-purple-700 text-white'
        case 'efficiency': return 'bg-blue-600 hover:bg-blue-700 text-white'
        case 'automation': return 'bg-red-600 hover:bg-red-700 text-white'
        case 'research': return 'bg-amber-600 hover:bg-amber-700 text-white'
        case 'synergy': return 'bg-green-600 hover:bg-green-700 text-white'
        case 'prestige': return 'bg-indigo-600 hover:bg-indigo-700 text-white'
        default: return 'bg-gray-600 hover:bg-gray-700 text-white'
    }
}
</script>

<template>
    <div class="bg-white/90 rounded-lg shadow-sm overflow-hidden border transition-all duration-200 hover:shadow-md"
        :class="[
            getBorderColorClass(),
            { 'opacity-75': !canAfford || isMaxLevel || hasMissingDependency }
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

                <HoldableButton @action="purchaseUpgrade" :disabled="!canAfford || isMaxLevel || hasMissingDependency"
                    class="py-1 px-2 rounded text-xs font-medium transition-colors" :class="canAfford && !isMaxLevel && !hasMissingDependency
                        ? getButtonClasses()
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

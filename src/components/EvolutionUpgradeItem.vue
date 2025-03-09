<script setup lang="ts">
import { computed } from 'vue'
import { usePrestigeStore } from '@/stores/prestigeStore'
import type { EvolutionUpgrade } from '@/stores/prestigeStore'
import { formatDecimal } from '@/utils/decimalUtils'

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

// Methods
const purchaseUpgrade = () => {
    if (canAfford.value && !isMaxLevel.value) {
        prestigeStore.purchaseUpgrade(props.upgrade.id)
    }
}
</script>

<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 transition-all duration-200"
        :class="{ 'opacity-75': !canAfford || isMaxLevel }">
        <!-- Adaptation header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-500 p-3 flex items-center justify-between text-white">
            <div class="flex items-center">
                <span :class="[upgrade.icon, 'text-2xl mr-2 text-purple-200']"></span>
                <h3 class="font-bold">{{ upgrade.name }}</h3>
            </div>
            <div class="text-sm font-medium bg-purple-700/30 px-2 py-0.5 rounded">
                Lv. {{ formattedLevel }}/{{ formattedMaxLevel }}
            </div>
        </div>

        <!-- Adaptation details -->
        <div class="p-3 text-purple-900">
            <p class="text-sm mb-2">{{ upgrade.description }}</p>

            <div class="text-xs text-purple-700 mb-3">
                <div class="flex justify-between mb-1">
                    <span>Current Effect:</span>
                    <span>{{ formattedEffect }}</span>
                </div>
            </div>

            <!-- Buy button -->
            <button @click="purchaseUpgrade"
                class="w-full py-2 px-4 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                :class="canAfford && !isMaxLevel ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
                :disabled="!canAfford || isMaxLevel">
                <span v-if="isMaxLevel">Max Level</span>
                <template v-else>
                    <span class="i-heroicons-sparkles text-lg mr-1.5"></span>
                    Adapt for {{ formattedCost }} EP
                </template>
            </button>
        </div>
    </div>
</template>

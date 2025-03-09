<script setup lang="ts">
import { computed } from 'vue'
import { useGeneratorUpgradeStore } from '@/stores/generatorUpgradeStore'
import { useGeneratorStore } from '@/stores/generatorStore'

const props = defineProps({
    generatorId: {
        type: String,
        required: true
    }
})

const generatorUpgradeStore = useGeneratorUpgradeStore()
const generatorStore = useGeneratorStore()

// Get the generator
const generator = computed(() => {
    return generatorStore.getGenerator(props.generatorId)
})

// Get level progress percentage
const progressPercentage = computed(() => {
    return generatorUpgradeStore.formatProgressPercentage(props.generatorId)
})

// Get level requirement description
const levelRequirementDescription = computed(() => {
    switch (props.generatorId) {
        case 'worker':
            return 'Levels up based on ticks in current evolution'
        case 'nursery':
            return 'Levels up based on amount of food gained'
        case 'queenChamber':
            return 'Levels up based on total manual purchases'
        case 'colony':
            return 'Levels up based on amount of upgrades purchased'
        default:
            return ''
    }
})

// Get level requirement value
const levelRequirementValue = computed(() => {
    return generatorUpgradeStore.formatNextLevelRequirement(props.generatorId)
})

// Get level requirement unit
const levelRequirementUnit = computed(() => {
    switch (props.generatorId) {
        case 'worker':
            return 'ticks'
        case 'nursery':
            return 'food'
        case 'queenChamber':
            return 'purchases'
        case 'colony':
            return 'upgrades'
        default:
            return ''
    }
})
</script>

<template>
    <div v-if="generator" class="bg-white/80 p-3 rounded-lg shadow-sm border border-amber-200">
        <div class="flex justify-between items-start">
            <div class="flex items-center">
                <span :class="generator.icon + ' text-amber-600 mr-2'"></span>
                <span class="font-medium">{{ generator.name }} Level</span>
            </div>

            <div class="text-right">
                <div class="text-sm font-bold text-amber-700">
                    Level {{ generatorUpgradeStore.formatLevel(generatorId) }}
                </div>
                <div class="text-xs text-amber-700">
                    {{ generatorUpgradeStore.formatPoints(generatorId) }} points available
                </div>
            </div>
        </div>

        <div class="mt-3">
            <div class="text-xs text-gray-600 mb-1">{{ levelRequirementDescription }}</div>

            <!-- Progress bar -->
            <div class="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 transition-all duration-300 ease-out"
                    :style="{ width: `${progressPercentage}%` }"></div>
            </div>

            <div class="text-xs text-amber-700 mt-1 flex justify-between">
                <span>Progress: {{ progressPercentage }}%</span>
                <span>Next level: {{ levelRequirementValue }} {{ levelRequirementUnit }}</span>
            </div>
        </div>
    </div>
</template>

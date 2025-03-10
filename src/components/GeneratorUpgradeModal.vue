<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGeneratorUpgradeStore } from '@/stores/generatorUpgradeStore'
import GeneratorUpgradeItem from '@/components/GeneratorUpgradeItem.vue'
import type { GeneratorId } from '@/types/generators'

const props = defineProps<{
    show: boolean
    selectedGenerator: GeneratorId | null
    generatorInfo: Record<GeneratorId, { name: string; icon: string }>
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const generatorUpgradeStore = useGeneratorUpgradeStore()
const isClosing = ref(false)

// Get upgrades for selected generator
const selectedGeneratorUpgrades = computed(() => {
    if (!props.selectedGenerator) return []
    return generatorUpgradeStore.getUpgradesForGenerator(props.selectedGenerator)
})

// Handle close with animation
const handleClose = () => {
    isClosing.value = true
    setTimeout(() => {
        emit('close')
        isClosing.value = false
    }, 250) // Match this with the animation duration
}

// Get level requirement description
const levelRequirementDescription = computed(() => {
    if (!props.selectedGenerator) return ''
    switch (props.selectedGenerator) {
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

// Get level requirement unit
const levelRequirementUnit = computed(() => {
    if (!props.selectedGenerator) return ''
    switch (props.selectedGenerator) {
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

// Reset isClosing when show changes
watch(() => props.show, (newValue) => {
    if (!newValue) {
        isClosing.value = false
    }
})
</script>

<template>
    <div v-if="show && selectedGenerator" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 animate-fadeIn" :class="{ 'animate-fadeOut': isClosing }"></div>

        <!-- Modal Content -->
        <div class="relative w-full h-full flex flex-col overflow-hidden animate-slideUp"
            :class="{ 'animate-slideDown': isClosing }">
            <!-- Header -->
            <div class="bg-gradient-to-r from-amber-600 to-amber-500 p-3 shadow-md flex justify-between items-center">
                <h3 class="text-lg font-bold flex items-center text-white">
                    <span :class="[generatorInfo[selectedGenerator]?.icon, 'text-white mr-2 text-xl']"></span>
                    {{ generatorInfo[selectedGenerator]?.name }} Adaptations
                </h3>
                <button @click="handleClose" class="text-white hover:text-amber-200 transition-colors p-2">
                    <span class="i-heroicons-x-mark text-xl"></span>
                </button>
            </div>

            <!-- Content -->
            <div class="flex-grow overflow-y-auto bg-amber-50/95 p-4">
                <!-- Stats Card -->
                <div
                    class="bg-white rounded-lg shadow-md border border-amber-200 p-3 mb-4 animate-fadeIn animation-delay-100">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-sm text-amber-800 font-medium">Current Level</div>
                            <div class="text-xl font-bold text-amber-800 flex items-center">
                                <span class="i-heroicons-star text-amber-500 mr-1"></span>
                                Level {{ generatorUpgradeStore.generatorLevels[selectedGenerator]?.toNumber() }}
                            </div>
                        </div>
                        <div>
                            <div class="text-sm text-amber-800 font-medium">Available Points</div>
                            <div class="text-xl font-bold text-amber-800 flex items-center">
                                <span class="i-heroicons-bolt text-amber-500 mr-1"></span>
                                {{ generatorUpgradeStore.formatPoints(selectedGenerator) }} points
                            </div>
                        </div>
                    </div>

                    <div class="mt-3">
                        <div class="text-sm text-amber-800 font-medium mb-1 flex justify-between">
                            <span>Progress to Next Level</span>
                            <span>{{ generatorUpgradeStore.formatProgressPercentage(selectedGenerator) }}%</span>
                        </div>
                        <div class="h-2.5 bg-amber-100 rounded-full overflow-hidden">
                            <div class="h-full bg-amber-500 transition-all duration-300 ease-out"
                                :style="{ width: `${generatorUpgradeStore.formatProgressPercentage(selectedGenerator)}%` }">
                            </div>
                        </div>
                        <div class="flex justify-between mt-1 text-xs text-amber-700">
                            <span>Current: {{ generatorUpgradeStore.levelProgress[selectedGenerator]?.toFixed(0)
                                }}</span>
                            <span>Next: {{ generatorUpgradeStore.formatNextLevelRequirement(selectedGenerator) }} {{
                                levelRequirementUnit }}</span>
                        </div>
                    </div>

                    <!-- Level Requirement Description -->
                    <div class="mt-3 pt-3 border-t border-amber-200">
                        <div class="text-xs text-amber-700">{{ levelRequirementDescription }}</div>
                    </div>
                </div>
                <!-- Upgrades -->
                <h4
                    class="text-base font-bold text-amber-800 mb-3 flex items-center animate-fadeIn animation-delay-100">
                    <span class="i-heroicons-adjustments-horizontal text-amber-600 mr-2"></span>
                    Available Adaptations
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn animation-delay-150">
                    <GeneratorUpgradeItem v-for="upgrade in selectedGeneratorUpgrades" :key="upgrade.id"
                        :upgradeId="upgrade.id" />
                </div>
            </div>

            <!-- Footer -->
            <div class="bg-white p-3 shadow-md flex justify-end">
                <button @click="handleClose"
                    class="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium flex items-center transition-all duration-200 active:scale-95">
                    <span class="i-heroicons-arrow-left text-base mr-1"></span>
                    Return to Colony
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Animation keyframes */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(15px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

@keyframes slideDown {
    from {
        transform: translateY(0);
        opacity: 1;
    }

    to {
        transform: translateY(15px);
        opacity: 0;
    }
}

/* Animation classes */
.animate-fadeIn {
    animation: fadeIn 0.25s ease-out forwards;
}

.animate-slideUp {
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fadeOut {
    animation: fadeOut 0.25s ease-out forwards;
}

.animate-slideDown {
    animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Animation delays */
.animation-delay-100 {
    animation-delay: 100ms;
}

.animation-delay-150 {
    animation-delay: 150ms;
}

/* Scale effect for buttons */
.active\:scale-95:active {
    transform: scale(0.95);
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGeneratorStore } from '@/stores/generatorStore'
import { useGeneratorUpgradeStore } from '@/stores/generatorUpgradeStore'
import type { GeneratorId } from '@/types/generators'

const props = defineProps<{
    className?: string
}>()

const emit = defineEmits<{
    (e: 'showInfo'): void
}>()

const generatorStore = useGeneratorStore()
const generatorUpgradeStore = useGeneratorUpgradeStore()

// Get total points available
const totalPointsAvailable = computed(() => {
    let total = 0
    Object.values(generatorUpgradeStore.generatorPoints).forEach(points => {
        total += points.toNumber()
    })
    return total
})

// Generator names and icons mapping
const generatorInfo: Record<GeneratorId, { name: string; icon: string }> = {
    worker: { name: 'Worker Ants', icon: 'i-heroicons-bug-ant' },
    nursery: { name: 'Nursery', icon: 'i-heroicons-home-modern' },
    queenChamber: { name: 'Queen Chamber', icon: 'i-heroicons-crown' },
    colony: { name: 'Colony', icon: 'i-heroicons-building-storefront' },
    megacolony: { name: 'Mega Colony', icon: 'i-heroicons-building-office-2' },
    hivemind: { name: 'Hive Mind', icon: 'i-heroicons-cpu-chip' },
    antopolis: { name: 'Antopolis', icon: 'i-heroicons-building-library' }
}

// Get unlocked generator IDs
const unlockedGeneratorIds = computed(() => {
    return generatorStore.unlockedGenerators.map(generator => generator.id as GeneratorId)
})

// Get highest level generator
const highestLevelGenerator = computed(() => {
    let highest = { id: 'worker' as GeneratorId, level: 0 }

    unlockedGeneratorIds.value.forEach(id => {
        const level = generatorUpgradeStore.generatorLevels[id]?.toNumber() || 0
        if (level > highest.level) {
            highest = { id, level }
        }
    })

    return highest
})
</script>

<template>
    <section :class="['bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-3 shadow-md', className]">
        <h2 class="text-base font-bold mb-2 flex items-center justify-between">
            <div class="flex items-center">
                <span class="i-heroicons-star text-amber-700 mr-2"></span>
                Adaptation Summary
            </div>
            <button @click="emit('showInfo')"
                class="w-5 h-5 rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center text-amber-700 transition-colors">
                <span class="i-heroicons-question-mark-circle text-base"></span>
            </button>
        </h2>

        <div class="space-y-2">
            <div class="grid grid-cols-2 gap-2">
                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200">
                    <div class="text-xs text-amber-700 font-medium">Total Points</div>
                    <div class="text-sm font-bold flex items-center">
                        <span class="i-heroicons-star text-amber-600 mr-1 text-xs"></span>
                        {{ totalPointsAvailable }}
                    </div>
                </div>

                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200">
                    <div class="text-xs text-amber-700 font-medium">Ant Types</div>
                    <div class="text-sm font-bold flex items-center">
                        <span class="i-heroicons-bug-ant text-amber-600 mr-1 text-xs"></span>
                        {{ generatorStore.unlockedGenerators.length }}
                    </div>
                </div>
            </div>

            <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200">
                <div class="text-xs text-amber-700 font-medium">Highest Level</div>
                <div class="grid grid-cols-2 gap-1 mt-1">
                    <div class="text-xs font-medium flex items-center">
                        <span class="i-heroicons-trophy text-amber-600 mr-1 text-xs"></span>
                        {{ generatorInfo[highestLevelGenerator.id]?.name }}
                    </div>
                    <div class="text-xs font-medium flex items-center justify-end">
                        Level {{ highestLevelGenerator.level }}
                    </div>
                </div>
            </div>

            <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-amber-200">
                <div class="text-xs text-amber-700 font-medium">Adaptation Benefits</div>
                <div class="text-xs text-amber-600 mt-1">
                    • Increased production efficiency
                    <br />
                    • Resource cost reduction
                    <br />
                    • Special abilities unlocked
                </div>
            </div>
        </div>
    </section>
</template>

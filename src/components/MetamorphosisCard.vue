<script setup lang="ts">
import { computed } from 'vue'
import { usePrestigeStore } from '@/stores/prestigeStore'
import { formatDecimal } from '@/utils/decimalUtils'

const props = defineProps<{
    className?: string
}>()

const prestigeStore = usePrestigeStore()
</script>

<template>
    <section :class="['bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 shadow-md', className]">
        <h2 class="text-base font-bold mb-2 flex items-center">
            <span class="i-heroicons-sparkles text-purple-700 mr-2"></span>
            Metamorphosis
        </h2>

        <div class="space-y-2">
            <div class="grid grid-cols-2 gap-2">
                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200">
                    <div class="text-xs text-purple-700 font-medium">Metamorphosis Count</div>
                    <div class="text-sm font-bold flex items-center">
                        <span class="i-heroicons-sparkles text-purple-600 mr-1 text-xs"></span>
                        {{ prestigeStore.formatEvolutionCount() }}
                    </div>
                </div>

                <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200">
                    <div class="text-xs text-purple-700 font-medium">Evolution Points</div>
                    <div class="text-sm font-bold flex items-center">
                        <span class="i-heroicons-sparkles text-purple-600 mr-1 text-xs"></span>
                        {{ prestigeStore.formatEP() }}
                    </div>
                </div>
            </div>

            <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200">
                <div class="text-xs text-purple-700 font-medium flex justify-between">
                    <span>Foraging Cycles Completed</span>
                    <span>{{ Math.min(100,
                        Math.round((prestigeStore.loopsCompleted.div(prestigeStore.requiredLoops).toNumber() * 100)))
                        }}%</span>
                </div>
                <div class="h-1.5 bg-purple-100 rounded-full mt-1 overflow-hidden">
                    <div class="h-full bg-purple-500 transition-all duration-300 ease-out"
                        :style="{ width: `${Math.min(100, (prestigeStore.loopsCompleted.div(prestigeStore.requiredLoops).toNumber() * 100))}%` }">
                    </div>
                </div>
                <div class="text-xs text-purple-600 mt-1">
                    {{ prestigeStore.formatLoopsCompleted() }} / {{ formatDecimal(prestigeStore.requiredLoops, 1) }}
                    cycles
                </div>
            </div>

            <div class="bg-white/80 p-2 rounded-lg shadow-sm border border-purple-200">
                <div class="text-xs text-purple-700 font-medium">Cycle Requirements</div>
                <div class="grid grid-cols-2 gap-1 mt-1">
                    <div class="text-xs font-medium flex items-center">
                        <span class="i-heroicons-clock text-purple-600 mr-1 text-xs"></span>
                        {{ formatDecimal(prestigeStore.ticksPerLoop, 1) }} trips
                    </div>
                    <div class="text-xs font-medium flex items-center">
                        <span class="i-heroicons-cake text-purple-600 mr-1 text-xs"></span>
                        {{ formatDecimal(prestigeStore.foodForNextLoop, 0) }} food
                    </div>
                </div>
            </div>

            <router-link to="/upgrades"
                class="block w-full px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-medium text-center">
                View Evolutionary Adaptations
            </router-link>
        </div>
    </section>
</template>

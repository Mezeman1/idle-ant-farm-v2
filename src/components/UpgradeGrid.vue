<script setup lang="ts">
import { computed } from 'vue'
import EvolutionUpgradeItem from '@/components/EvolutionUpgradeItem.vue'
import { usePrestigeStore } from '@/stores/prestigeStore'

const props = defineProps<{
    category: string
    showMaxed: boolean
    showAffordable: boolean
}>()

const emit = defineEmits<{
    (e: 'resetFilters'): void
}>()

const prestigeStore = usePrestigeStore()
const evolutionUpgrades = computed(() => prestigeStore.evolutionUpgrades)

// Group upgrades by category
const upgradeCategories = computed(() => {
    const categories = {
        production: [] as typeof evolutionUpgrades.value,
        efficiency: [] as typeof evolutionUpgrades.value,
        automation: [] as typeof evolutionUpgrades.value,
        research: [] as typeof evolutionUpgrades.value,
        synergy: [] as typeof evolutionUpgrades.value,
        prestige: [] as typeof evolutionUpgrades.value,
    }

    evolutionUpgrades.value.forEach(upgrade => {
        // Ensure the category exists in our categories object
        const category = upgrade.category as keyof typeof categories
        if (categories[category]) {
            categories[category].push(upgrade)
        }
    })

    return categories
})

// Filter upgrades based on category and filters
const filteredUpgrades = computed(() => {
    // Handle the 'all' category by combining all upgrades
    let upgrades = [] as typeof evolutionUpgrades.value

    if (props.category === 'all') {
        // Combine all categories
        Object.values(upgradeCategories.value).forEach(categoryUpgrades => {
            upgrades = [...upgrades, ...categoryUpgrades]
        })
    } else if (props.category in upgradeCategories.value) {
        // Get upgrades for the specific category
        upgrades = upgradeCategories.value[props.category as keyof typeof upgradeCategories.value] || []
    }

    // Apply filters
    return upgrades.filter(upgrade => {
        // Maxed filter
        const isMaxed = !props.showMaxed ||
            (upgrade.maxLevel && upgrade.level.gte(upgrade.maxLevel))

        // Affordable filter
        const isAffordable = !props.showAffordable ||
            prestigeStore.evolutionPoints.gte(upgrade.cost)

        return isMaxed && isAffordable
    })
})

// Get count of upgrades for a category
const categoryCount = computed(() => {
    if (props.category === 'all') {
        let count = 0
        Object.values(upgradeCategories.value).forEach(upgrades => {
            count += upgrades.length
        })
        return count
    }

    return upgradeCategories.value[props.category as keyof typeof upgradeCategories.value]?.length || 0
})

// Expose the count to the parent component
defineExpose({
    count: categoryCount
})
</script>

<template>
    <div class="space-y-4">
        <div v-if="filteredUpgrades.length === 0" class="text-center py-8">
            <div class="text-gray-400 i-heroicons-face-frown text-4xl mx-auto mb-2"></div>
            <p class="text-gray-600">No upgrades match your filters</p>
            <button @click="emit('resetFilters')" class="mt-2 text-purple-600 hover:text-purple-800 text-sm">
                Reset filters
            </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <EvolutionUpgradeItem v-for="upgrade in filteredUpgrades" :key="upgrade.id" :upgrade="upgrade" />
        </div>
    </div>
</template>

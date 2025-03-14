<script setup lang="ts">
const prestigeStore = usePrestigeStore()
const evolutionUpgrades = computed(() => prestigeStore.evolutionUpgrades)

// Group upgrades by category for counting
const upgradeCategories = computed(() => {
  const categories: Record<string, typeof evolutionUpgrades.value> = {
    production: [],
    efficiency: [],
    automation: [],
    research: [],
    synergy: [],
    prestige: [],
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

// Function to get category count
const getCategoryCount = (category: string): number => {
  if (category === 'all') {
    let count = 0
    Object.values(upgradeCategories.value).forEach(upgrades => {
      count += upgrades.length
    })
    return count
  }

  return upgradeCategories.value[category]?.length || 0
}

// Tabbed interface state
const activeTab = ref('all')
const showMaxed = ref(false)
const showAffordable = ref(false)
const showUnlocked = ref(true)

// Confirmation dialog state
const showConfirmation = ref(false)

// About evolution dialog state
const showAboutEvolution = ref(false)

// Show confirmation dialog
const confirmEvolution = () => {
  if (prestigeStore.canEvolve) {
    showConfirmation.value = true
  }
}

// Perform evolution
const performEvolution = () => {
  if (prestigeStore.canEvolve) {
    prestigeStore.evolve()
    showConfirmation.value = false
  }
}

// Cancel evolution
const cancelEvolution = () => {
  showConfirmation.value = false
}

// Toggle about evolution dialog
const toggleAboutEvolution = () => {
  showAboutEvolution.value = !showAboutEvolution.value
}

// Reset filters
const resetFilters = () => {
  showMaxed.value = false
  showAffordable.value = false
  showUnlocked.value = true
}

// Available categories
const categories = ['all', 'production', 'efficiency', 'automation', 'research', 'synergy', 'prestige']
</script>

<template>
  <div class="space-y-4">
    <!-- Evolution Status -->
    <EvolutionStatusSection :showAboutEvolution="showAboutEvolution" @toggleAboutEvolution="toggleAboutEvolution"
      @confirmEvolution="confirmEvolution" />

    <!-- Evolution Upgrades -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
      <!-- Tabs Navigation -->
      <div class="sticky top-0 z-20 bg-white dark:bg-gray-800">
        <UpgradeTabsNavigation v-model:activeTab="activeTab" :categories="categories">
          <template #badge="{ category }">
            <span v-if="category !== 'all'"
              class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
              {{ getCategoryCount(category) }}
            </span>
          </template>
        </UpgradeTabsNavigation>
      </div>

      <!-- Upgrades Content -->
      <div class="p-4">
        <!-- Filters -->
        <UpgradeFilters v-model:showMaxed="showMaxed" v-model:showAffordable="showAffordable"
          v-model:showUnlocked="showUnlocked" @resetFilters="resetFilters" />

        <!-- Upgrades Grid -->
        <div v-for="category in categories" :key="`panel-${category}`" :id="`panel-${category}`" role="tabpanel"
          :aria-labelledby="`tab-${category}`" :hidden="activeTab !== category">
          <UpgradeGrid :category="category" :showMaxed="showMaxed" :showAffordable="showAffordable"
            :showUnlocked="showUnlocked" @resetFilters="resetFilters" />
        </div>
      </div>
    </div>

    <!-- Evolution Confirmation Dialog -->
    <EvolutionConfirmationDialog :show="showConfirmation" @confirm="performEvolution" @cancel="cancelEvolution" />

    <!-- About Evolution Dialog -->
    <AboutEvolutionDialog :show="showAboutEvolution" @close="toggleAboutEvolution" />
  </div>
</template>

<style scoped>
/* Animation for active scale */
.transform {
  transition: transform 0.1s ease-in-out;
}

.active\:scale-98:active {
  transform: scale(0.98);
}
</style>

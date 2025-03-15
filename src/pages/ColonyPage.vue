<script setup lang="ts">
import { generatorInfo } from '@/constants/generatorInfo'
import type { GeneratorId } from '@/types/generators'

// Import shared styles
import '@/assets/styles/animations.css'

const generatorStore = useGeneratorStore()

// Get unlocked generators
const unlockedGenerators = computed(() => generatorStore.unlockedGenerators)

// Get unlocked generator IDs for level cards
const unlockedGeneratorIds = computed(() => {
  return unlockedGenerators.value.map(generator => generator.id as GeneratorId)
})

// Selected generator for upgrades
const selectedGenerator = ref<GeneratorId | null>(null)

// Show/hide upgrade modal
const showUpgradeModal = ref(false)

// Open upgrade modal for a specific generator
const openUpgradeModal = (generatorId: GeneratorId) => {
  selectedGenerator.value = generatorId
  showUpgradeModal.value = true
}

// Close upgrade modal
const closeUpgradeModal = () => {
  showUpgradeModal.value = false
}

// Show/hide generator info dialog
const showGeneratorInfo = ref(false)
const toggleGeneratorInfo = () => {
  showGeneratorInfo.value = !showGeneratorInfo.value
}
</script>

<template>
  <div class="space-y-4">
    <!-- Main Dashboard - Colony Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Colony Status -->
      <ColonyStatusCard className="md:col-span-2" />

      <!-- Right Column: Adaptation Summary -->
      <AdaptationSummaryCard @show-info="toggleGeneratorInfo" />
    </div>

    <!-- Generator Levels -->
    <section
      class="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-3 shadow-md dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-50">
      <h2 class="text-base font-bold mb-2 flex items-center">
        <span class="i-heroicons-star text-amber-700 mr-2"></span>
        Ant Specialization Levels
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AntSpecializationCard v-for="generatorId in unlockedGeneratorIds" :key="generatorId"
          :generator-id="generatorId" :name="generatorInfo[generatorId]?.name" :icon="generatorInfo[generatorId]?.icon"
          @upgrade="openUpgradeModal" />
      </div>
    </section>

    <!-- Generator Info Dialog -->
    <GeneratorInfoDialog :show="showGeneratorInfo" @close="toggleGeneratorInfo" />

    <!-- Generator Upgrade Modal -->
    <GeneratorUpgradeModal :show="showUpgradeModal" :selected-generator="selectedGenerator"
      :generator-info="generatorInfo" @close="closeUpgradeModal" />

    <ScrollToTopButton :threshold="400" />

  </div>
</template>

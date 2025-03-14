<script setup lang="ts">
// Import shared styles
import '@/assets/styles/animations.css'
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'

const gameStore = useGameStore()
const generatorStore = useGeneratorStore()
const prestigeStore = usePrestigeStore()
</script>

<template>
  <div class="space-y-4">
    <!-- Main Dashboard - Combined Colony Status and Evolution Status -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Left Column: Colony Status -->
      <HomeColonyStatusCard className="md:col-span-2" />

      <!-- Right Column: Evolution Status -->
      <MetamorphosisCard />
    </div>

    <!-- Generators -->
    <AntHierarchySection />

    <!-- Scroll to top button -->
    <ScrollToTopButton :threshold="400" />
  </div>
</template>

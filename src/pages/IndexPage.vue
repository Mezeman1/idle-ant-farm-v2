<script setup lang="ts">
// Home page for the idle ant farm game
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useGeneratorStore } from '@/stores/generatorStore'
import { usePrestigeStore } from '@/stores/prestigeStore'
import HomeColonyStatusCard from '@/components/HomeColonyStatusCard.vue'
import MetamorphosisCard from '@/components/MetamorphosisCard.vue'
import AntHierarchySection from '@/components/AntHierarchySection.vue'

// Import shared styles
import '@/assets/styles/animations.css'

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
  </div>
</template>

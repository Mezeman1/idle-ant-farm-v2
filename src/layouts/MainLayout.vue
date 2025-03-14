<script setup lang="ts">
// Navigation items for the footer
const navItems = ref([
  { name: 'Home', icon: 'i-heroicons-home', route: '/' },
  { name: 'Colony', icon: 'i-heroicons-building-storefront', route: '/colony' },
  { name: 'Upgrades', icon: 'i-heroicons-sparkles', route: '/upgrades' },
  { name: 'Adventure', icon: 'i-heroicons-bolt', route: '/adventure' },
  { name: 'Settings', icon: 'i-heroicons-cog-6-tooth', route: '/settings' },
])

// Game store for progress tracking
const gameStore = useGameStore()
const generatorStore = useGeneratorStore()
const prestigeStore = usePrestigeStore()

// Animation frame handling for smooth progress updates
let animationFrameId: number | null = null

// Update game progress on each animation frame
const updateGameLoop = () => {
  gameStore.updateProgress()
  animationFrameId = requestAnimationFrame(updateGameLoop)
}

// Start and stop the game loop with component lifecycle
onMounted(() => {
  animationFrameId = requestAnimationFrame(updateGameLoop)
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="flex flex-col h-screen bg-amber-50 text-amber-900 font-sans w-full">
    <!-- Header -->
    <header class="bg-gradient-to-r from-amber-800 to-amber-700 text-amber-50 shadow-lg">
      <!-- Foraging Progress Bar -->
      <div class="w-full h-1.5 bg-amber-900/30 rounded-full overflow-hidden">
        <div class="h-full bg-amber-300 transition-all duration-100 ease-linear"
          :style="{ width: `${gameStore.progressPercentage}%` }"></div>
      </div>

      <!-- Main Header Content -->
      <div class="p-2 md:p-3">
        <!-- Title and Timer Row -->
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-lg md:text-xl font-extrabold tracking-tight">Idle Ant Farm</h1>
          <span class="text-xs bg-amber-900/30 px-2 py-0.5 rounded-full whitespace-nowrap">
            {{ gameStore.timeRemaining }}s
          </span>
        </div>

        <!-- Resources Row -->
        <div class="flex flex-wrap items-center gap-2 md:gap-3">
          <!-- Food -->
          <div class="flex items-center bg-amber-900/20 rounded-full px-2 py-1">
            <span class="i-heroicons-cake text-amber-300 mr-1"></span>
            <span class="text-xs md:text-sm font-medium">{{ generatorStore.formatFood() }}</span>
          </div>

          <!-- Worker Ants -->
          <div class="flex items-center bg-amber-900/20 rounded-full px-2 py-1">
            <span class="i-heroicons-bug-ant text-amber-300 mr-1"></span>
            <span class="text-xs md:text-sm font-medium">{{ generatorStore.formatGeneratorCount('worker') }}</span>
          </div>

          <!-- Progress -->
          <div class="flex items-center bg-amber-900/20 rounded-full px-2 py-1">
            <span class="i-heroicons-arrow-path-rounded-square text-amber-300 mr-1"></span>
            <span class="text-xs md:text-sm font-medium">{{ Math.round(gameStore.progressPercentage) }}%</span>
          </div>

          <!-- Tick Duration -->
          <div class="flex items-center bg-amber-900/20 rounded-full px-2 py-1">
            <span class="i-heroicons-clock text-amber-300 mr-1"></span>
            <span class="text-xs md:text-sm font-medium">{{ gameStore.tickDuration.toFixed(1) }}s/tick</span>
          </div>

          <!-- Food per Trip -->
          <div class="flex items-center bg-amber-900/20 rounded-full px-2 py-1">
            <span class="i-heroicons-arrow-trending-up text-amber-300 mr-1"></span>
            <span class="text-xs md:text-sm font-medium">{{ formatDecimal(generatorStore.foodPerSecond, 1)
            }}/trip</span>
          </div>

          <!-- Evolution Count -->
          <div class="flex items-center bg-amber-900/20 rounded-full px-2 py-1">
            <span class="i-heroicons-sparkles text-amber-300 mr-1"></span>
            <span class="text-xs md:text-sm font-medium">Evo: {{ prestigeStore.formatEvolutionCount() }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content (Scrollable) -->
    <main class="flex-1 overflow-y-auto p-4 pb-6 scroll-smooth">
      <slot></slot>
    </main>

    <!-- Footer Navigation -->
    <footer class="bg-gradient-to-r from-amber-800 to-amber-700 text-amber-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <nav class="flex justify-around items-center">
        <template v-for="item in navItems" :key="item.name">
          <router-link :to="item.route"
            class="flex flex-col items-center py-3 px-2 w-full transition-colors duration-200 select-none" :class="{
              'text-amber-300 border-t-2 border-amber-300 bg-amber-900/20': $route.path === item.route,
              'hover:bg-amber-900/10': $route.path !== item.route
            }">
            <span :class="[item.icon, 'text-xl']"></span>
            <span class="text-xs mt-1 font-medium">{{ item.name }}</span>
          </router-link>
        </template>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
/* Custom scrollbar for the main content */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background-color: rgb(254 243 199);
  /* amber-100 */
}

main::-webkit-scrollbar-thumb {
  background-color: rgb(251 191 36);
  /* amber-400 */
  border-radius: 9999px;
}

main::-webkit-scrollbar-thumb:hover {
  background-color: rgb(245 158 11);
  /* amber-500 */
}
</style>

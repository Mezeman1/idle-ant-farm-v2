<script setup lang="ts">
const adventureStore = useAdventureStore()

// Computed properties for formatted values
const formattedCurrentHealth = computed(() =>
  formatDecimal(adventureStore.currentHealth)
)

const formattedMaxHealth = computed(() =>
  formatDecimal(adventureStore.playerMaxHealth)
)

const formattedDamage = computed(() =>
  formatDecimal(adventureStore.playerDamage)
)

const formattedRegen = computed(() =>
  formatDecimal(adventureStore.playerRegen)
)

// Health percentage for the progress bar
const healthPercentage = computed(() => {
  if (adventureStore.playerMaxHealth.eq(0)) return 0
  return adventureStore.currentHealth
    .div(adventureStore.playerMaxHealth)
    .mul(100)
    .toNumber()
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold mb-2 flex items-center">
      <span class="i-heroicons-shield-exclamation text-red-700 dark:text-red-500 mr-2"></span>
      Adventure
    </h1>

    <!-- Main Dashboard - Player Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Left Column: Player Stats -->
      <section class="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/30 rounded-xl p-3 shadow-md md:col-span-2">
        <h2 class="text-base font-bold mb-2 flex items-center">
          <span class="i-heroicons-user-circle text-red-700 dark:text-red-500 mr-2"></span>
          Player Stats
        </h2>

        <div class="grid grid-cols-3 gap-2">
          <div class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
            <div class="text-xs text-red-700 dark:text-red-400 font-medium">Health</div>
            <div class="text-sm font-bold flex items-center">
              <span class="i-heroicons-heart text-red-600 dark:text-red-500 mr-1 text-xs"></span>
              {{ formattedCurrentHealth }} / {{ formattedMaxHealth }}
            </div>
          </div>

          <div class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
            <div class="text-xs text-red-700 dark:text-red-400 font-medium">Attack Damage</div>
            <div class="text-sm font-bold flex items-center">
              <span class="i-heroicons-bolt text-red-600 dark:text-red-500 mr-1 text-xs"></span>
              {{ formattedDamage }}
            </div>
          </div>

          <div class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
            <div class="text-xs text-red-700 dark:text-red-400 font-medium">Health Regen</div>
            <div class="text-sm font-bold flex items-center">
              <span class="i-heroicons-arrow-path text-red-600 dark:text-red-500 mr-1 text-xs"></span>
              {{ formattedRegen }} / tick
            </div>
          </div>
        </div>

        <!-- Health Bar -->
        <div class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700 mt-2">
          <div class="text-xs text-red-700 dark:text-red-400 font-medium flex justify-between">
            <span>Health</span>
            <span>{{ Math.round(healthPercentage) }}%</span>
          </div>
          <div class="h-2 bg-red-100 dark:bg-red-900/50 rounded-full mt-1 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 transition-all duration-300 ease-out"
              :style="{ width: `${healthPercentage}%` }"></div>
          </div>
          <div class="text-xs text-red-600 dark:text-red-400 mt-1">
            {{ formattedCurrentHealth }} / {{ formattedMaxHealth }}
          </div>
        </div>

        <!-- Status -->
        <div class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700 mt-2">
          <div class="text-xs text-red-700 dark:text-red-400 font-medium">Status</div>
          <div class="text-sm font-bold flex items-center"
            :class="adventureStore.isDead ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'">
            <span :class="adventureStore.isDead ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle'"
              class="mr-1 text-xs"></span>
            {{ adventureStore.isDead ? 'Dead' : 'Alive' }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 mt-2">
          <button @click="adventureStore.regenHealth()"
            class="px-3 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center flex-1">
            <span class="i-heroicons-heart text-base mr-1"></span>
            Heal
          </button>
          <button @click="adventureStore.takeDamage(adventureStore.playerDamage.div(2))"
            class="px-3 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center flex-1">
            <span class="i-heroicons-bolt text-base mr-1"></span>
            Take Damage
          </button>
        </div>
      </section>

      <!-- Right Column: Combat Log -->
      <section class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 shadow-md">
        <h2 class="text-base font-bold mb-2 flex items-center">
          <span class="i-heroicons-document-text text-gray-700 dark:text-gray-300 mr-2"></span>
          Combat Log
        </h2>

        <div class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 h-48 overflow-y-auto">
          <div class="text-xs text-gray-600 dark:text-gray-400">
            <p class="mb-1">• Adventure mode initialized</p>
            <p class="mb-1">• Player ready for combat</p>
            <p class="mb-1">• Use the buttons below to test combat mechanics</p>
          </div>
        </div>

        <div class="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
          <span class="i-heroicons-information-circle text-gray-600 dark:text-gray-400 mr-1 inline-block"></span>
          Combat mechanics are still in development. More features coming soon!
        </div>
      </section>
    </div>

    <!-- Future Combat Features Section -->
    <section class="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center">
        <span class="i-heroicons-map text-blue-700 dark:text-blue-500 mr-2"></span>
        Adventure Map
      </h2>

      <div class="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700 text-center">
        <p class="text-sm text-blue-700 dark:text-blue-400 mb-2">Adventure map is under construction</p>
        <p class="text-xs text-blue-600 dark:text-blue-500">Explore different locations, fight enemies, and collect rewards soon!</p>
      </div>
    </section>
  </div>
</template>

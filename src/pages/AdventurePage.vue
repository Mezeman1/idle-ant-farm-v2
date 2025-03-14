<script setup lang="ts">
import { useAdventureStore } from '@/stores/adventureStore'
import { useBugStore } from '@/stores/bugStore'
import { formatDecimal } from '@/utils/decimalUtils'
import { computed, ref, onMounted, nextTick, watch } from 'vue'

const adventureStore = useAdventureStore()
const gameStore = useGameStore()
const bugStore = useBugStore()
const logContainer = ref<HTMLElement | null>(null)

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

// Enemy stats
const formattedEnemyHealth = computed(() => {
  if (!bugStore.selectedBug) return '0'
  return formatDecimal(bugStore.selectedBug.health)
})

const formattedEnemyMaxHealth = computed(() => {
  if (!bugStore.selectedBug) return '0'
  return formatDecimal(bugStore.selectedBug.maxHealth)
})

const formattedEnemyDamage = computed(() => {
  if (!bugStore.selectedBug) return '0'
  return formatDecimal(bugStore.selectedBug.damage)
})

// Health percentage for the progress bar
const healthPercentage = computed(() => {
  if (adventureStore.playerMaxHealth.eq(0)) return 0
  return adventureStore.currentHealth
    .div(adventureStore.playerMaxHealth)
    .mul(100)
    .toNumber()
})

const enemyHealthPercentage = computed(() => bugStore.getBugHealthPercentage)

const scrollToBottom = async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})

// Watch for new logs and scroll to bottom
watch(() => adventureStore.logs.length, () => {
  scrollToBottom()
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold mb-2 flex items-center">
      <span class="i-heroicons-shield-exclamation text-red-700 dark:text-red-500 mr-2"></span>
      Adventure
    </h1>

    <!-- Adventure Progress Bar -->
    <div
      class="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/30 rounded-xl p-3 shadow-md">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-base font-bold flex items-center">
          <span class="i-heroicons-clock text-red-700 dark:text-red-500 mr-2"></span>
          Adventure Progress
        </h2>
        <span class="text-xs bg-red-900/30 dark:bg-red-950/50 px-2 py-0.5 rounded-full whitespace-nowrap">
          {{ gameStore.adventureTimeRemaining }}s
        </span>
      </div>
      <div class="w-full h-1.5 bg-red-900/30 dark:bg-red-950/50 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 transition-all duration-100 ease-linear"
          :style="{ width: `${gameStore.adventureProgressPercentage}%` }"></div>
      </div>
      <div class="text-xs text-red-600 dark:text-red-400 mt-1">
        {{ gameStore.adventureProgressPercentage }}%
      </div>
    </div>

    <!-- Main Dashboard - Player Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Left Column: Player Stats -->
      <section
        class="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/30 rounded-xl p-3 shadow-md md:col-span-2">
        <h2 class="text-base font-bold mb-2 flex items-center">
          <span class="i-heroicons-user-circle text-red-700 dark:text-red-500 mr-2"></span>
          Player Stats
        </h2>

        <div class="grid grid-cols-3 gap-2">
          <div
            class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
            <div class="text-xs text-red-700 dark:text-red-400 font-medium">Health</div>
            <div class="text-sm font-bold flex items-center">
              <span class="i-heroicons-heart text-red-600 dark:text-red-500 mr-1 text-xs"></span>
              {{ formattedCurrentHealth }} / {{ formattedMaxHealth }}
            </div>
          </div>

          <div
            class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
            <div class="text-xs text-red-700 dark:text-red-400 font-medium">Attack Damage</div>
            <div class="text-sm font-bold flex items-center">
              <span class="i-heroicons-bolt text-red-600 dark:text-red-500 mr-1 text-xs"></span>
              {{ formattedDamage }}
            </div>
          </div>

          <div
            class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
            <div class="text-xs text-red-700 dark:text-red-400 font-medium">Health Regen</div>
            <div class="text-sm font-bold flex items-center">
              <span class="i-heroicons-arrow-path text-red-600 dark:text-red-500 mr-1 text-xs"></span>
              {{ formattedRegen }} / tick
            </div>
          </div>
        </div>

        <!-- Health Bar -->
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700 mt-2">
          <div class="text-xs text-red-700 dark:text-red-400 font-medium flex justify-between">
            <span>Health</span>
            <span>{{ Math.round(healthPercentage) }}%</span>
          </div>
          <div class="h-2 bg-red-100 dark:bg-red-900/50 rounded-full mt-1 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 transition-all duration-300 ease-out"
              :style="{ width: `${healthPercentage}%` }"></div>
          </div>
          <div class="text-xs text-red-600 dark:text-red-400 mt-1">
            {{ formattedCurrentHealth }} / {{ formattedMaxHealth }}
          </div>
        </div>

        <!-- Status -->
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700 mt-2">
          <div class="text-xs text-red-700 dark:text-red-400 font-medium">Status</div>
          <div class="text-sm font-bold flex items-center"
            :class="adventureStore.isDead ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'">
            <span :class="adventureStore.isDead ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle'"
              class="mr-1 text-xs"></span>
            {{ adventureStore.isDead ? 'Dead' : 'Alive' }}
          </div>
        </div>

        <!-- Combat Status -->
        <div v-if="adventureStore.isInCombat && bugStore.selectedBug" class="mt-4">
          <h3 class="text-sm font-bold mb-2 text-red-700 dark:text-red-500">Current Enemy: {{ bugStore.selectedBug.name
          }}</h3>
          <div
            class="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
            <div class="text-xs text-red-700 dark:text-red-400 font-medium">Enemy Health</div>
            <div class="h-2 bg-red-100 dark:bg-red-900/50 rounded-full mt-1 overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 transition-all duration-300 ease-out"
                :style="{ width: `${enemyHealthPercentage}%` }"></div>
            </div>
            <div class="text-xs text-red-600 dark:text-red-400 mt-1">
              {{ formattedEnemyHealth }} / {{ formattedEnemyMaxHealth }}
            </div>
            <div class="text-xs text-red-700 dark:text-red-400 mt-2">Damage: {{ formattedEnemyDamage }}</div>
          </div>
        </div>
      </section>

      <!-- Right Column: Combat Log -->
      <section
        class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 shadow-md">
        <h2 class="text-base font-bold mb-2 flex items-center">
          <span class="i-heroicons-document-text text-gray-700 dark:text-gray-300 mr-2"></span>
          Combat Log
        </h2>

        <div ref="logContainer"
          class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 h-48 overflow-y-auto">
          <div v-if="adventureStore.logs.length === 0" class="text-xs text-gray-600 dark:text-gray-400">
            <p class="mb-1">• Adventure mode initialized</p>
            <p class="mb-1">• Select an enemy to begin combat</p>
            <p class="mb-1">• Combat is turn-based: you attack, then the enemy attacks</p>
          </div>
          <div v-else class="space-y-1">
            <div v-for="log in adventureStore.logs" :key="log.timestamp + log.message" class="text-xs">
              <span class="text-gray-500 dark:text-gray-400 mr-1">
                {{ new Date(log.timestamp).toLocaleTimeString() }}
              </span>
              <span :class="{
                'text-gray-600 dark:text-gray-300': log.type === 'info',
                'text-red-600 dark:text-red-400': log.type === 'combat',
                'text-green-600 dark:text-green-400': log.type === 'reward'
              }">
                {{ log.message }}
              </span>
            </div>
          </div>
        </div>

        <div
          class="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
          <span class="i-heroicons-information-circle text-gray-600 dark:text-gray-400 mr-1 inline-block"></span>
          Combat is turn-based. Your damage scales with your ant count!
        </div>
      </section>
    </div>

    <!-- Adventure Map Section -->
    <section
      class="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 rounded-xl p-3 shadow-md">
      <h2 class="text-base font-bold mb-2 flex items-center">
        <span class="i-heroicons-map text-blue-700 dark:text-blue-500 mr-2"></span>
        Adventure Map
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Bug Selection -->
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700">
          <h3 class="text-sm font-bold mb-3 text-blue-700 dark:text-blue-500">Available Enemies</h3>
          <div class="space-y-3">
            <div v-for="bug in bugStore.bugs" :key="bug.id"
              class="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <span class="i-heroicons-bug-ant text-blue-600 dark:text-blue-400 mr-2"></span>
                  <span class="font-medium text-blue-700 dark:text-blue-300">{{ bug.name }}</span>
                </div>
                <button @click="adventureStore.toggleAutoCombat(bug.id)" :class="[
                  adventureStore.autoCombatEnabled && adventureStore.selectedBugId === bug.id
                    ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
                  'px-3 py-1 rounded-lg text-white text-sm font-medium transition-colors duration-200'
                ]">
                  {{ adventureStore.autoCombatEnabled && adventureStore.selectedBugId === bug.id ? 'Stop Fighting' :
                    'Auto Fight' }}
                </button>
              </div>
              <div class="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <p>Health: {{ formatDecimal(bug.maxHealth) }}</p>
                <p>Damage: {{ formatDecimal(bug.damage) }}</p>
                <p class="text-blue-500 dark:text-blue-300">{{ bug.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Combat Status -->
        <div
          class="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700">
          <h3 class="text-sm font-bold mb-3 text-blue-700 dark:text-blue-500">Combat Status</h3>

          <!-- Current Enemy -->
          <div v-if="adventureStore.isInCombat && bugStore.selectedBug" class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <span class="i-heroicons-bug-ant text-blue-600 dark:text-blue-400 mr-2"></span>
                <span class="font-medium text-blue-700 dark:text-blue-300">{{ bugStore.selectedBug.name }}</span>
              </div>
              <span class="text-xs text-blue-600 dark:text-blue-400">In Combat</span>
            </div>

            <!-- Enemy Health Bar -->
            <div class="mb-2">
              <div class="flex justify-between text-xs text-blue-600 dark:text-blue-400 mb-1">
                <span>Health</span>
                <span>{{ Math.round(enemyHealthPercentage) }}%</span>
              </div>
              <div class="h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 transition-all duration-300 ease-out"
                  :style="{ width: `${enemyHealthPercentage}%` }"></div>
              </div>
              <div class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {{ formattedEnemyHealth }} / {{ formattedEnemyMaxHealth }}
              </div>
            </div>

            <!-- Enemy Stats -->
            <div class="grid grid-cols-2 gap-2 text-xs text-blue-600 dark:text-blue-400">
              <div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                <div class="font-medium">Damage</div>
                <div>{{ formattedEnemyDamage }}</div>
              </div>
              <div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                <div class="font-medium">Reward</div>
                <div>{{ formatDecimal(bugStore.selectedBug.maxHealth.mul(0.1)) }}</div>
              </div>
            </div>
          </div>

          <!-- No Combat -->
          <div v-else class="text-center py-4">
            <p class="text-sm text-blue-600 dark:text-blue-400 mb-2">No active combat</p>
            <p class="text-xs text-blue-500 dark:text-blue-300">Select an enemy to begin fighting</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

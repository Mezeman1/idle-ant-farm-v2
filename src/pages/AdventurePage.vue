<script setup lang="ts">
import { useAdventureStore } from '@/stores/adventureStore'
import { useBugStore } from '@/stores/bugStore'
import { useGameStore } from '@/stores/gameStore'
import { useItemStore } from '@/stores/itemStore'
import { formatDecimal } from '@/utils/decimalUtils'
import { computed, ref, onMounted, nextTick, watch, onUpdated } from 'vue'

const adventureStore = useAdventureStore()
const gameStore = useGameStore()
const bugStore = useBugStore()
const itemStore = useItemStore()
const logContainer = ref<HTMLElement | null>(null)
const lastLogCount = ref(0)

// Drop table modal state
const selectedBug = ref<any>(null)

const showDropTableModal = (bug: any) => {
  selectedBug.value = bug
}

const hideDropTableModal = () => {
  selectedBug.value = null
}

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

const formattedDefense = computed(() =>
  formatDecimal(adventureStore.playerDefense)
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

// Mobile view state
const showCombatLog = ref(true)
const showAllEnemies = ref(false)

const toggleCombatLog = () => {
  showCombatLog.value = !showCombatLog.value
  if (showCombatLog.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const toggleEnemyList = () => {
  showAllEnemies.value = !showAllEnemies.value
}

// Display a limited number of enemies by default
const visibleEnemies = computed(() => {
  if (showAllEnemies.value) {
    return bugStore.bugs
  }
  return bugStore.bugs.slice(0, 3)
})

// Aggressive scroll to bottom implementation
const scrollToBottom = () => {
  if (!logContainer.value) return

  // Use requestAnimationFrame to ensure we're in the next paint cycle
  requestAnimationFrame(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

// Even more aggressive scroll with multiple attempts
const forceScrollToBottom = () => {
  // Immediate attempt
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }

  // Try again after a short delay
  setTimeout(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  }, 50)

  // And again after a longer delay
  setTimeout(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  }, 150)
}

// Check for new logs on every component update
onUpdated(() => {
  const currentLogCount = adventureStore.logs.length
  if (currentLogCount > lastLogCount.value) {
    lastLogCount.value = currentLogCount
    forceScrollToBottom()
  }
})

onMounted(() => {
  lastLogCount.value = adventureStore.logs.length
  forceScrollToBottom()

  // Set up a MutationObserver to watch for changes to the log container
  if (logContainer.value) {
    const observer = new MutationObserver(() => {
      forceScrollToBottom()
    })

    observer.observe(logContainer.value, {
      childList: true,
      subtree: true
    })
  }
})

// Watch for new logs and scroll to bottom
watch(() => adventureStore.logs.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    lastLogCount.value = newLength
    forceScrollToBottom()
  }
}, { flush: 'post' })
</script>

<template>
  <div class="space-y-4 px-2 sm:px-0">
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
      <div class="w-full h-2 bg-red-900/30 dark:bg-red-950/50 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 transition-all duration-100 ease-linear"
          :style="{ width: `${gameStore.adventureProgressPercentage}%` }"></div>
      </div>
      <div class="text-xs text-red-600 dark:text-red-400 mt-1">
        {{ gameStore.adventureProgressPercentage }}%
      </div>
    </div>

    <!-- Active Combat Status (Moved to top when in combat) -->
    <section v-if="adventureStore.isInCombat && bugStore.selectedBug"
      class="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/30 rounded-xl p-3 shadow-md border-2 border-amber-300 dark:border-amber-700">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-base font-bold flex items-center">
          <span class="i-heroicons-bolt text-amber-700 dark:text-amber-500 mr-2"></span>
          Active Combat
        </h2>
        <span
          class="text-xs bg-amber-200 dark:bg-amber-900/50 px-2 py-1 rounded-full text-amber-800 dark:text-amber-300 font-medium">
          In Combat
        </span>
      </div>

      <div class="flex items-center gap-2 mb-2">
        <span class="i-heroicons-bug-ant text-amber-600 dark:text-amber-400 text-lg"></span>
        <span class="font-medium text-amber-800 dark:text-amber-300 text-sm">{{ bugStore.selectedBug.name }}</span>
      </div>

      <!-- Enemy Health Bar -->
      <div class="mb-2">
        <div class="flex justify-between text-xs text-amber-700 dark:text-amber-400 mb-1">
          <span>Enemy Health</span>
          <span>{{ Math.round(enemyHealthPercentage) }}%</span>
        </div>
        <div class="h-3 bg-amber-100 dark:bg-amber-900/50 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-500 dark:to-amber-400 transition-all duration-300 ease-out"
            :style="{ width: `${enemyHealthPercentage}%` }"></div>
        </div>
        <div class="text-xs text-amber-700 dark:text-amber-400 mt-1">
          {{ formattedEnemyHealth }} / {{ formattedEnemyMaxHealth }}
        </div>
      </div>

      <!-- Enemy Stats -->
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg text-amber-700 dark:text-amber-400">
          <div class="font-medium">Damage</div>
          <div>{{ formattedEnemyDamage }}</div>
        </div>
        <div class="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg text-amber-700 dark:text-amber-400">
          <div class="font-medium">Reward</div>
          <div>{{ formatDecimal(bugStore.selectedBug.maxHealth.mul(0.1)) }}</div>
        </div>
      </div>

      <div class="text-xs text-amber-700 dark:text-amber-400 mt-3 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg">
        <span class="i-heroicons-information-circle mr-1 inline-block"></span>
        To change enemies, select a different bug from the Adventure Map below.
      </div>
    </section>

    <!-- Main Dashboard - Player Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Left Column: Player Stats -->
      <section
        class="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/30 rounded-xl p-3 shadow-md lg:col-span-2">
        <h2 class="text-base font-bold mb-2 flex items-center">
          <span class="i-heroicons-user-circle text-red-700 dark:text-red-500 mr-2"></span>
          Player Stats
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
            <div class="text-xs text-red-700 dark:text-red-400 font-medium">Defense</div>
            <div class="text-sm font-bold flex items-center">
              <span class="i-heroicons-shield-check text-red-600 dark:text-red-500 mr-1 text-xs"></span>
              {{ formattedDefense }}
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
          <div class="h-3 bg-red-100 dark:bg-red-900/50 rounded-full mt-1 overflow-hidden">
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

        <!-- Combat Status (Removed from here, moved to top) -->
      </section>

      <!-- Right Column: Combat Log -->
      <section
        class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 shadow-md">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-base font-bold flex items-center">
            <span class="i-heroicons-document-text text-gray-700 dark:text-gray-300 mr-2"></span>
            Combat Log
          </h2>
          <button @click="toggleCombatLog"
            class="md:hidden text-gray-600 dark:text-gray-400 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <span :class="showCombatLog ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"></span>
          </button>
        </div>

        <div v-if="showCombatLog" ref="logContainer"
          class="bg-white/80 dark:bg-gray-900/80 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 h-48 sm:h-64 overflow-y-auto scroll-smooth">
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
            <!-- Invisible element to help with scrolling -->
            <div class="h-1" id="log-end"></div>
          </div>
        </div>

        <div v-if="showCombatLog"
          class="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
          <span class="i-heroicons-information-circle text-gray-600 dark:text-gray-400 mr-1 inline-block"></span>
          Combat is turn-based. Your damage scales with your ant count!
        </div>
      </section>
    </div>

    <!-- Adventure Map Section -->
    <section
      class="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 rounded-xl p-3 shadow-md">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-base font-bold flex items-center">
          <span class="i-heroicons-map text-blue-700 dark:text-blue-500 mr-2"></span>
          Adventure Map
        </h2>
        <button @click="toggleEnemyList"
          class="text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors flex items-center">
          <span class="mr-1">{{ showAllEnemies ? 'Show Less' : 'Show All' }}</span>
          <span :class="showAllEnemies ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"></span>
        </button>
      </div>

      <!-- Bug Selection - Compact List -->
      <div class="space-y-3">
        <div v-for="bug in visibleEnemies" :key="bug.id"
          class="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700"
          :class="{ 'border-2 border-green-400 dark:border-green-500': adventureStore.selectedBugId === bug.id && adventureStore.isInCombat }">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div class="flex items-center">
              <span class="i-heroicons-bug-ant text-blue-600 dark:text-blue-400 mr-2 text-lg"></span>
              <span class="font-medium text-blue-700 dark:text-blue-300">{{ bug.name }}</span>
              <span v-if="adventureStore.selectedBugId === bug.id && adventureStore.isInCombat"
                class="ml-2 text-xs bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full text-green-700 dark:text-green-400">
                Active
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="showDropTableModal(bug)"
                class="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors">
                <span class="i-heroicons-information-circle text-blue-600 dark:text-blue-400 text-lg"></span>
              </button>
              <button @click="adventureStore.toggleAutoCombat(bug.id)"
                class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 flex-grow sm:flex-grow-0">
                Fight
              </button>
            </div>
          </div>
          <div class="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <div class="grid grid-cols-2 gap-2">
              <p>Health: {{ formatDecimal(bug.maxHealth) }}</p>
              <p>Damage: {{ formatDecimal(bug.damage) }}</p>
            </div>
            <p class="text-blue-500 dark:text-blue-300 mt-1">{{ bug.description }}</p>
          </div>
        </div>

        <!-- Show More/Less Button -->
        <div v-if="bugStore.bugs.length > 3" class="flex justify-center">
          <button @click="toggleEnemyList"
            class="text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors flex items-center">
            <span class="mr-1">{{ showAllEnemies ? 'Show Less' : `Show ${bugStore.bugs.length - 3} More Enemies`
              }}</span>
            <span :class="showAllEnemies ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- Drop Table Modal -->
    <div v-if="selectedBug"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-4 sm:p-5 mx-auto border border-blue-200 dark:border-blue-700 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-700">
          <h3 class="text-base font-bold flex items-center text-blue-800 dark:text-blue-300">
            <span class="i-heroicons-bug-ant text-blue-600 dark:text-blue-400 mr-2"></span>
            {{ selectedBug.name }} Drop Table
          </h3>
          <button @click="hideDropTableModal" class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="i-heroicons-x-mark text-gray-600 dark:text-gray-400 text-lg"></span>
          </button>
        </div>

        <div class="space-y-3 mt-3">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            {{ selectedBug.description }}
          </div>

          <!-- Drop Table -->
          <div class="space-y-2">
            <div v-for="drop in selectedBug.drops" :key="drop.itemId"
              class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium"
                  :class="itemStore.getRarityColor(itemStore.getItem(drop.itemId)?.rarity || 'common')">
                  {{ itemStore.getItem(drop.itemId)?.name }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ (drop.chance * 100).toFixed(1) }}%
                </span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ drop.minQuantity }}-{{ drop.maxQuantity }}x
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button @click="hideDropTableModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg text-white text-sm font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

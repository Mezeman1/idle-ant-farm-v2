import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'
import { useGeneratorStore } from './generatorStore'
import { usePrestigeStore } from './prestigeStore'
import { useGeneratorUpgradeStore } from './generatorUpgradeStore'
import { useSaveSystem } from './saveSystem'
import { useAdventureStore } from './adventureStore'

export const useGameStore = defineStore('game', () => {
  // Progress tracking
  const baseTickDuration = ref(10) // Base duration in seconds
  const gameSpeed = ref(1) // Game speed multiplier (for debug mode)
  const tickDuration = computed(() => {
    const prestigeStore = usePrestigeStore()
    const reduction = prestigeStore.getUpgradeMultiplier('cycleTimeReduction').toNumber()
    const reductionAdvanced = prestigeStore.getUpgradeMultiplier('cycleTimeReductionAdvanced').toNumber()
    // Apply game speed multiplier and ensure tick duration doesn't go below 0.1 seconds
    return Math.max(0.1, (baseTickDuration.value - reduction - reductionAdvanced) / gameSpeed.value)
  })
  const tickProgress = ref(0) // Current progress (0 to 1)
  const adventureTickProgress = ref(0) // Adventure progress (0 to 1)
  const lastTickTime = ref(Date.now())
  const isRunning = ref(true)

  // Game statistics using Decimal for large number handling
  const totalTicks = ref(createDecimal(0))

  // Computed properties
  const progressPercentage = computed(() => Math.round(tickProgress.value * 100))
  const adventureProgressPercentage = computed(() => Math.round(adventureTickProgress.value * 100))
  const timeRemaining = computed(() => {
    const remaining = tickDuration.value * (1 - tickProgress.value)
    return remaining.toFixed(1)
  })
  const adventureTimeRemaining = computed(() => {
    const remaining = (tickDuration.value / 2) * (1 - adventureTickProgress.value)
    return remaining.toFixed(1)
  })

  // Formatted total ticks for display
  const formattedTotalTicks = computed(() => {
    return formatDecimal(totalTicks.value, 0)
  })

  // Main tick function that will be called when progress reaches 100%
  function tick() {
    console.log('Game tick triggered!')
    // Increment total ticks using Decimal addition
    totalTicks.value = totalTicks.value.add(1)

    // Call the generator store's tick function
    const generatorStore = useGeneratorStore()
    generatorStore.tick()

    // Update prestige loop progress
    const prestigeStore = usePrestigeStore()
    prestigeStore.updateLoopProgress(1) // Full tick = 1 unit of progress

    // Update generator upgrade progress
    const generatorUpgradeStore = useGeneratorUpgradeStore()
    generatorUpgradeStore.updateWorkerProgress(1) // 1 tick of progress for worker level

    // Trigger debounced save
    const saveSystem = useSaveSystem()
    saveSystem.debouncedSave()

    // Reset progress after tick
    tickProgress.value = 0
    lastTickTime.value = Date.now()
  }

  // Update progress based on elapsed time
  function updateProgress() {
    if (!isRunning.value) return

    const now = Date.now()
    const elapsed = (now - lastTickTime.value) / 1000 // Convert to seconds

    // Calculate new progress for main tick
    tickProgress.value += elapsed / tickDuration.value

    // Get prestige store to check if adventure is unlocked
    const prestigeStore = usePrestigeStore()
    const isAdventureUnlocked = prestigeStore.getUpgradeCount('unlockAdventure').gt(0)

    // Only update adventure progress if adventure mode is unlocked
    if (isAdventureUnlocked) {
      // Calculate new progress for adventure tick (twice as fast)
      adventureTickProgress.value += elapsed / (tickDuration.value / 2)

      // If adventure progress reaches or exceeds 1, trigger an adventure tick
      if (adventureTickProgress.value >= 1) {
        const adventureStore = useAdventureStore()
        adventureStore.tick()
        adventureTickProgress.value = 0
      }
    }

    // If progress reaches or exceeds 1, trigger a tick
    if (tickProgress.value >= 1) {
      tick()
    }

    // Update last tick time
    lastTickTime.value = now
  }

  // Toggle game running state
  function toggleRunning() {
    isRunning.value = !isRunning.value
    if (isRunning.value) {
      lastTickTime.value = Date.now() // Reset timer when resuming
    }
  }

  // Set game speed (for debug mode)
  function setGameSpeed(speed: number) {
    gameSpeed.value = speed
    console.log(`Game speed set to ${speed}x`)
  }

  // Get state for saving
  const getState = () => {
    return {
      totalTicks: totalTicks.value.toString(),
      baseTickDuration: baseTickDuration.value,
      gameSpeed: gameSpeed.value,
    }
  }

  // Load state
  const loadState = (state: any) => {
    if (state.totalTicks) {
      totalTicks.value = createDecimal(state.totalTicks)
    }

    if (state.baseTickDuration) {
      baseTickDuration.value = state.baseTickDuration
    }

    if (state.gameSpeed) {
      gameSpeed.value = state.gameSpeed
    }
  }

  return {
    tickDuration,
    tickProgress,
    adventureTickProgress,
    isRunning,
    totalTicks,
    formattedTotalTicks,
    progressPercentage,
    adventureProgressPercentage,
    timeRemaining,
    adventureTimeRemaining,
    gameSpeed,
    setGameSpeed,
    tick,
    updateProgress,
    toggleRunning,
    getState,
    loadState,
  }
})

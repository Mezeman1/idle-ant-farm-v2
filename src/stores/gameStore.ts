import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'

export const useGameStore = defineStore('game', () => {
  // Progress tracking
  const tickDuration = ref(10) // Duration in seconds
  const tickProgress = ref(0) // Current progress (0 to 1)
  const lastTickTime = ref(Date.now())
  const isRunning = ref(true)

  // Game statistics using Decimal for large number handling
  const totalTicks = ref(createDecimal(0))

  // Computed properties
  const progressPercentage = computed(() => Math.round(tickProgress.value * 100))
  const timeRemaining = computed(() => {
    const remaining = tickDuration.value * (1 - tickProgress.value)
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

    // This will later call other store tick functions
    // e.g. resourceStore.tick(), colonyStore.tick(), etc.

    // Reset progress after tick
    tickProgress.value = 0
    lastTickTime.value = Date.now()
  }

  // Update progress based on elapsed time
  function updateProgress() {
    if (!isRunning.value) return

    const now = Date.now()
    const elapsed = (now - lastTickTime.value) / 1000 // Convert to seconds

    // Calculate new progress
    tickProgress.value += elapsed / tickDuration.value

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

  return {
    tickDuration,
    tickProgress,
    isRunning,
    totalTicks,
    formattedTotalTicks,
    progressPercentage,
    timeRemaining,
    tick,
    updateProgress,
    toggleRunning
  }
})

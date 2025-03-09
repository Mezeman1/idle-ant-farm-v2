import { onMounted, onUnmounted, ref } from 'vue'
import { useSaveSystem } from '@/stores/saveSystem'

/**
 * Composable to handle app visibility state changes
 * Triggers offline progress calculations when app returns to foreground
 */
export function useVisibilityState() {
  const isVisible = ref(true)
  const lastActiveTimestamp = ref(Date.now())
  const saveSystem = useSaveSystem()

  // Handle visibility change
  const handleVisibilityChange = () => {
    const wasVisible = isVisible.value
    isVisible.value = document.visibilityState === 'visible'

    // If app becomes visible again after being hidden
    if (isVisible.value && !wasVisible) {
      const currentTime = Date.now()
      const elapsedTimeInSeconds = (currentTime - lastActiveTimestamp.value) / 1000

      // Only process offline progress if the app was in background for at least 5 seconds
      if (elapsedTimeInSeconds >= 5) {
        // Calculate offline progress with elapsed time in seconds
        saveSystem.calculateOfflineProgress(elapsedTimeInSeconds, true)
      }
    }

    // Update last active timestamp when visibility changes
    lastActiveTimestamp.value = Date.now()
  }

  // Handle page unload/close
  const handleBeforeUnload = () => {
    // Save the current timestamp to localStorage for longer offline periods
    localStorage.setItem('lastActiveTimestamp', lastActiveTimestamp.value.toString())
  }

  onMounted(() => {
    // Check if there's a stored timestamp from a previous session
    const storedTimestamp = localStorage.getItem('lastActiveTimestamp')
    if (storedTimestamp) {
      const currentTime = Date.now()
      const storedTime = parseInt(storedTimestamp, 10)
      const elapsedTimeInSeconds = (currentTime - storedTime) / 1000

      // Calculate offline progress if the app was closed for at least 5 seconds
      if (elapsedTimeInSeconds >= 5) {
        saveSystem.calculateOfflineProgress(elapsedTimeInSeconds, true)
      }

      // Update the last active timestamp
      lastActiveTimestamp.value = currentTime
      localStorage.removeItem('lastActiveTimestamp')
    }

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  onUnmounted(() => {
    // Remove event listeners
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  return {
    isVisible,
  }
}

import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Composable to persist scroll positions across pages
 *
 * @param options Configuration options
 * @param options.storageKey Key used for localStorage (defaults to 'scrollPositions')
 * @param options.debounceTime Time in ms to debounce scroll events (defaults to 100)
 * @param options.saveOnUnmount Whether to save scroll position when component unmounts (defaults to true)
 * @param options.scrollElementSelector CSS selector for the scrollable element (defaults to 'main')
 * @returns Object containing scroll position utilities
 */
export function useScrollPosition(
  options: {
    storageKey?: string
    debounceTime?: number
    saveOnUnmount?: boolean
    scrollElementSelector?: string
  } = {}
) {
  const {
    storageKey = 'scrollPositions',
    debounceTime = 100,
    saveOnUnmount = true,
    scrollElementSelector = 'main',
  } = options

  const route = useRoute()
  const router = useRouter()

  // Current scroll position
  const scrollPosition = ref(0)

  // Reference to the scrollable element
  let scrollElement: HTMLElement | null = null

  // Debounce timer
  let debounceTimer: number | null = null

  // Flag to prevent saving during restoration
  const isRestoringScroll = ref(false)

  /**
   * Get the current scroll position of the target element
   */
  const getCurrentScrollPosition = (): number => {
    if (!scrollElement) return 0
    return scrollElement.scrollTop
  }

  /**
   * Save the current scroll position to localStorage
   */
  const saveScrollPosition = () => {
    if (!scrollElement || isRestoringScroll.value) return

    try {
      // Get existing positions or initialize empty object
      const positions = JSON.parse(localStorage.getItem(storageKey) || '{}')

      // Get current scroll position
      const currentPosition = getCurrentScrollPosition()

      // Update position for current route
      positions[route.path] = currentPosition

      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(positions))

      // Update ref
      scrollPosition.value = currentPosition
    } catch (error) {
      console.error('Failed to save scroll position:', error)
    }
  }

  /**
   * Restore the saved scroll position for the current route
   */
  const restoreScrollPosition = async () => {
    if (!scrollElement) return

    try {
      // Set flag to prevent saving during restoration
      isRestoringScroll.value = true

      // Get saved positions
      const positions = JSON.parse(localStorage.getItem(storageKey) || '{}')

      // Get position for current route or default to 0
      const savedPosition = positions[route.path] || 0

      // Wait for next tick to ensure DOM is updated
      await nextTick()

      // Scroll to saved position
      scrollElement.scrollTo({
        top: savedPosition,
        behavior: 'auto', // Use 'auto' instead of 'smooth' to prevent animation conflicts
      })

      // Update ref
      scrollPosition.value = savedPosition

      // Clear the flag after a short delay to allow the scroll to complete
      setTimeout(() => {
        isRestoringScroll.value = false
      }, 50)
    } catch (error) {
      console.error('Failed to restore scroll position:', error)
      isRestoringScroll.value = false
    }
  }

  /**
   * Handle scroll events with debounce
   */
  const handleScroll = () => {
    // Skip if we're in the process of restoring scroll
    if (isRestoringScroll.value) return

    // Clear existing timer
    if (debounceTimer !== null) {
      window.clearTimeout(debounceTimer)
    }

    // Set new timer
    debounceTimer = window.setTimeout(() => {
      saveScrollPosition()
    }, debounceTime)
  }

  /**
   * Clear saved scroll position for the current route
   */
  const clearScrollPosition = () => {
    try {
      const positions = JSON.parse(localStorage.getItem(storageKey) || '{}')

      // Remove position for current route
      delete positions[route.path]

      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(positions))

      // Reset ref
      scrollPosition.value = 0

      // Reset scroll position if element exists
      if (scrollElement) {
        scrollElement.scrollTo({ top: 0 })
      }
    } catch (error) {
      console.error('Failed to clear scroll position:', error)
    }
  }

  /**
   * Clear all saved scroll positions
   */
  const clearAllScrollPositions = () => {
    try {
      localStorage.removeItem(storageKey)
      scrollPosition.value = 0

      // Reset scroll position if element exists
      if (scrollElement) {
        scrollElement.scrollTo({ top: 0 })
      }
    } catch (error) {
      console.error('Failed to clear all scroll positions:', error)
    }
  }

  /**
   * Initialize the scrollable element and event listeners
   */
  const initializeScrollElement = () => {
    // Find the scrollable element
    scrollElement = document.querySelector(scrollElementSelector)

    if (!scrollElement) {
      console.warn(`Scrollable element not found with selector: ${scrollElementSelector}`)
      return false
    }

    // Add scroll event listener to the element
    scrollElement.addEventListener('scroll', handleScroll, { passive: true })

    return true
  }

  // Setup event listeners when component mounts
  onMounted(() => {
    // Initialize after a short delay to ensure DOM is fully rendered
    setTimeout(() => {
      if (initializeScrollElement()) {
        // Restore scroll position after initialization
        restoreScrollPosition()
      }
    }, 50)
  })

  // Clean up event listeners when component unmounts
  onBeforeUnmount(() => {
    // Remove scroll event listener
    if (scrollElement) {
      scrollElement.removeEventListener('scroll', handleScroll)
    }

    // Save final scroll position if enabled
    if (saveOnUnmount && !isRestoringScroll.value) {
      saveScrollPosition()
    }

    // Clear debounce timer
    if (debounceTimer !== null) {
      window.clearTimeout(debounceTimer)
    }
  })

  // Use router's beforeEach navigation guard to save position before navigation
  router.beforeEach((to, from, next) => {
    if (from.path !== to.path && !isRestoringScroll.value) {
      saveScrollPosition()
    }
    next()
  })

  // Watch for route changes to restore position after navigation
  watch(
    () => route.path,
    (newPath, oldPath) => {
      // Only restore if paths are different (actual navigation occurred)
      if (newPath !== oldPath) {
        // Use a slightly longer delay to ensure content is rendered
        setTimeout(() => {
          restoreScrollPosition()
        }, 150)
      }
    }
  )

  return {
    scrollPosition,
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    clearAllScrollPositions,
  }
}

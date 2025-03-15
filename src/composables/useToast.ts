import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timeout: number
}

// Create a reactive array to store toasts
const toasts = ref<Toast[]>([])
let nextId = 0

/**
 * Composable for showing toast notifications
 */
export function useToast() {
  /**
   * Show a toast notification
   * @param message The message to display
   * @param type The type of toast (info, success, warning, error)
   * @param timeout Time in milliseconds before the toast disappears (default: 3000)
   * @returns The ID of the created toast
   */
  const showToast = (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    timeout = 3000
  ): number => {
    const id = nextId++

    // Add the toast to the array
    toasts.value.push({
      id,
      message,
      type,
      timeout
    })

    // Remove the toast after the timeout
    setTimeout(() => {
      removeToast(id)
    }, timeout)

    return id
  }

  /**
   * Remove a toast by ID
   * @param id The ID of the toast to remove
   */
  const removeToast = (id: number): void => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}

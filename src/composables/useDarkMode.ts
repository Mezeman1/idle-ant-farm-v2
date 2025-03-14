import { ref, onMounted, watch } from 'vue'

export function useDarkMode() {
  const isDarkMode = ref(false)

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    updateDarkMode()
  }

  // Function to set dark mode
  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value
    updateDarkMode()
  }

  // Update the DOM and localStorage based on current state
  const updateDarkMode = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  // Initialize dark mode based on user preference or system preference
  onMounted(() => {
    // Check if user has previously set a preference
    const savedDarkMode = localStorage.getItem('darkMode')

    if (savedDarkMode === 'true') {
      isDarkMode.value = true
    } else if (savedDarkMode === 'false') {
      isDarkMode.value = false
    } else {
      // If no preference is saved, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDarkMode.value = prefersDark
    }

    // Apply initial dark mode setting
    updateDarkMode()

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches)
      }
    })
  })

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
  }
}

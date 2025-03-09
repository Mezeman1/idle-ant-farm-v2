import { onMounted, onUnmounted, ref } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Composable to handle PWA-specific events
 * - beforeinstallprompt: Fired when the PWA can be installed
 * - appinstalled: Fired when the PWA is installed
 */
export function usePWAEvents() {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)

  // Check if the app is already installed
  const checkIfInstalled = () => {
    // @ts-ignore - matchMedia is available in modern browsers
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true
    }
  }

  // Handle beforeinstallprompt event
  const handleBeforeInstallPrompt = (e: Event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault()

    // Store the event for later use
    deferredPrompt.value = e as BeforeInstallPromptEvent
    isInstallable.value = true
  }

  // Handle appinstalled event
  const handleAppInstalled = () => {
    isInstalled.value = true
    isInstallable.value = false
    deferredPrompt.value = null

    // You could track installation in analytics here
    console.log('PWA was installed')
  }

  // Function to prompt the user to install the PWA
  const promptInstall = async () => {
    if (!deferredPrompt.value) {
      return
    }

    // Show the install prompt
    deferredPrompt.value.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.value.userChoice

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the saved prompt as it can't be used again
    deferredPrompt.value = null
    isInstallable.value = false
  }

  onMounted(() => {
    // Check if already installed
    checkIfInstalled()

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
  })

  onUnmounted(() => {
    // Remove event listeners
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
  })

  return {
    isInstallable,
    isInstalled,
    promptInstall,
  }
}

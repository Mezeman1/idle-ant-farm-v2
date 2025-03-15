import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { useSaveSystem } from '@/stores/saveSystem'
import VueGtag from 'vue-gtag-next'
import { useGdprConsent } from '@/composables/useGdprConsent'
import '@/assets/base.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize GDPR consent
const { hasConsent } = useGdprConsent()

// Configure Google Analytics with GDPR compliance
app.use(VueGtag, {
  property: {
    id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX',
  },
  isEnabled: hasConsent(), // Only enable if consent is given
  useDebugger: import.meta.env.VITE_DEBUG_MODE === 'true',
  disableScriptLoad: !hasConsent(), // Don't load the script if no consent
})

app.mount('#app')

// Initialize save system after app is mounted
const saveSystem = useSaveSystem()

// Try to load saved game
const offlineProgress = saveSystem.loadGame()
if (offlineProgress) {
  console.log('Loaded game with offline progress:', offlineProgress)

  // We don't need to navigate to settings anymore since we have a modal
  // that shows the offline progress calculation
}

// Start auto-save
saveSystem.startAutoSave()

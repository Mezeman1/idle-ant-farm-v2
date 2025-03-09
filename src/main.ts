import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { useSaveSystem } from '@/stores/saveSystem'

import '@/assets/base.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

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

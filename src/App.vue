<script setup lang="ts">
import { onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import OfflineProgressModal from '@/components/OfflineProgressModal.vue'
import PWAUpdateNotification from '@/components/PWAUpdateNotification.vue'
import PWAInstallButton from '@/components/PWAInstallButton.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import GdprConsentBanner from '@/components/GdprConsentBanner.vue'
import { useSaveSystem } from '@/stores/saveSystem'
import { useVisibilityState } from '@/composables/useVisibilityState'
import { useDarkMode } from '@/composables/useDarkMode'
import { useScrollPosition } from '@/composables/useScrollPosition'

const saveSystem = useSaveSystem()

// Initialize visibility state tracking
const { isVisible } = useVisibilityState()

// Initialize dark mode
const { isDarkMode } = useDarkMode()

// Initialize scroll position persistence
const { scrollPosition } = useScrollPosition({
  debounceTime: 150, // Slightly higher debounce time for better performance
  storageKey: 'idleAntFarmScrollPositions', // App-specific key
  scrollElementSelector: 'main' // Target the main element in MainLayout
})

// Handle closing the offline progress modal
const handleCloseOfflineModal = () => {
  // Only allow closing if calculation is complete
  if (saveSystem.offlineProgressTicksProcessed >= saveSystem.offlineProgressTotalTicks) {
    saveSystem.isCalculatingOfflineProgress = false
  }
}
</script>

<template>
  <MainLayout>
    <router-view />
  </MainLayout>

  <!-- Offline Progress Modal -->
  <OfflineProgressModal :is-visible="saveSystem.isCalculatingOfflineProgress"
    :total-ticks="saveSystem.offlineProgressTotalTicks" :ticks-processed="saveSystem.offlineProgressTicksProcessed"
    :elapsed-time="saveSystem.offlineProgressElapsedTime" @close="handleCloseOfflineModal" />

  <!-- PWA Update Notification -->
  <PWAUpdateNotification />

  <!-- PWA Install Button -->
  <PWAInstallButton />

  <!-- Toast Notifications -->
  <ToastContainer />

  <!-- GDPR Consent Banner -->
  <GdprConsentBanner />
</template>

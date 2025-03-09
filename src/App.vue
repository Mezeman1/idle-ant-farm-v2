<script setup lang="ts">
import { onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import OfflineProgressModal from '@/components/OfflineProgressModal.vue'
import PWAUpdateNotification from '@/components/PWAUpdateNotification.vue'
import PWAInstallButton from '@/components/PWAInstallButton.vue'
import { useSaveSystem } from '@/stores/saveSystem'
import { useVisibilityState } from '@/composables/useVisibilityState'

const saveSystem = useSaveSystem()

// Initialize visibility state tracking
const { isVisible } = useVisibilityState()

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
</template>

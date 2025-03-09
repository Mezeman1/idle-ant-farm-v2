<script setup lang="ts">
import { onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import OfflineProgressModal from '@/components/OfflineProgressModal.vue'
import { useSaveSystem } from '@/stores/saveSystem'

const saveSystem = useSaveSystem()

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
</template>

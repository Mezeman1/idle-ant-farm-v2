import { computed } from 'vue'
import { usePrestigeStore } from '@/stores/prestigeStore'

/**
 * Composable to check if adventure mode is unlocked
 * @returns Object with isAdventureUnlocked computed property
 */
export function useAdventureUnlock() {
  const prestigeStore = usePrestigeStore()

  // Check if adventure mode is unlocked
  const isAdventureUnlocked = computed(() => {
    const upgradeLevel = prestigeStore.getUpgradeCount('unlockAdventure')
    return upgradeLevel.gt(0)
  })

  return {
    isAdventureUnlocked,
  }
}

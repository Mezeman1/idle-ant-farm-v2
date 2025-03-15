import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAdventureUnlock } from '@/composables/useAdventureUnlock'
import { useToast } from '@/composables/useToast'

import IndexPage from '@/pages/IndexPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import ColonyPage from '@/pages/ColonyPage.vue'
import UpgradesPage from '@/pages/UpgradesPage.vue'
import AdventurePage from '@/pages/AdventurePage.vue'
import InventoryPage from '@/pages/InventoryPage.vue'

const routes = [
  {
    path: '/',
    component: IndexPage,
  },
  {
    path: '/settings',
    component: SettingsPage,
  },
  {
    path: '/colony',
    component: ColonyPage,
  },
  {
    path: '/upgrades',
    component: UpgradesPage,
  },
  {
    path: '/adventure',
    component: AdventurePage,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const { isAdventureUnlocked } = useAdventureUnlock()

      if (isAdventureUnlocked.value) {
        next()
      } else {
        // Redirect to upgrades page
        next('/upgrades')

        // Show a toast message if available
        try {
          const { showToast } = useToast()
          showToast('You need to unlock Adventure Mode first (50 EP)', 'error')
        } catch (e) {
          console.warn('Toast system not available')
        }
      }
    },
  },
  {
    path: '/inventory',
    component: InventoryPage,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const { isAdventureUnlocked } = useAdventureUnlock()

      if (isAdventureUnlocked.value) {
        next()
      } else {
        // Redirect to upgrades page
        next('/upgrades')

        // Show a toast message if available
        try {
          const { showToast } = useToast()
          showToast('You need to unlock Adventure Mode first (50 EP)', 'error')
        } catch (e) {
          console.warn('Toast system not available')
        }
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

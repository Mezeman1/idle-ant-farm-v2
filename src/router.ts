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
    meta: {
      title: 'Home',
    },
  },
  {
    path: '/settings',
    component: SettingsPage,
    meta: {
      title: 'Settings',
    },
  },
  {
    path: '/colony',
    component: ColonyPage,
    meta: {
      title: 'Colony',
    },
  },
  {
    path: '/upgrades',
    component: UpgradesPage,
    meta: {
      title: 'Upgrades',
    },
  },
  {
    path: '/adventure',
    component: AdventurePage,
    meta: {
      title: 'Adventure',
    },
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
    meta: {
      title: 'Inventory',
    },
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

// Add analytics tracking
import { useAnalytics } from '@/composables/useAnalytics'

// We need to wait until the router is ready to use the analytics
// because the composable needs to be called within a Vue component or setup function
router.isReady().then(() => {
  // This will be executed after the router is ready
  const { trackPageView } = useAnalytics()

  router.afterEach(to => {
    console.log('to', to)
    // Track page view with the route path and title
    trackPageView(to.path, to.meta.title as string | undefined)
  })
})

export default router

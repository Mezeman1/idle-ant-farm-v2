import { createRouter, createWebHistory } from 'vue-router'

import IndexPage from '@/pages/IndexPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import ColonyPage from '@/pages/ColonyPage.vue'
import UpgradesPage from '@/pages/UpgradesPage.vue'
import AdventurePage from '@/pages/AdventurePage.vue'

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
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

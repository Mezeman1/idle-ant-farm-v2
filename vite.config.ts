import tailwindcss from '@tailwindcss/vite'
import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import PackageJson from './package.json' with { type: 'json' }

process.env.VITE_APP_VERSION = PackageJson.version
if (process.env.NODE_ENV === 'production') {
  process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString()
}

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@/store': ['useStore'],
        },
        {
          '@/utils/decimalUtils': [
            'createDecimal',
            'formatDecimal',
            'canAfford',
            'calculateProduction',
            'calculateCost',
            'calculateMk1Cost',
            'calculateMk2Cost',
            'calculateMk3Cost',
            'calculateMk4Cost',
            'calculateMk5Cost',
            'calculateMk6Cost',
            'calculateMk7Cost',
            'calculateGeneratorCost',
            'toNumber',
            'formatPercentage',
          ],
        },
        {
          '@/composables/usePWAEvents': ['usePWAEvents'],
          '@/composables/useVisibilityState': ['useVisibilityState'],
          '@/composables/useDarkMode': ['useDarkMode'],
        },
        unheadVueComposablesImports,
      ],
      dirs: ['src/stores', 'src/utils', 'src/composables'],
      dts: 'auto-imports.d.ts',
      vueTemplate: true,
    }),
    Components({
      dts: 'components.d.ts',
    }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Idle Ant Farm',
        short_name: 'Idle Ant Farm',
        description: 'An idle game about managing an ant farm',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorMaxWorkers: true,
  },
})

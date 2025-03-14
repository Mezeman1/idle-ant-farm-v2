# Composables

This directory contains reusable Vue 3 composables that encapsulate and share client-side logic across multiple components.

## useScrollPosition

The `useScrollPosition` composable provides functionality to persist scroll positions across page navigation. When a user navigates away from a page and later returns, the scroll position will be automatically restored to where they left off.

This composable is specifically designed to work with scrollable elements within the layout (like the `<main>` element in `MainLayout.vue`), rather than the window's scroll position.

### Basic Usage

The composable is already implemented at the App level, so scroll positions are automatically persisted across all pages without any additional code.

### Advanced Usage

If you need more control over scroll behavior in a specific component or page, you can use the composable directly:

```vue
<script setup lang="ts">
import { useScrollPosition } from '@/composables/useScrollPosition'

// Use with custom options
const { scrollPosition, saveScrollPosition, restoreScrollPosition, clearScrollPosition, clearAllScrollPositions } =
  useScrollPosition({
    // Custom options
    debounceTime: 200,
    storageKey: 'customScrollPositions',
    saveOnUnmount: true,
    scrollElementSelector: '.custom-scrollable-element', // Target a specific element
  })

// You can manually trigger any of these functions
// or use the reactive scrollPosition value
</script>
```

### API

#### Options

| Option                  | Type      | Default             | Description                                             |
| ----------------------- | --------- | ------------------- | ------------------------------------------------------- |
| `storageKey`            | `string`  | `'scrollPositions'` | Key used for localStorage                               |
| `debounceTime`          | `number`  | `100`               | Time in ms to debounce scroll events                    |
| `saveOnUnmount`         | `boolean` | `true`              | Whether to save scroll position when component unmounts |
| `scrollElementSelector` | `string`  | `'main'`            | CSS selector for the scrollable element                 |

#### Returned Values

| Name                      | Type          | Description                                       |
| ------------------------- | ------------- | ------------------------------------------------- |
| `scrollPosition`          | `Ref<number>` | Reactive reference to the current scroll position |
| `saveScrollPosition`      | `() => void`  | Manually save the current scroll position         |
| `restoreScrollPosition`   | `() => void`  | Manually restore the saved scroll position        |
| `clearScrollPosition`     | `() => void`  | Clear saved scroll position for the current route |
| `clearAllScrollPositions` | `() => void`  | Clear all saved scroll positions                  |

### Example: Manual Control in a Specific Page

```vue
<script setup lang="ts">
import { useScrollPosition } from '@/composables/useScrollPosition'
import { ref, watch } from 'vue'

const { scrollPosition, clearScrollPosition } = useScrollPosition()
const showResetButton = ref(false)

// Show reset button only if we have scrolled down significantly
watch(scrollPosition, newPosition => {
  showResetButton.value = newPosition > 500
})

// Function to scroll back to top
const scrollToTop = () => {
  const mainElement = document.querySelector('main')
  if (mainElement) {
    mainElement.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div>
    <!-- Page content -->

    <!-- Floating button to reset scroll position -->
    <button
      v-if="showResetButton"
      @click="scrollToTop"
      class="fixed bottom-4 right-4 bg-primary text-white rounded-full p-3 shadow-lg"
    >
      <ArrowUpIcon class="w-6 h-6" />
    </button>
  </div>
</template>
```

## Other Composables

- `useDarkMode`: Manages dark mode preferences
- `usePWAEvents`: Handles Progressive Web App events
- `useVisibilityState`: Tracks document visibility state

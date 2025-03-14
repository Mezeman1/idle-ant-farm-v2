<script setup lang="ts">
const props = defineProps<{
  activeTab: string
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', tab: string): void
}>()

// Tab label and icon
const getTabIcon = (category: string) => {
  switch (category) {
    case 'production':
      return 'i-heroicons-bolt'
    case 'efficiency':
      return 'i-heroicons-cog-6-tooth'
    case 'automation':
      return 'i-heroicons-cog-8-tooth'
    case 'research':
      return 'i-heroicons-beaker'
    case 'synergy':
      return 'i-heroicons-puzzle-piece'
    case 'prestige':
      return 'i-heroicons-star'
    case 'all':
      return 'i-heroicons-squares-2x2'
    default:
      return 'i-heroicons-face-frown'
  }
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'production':
      return 'Production'
    case 'efficiency':
      return 'Efficiency'
    case 'automation':
      return 'Automation'
    case 'research':
      return 'Research'
    case 'synergy':
      return 'Synergy'
    case 'prestige':
      return 'Prestige'
    case 'all':
      return 'All'
    default:
      return category.charAt(0).toUpperCase() + category.slice(1)
  }
}

// Handle keyboard navigation
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'ArrowRight') {
    // Move to next tab
    const nextIndex = (index + 1) % props.categories.length
    emit('update:activeTab', props.categories[nextIndex])
    focusTab(nextIndex)
    event.preventDefault()
  } else if (event.key === 'ArrowLeft') {
    // Move to previous tab
    const prevIndex = (index - 1 + props.categories.length) % props.categories.length
    emit('update:activeTab', props.categories[prevIndex])
    focusTab(prevIndex)
    event.preventDefault()
  } else if (event.key === 'Home') {
    // Move to first tab
    emit('update:activeTab', props.categories[0])
    focusTab(0)
    event.preventDefault()
  } else if (event.key === 'End') {
    // Move to last tab
    const lastIndex = props.categories.length - 1
    emit('update:activeTab', props.categories[lastIndex])
    focusTab(lastIndex)
    event.preventDefault()
  }
}

// Focus a specific tab by index
const focusTab = (index: number) => {
  const tabId = `tab-${props.categories[index]}`
  setTimeout(() => {
    const tabElement = document.getElementById(tabId)
    if (tabElement) {
      tabElement.focus()
    }
  }, 10)
}
</script>

<template>
  <div
    class="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
    role="tablist" aria-label="Upgrade Categories">
    <div class="flex overflow-x-auto scrollbar-hide">
      <button v-for="(category, index) in categories" :key="category" @click="emit('update:activeTab', category)"
        @keydown="handleKeyDown($event, index)" :class="[
          'px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors outline-none',
          activeTab === category
            ? 'border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        ]" :id="`tab-${category}`" :aria-selected="activeTab === category" :aria-controls="`panel-${category}`"
        role="tab" :tabindex="activeTab === category ? 0 : -1">
        <span :class="getTabIcon(category)" class="mr-1.5"></span>
        {{ getCategoryLabel(category) }}
        <slot name="badge" :category="category"></slot>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Remove default focus styles */
button:focus-visible {
  outline: 2px solid #9333ea;
  outline-offset: -2px;
}

.dark button:focus-visible {
  outline: 2px solid #a855f7;
  outline-offset: -2px;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  activeTab: 'equipment' | 'inventory'
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', tab: 'equipment' | 'inventory'): void
}>()

// Handle keyboard navigation
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'ArrowRight') {
    emit('update:activeTab', 'inventory')
    focusTab(1)
    event.preventDefault()
  } else if (event.key === 'ArrowLeft') {
    emit('update:activeTab', 'equipment')
    focusTab(0)
    event.preventDefault()
  }
}

// Focus a specific tab by index
const focusTab = (index: number) => {
  const tabId = `tab-${index === 0 ? 'equipment' : 'inventory'}`
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
    role="tablist" aria-label="Inventory Sections">
    <div class="flex overflow-x-auto scrollbar-hide">
      <button @click="emit('update:activeTab', 'equipment')" @keydown="handleKeyDown($event, 0)" :class="[
        'px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors outline-none',
        activeTab === 'equipment'
          ? 'border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
      ]" :id="'tab-equipment'" :aria-selected="activeTab === 'equipment'" :aria-controls="'panel-equipment'" role="tab"
        :tabindex="activeTab === 'equipment' ? 0 : -1">
        <span class="i-heroicons-shield-check mr-1.5"></span>
        Equipment
      </button>
      <button @click="emit('update:activeTab', 'inventory')" @keydown="handleKeyDown($event, 1)" :class="[
        'px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors outline-none',
        activeTab === 'inventory'
          ? 'border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
      ]" :id="'tab-inventory'" :aria-selected="activeTab === 'inventory'" :aria-controls="'panel-inventory'" role="tab"
        :tabindex="activeTab === 'inventory' ? 0 : -1">
        <span class="i-heroicons-shopping-bag mr-1.5"></span>
        Inventory
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

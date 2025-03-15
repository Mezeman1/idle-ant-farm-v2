<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { TransitionGroup } from 'vue'

const { toasts, removeToast } = useToast()

// Get icon based on toast type
const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return 'i-heroicons-check-circle'
    case 'warning':
      return 'i-heroicons-exclamation-triangle'
    case 'error':
      return 'i-heroicons-x-circle'
    case 'info':
    default:
      return 'i-heroicons-information-circle'
  }
}

// Get background color based on toast type
const getBgColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-700 dark:bg-green-800'
    case 'warning':
      return 'bg-yellow-700 dark:bg-yellow-800'
    case 'error':
      return 'bg-red-700 dark:bg-red-800'
    case 'info':
    default:
      return 'bg-amber-700 dark:bg-amber-800'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id"
        :class="['rounded-lg shadow-lg text-white p-3 flex items-start gap-2', getBgColor(toast.type)]">
        <span :class="[getIcon(toast.type), 'text-xl flex-shrink-0 mt-0.5']"></span>
        <div class="flex-grow">
          <p class="text-sm">{{ toast.message }}</p>
        </div>
        <button @click="removeToast(toast.id)" class="text-white hover:text-gray-200 flex-shrink-0">
          <span class="i-heroicons-x-mark text-lg"></span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'

const { isDarkMode, toggleDarkMode } = useDarkMode()
</script>

<template>
    <div class="flex items-center justify-between">
        <div>
            <div class="text-sm font-medium">Dark Mode</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Toggle between light and dark theme</div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" class="sr-only peer">
            <div
                class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
            </div>
        </label>
    </div>
</template>

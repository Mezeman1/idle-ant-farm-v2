<script setup lang="ts">
import { usePWAEvents } from '@/composables/usePWAEvents'

const { isInstallable, promptInstall } = usePWAEvents()
</script>

<template>
    <button v-if="isInstallable" @click="promptInstall"
        class="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-indigo-600 dark:bg-indigo-700 px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:ring-offset-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd" />
        </svg>
        Install App
    </button>
</template>

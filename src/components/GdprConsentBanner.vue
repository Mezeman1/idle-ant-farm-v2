<script setup lang="ts">
import { useGdprConsent } from '@/composables/useGdprConsent'

const { consentStatus, acceptConsent, declineConsent, isPending } = useGdprConsent()
</script>

<template>
    <Transition name="slide-up">
        <div v-if="isPending()"
            class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50 border-t border-gray-200 dark:border-gray-700">
            <div class="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                    <p>
                        We use cookies and similar technologies to analyze traffic, enhance site functionality, and
                        improve your experience.
                        By clicking "Accept", you consent to the use of cookies for analytics purposes.
                    </p>
                </div>
                <div class="flex gap-3">
                    <button @click="declineConsent"
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Decline
                    </button>
                    <button @click="acceptConsent"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Accept
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    show: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const isClosing = ref(false)

// Handle close with animation
const handleClose = () => {
    isClosing.value = true
    setTimeout(() => {
        emit('close')
        isClosing.value = false
    }, 250) // Match this with the animation duration
}

// Reset isClosing when show changes
watch(() => props.show, (newValue) => {
    if (!newValue) {
        isClosing.value = false
    }
})
</script>

<template>
    <div v-if="show" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 animate-fadeIn" :class="{ 'animate-fadeOut': isClosing }"></div>

        <!-- Modal Content -->
        <div class="fixed inset-0 flex flex-col animate-fadeIn" :class="{ 'animate-fadeOut': isClosing }">
            <div class="w-full h-full flex flex-col bg-amber-50 text-amber-900 font-sans animate-slideUp"
                :class="{ 'animate-slideDown': isClosing }">
                <!-- Header -->
                <header class="bg-gradient-to-r from-amber-800 to-amber-700 text-amber-50 shadow-lg">
                    <!-- Main Header Content -->
                    <div class="p-2 md:p-3">
                        <!-- Title Row -->
                        <div class="flex items-center justify-between">
                            <h1 class="text-lg md:text-xl font-bold tracking-tight flex items-center">
                                <span class="i-heroicons-information-circle text-amber-300 mr-2"></span>
                                About Ant Specialization
                            </h1>
                            <button @click="handleClose"
                                class="text-amber-50 hover:text-amber-300 transition-colors p-1.5 rounded-full hover:bg-amber-900/30">
                                <span class="i-heroicons-x-mark text-lg"></span>
                            </button>
                        </div>
                    </div>
                </header>

                <!-- Main Content (Scrollable) -->
                <main class="flex-1 overflow-y-auto p-4 pb-6 scroll-smooth">
                    <div class="space-y-3">
                        <div class="bg-white rounded-xl shadow-md border border-amber-200 p-3">
                            <p class="text-sm text-amber-800 mb-2 font-medium">
                                How Ant Specialization Works:
                            </p>

                            <ul class="text-xs text-amber-800 list-disc pl-4 space-y-1">
                                <li>Each ant type has its own specialization level that increases based on different
                                    metrics:
                                </li>
                                <li class="ml-3"><strong>Worker Ants:</strong> Level up based on foraging trips in
                                    current
                                    evolution (50%
                                    increase
                                    per level)</li>
                                <li class="ml-3"><strong>Nurseries:</strong> Level up based on amount of food gathered
                                    (100%
                                    increase per
                                    level)</li>
                                <li class="ml-3"><strong>Queen Chambers:</strong> Level up based on total manual
                                    purchases (30%
                                    increase
                                    per level)</li>
                                <li class="ml-3"><strong>Colonies:</strong> Level up based on amount of adaptations
                                    developed
                                    (20%
                                    increase
                                    per level)</li>
                                <li>Each level-up awards 1 adaptation point for that ant type</li>
                                <li>Adaptation points can be spent on specialized traits for that ant type</li>
                                <li>Specialization levels and adaptations reset when your colony undergoes metamorphosis
                                </li>
                            </ul>
                        </div>

                        <div class="bg-white rounded-xl shadow-md border border-amber-200 p-3">
                            <p class="text-sm text-amber-800 mb-2 font-medium">
                                Types of Ant Adaptations:
                            </p>

                            <ul class="text-xs text-amber-800 list-disc pl-4 space-y-1">
                                <li><strong>Efficiency Adaptations:</strong> Increase production (+20% per level)</li>
                                <li><strong>Resource Adaptations:</strong> Decrease resource requirements (-5% per
                                    level)</li>
                                <li><strong>Special Adaptations:</strong> Add a chance for ants to reproduce themselves
                                </li>
                            </ul>
                        </div>
                    </div>
                </main>

                <!-- Footer -->
                <footer
                    class="bg-gradient-to-r from-amber-800 to-amber-700 text-amber-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div class="flex justify-end p-3">
                        <button @click="handleClose"
                            class="px-3 py-2 bg-amber-900/20 hover:bg-amber-900/30 rounded-lg text-amber-50 font-medium transition-colors duration-200 flex items-center justify-center active:scale-95 border border-amber-600">
                            <span class="i-heroicons-arrow-left text-base mr-1"></span>
                            Return to Colony
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Custom scrollbar for the main content */
main::-webkit-scrollbar {
    width: 6px;
}

main::-webkit-scrollbar-track {
    background-color: rgb(254 243 199);
    /* amber-100 */
}

main::-webkit-scrollbar-thumb {
    background-color: rgb(251 191 36);
    /* amber-400 */
    border-radius: 9999px;
}

main::-webkit-scrollbar-thumb:hover {
    background-color: rgb(245 158 11);
    /* amber-500 */
}
</style>

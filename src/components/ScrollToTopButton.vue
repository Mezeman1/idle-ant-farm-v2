<script setup lang="ts">
import { ref, watch } from 'vue'
import { useScrollPosition } from '@/composables/useScrollPosition'

// Props for customization
interface Props {
    /**
     * Threshold in pixels after which the button appears
     */
    threshold?: number
    /**
     * CSS classes for the button
     */
    buttonClass?: string
    /**
     * Icon to display in the button
     */
    iconClass?: string
}

const props = withDefaults(defineProps<Props>(), {
    threshold: 300,
    buttonClass: 'fixed bottom-4 right-4 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 z-50',
    iconClass: 'i-heroicons-arrow-up w-5 h-5'
})

// Use the scroll position composable
const { scrollPosition } = useScrollPosition()

// Control button visibility
const isVisible = ref(false)

// Show button only when scrolled past threshold
watch(scrollPosition, (newPosition) => {
    isVisible.value = newPosition > props.threshold
})

/**
 * Scroll back to the top of the main content
 */
const scrollToTop = () => {
    const mainElement = document.querySelector('main')
    if (mainElement) {
        mainElement.scrollTo({ top: 0, behavior: 'smooth' })
    }
}
</script>

<template>
    <Transition name="fade">
        <button v-if="isVisible" @click="scrollToTop" :class="buttonClass" aria-label="Scroll to top">
            <span :class="iconClass"></span>
        </button>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

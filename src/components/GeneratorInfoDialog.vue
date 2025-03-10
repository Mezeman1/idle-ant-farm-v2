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
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
        :class="{ 'animate-fadeOut': isClosing }">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-4 mx-auto max-h-[80vh] overflow-y-auto animate-slideUp"
            :class="{ 'animate-slideDown': isClosing }">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-base font-bold flex items-center text-amber-800">
                    <span class="i-heroicons-information-circle text-amber-600 mr-2"></span>
                    About Ant Specialization
                </h3>
                <button @click="handleClose" class="text-gray-500 hover:text-gray-700 transition-colors">
                    <span class="i-heroicons-x-mark text-lg"></span>
                </button>
            </div>

            <div class="space-y-3">
                <div class="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p class="text-xs text-amber-800 mb-1">
                        <strong>How Ant Specialization Works:</strong>
                    </p>

                    <ul class="text-xs text-amber-800 list-disc pl-4 space-y-0.5">
                        <li>Each ant type has its own specialization level that increases based on different metrics:
                        </li>
                        <li class="ml-3"><strong>Worker Ants:</strong> Level up based on foraging trips in current
                            evolution (50%
                            increase
                            per level)</li>
                        <li class="ml-3"><strong>Nurseries:</strong> Level up based on amount of food gathered (100%
                            increase per
                            level)</li>
                        <li class="ml-3"><strong>Queen Chambers:</strong> Level up based on total manual purchases (30%
                            increase
                            per level)</li>
                        <li class="ml-3"><strong>Colonies:</strong> Level up based on amount of adaptations developed
                            (20%
                            increase
                            per level)</li>
                        <li>Each level-up awards 1 adaptation point for that ant type</li>
                        <li>Adaptation points can be spent on specialized traits for that ant type</li>
                        <li>Specialization levels and adaptations reset when your colony undergoes metamorphosis</li>
                    </ul>
                </div>

                <div class="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p class="text-xs text-amber-800 mb-1">
                        <strong>Types of Ant Adaptations:</strong>
                    </p>

                    <ul class="text-xs text-amber-800 list-disc pl-4 space-y-0.5">
                        <li><strong>Efficiency Adaptations:</strong> Increase production (+20% per level)</li>
                        <li><strong>Resource Adaptations:</strong> Decrease resource requirements (-5% per level)</li>
                        <li><strong>Special Adaptations:</strong> Add a chance for ants to reproduce themselves</li>
                    </ul>
                </div>
            </div>

            <div class="mt-3 flex justify-end">
                <button @click="handleClose"
                    class="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-medium transition-colors duration-200 active:scale-95">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Animation keyframes */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(15px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

@keyframes slideDown {
    from {
        transform: translateY(0);
        opacity: 1;
    }

    to {
        transform: translateY(15px);
        opacity: 0;
    }
}

/* Animation classes */
.animate-fadeIn {
    animation: fadeIn 0.25s ease-out forwards;
}

.animate-slideUp {
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fadeOut {
    animation: fadeOut 0.25s ease-out forwards;
}

.animate-slideDown {
    animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Scale effect for buttons */
.active\:scale-95:active {
    transform: scale(0.95);
}
</style>

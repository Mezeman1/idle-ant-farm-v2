<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { needRefresh, updateServiceWorker } = useRegisterSW();
const updateAvailable = ref(false);

onMounted(() => {
    // Watch for updates
    watch(needRefresh, (value) => {
        updateAvailable.value = value;
    });
});

const refreshApp = () => {
    updateServiceWorker();
    updateAvailable.value = false;
};
</script>

<template>
    <Transition name="slide-up">
        <div v-if="updateAvailable" class="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-sm px-4">
            <div class="rounded-lg bg-indigo-600 p-4 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <h3 class="text-sm font-medium text-white">
                            App Update Available
                        </h3>
                        <p class="mt-1 text-sm text-indigo-100">
                            A new version is available. Click to update.
                        </p>
                    </div>
                    <div class="ml-4 flex flex-shrink-0">
                        <button type="button" @click="refreshApp"
                            class="inline-flex rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-indigo-600">
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease-out;
}

.slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>

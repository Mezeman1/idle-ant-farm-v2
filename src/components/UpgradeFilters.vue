<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    showMaxed: boolean
    showAffordable: boolean
}>()

const emit = defineEmits<{
    (e: 'update:showMaxed', value: boolean): void
    (e: 'update:showAffordable', value: boolean): void
    (e: 'resetFilters'): void
}>()
</script>

<template>
    <div class="flex flex-wrap items-center justify-end gap-6 mb-4">
        <div class="flex items-center space-x-2">
            <input :checked="showMaxed" @change="emit('update:showMaxed', !showMaxed)" type="checkbox" id="show-maxed"
                class="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 bg-white focus:ring-purple-500" />
            <label for="show-maxed" class="text-sm text-gray-700 font-medium">Show Maxed</label>
        </div>

        <div class="flex items-center space-x-2">
            <input :checked="showAffordable" @change="emit('update:showAffordable', !showAffordable)" type="checkbox"
                id="show-affordable"
                class="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 bg-white focus:ring-purple-500" />
            <label for="show-affordable" class="text-sm text-gray-700 font-medium">Show Affordable</label>
        </div>

        <button v-if="showMaxed || showAffordable" @click="emit('resetFilters')"
            class="text-sm text-purple-600 hover:text-purple-800 font-medium">
            Reset filters
        </button>
    </div>
</template>

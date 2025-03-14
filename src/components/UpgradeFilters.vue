<script setup lang="ts">
const props = defineProps<{
  showMaxed: boolean
  showAffordable: boolean
  showUnlocked: boolean
}>()

const emit = defineEmits<{
  (e: 'update:showMaxed', value: boolean): void
  (e: 'update:showAffordable', value: boolean): void
  (e: 'update:showUnlocked', value: boolean): void
  (e: 'resetFilters'): void
}>()
</script>

<template>
  <div
    class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-start sm:justify-end gap-3 sm:gap-4 mb-4">
    <!-- Show unlocked upgrades -->
    <div class="flex items-center space-x-2">
      <input :checked="showUnlocked" @change="emit('update:showUnlocked', !showUnlocked)" type="checkbox"
        id="show-unlocked"
        class="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-purple-600 rounded border-gray-300 bg-white focus:ring-purple-500" />
      <label for="show-unlocked" class="text-xs sm:text-sm text-gray-700 font-medium">Show Unlocked</label>
    </div>

    <div class="flex items-center space-x-2">
      <input :checked="showMaxed" @change="emit('update:showMaxed', !showMaxed)" type="checkbox" id="show-maxed"
        class="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-purple-600 rounded border-gray-300 bg-white focus:ring-purple-500" />
      <label for="show-maxed" class="text-xs sm:text-sm text-gray-700 font-medium">Show Maxed</label>
    </div>

    <div class="flex items-center space-x-2">
      <input :checked="showAffordable" @change="emit('update:showAffordable', !showAffordable)" type="checkbox"
        id="show-affordable"
        class="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-purple-600 rounded border-gray-300 bg-white focus:ring-purple-500" />
      <label for="show-affordable" class="text-xs sm:text-sm text-gray-700 font-medium">Show Affordable</label>
    </div>

    <button v-if="showMaxed || showAffordable" @click="emit('resetFilters')"
      class="text-xs sm:text-sm text-purple-600 hover:text-purple-800 font-medium mt-2 sm:mt-0">
      Reset filters
    </button>
  </div>
</template>

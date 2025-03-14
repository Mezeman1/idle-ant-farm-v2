<script setup lang="ts">
const props = defineProps<{
  className?: string
}>()

const generatorStore = useGeneratorStore()

// Get unlocked generators
const unlockedGenerators = computed(() => generatorStore.unlockedGenerators)

// Get the next unlockable generator
const nextUnlockableGenerator = computed(() => generatorStore.nextUnlockableGenerator)
</script>

<template>
  <section
    :class="['bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-3 shadow-md dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-50', className]">
    <h2 class="text-base font-bold mb-2 flex items-center">
      <span class="i-heroicons-cog-6-tooth text-amber-700 mr-2"></span>
      Ant Hierarchy
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <GeneratorItem v-for="generator in unlockedGenerators" :key="generator.id" :generator="generator" />
      <NextUnlockableGenerator v-if="nextUnlockableGenerator" :generator="nextUnlockableGenerator" />
    </div>
  </section>
</template>

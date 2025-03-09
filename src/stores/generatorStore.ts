import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal, calculateCost } from '@/utils/decimalUtils'

// Generator types
export interface Generator {
  id: string
  name: string
  description: string
  tier: number
  count: Decimal
  baseCost: Decimal
  costGrowth: Decimal
  baseProduction: Decimal
  unlocked: boolean
  icon: string
}

export const useGeneratorStore = defineStore('generator', () => {
  // Generator definitions
  const generators = ref<Generator[]>([
    {
      id: 'worker',
      name: 'Worker Ant',
      description: 'Gathers food and materials for the colony',
      tier: 1,
      count: createDecimal(0),
      baseCost: createDecimal(10),
      costGrowth: createDecimal(1.1),
      baseProduction: createDecimal(1),
      unlocked: true,
      icon: 'i-heroicons-bug-ant',
    },
    {
      id: 'nursery',
      name: 'Nursery',
      description: 'Produces worker ants',
      tier: 2,
      count: createDecimal(0),
      baseCost: createDecimal(100),
      costGrowth: createDecimal(1.15),
      baseProduction: createDecimal(1),
      unlocked: false,
      icon: 'i-heroicons-home-modern',
    },
    {
      id: 'queenChamber',
      name: 'Queen Chamber',
      description: 'Nurtures new queens',
      tier: 3,
      count: createDecimal(0),
      baseCost: createDecimal(1000),
      costGrowth: createDecimal(1.2),
      baseProduction: createDecimal(1),
      unlocked: false,
      icon: 'i-heroicons-crown',
    },
    {
      id: 'colony',
      name: 'Colony',
      description: 'Expands your ant empire',
      tier: 4,
      count: createDecimal(0),
      baseCost: createDecimal(10000),
      costGrowth: createDecimal(1.25),
      baseProduction: createDecimal(1),
      unlocked: false,
      icon: 'i-heroicons-building-storefront',
    },
  ])

  // Resources
  const food = ref(createDecimal(10))
  const foodPerSecond = computed(() => {
    // Worker ants produce food directly
    return generators.value[0].count.mul(generators.value[0].baseProduction)
  })

  // Get a specific generator by ID
  const getGenerator = (id: string) => {
    return generators.value.find(g => g.id === id)
  }

  // Get all unlocked generators
  const unlockedGenerators = computed(() => {
    return generators.value.filter(g => g.unlocked)
  })

  // Calculate cost for the next generator purchase
  const getGeneratorCost = (id: string) => {
    const generator = getGenerator(id)
    if (!generator) return createDecimal(0)

    return calculateCost(generator.baseCost, generator.costGrowth, generator.count)
  }

  // Buy a generator
  const buyGenerator = (id: string, amount: number = 1) => {
    const generator = getGenerator(id)
    if (!generator) return false

    const cost = getGeneratorCost(id)

    if (food.value.gte(cost)) {
      food.value = food.value.sub(cost)
      generator.count = generator.count.add(amount)

      // Check for unlocking next tier
      unlockNextTier(generator.tier)

      return true
    }

    return false
  }

  // Unlock the next tier of generators if conditions are met
  const unlockNextTier = (currentTier: number) => {
    const currentGenerator = generators.value.find(g => g.tier === currentTier)
    const nextGenerator = generators.value.find(g => g.tier === currentTier + 1)

    if (currentGenerator && nextGenerator && !nextGenerator.unlocked) {
      // Unlock next tier when you have at least 10 of the current tier
      if (currentGenerator.count.gte(10)) {
        nextGenerator.unlocked = true
      }
    }
  }

  // Process generator production for a tick
  const tick = () => {
    // Process production from highest tier to lowest
    // Each tier produces units of the tier below it
    for (let i = generators.value.length - 1; i > 0; i--) {
      const generator = generators.value[i]
      const targetGenerator = generators.value[i - 1]

      if (generator.unlocked && generator.count.gt(0)) {
        // Each generator produces units of the tier below it
        const production = generator.count.mul(generator.baseProduction)
        targetGenerator.count = targetGenerator.count.add(production)
      }
    }

    // Worker ants (tier 1) produce food
    const workerAnts = generators.value[0]
    if (workerAnts.count.gt(0)) {
      const foodProduction = workerAnts.count.mul(workerAnts.baseProduction)
      food.value = food.value.add(foodProduction)
    }
  }

  // Format generator count for display
  const formatGeneratorCount = (id: string) => {
    const generator = getGenerator(id)
    if (!generator) return '0'

    return formatDecimal(generator.count, 0)
  }

  // Format food amount for display
  const formatFood = () => {
    return formatDecimal(food.value, 0)
  }

  // Get state for saving
  const getState = () => {
    return {
      generators: generators.value.map(g => ({
        id: g.id,
        count: g.count.toString(),
        unlocked: g.unlocked,
      })),
      food: food.value.toString(),
    }
  }

  // Load state
  const loadState = (state: any) => {
    if (state.food) {
      food.value = createDecimal(state.food)
    }

    if (state.generators && Array.isArray(state.generators)) {
      state.generators.forEach((savedGen: any) => {
        const generator = getGenerator(savedGen.id)
        if (generator) {
          generator.count = createDecimal(savedGen.count)
          generator.unlocked = savedGen.unlocked
        }
      })
    }
  }

  return {
    generators,
    unlockedGenerators,
    food,
    foodPerSecond,
    getGenerator,
    getGeneratorCost,
    buyGenerator,
    tick,
    formatGeneratorCount,
    formatFood,
    getState,
    loadState,
  }
})

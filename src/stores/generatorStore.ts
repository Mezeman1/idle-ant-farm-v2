import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal, calculateCost, calculateGeneratorCost } from '@/utils/decimalUtils'
import { usePrestigeStore } from './prestigeStore'
import { useGeneratorUpgradeStore } from './generatorUpgradeStore'

// Generator types
export interface Generator {
  id: string
  name: string
  description: string
  tier: number
  count: Decimal
  manualPurchases: Decimal // Track manually purchased units separately
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
      manualPurchases: createDecimal(0),
      baseCost: createDecimal(10),
      costGrowth: createDecimal(1.1),
      baseProduction: createDecimal(10),
      unlocked: true,
      icon: 'i-heroicons-bug-ant',
    },
    {
      id: 'nursery',
      name: 'Nursery',
      description: 'Produces worker ants',
      tier: 2,
      count: createDecimal(0),
      manualPurchases: createDecimal(0),
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
      manualPurchases: createDecimal(0),
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
      manualPurchases: createDecimal(0),
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
    const workerAnts = generators.value[0]

    // Apply prestige multipliers
    let multiplier = createDecimal(1)
    try {
      const prestigeStore = usePrestigeStore()

      // Apply food processing multiplier
      multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('foodProcessing'))

      // Apply mutated workers multiplier
      multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('mutatedWorkers'))

      // Apply stronger soldiers multiplier (general efficiency)
      multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))
    } catch (error) {
      // Prestige store might not be initialized yet
      console.error('Error applying prestige multipliers:', error)
    }

    return workerAnts.count.mul(workerAnts.baseProduction).mul(multiplier)
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

    // Apply cost reduction from generator upgrades
    let costMultiplier = createDecimal(1)
    try {
      const generatorUpgradeStore = useGeneratorUpgradeStore()

      // Apply specific cost reduction upgrades based on generator type
      if (id === 'worker') {
        costMultiplier = generatorUpgradeStore.getUpgradeMultiplier('workerTraining')
      } else if (id === 'nursery') {
        costMultiplier = generatorUpgradeStore.getUpgradeMultiplier('nurseryExpansion')
      } else if (id === 'queenChamber') {
        costMultiplier = generatorUpgradeStore.getUpgradeMultiplier('queenLongevity')
      } else if (id === 'colony') {
        costMultiplier = generatorUpgradeStore.getUpgradeMultiplier('colonyExpansion')
      }
    } catch (error) {
      console.error('Error applying cost reduction:', error)
    }

    // Use the new tier-based cost calculation
    const cost = calculateGeneratorCost(generator.tier, generator.manualPurchases)

    // Apply cost multiplier (reduction)
    return cost.mul(costMultiplier)
  }

  // Buy a generator
  const buyGenerator = (id: string, amount: number = 1) => {
    const generator = getGenerator(id)
    if (!generator) return false

    const cost = getGeneratorCost(id)

    if (food.value.gte(cost)) {
      food.value = food.value.sub(cost)
      generator.count = generator.count.add(amount)
      generator.manualPurchases = generator.manualPurchases.add(amount)

      // Check for unlocking next tier
      unlockNextTier(generator.tier)

      // Update queen chamber progress for manual purchases
      try {
        const generatorUpgradeStore = useGeneratorUpgradeStore()
        generatorUpgradeStore.updateQueenChamberProgress(amount)
      } catch (error) {
        console.error('Error updating queen chamber progress:', error)
      }

      return true
    }

    return false
  }

  // Add generators automatically (from production)
  const addGeneratorAuto = (id: string, amount: Decimal) => {
    const generator = getGenerator(id)
    if (!generator) return

    // Only increase count, not manual purchases
    generator.count = generator.count.add(amount)

    // Check for unlocking next tier
    if (generator.count.gte(10)) {
      unlockNextTier(generator.tier)
    }
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
    // Get prestige multipliers
    let generalMultiplier = createDecimal(1)
    let queenMultiplier = createDecimal(1)

    try {
      const prestigeStore = usePrestigeStore()
      const generatorUpgradeStore = useGeneratorUpgradeStore()

      // Apply stronger soldiers multiplier (general efficiency)
      generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))

      // Apply efficient queens multiplier
      queenMultiplier = queenMultiplier.mul(prestigeStore.getUpgradeMultiplier('efficientQueens'))

      // Apply generator-specific upgrade multipliers
      for (const generator of generators.value) {
        if (generator.id === 'worker') {
          // Apply worker efficiency multiplier
          generalMultiplier = generalMultiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('workerEfficiency'))
        } else if (generator.id === 'nursery') {
          // Apply nursery efficiency multiplier
          generalMultiplier = generalMultiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('nurseryEfficiency'))
        } else if (generator.id === 'queenChamber') {
          // Apply queen efficiency multiplier
          generalMultiplier = generalMultiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('queenEfficiency'))
        } else if (generator.id === 'colony') {
          // Apply colony efficiency multiplier
          generalMultiplier = generalMultiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('colonyEfficiency'))
        }
      }
    } catch (error) {
      // Stores might not be initialized yet
      console.error('Error applying multipliers:', error)
    }

    // Track food gained in this tick for nursery progress
    let foodGained = createDecimal(0)

    // Process production from highest tier to lowest
    // Each tier produces units of the tier below it
    for (let i = generators.value.length - 1; i > 0; i--) {
      const generator = generators.value[i]
      const targetGenerator = generators.value[i - 1]

      if (generator.unlocked && generator.count.gt(0)) {
        // Each generator produces units of the tier below it
        let production = generator.count.mul(generator.baseProduction)

        // Apply general multiplier
        production = production.mul(generalMultiplier)

        // Apply queen multiplier for queen chambers
        if (generator.id === 'queenChamber') {
          production = production.mul(queenMultiplier)
        }

        // Add the produced units to the target generator
        addGeneratorAuto(targetGenerator.id, production)

        // Check for auto-generation of generators based on upgrades
        try {
          const generatorUpgradeStore = useGeneratorUpgradeStore()

          // Worker reproduction
          if (generator.id === 'worker') {
            const reproductionChance = generatorUpgradeStore.getUpgradeMultiplier('workerReproduction')
            if (reproductionChance.gt(0) && Math.random() < reproductionChance.toNumber()) {
              addGeneratorAuto('worker', createDecimal(1))
            }
          }
          // Nursery automation
          else if (generator.id === 'nursery') {
            const automationChance = generatorUpgradeStore.getUpgradeMultiplier('nurseryAutomation')
            if (automationChance.gt(0) && Math.random() < automationChance.toNumber()) {
              addGeneratorAuto('nursery', createDecimal(1))
            }
          }
          // Queen fertility
          else if (generator.id === 'queenChamber') {
            const fertilityChance = generatorUpgradeStore.getUpgradeMultiplier('queenFertility')
            if (fertilityChance.gt(0) && Math.random() < fertilityChance.toNumber()) {
              addGeneratorAuto('queenChamber', createDecimal(1))
            }
          }
          // Colony dominance
          else if (generator.id === 'colony') {
            const dominanceChance = generatorUpgradeStore.getUpgradeMultiplier('colonyDominance')
            if (dominanceChance.gt(0) && Math.random() < dominanceChance.toNumber()) {
              addGeneratorAuto('colony', createDecimal(1))
            }
          }
        } catch (error) {
          console.error('Error applying generator auto-generation:', error)
        }
      }
    }

    // Worker ants produce food
    const workerAnts = generators.value[0]
    if (workerAnts.unlocked && workerAnts.count.gt(0)) {
      // Calculate food production
      let foodProduction = foodPerSecond.value

      // Add food
      food.value = food.value.add(foodProduction)
      foodGained = foodProduction

      // Update nursery progress based on food gained
      try {
        const generatorUpgradeStore = useGeneratorUpgradeStore()
        generatorUpgradeStore.updateNurseryProgress(foodGained)
      } catch (error) {
        console.error('Error updating nursery progress:', error)
      }
    }
  }

  // Format generator count for display
  const formatGeneratorCount = (id: string) => {
    const generator = getGenerator(id)
    if (!generator) return '0'

    return formatDecimal(generator.count, 0)
  }

  // Format manual purchases for display
  const formatManualPurchases = (id: string) => {
    const generator = getGenerator(id)
    if (!generator) return '0'

    return formatDecimal(generator.manualPurchases, 0)
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
        manualPurchases: g.manualPurchases.toString(),
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

          // Handle loading manual purchases (for backward compatibility)
          if (savedGen.manualPurchases) {
            generator.manualPurchases = createDecimal(savedGen.manualPurchases)
          } else {
            // If no manual purchases in save, assume all were manual
            generator.manualPurchases = createDecimal(savedGen.count)
          }

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
    addGeneratorAuto,
    tick,
    formatGeneratorCount,
    formatManualPurchases,
    formatFood,
    getState,
    loadState,
  }
})

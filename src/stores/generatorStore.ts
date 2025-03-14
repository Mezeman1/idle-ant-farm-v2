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
  purchasable: boolean // Whether the generator can be purchased (for advanced generators)
  icon: string
  autoPurchaseEnabled: boolean // Toggle for auto-purchasing
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
      purchasable: false,
      icon: 'i-heroicons-bug-ant',
      autoPurchaseEnabled: true,
    },
    {
      id: 'nursery',
      name: 'Nursery',
      description: 'Produces worker ants',
      tier: 2,
      count: createDecimal(0),
      manualPurchases: createDecimal(0),
      baseCost: createDecimal(100),
      costGrowth: createDecimal(1.1),
      baseProduction: createDecimal(1),
      unlocked: false,
      purchasable: false,
      icon: 'i-heroicons-home-modern',
      autoPurchaseEnabled: true,
    },
    {
      id: 'queenChamber',
      name: 'Queen Chamber',
      description: 'Nurtures new queens',
      tier: 3,
      count: createDecimal(0),
      manualPurchases: createDecimal(0),
      baseCost: createDecimal(1000),
      costGrowth: createDecimal(1.1),
      baseProduction: createDecimal(1),
      unlocked: false,
      purchasable: false,
      icon: 'i-heroicons-crown',
      autoPurchaseEnabled: true,
    },
    {
      id: 'colony',
      name: 'Colony',
      description: 'Expands your ant empire',
      tier: 4,
      count: createDecimal(0),
      manualPurchases: createDecimal(0),
      baseCost: createDecimal(10000),
      costGrowth: createDecimal(1.1),
      baseProduction: createDecimal(1),
      unlocked: false,
      purchasable: false,
      icon: 'i-heroicons-building-storefront',
      autoPurchaseEnabled: true,
    },
    // Advanced generators (unlocked through prestige upgrades)
    {
      id: 'megacolony',
      name: 'Mega Colony',
      description: 'A massive colony complex with advanced infrastructure',
      tier: 5,
      count: createDecimal(0),
      manualPurchases: createDecimal(0),
      baseCost: createDecimal(100000),
      costGrowth: createDecimal(1.2),
      baseProduction: createDecimal(1),
      unlocked: false,
      purchasable: false,
      icon: 'i-heroicons-building-office-2',
      autoPurchaseEnabled: true,
    },
    {
      id: 'hivemind',
      name: 'Hive Mind',
      description: 'A collective consciousness that coordinates all colonies',
      tier: 6,
      count: createDecimal(0),
      manualPurchases: createDecimal(0),
      baseCost: createDecimal(1000000),
      costGrowth: createDecimal(1.2),
      baseProduction: createDecimal(1),
      unlocked: false,
      purchasable: false,
      icon: 'i-heroicons-cpu-chip',
      autoPurchaseEnabled: true,
    },
    {
      id: 'antopolis',
      name: 'Antopolis',
      description: 'An entire city-state of ants with advanced civilization',
      tier: 7,
      count: createDecimal(0),
      manualPurchases: createDecimal(0),
      baseCost: createDecimal(10000000),
      costGrowth: createDecimal(1.2),
      baseProduction: createDecimal(1),
      unlocked: false,
      purchasable: false,
      icon: 'i-heroicons-building-library',
      autoPurchaseEnabled: true,
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
      const generatorUpgradeStore = useGeneratorUpgradeStore()

      // Apply food processing multiplier
      multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('foodProcessing'))

      // Apply mutated workers multiplier
      multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('mutatedWorkers'))

      // Apply stronger soldiers multiplier (general efficiency)
      multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))

      // Apply worker efficiency upgrades
      multiplier = multiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('workerEfficiency'))
      multiplier = multiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('workerForaging'))
      multiplier = multiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('workerEndurance'))
    } catch (error) {
      // Stores might not be initialized yet
      console.error('Error applying multipliers:', error)
    }

    return workerAnts.count.mul(workerAnts.baseProduction).mul(multiplier)
  })

  // Get a specific generator by ID
  const getGenerator = (id: string) => {
    return generators.value.find(g => g.id === id)
  }

  // Get all unlocked generators
  const unlockedGenerators = computed(() => {
    return generators.value.filter(g => g.unlocked || g.purchasable)
  })

  // Get the next unlockable generator
  const nextUnlockableGenerator = computed(() => {
    // Only consider regular generators (tier <= 4) when calculating the highest unlocked tier
    const highestUnlockedTier = Math.max(...generators.value.filter(g => g.unlocked && g.tier <= 4).map(g => g.tier))
    const nextTier = highestUnlockedTier + 1
    const nextGenerator = generators.value.find(g => g.tier === nextTier)

    // Don't show advanced generators (tier 5+) in the next unlockable slot
    // They should only be visible after being unlocked through prestige upgrades
    if (nextGenerator && nextGenerator.tier >= 5) {
      return undefined
    }

    return nextGenerator
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
        costMultiplier = generatorUpgradeStore.getUpgradeMultiplier('queenChamberLongevity')
      } else if (id === 'colony') {
        costMultiplier = generatorUpgradeStore.getUpgradeMultiplier('colonyExpansion')
      } else if (id === 'megacolony' || id === 'hivemind' || id === 'antopolis') {
        // Advanced generators don't have specific cost reduction upgrades yet
        // But we could apply a general prestige multiplier if needed
        try {
          const prestigeStore = usePrestigeStore()
          // Apply stronger soldiers multiplier as a general efficiency bonus
          costMultiplier = prestigeStore.getUpgradeMultiplier('strongerSoldiers')
        } catch (error) {
          console.error('Error applying advanced generator cost reduction:', error)
        }
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

    // Check if generator is unlocked or purchasable
    if (!generator.unlocked && !generator.purchasable) {
      return false
    }

    // Check dependencies for advanced generators
    if (id === 'hivemind') {
      // Check if megacolony has been purchased
      const megacolony = getGenerator('megacolony')
      if (!megacolony || megacolony.count.eq(0)) {
        return false // Cannot buy Hive Mind without having at least one Mega Colony
      }
    } else if (id === 'antopolis') {
      // Check if hivemind has been purchased
      const hivemind = getGenerator('hivemind')
      if (!hivemind || hivemind.count.eq(0)) {
        return false // Cannot buy Antopolis without having at least one Hive Mind
      }
    }

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

        // Update progress for advanced generators
        if (id === 'colony') {
          generatorUpgradeStore.updateMegacolonyProgress(amount)
        } else if (id === 'megacolony') {
          generatorUpgradeStore.updateHivemindProgress(amount)
        } else if (id === 'hivemind') {
          generatorUpgradeStore.updateAntopolisProgress(amount)
        }
      } catch (error) {
        console.error('Error updating generator progress:', error)
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

      // Apply exponential growth multiplier (affects all production)
      generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('exponentialGrowth'))

      // Apply compound evolution multiplier (affects all generators)
      generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('compoundEvolution'))

      // Apply generator synergy bonus
      generalMultiplier = generalMultiplier.mul(
        prestigeStore.getAllMultipliers()['generatorSynergyBonus'] || createDecimal(1)
      )

      // Apply evolution synergy bonus
      generalMultiplier = generalMultiplier.mul(
        prestigeStore.getAllMultipliers()['evolutionSynergyBonus'] || createDecimal(1)
      )

      // Apply efficient queens multiplier
      queenMultiplier = queenMultiplier.mul(prestigeStore.getUpgradeMultiplier('efficientQueens'))

      // Apply generator-specific upgrade multipliers
      for (const generator of generators.value) {
        if (generator.id === 'worker') {
          // Apply worker efficiency multiplier
          generalMultiplier = generalMultiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('workerEfficiency'))
          // Apply mutated workers multiplier
          generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('mutatedWorkers'))
        } else if (generator.id === 'nursery') {
          // Apply nursery efficiency multiplier
          generalMultiplier = generalMultiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('nurseryEfficiency'))
          // Apply new nursery efficiency prestige upgrade
          generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('nurseryEfficiency'))
        } else if (generator.id === 'queenChamber') {
          // Apply queen efficiency multiplier
          generalMultiplier = generalMultiplier.mul(
            generatorUpgradeStore.getUpgradeMultiplier('queenChamberEfficiency')
          )
        } else if (generator.id === 'colony') {
          // Apply colony efficiency multiplier
          generalMultiplier = generalMultiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('colonyEfficiency'))
          // Apply colony expansion prestige upgrade
          generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('colonyExpansion'))
        } else if (generator.id === 'megacolony') {
          // Apply megacolony efficiency prestige upgrade
          generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('megacolonyEfficiency'))

          // For advanced generators, apply a stronger multiplier based on their tier
          const tierBonus = createDecimal(1 + (generator.tier - 4) * 0.1) // +10% per tier above colony
          generalMultiplier = generalMultiplier.mul(tierBonus)

          // Also apply the stronger soldiers multiplier as a general efficiency bonus
          generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))
        } else if (generator.id === 'hivemind') {
          // Apply hivemind efficiency prestige upgrade
          generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('hivemindEfficiency'))

          // For advanced generators, apply a stronger multiplier based on their tier
          const tierBonus = createDecimal(1 + (generator.tier - 4) * 0.1) // +10% per tier above colony
          generalMultiplier = generalMultiplier.mul(tierBonus)

          // Also apply the stronger soldiers multiplier as a general efficiency bonus
          generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))
        } else if (generator.id === 'antopolis') {
          // Apply antopolis efficiency prestige upgrade
          generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('antopolisEfficiency'))

          // For advanced generators, apply a stronger multiplier based on their tier
          const tierBonus = createDecimal(1 + (generator.tier - 4) * 0.1) // +10% per tier above colony
          generalMultiplier = generalMultiplier.mul(tierBonus)

          // Also apply the stronger soldiers multiplier as a general efficiency bonus
          generalMultiplier = generalMultiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))
        }
      }

      // Handle auto-purchasing from prestige upgrades
      // This needs to be done before production to ensure new generators contribute to this tick
      const autoGeneratorMap = {
        worker: 'autoWorker',
        nursery: 'autoNursery',
        queenChamber: 'autoQueenChamber',
        colony: 'autoColony',
        megacolony: 'autoMegacolony',
        hivemind: 'autoHivemind',
        antopolis: 'autoAntopolis',
      }

      // Process auto-purchases for each generator type
      for (const generator of generators.value) {
        if (generator.unlocked && generator.autoPurchaseEnabled) {
          const autoUpgradeId = autoGeneratorMap[generator.id as keyof typeof autoGeneratorMap]
          if (autoUpgradeId) {
            const purchasesPerTick = prestigeStore.getUpgradeMultiplier(autoUpgradeId)

            // Only attempt to purchase if the upgrade level is greater than 0
            if (purchasesPerTick.gt(0)) {
              // Try to purchase the specified number of generators
              for (let i = 0; i < purchasesPerTick.toNumber(); i++) {
                buyGenerator(generator.id, 1)
              }
            }
          }
        }
      }
    } catch (error) {
      // Stores might not be initialized yet
      console.error('Error applying multipliers or auto-purchasing:', error)
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
            const fertilityChance = generatorUpgradeStore.getUpgradeMultiplier('queenChamberFertility')
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
    return formatDecimal(food.value, 2)
  }

  // Get the production multiplier for a specific generator
  const getProductionMultiplier = (id: string) => {
    let multiplier = createDecimal(1)

    try {
      const prestigeStore = usePrestigeStore()
      const generatorUpgradeStore = useGeneratorUpgradeStore()

      // Apply general prestige multiplier
      multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))

      // Apply exponential growth multiplier (affects all production)
      multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('exponentialGrowth'))

      // Apply compound evolution multiplier (affects all generators)
      multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('compoundEvolution'))

      // Apply generator synergy bonus
      multiplier = multiplier.mul(prestigeStore.getAllMultipliers()['generatorSynergyBonus'] || createDecimal(1))

      // Apply evolution synergy bonus
      multiplier = multiplier.mul(prestigeStore.getAllMultipliers()['evolutionSynergyBonus'] || createDecimal(1))

      // Apply generator-specific upgrade multipliers
      if (id === 'worker') {
        // Worker gets efficiency upgrades
        multiplier = multiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('workerEfficiency'))
        multiplier = multiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('workerForaging'))
        multiplier = multiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('workerEndurance'))

        // Worker also gets prestige upgrades
        multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('foodProcessing'))
        multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('mutatedWorkers'))
      } else if (id === 'nursery') {
        multiplier = multiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('nurseryEfficiency'))
        // Apply new nursery efficiency prestige upgrade
        multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('nurseryEfficiency'))
      } else if (id === 'queenChamber') {
        multiplier = multiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('queenChamberEfficiency'))
        // Apply queen multiplier for queen chambers
        multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('efficientQueens'))
      } else if (id === 'colony') {
        multiplier = multiplier.mul(generatorUpgradeStore.getUpgradeMultiplier('colonyEfficiency'))
        // Apply colony expansion prestige upgrade
        multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('colonyExpansion'))
      } else if (id === 'megacolony') {
        // Apply megacolony efficiency prestige upgrade
        multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('megacolonyEfficiency'))

        // For advanced generators, apply a stronger multiplier based on their tier
        const generator = getGenerator(id)
        if (generator) {
          const tierBonus = createDecimal(1 + (generator.tier - 4) * 0.1) // +10% per tier above colony
          multiplier = multiplier.mul(tierBonus)
          // Also apply the stronger soldiers multiplier again as a general efficiency bonus
          multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))
        }
      } else if (id === 'hivemind') {
        // Apply hivemind efficiency prestige upgrade
        multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('hivemindEfficiency'))

        // For advanced generators, apply a stronger multiplier based on their tier
        const generator = getGenerator(id)
        if (generator) {
          const tierBonus = createDecimal(1 + (generator.tier - 4) * 0.1) // +10% per tier above colony
          multiplier = multiplier.mul(tierBonus)
          // Also apply the stronger soldiers multiplier again as a general efficiency bonus
          multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))
        }
      } else if (id === 'antopolis') {
        // Apply antopolis efficiency prestige upgrade
        multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('antopolisEfficiency'))

        // For advanced generators, apply a stronger multiplier based on their tier
        const generator = getGenerator(id)
        if (generator) {
          const tierBonus = createDecimal(1 + (generator.tier - 4) * 0.1) // +10% per tier above colony
          multiplier = multiplier.mul(tierBonus)
          // Also apply the stronger soldiers multiplier again as a general efficiency bonus
          multiplier = multiplier.mul(prestigeStore.getUpgradeMultiplier('strongerSoldiers'))
        }
      }
    } catch (error) {
      console.error('Error calculating production multiplier:', error)
    }

    return multiplier
  }

  // Format the production multiplier for display
  const formatProductionMultiplier = (id: string) => {
    const multiplier = getProductionMultiplier(id)
    return `${formatDecimal(multiplier, 2)}x`
  }

  // Toggle auto-purchase for a generator
  const toggleAutoPurchase = (id: string) => {
    const generator = getGenerator(id)
    if (generator) {
      generator.autoPurchaseEnabled = !generator.autoPurchaseEnabled
      return true
    }
    return false
  }

  // Get state for saving
  const getState = () => {
    return {
      food: food.value.toString(),
      generators: generators.value.map(generator => ({
        id: generator.id,
        count: generator.count.toString(),
        manualPurchases: generator.manualPurchases.toString(),
        unlocked: generator.unlocked,
        purchasable: generator.purchasable,
        autoPurchaseEnabled: generator.autoPurchaseEnabled,
      })),
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

          // Load purchasable property (with backward compatibility)
          if (savedGen.purchasable !== undefined) {
            generator.purchasable = savedGen.purchasable
          } else if (generator.tier >= 5 && savedGen.unlocked) {
            // For backward compatibility: if an advanced generator was unlocked in the save,
            // set purchasable to true and unlocked to false
            generator.purchasable = true
            generator.unlocked = false
          }

          // Load auto-purchase toggle (with backward compatibility)
          if (savedGen.autoPurchaseEnabled !== undefined) {
            generator.autoPurchaseEnabled = savedGen.autoPurchaseEnabled
          }
        }
      })
    }
  }

  // Get total points available

  const totalPointsAvailable = computed(() => {
    let total = 0
    Object.values(useGeneratorUpgradeStore().generatorPoints).forEach((points: Decimal) => {
      total += points.toNumber()
    })
    return total
  })

  return {
    generators,
    unlockedGenerators,
    nextUnlockableGenerator,
    food,
    foodPerSecond,
    totalPointsAvailable,
    getGenerator,
    getGeneratorCost,
    buyGenerator,
    addGeneratorAuto,
    unlockNextTier,
    tick,
    formatGeneratorCount,
    formatManualPurchases,
    formatFood,
    getProductionMultiplier,
    formatProductionMultiplier,
    toggleAutoPurchase,
    getState,
    loadState,
  }
})

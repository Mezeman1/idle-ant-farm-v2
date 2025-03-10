import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'
import { useGeneratorStore } from './generatorStore'
import { useGameStore } from './gameStore'
import { useGeneratorUpgradeStore } from './generatorUpgradeStore'

// Evolution upgrade interface
export interface EvolutionUpgrade {
  id: string
  name: string
  description: string
  cost: Decimal
  level: Decimal
  maxLevel: Decimal | null // null means no max level
  effect: (level: Decimal) => Decimal // Returns multiplier based on level
  icon: string
  unlocked: boolean
}

export const usePrestigeStore = defineStore('prestige', () => {
  // Evolution stats
  const evolutionPoints = ref(createDecimal(0))
  const evolutionCount = ref(createDecimal(0))
  const currentLoopTicks = ref(createDecimal(0)) // Current ticks in this loop
  const loopsCompleted = ref(createDecimal(0))
  const ticksPerLoop = ref(createDecimal(3)) // Base requirement: 3 trips per cycle
  const foodForNextLoop = ref(createDecimal(1000)) // Base requirement: 1000 food for first cycle

  // Evolution requirements
  const requiredLoops = computed(() => {
    // Scaling cycle requirement based on evolution count (CIFI pattern)
    const evolutionCountNum = evolutionCount.value.toNumber()
    let requirement = 3 // Base requirement is 3 cycles

    if (evolutionCountNum <= 100) {
      // Resets 1-100: +0.95 cycles per evolution
      requirement += evolutionCountNum * 0.95
    } else if (evolutionCountNum <= 150) {
      // Resets 101-150: +1.35 cycles per evolution
      requirement = 3 + 100 * 0.95 + (evolutionCountNum - 100) * 1.35
    } else if (evolutionCountNum <= 200) {
      // Resets 151-200: +1.95 cycles per evolution
      requirement = 3 + 100 * 0.95 + 50 * 1.35 + (evolutionCountNum - 150) * 1.95
    } else if (evolutionCountNum <= 250) {
      // Resets 201-250: +2.55 cycles per evolution
      requirement = 3 + 100 * 0.95 + 50 * 1.35 + 50 * 1.95 + (evolutionCountNum - 200) * 2.55
    } else if (evolutionCountNum <= 300) {
      // Resets 251-300: +3.25 cycles per evolution
      requirement = 3 + 100 * 0.95 + 50 * 1.35 + 50 * 1.95 + 50 * 2.55 + (evolutionCountNum - 250) * 3.25
    } else {
      // Resets 301+: +4.05 cycles per evolution
      requirement = 3 + 100 * 0.95 + 50 * 1.35 + 50 * 1.95 + 50 * 2.55 + 50 * 3.25 + (evolutionCountNum - 300) * 4.05
    }

    return createDecimal(requirement)
  })

  // Evolution upgrades
  const evolutionUpgrades = ref<EvolutionUpgrade[]>([
    {
      id: 'foodProcessing',
      name: 'Faster Food Processing',
      description: 'Increases food production by 10% per level',
      cost: createDecimal(1),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.1)), // 1 + (level * 0.1)
      icon: 'i-heroicons-cake',
      unlocked: true,
    },
    {
      id: 'efficientQueens',
      name: 'Efficient Queens',
      description: 'Queens produce 15% more nurseries per level',
      cost: createDecimal(2),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.15)), // 1 + (level * 0.15)
      icon: 'i-heroicons-crown',
      unlocked: true,
    },
    {
      id: 'shorterLoops',
      name: 'Shorter Cycle Duration',
      description: 'Reduces cycle completion time by 5% per level',
      cost: createDecimal(3),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.05)), // 1 + (level * 0.05)
      icon: 'i-heroicons-clock',
      unlocked: true,
    },
    {
      id: 'strongerSoldiers',
      name: 'Stronger Soldier Ants',
      description: 'Increases overall colony efficiency by 5% per level',
      cost: createDecimal(5),
      level: createDecimal(0),
      maxLevel: null, // No max level
      effect: level => createDecimal(1).add(level.mul(0.05)), // 1 + (level * 0.05)
      icon: 'i-heroicons-shield-check',
      unlocked: true,
    },
    {
      id: 'mutatedWorkers',
      name: 'Mutated Worker Ants',
      description: 'Worker ants are 20% more efficient per level',
      cost: createDecimal(3),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(1).add(level.mul(0.2)), // 1 + (level * 0.2)
      icon: 'i-heroicons-bug-ant',
      unlocked: true,
    },
    // Advanced generator unlocks
    {
      id: 'unlockMegacolony',
      name: 'Mega Colony Research',
      description: 'Unlocks the Mega Colony generator',
      cost: createDecimal(1000),
      level: createDecimal(0),
      maxLevel: createDecimal(1),
      effect: level => createDecimal(level), // 0 or 1 (unlocked or not)
      icon: 'i-heroicons-building-office-2',
      unlocked: true,
    },
    {
      id: 'unlockHivemind',
      name: 'Hive Mind Research',
      description: 'Unlocks the Hive Mind generator',
      cost: createDecimal(1e6),
      level: createDecimal(0),
      maxLevel: createDecimal(1),
      effect: level => createDecimal(level), // 0 or 1 (unlocked or not)
      icon: 'i-heroicons-cpu-chip',
      unlocked: false, // Only unlocked after purchasing Mega Colony
    },
    {
      id: 'unlockAntopolis',
      name: 'Antopolis Research',
      description: 'Unlocks the Antopolis generator',
      cost: createDecimal(1e9),
      level: createDecimal(0),
      maxLevel: createDecimal(1),
      effect: level => createDecimal(level), // 0 or 1 (unlocked or not)
      icon: 'i-heroicons-building-library',
      unlocked: false, // Only unlocked after purchasing Hive Mind
    },
    // New upgrades for cycle time and EP gain
    {
      id: 'cycleTimeReduction',
      name: 'Time Manipulation',
      description: 'Decreases cycle time by 0.2 seconds per level',
      cost: createDecimal(50), // Expensive starting cost
      level: createDecimal(0),
      maxLevel: createDecimal(10), // Max 2 seconds reduction
      effect: level => createDecimal(0.2).mul(level), // 0.2s reduction per level
      icon: 'i-heroicons-clock-solid',
      unlocked: true,
    },
    {
      id: 'epBoost',
      name: 'Evolution Mastery',
      description: 'Increases Evolution Points gained per cycle by 10% per level',
      cost: createDecimal(25),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.1)), // +10% per level
      icon: 'i-heroicons-star',
      unlocked: true,
    },
  ])

  // Get multiplier for a specific upgrade
  const getUpgradeMultiplier = (upgradeId: string) => {
    const upgrade = evolutionUpgrades.value.find(u => u.id === upgradeId)
    if (!upgrade) return createDecimal(1) // Default multiplier is 1 (no effect)

    return upgrade.effect(upgrade.level)
  }

  // Get all active multipliers
  const getAllMultipliers = () => {
    const multipliers: Record<string, Decimal> = {}

    evolutionUpgrades.value.forEach(upgrade => {
      multipliers[upgrade.id] = upgrade.effect(upgrade.level)
    })

    return multipliers
  }

  // Check if evolution is possible
  const canEvolve = computed(() => {
    // Check if we have enough cycles
    return loopsCompleted.value.gte(requiredLoops.value)
  })

  // Calculate EP gain for evolution
  const calculateEvolutionPointsGain = () => {
    // Base EP gain is based on the number of cycles completed
    // Each cycle completed contributes to the total EP gain

    // Base points per cycle (starts at 1)
    const basePointsPerCycle = createDecimal(1)

    // Calculate total EP from all completed cycles using a mathematical formula
    // For an arithmetic progression with first term a=1 and common difference d=0.1:
    // Sum = n/2 * (2a + (n-1)d) where n is the number of cycles
    const loopsCompletedNum = loopsCompleted.value.toNumber()

    // If no cycles completed, return 0
    if (loopsCompletedNum <= 0) return createDecimal(0)

    // Calculate sum using the formula for arithmetic progression
    // Sum = n * a + n(n-1)/2 * d
    // Where a = 1 (base points) and d = 0.1 (increment per cycle)
    const n = createDecimal(loopsCompletedNum)
    const a = basePointsPerCycle
    const d = createDecimal(0.1)

    // n * a = n (since a = 1)
    // n(n-1)/2 * d = n(n-1) * 0.05
    const firstTerm = n
    const secondTerm = n.mul(n.sub(1)).mul(0.05)

    let totalEP = firstTerm.add(secondTerm)

    // Apply evolution count bonus (small bonus for higher evolution counts)
    const evolutionMultiplier = createDecimal(1).add(evolutionCount.value.div(10))
    totalEP = totalEP.mul(evolutionMultiplier)

    // Apply EP boost from Evolution Mastery upgrade
    const epBoostMultiplier = getUpgradeMultiplier('epBoost')
    totalEP = totalEP.mul(epBoostMultiplier)

    return totalEP
  }

  // Complete a foraging cycle and update requirements
  const completeLoop = () => {
    // Increment foraging cycles completed
    loopsCompleted.value = loopsCompleted.value.add(1)

    // Increase foraging trips required for next cycle (by 0.5 trips per cycle)
    ticksPerLoop.value = ticksPerLoop.value.add(0.5)

    // Increase food required for next cycle (exponential growth: ^1.1)
    foodForNextLoop.value = foodForNextLoop.value.pow(1.1)

    // Reset cycle progress
    currentLoopTicks.value = createDecimal(0)
  }

  // Update foraging cycle progress based on activity and check food-based completion
  const updateLoopProgress = (deltaTime: number) => {
    // Increment current ticks
    currentLoopTicks.value = currentLoopTicks.value.add(1)

    // Check if we have enough ticks for loop completion
    if (currentLoopTicks.value.gte(ticksPerLoop.value)) {
      currentLoopTicks.value = createDecimal(0)
      loopsCompleted.value = loopsCompleted.value.add(1)
    }

    // Check if foraging cycle completed via food
    const generatorStore = useGeneratorStore()

    if (generatorStore.food.gte(foodForNextLoop.value)) {
      // Complete foraging cycle via food (even if activity progress isn't complete)
      completeLoop()
    }
  }

  // Helper function to convert Decimal to number
  const toNumber = (decimal: Decimal): number => {
    return decimal.toNumber()
  }

  // Format EP for display
  const formatEP = () => {
    return formatDecimal(evolutionPoints.value, 2)
  }

  // Format evolution count for display
  const formatEvolutionCount = () => {
    return formatDecimal(evolutionCount.value, 0)
  }

  // Format cycles completed for display
  const formatLoopsCompleted = () => {
    return formatDecimal(loopsCompleted.value, 0)
  }

  // Format required cycles for display
  const formatRequiredLoops = () => {
    return formatDecimal(requiredLoops.value, 0)
  }

  // Format potential EP gain for display
  const formatPotentialEPGain = () => {
    const epGain = calculateEvolutionPointsGain()
    return formatDecimal(epGain, 2)
  }

  // Format trips per cycle for display
  const formatTicksPerLoop = () => {
    return formatDecimal(ticksPerLoop.value, 1)
  }

  // Format food for next cycle for display
  const formatFoodForNextLoop = () => {
    return formatDecimal(foodForNextLoop.value, 0)
  }

  // Get state for saving
  const getState = () => {
    return {
      evolutionPoints: evolutionPoints.value.toString(),
      evolutionCount: evolutionCount.value.toString(),
      loopsCompleted: loopsCompleted.value.toString(),
      currentLoopTicks: currentLoopTicks.value.toString(),
      ticksPerLoop: ticksPerLoop.value.toString(),
      foodForNextLoop: foodForNextLoop.value.toString(),
      upgrades: evolutionUpgrades.value.map(upgrade => ({
        id: upgrade.id,
        level: upgrade.level.toString(),
        cost: upgrade.cost.toString(),
      })),
    }
  }

  // Load state
  const loadState = (state: any) => {
    if (state.evolutionPoints) {
      evolutionPoints.value = createDecimal(state.evolutionPoints)
    }

    if (state.evolutionCount) {
      evolutionCount.value = createDecimal(state.evolutionCount)
    }

    if (state.loopsCompleted) {
      loopsCompleted.value = createDecimal(state.loopsCompleted)
    }

    if (state.currentLoopTicks) {
      currentLoopTicks.value = createDecimal(state.currentLoopTicks)
    }

    if (state.ticksPerLoop) {
      ticksPerLoop.value = createDecimal(state.ticksPerLoop)
    }

    if (state.foodForNextLoop) {
      foodForNextLoop.value = createDecimal(state.foodForNextLoop)
    } else if (state.antsForNextLoop) {
      // Migration from old save format
      foodForNextLoop.value = createDecimal(state.antsForNextLoop)
    }

    if (state.upgrades && Array.isArray(state.upgrades)) {
      state.upgrades.forEach((savedUpgrade: any) => {
        const upgrade = evolutionUpgrades.value.find(u => u.id === savedUpgrade.id)
        if (upgrade) {
          upgrade.level = createDecimal(savedUpgrade.level)
          upgrade.cost = createDecimal(savedUpgrade.cost)
        }
      })
    }
  }

  // Perform evolution (prestige)
  const evolve = () => {
    if (!canEvolve.value) return false

    // Calculate EP gain
    const epGain = calculateEvolutionPointsGain()
    evolutionPoints.value = evolutionPoints.value.add(epGain)

    // Increment evolution count
    evolutionCount.value = evolutionCount.value.add(1)

    // Reset all progress and resources
    resetProgress()

    return true
  }

  // Reset progress (but keep upgrades and EP)
  const resetProgress = () => {
    const generatorStore = useGeneratorStore()
    const generatorUpgradeStore = useGeneratorUpgradeStore()

    // Reset generators
    generatorStore.generators.forEach(generator => {
      generator.count = createDecimal(0)
      generator.manualPurchases = createDecimal(0)

      // Keep first tier unlocked, lock others except advanced generators unlocked through prestige
      if (generator.tier > 1 && generator.tier <= 4) {
        generator.unlocked = false
      }

      // For advanced generators (tier 5+), check if they should remain unlocked
      if (generator.tier >= 5) {
        // Check if the corresponding unlock upgrade is purchased
        const upgradeId =
          generator.id === 'megacolony'
            ? 'unlockMegacolony'
            : generator.id === 'hivemind'
              ? 'unlockHivemind'
              : generator.id === 'antopolis'
                ? 'unlockAntopolis'
                : ''

        if (upgradeId) {
          const upgrade = evolutionUpgrades.value.find(u => u.id === upgradeId)
          // Keep unlocked only if the upgrade is purchased (level > 0)
          generator.unlocked = upgrade ? upgrade.level.gt(0) : false
        } else {
          generator.unlocked = false
        }
      }
    })

    // Reset food
    generatorStore.food = createDecimal(10) // Start with 10 food

    // Reset cycle progress
    currentLoopTicks.value = createDecimal(0)
    loopsCompleted.value = createDecimal(0)
    ticksPerLoop.value = createDecimal(3) // Reset to base requirement
    foodForNextLoop.value = createDecimal(1000) // Reset to base requirement

    // Reset generator upgrades
    generatorUpgradeStore.resetProgress()

    // Don't reset total trips in gameStore
  }

  // Purchase an evolution upgrade
  const purchaseUpgrade = (upgradeId: string) => {
    const upgrade = evolutionUpgrades.value.find(u => u.id === upgradeId)
    if (!upgrade) return false

    // Check if max level reached
    if (upgrade.maxLevel && upgrade.level.gte(upgrade.maxLevel)) {
      return false
    }

    // Check if enough EP
    if (evolutionPoints.value.lt(upgrade.cost)) {
      return false
    }

    // Check dependencies for advanced generator upgrades
    if (upgradeId === 'unlockHivemind') {
      // Check if Mega Colony upgrade has been purchased
      const megaColonyUpgrade = evolutionUpgrades.value.find(u => u.id === 'unlockMegacolony')
      if (!megaColonyUpgrade || megaColonyUpgrade.level.eq(0)) {
        return false // Cannot purchase Hive Mind upgrade without Mega Colony upgrade
      }

      // Also check if player has at least one Mega Colony
      const generatorStore = useGeneratorStore()
      const megacolony = generatorStore.getGenerator('megacolony')
      if (!megacolony || megacolony.count.eq(0)) {
        return false // Cannot purchase Hive Mind upgrade without having at least one Mega Colony
      }
    } else if (upgradeId === 'unlockAntopolis') {
      // Check if Hive Mind upgrade has been purchased
      const hiveMindUpgrade = evolutionUpgrades.value.find(u => u.id === 'unlockHivemind')
      if (!hiveMindUpgrade || hiveMindUpgrade.level.eq(0)) {
        return false // Cannot purchase Antopolis upgrade without Hive Mind upgrade
      }

      // Also check if player has at least one Hive Mind
      const generatorStore = useGeneratorStore()
      const hivemind = generatorStore.getGenerator('hivemind')
      if (!hivemind || hivemind.count.eq(0)) {
        return false // Cannot purchase Antopolis upgrade without having at least one Hive Mind
      }
    }

    // Purchase upgrade
    evolutionPoints.value = evolutionPoints.value.sub(upgrade.cost)
    upgrade.level = upgrade.level.add(1)

    // Increase cost for next level (cost increases by 50% per level)
    upgrade.cost = upgrade.cost.mul(1.5)

    // Handle special upgrades for unlocking advanced generators
    if (upgradeId === 'unlockMegacolony') {
      // Unlock Mega Colony generator
      const generatorStore = useGeneratorStore()
      const megacolony = generatorStore.generators.find(g => g.id === 'megacolony')
      if (megacolony) {
        megacolony.unlocked = true
      }

      // Unlock the next upgrade in the sequence
      const hivemindUpgrade = evolutionUpgrades.value.find(u => u.id === 'unlockHivemind')
      if (hivemindUpgrade) {
        hivemindUpgrade.unlocked = true
      }
    } else if (upgradeId === 'unlockHivemind') {
      // Unlock Hive Mind generator
      const generatorStore = useGeneratorStore()
      const hivemind = generatorStore.generators.find(g => g.id === 'hivemind')
      if (hivemind) {
        hivemind.unlocked = true
      }

      // Unlock the next upgrade in the sequence
      const antopolisUpgrade = evolutionUpgrades.value.find(u => u.id === 'unlockAntopolis')
      if (antopolisUpgrade) {
        antopolisUpgrade.unlocked = true
      }
    } else if (upgradeId === 'unlockAntopolis') {
      // Unlock Antopolis generator
      const generatorStore = useGeneratorStore()
      const antopolis = generatorStore.generators.find(g => g.id === 'antopolis')
      if (antopolis) {
        antopolis.unlocked = true
      }
    }

    return true
  }

  return {
    evolutionPoints,
    evolutionCount,
    currentLoopTicks,
    loopsCompleted,
    ticksPerLoop,
    foodForNextLoop,
    requiredLoops,
    evolutionUpgrades,
    canEvolve,
    getUpgradeMultiplier,
    getAllMultipliers,
    evolve,
    resetProgress,
    purchaseUpgrade,
    updateLoopProgress,
    formatEP,
    formatEvolutionCount,
    formatLoopsCompleted,
    formatRequiredLoops,
    formatPotentialEPGain,
    formatTicksPerLoop,
    formatFoodForNextLoop,
    getState,
    loadState,
  }
})

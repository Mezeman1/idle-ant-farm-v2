import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'
import { useGeneratorStore } from './generatorStore'
import { useGameStore } from './gameStore'

// Generator upgrade interface
export interface GeneratorUpgrade {
  id: string
  generatorId: string // Which generator this upgrade is for
  name: string
  description: string
  cost: Decimal // Cost in generator points
  level: Decimal
  maxLevel: Decimal | null // null means no max level
  effect: (level: Decimal) => Decimal // Returns multiplier based on level
  icon: string
  unlocked: boolean
}

export const useGeneratorUpgradeStore = defineStore('generatorUpgrade', () => {
  // Generator levels and points
  const generatorLevels = ref({
    worker: createDecimal(1),
    nursery: createDecimal(1),
    queenChamber: createDecimal(1),
    colony: createDecimal(1),
  })

  const generatorPoints = ref({
    worker: createDecimal(0),
    nursery: createDecimal(0),
    queenChamber: createDecimal(0),
    colony: createDecimal(0),
  })

  // Progress tracking for leveling up
  const levelProgress = ref({
    worker: createDecimal(0), // Ticks in current evolution
    nursery: createDecimal(0), // Food gained
    queenChamber: createDecimal(0), // Manual purchases
    colony: createDecimal(0), // Upgrades purchased
  })

  // Requirements for next level
  const getLevelRequirement = (generatorId: string, level: Decimal) => {
    let baseRequirement: Decimal
    let growthRate: number

    // Set base requirements and growth rates based on generator type
    switch (generatorId) {
      case 'worker':
        baseRequirement = createDecimal(5) // 100 ticks for first level
        growthRate = 1.5 // 50% increase per level
        break
      case 'nursery':
        baseRequirement = createDecimal(1000) // 1000 food for first level
        growthRate = 2.0 // 100% increase per level - faster growth since food is easier to get
        break
      case 'queenChamber':
        baseRequirement = createDecimal(10) // 10 manual purchases for first level
        growthRate = 1.3 // 30% increase per level - slower growth to encourage manual purchases
        break
      case 'colony':
        baseRequirement = createDecimal(5) // 5 upgrades purchased for first level
        growthRate = 1.2 // 20% increase per level - slowest growth to encourage upgrades
        break
      default:
        baseRequirement = createDecimal(100)
        growthRate = 1.5
    }

    // Apply the specific growth rate for this generator type
    return baseRequirement.mul(level.pow(growthRate))
  }

  // Generator upgrades
  const generatorUpgrades = ref<GeneratorUpgrade[]>([
    // Worker Ant Upgrades
    {
      id: 'workerEfficiency',
      generatorId: 'worker',
      name: 'Worker Efficiency',
      description: 'Increases food production of worker ants',
      cost: createDecimal(1),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.2)), // +20% per level
      icon: 'i-heroicons-bolt',
      unlocked: true,
    },
    {
      id: 'workerTraining',
      generatorId: 'worker',
      name: 'Worker Training',
      description: 'Decreases the cost of worker ants',
      cost: createDecimal(1),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(1).sub(level.mul(0.05)), // -5% per level (max -25%)
      icon: 'i-heroicons-academic-cap',
      unlocked: true,
    },
    {
      id: 'workerReproduction',
      generatorId: 'worker',
      name: 'Worker Reproduction',
      description: 'Workers occasionally reproduce on their own',
      cost: createDecimal(3),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(level.mul(0.01)), // 1% chance per level to generate a free worker per tick
      icon: 'i-heroicons-heart',
      unlocked: true,
    },

    // Nursery Upgrades
    {
      id: 'nurseryEfficiency',
      generatorId: 'nursery',
      name: 'Nursery Efficiency',
      description: 'Increases worker ant production of nurseries',
      cost: createDecimal(1),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.2)), // +20% per level
      icon: 'i-heroicons-bolt',
      unlocked: true,
    },
    {
      id: 'nurseryExpansion',
      generatorId: 'nursery',
      name: 'Nursery Expansion',
      description: 'Decreases the cost of nurseries',
      cost: createDecimal(1),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(1).sub(level.mul(0.05)), // -5% per level (max -25%)
      icon: 'i-heroicons-home',
      unlocked: true,
    },
    {
      id: 'nurseryAutomation',
      generatorId: 'nursery',
      name: 'Nursery Automation',
      description: 'Nurseries occasionally build themselves',
      cost: createDecimal(3),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(level.mul(0.005)), // 0.5% chance per level to generate a free nursery per tick
      icon: 'i-heroicons-cog',
      unlocked: true,
    },

    // Queen Chamber Upgrades
    {
      id: 'queenEfficiency',
      generatorId: 'queenChamber',
      name: 'Queen Efficiency',
      description: 'Increases nursery production of queen chambers',
      cost: createDecimal(1),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.2)), // +20% per level
      icon: 'i-heroicons-bolt',
      unlocked: true,
    },
    {
      id: 'queenLongevity',
      generatorId: 'queenChamber',
      name: 'Queen Longevity',
      description: 'Decreases the cost of queen chambers',
      cost: createDecimal(1),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(1).sub(level.mul(0.05)), // -5% per level (max -25%)
      icon: 'i-heroicons-clock',
      unlocked: true,
    },
    {
      id: 'queenFertility',
      generatorId: 'queenChamber',
      name: 'Queen Fertility',
      description: 'Queen chambers occasionally create new queens',
      cost: createDecimal(3),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(level.mul(0.005)), // 0.5% chance per level to generate a free queen chamber per tick
      icon: 'i-heroicons-heart',
      unlocked: true,
    },

    // Colony Upgrades
    {
      id: 'colonyEfficiency',
      generatorId: 'colony',
      name: 'Colony Efficiency',
      description: 'Increases queen chamber production of colonies',
      cost: createDecimal(1),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.2)), // +20% per level
      icon: 'i-heroicons-bolt',
      unlocked: true,
    },
    {
      id: 'colonyExpansion',
      generatorId: 'colony',
      name: 'Colony Expansion',
      description: 'Decreases the cost of colonies',
      cost: createDecimal(1),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(1).sub(level.mul(0.05)), // -5% per level (max -25%)
      icon: 'i-heroicons-arrows-expand',
      unlocked: true,
    },
    {
      id: 'colonyDominance',
      generatorId: 'colony',
      name: 'Colony Dominance',
      description: 'Colonies occasionally establish new colonies',
      cost: createDecimal(3),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(level.mul(0.005)), // 0.5% chance per level to generate a free colony per tick
      icon: 'i-heroicons-globe-alt',
      unlocked: true,
    },
  ])

  // Get upgrades for a specific generator
  const getUpgradesForGenerator = (generatorId: string) => {
    return generatorUpgrades.value.filter(upgrade => upgrade.generatorId === generatorId)
  }

  // Get upgrade by ID
  const getUpgrade = (upgradeId: string) => {
    return generatorUpgrades.value.find(upgrade => upgrade.id === upgradeId)
  }

  // Get upgrade multiplier
  const getUpgradeMultiplier = (upgradeId: string) => {
    const upgrade = getUpgrade(upgradeId)
    if (!upgrade) return createDecimal(1)
    return upgrade.effect(upgrade.level)
  }

  // Get all multipliers for a generator
  const getMultipliersForGenerator = (generatorId: string) => {
    const upgrades = getUpgradesForGenerator(generatorId)
    const multipliers = {}

    upgrades.forEach(upgrade => {
      multipliers[upgrade.id] = upgrade.effect(upgrade.level)
    })

    return multipliers
  }

  // Update progress for generator levels
  const updateProgress = (generatorId: string, amount: Decimal) => {
    levelProgress.value[generatorId] = levelProgress.value[generatorId].add(amount)

    // Check if level up
    const currentLevel = generatorLevels.value[generatorId]
    const requirement = getLevelRequirement(generatorId, currentLevel)

    if (levelProgress.value[generatorId].gte(requirement)) {
      // Level up
      generatorLevels.value[generatorId] = generatorLevels.value[generatorId].add(1)
      // Reset progress
      levelProgress.value[generatorId] = levelProgress.value[generatorId].sub(requirement)
      // Award a point
      generatorPoints.value[generatorId] = generatorPoints.value[generatorId].add(1)
    }
  }

  // Update worker level based on ticks
  const updateWorkerProgress = (ticks: number) => {
    updateProgress('worker', createDecimal(ticks))
  }

  // Update nursery level based on food gained
  const updateNurseryProgress = (foodGained: Decimal) => {
    updateProgress('nursery', foodGained)
  }

  // Update queen chamber level based on manual purchases
  const updateQueenChamberProgress = (purchases: number) => {
    updateProgress('queenChamber', createDecimal(purchases))
  }

  // Update colony level based on upgrades purchased
  const updateColonyProgress = (upgradesPurchased: number) => {
    updateProgress('colony', createDecimal(upgradesPurchased))
  }

  // Purchase an upgrade
  const purchaseUpgrade = (upgradeId: string) => {
    const upgrade = getUpgrade(upgradeId)
    if (!upgrade) return false

    // Check if max level reached
    if (upgrade.maxLevel !== null && upgrade.level.gte(upgrade.maxLevel)) {
      return false
    }

    // Check if enough points
    if (generatorPoints.value[upgrade.generatorId].lt(upgrade.cost)) {
      return false
    }

    // Purchase upgrade
    generatorPoints.value[upgrade.generatorId] = generatorPoints.value[upgrade.generatorId].sub(upgrade.cost)
    upgrade.level = upgrade.level.add(1)

    // Update colony progress (for upgrades purchased)
    updateColonyProgress(1)

    return true
  }

  // Reset progress (called on evolution)
  const resetProgress = () => {
    // Reset levels to 1
    Object.keys(generatorLevels.value).forEach(key => {
      generatorLevels.value[key] = createDecimal(1)
    })

    // Reset points to 0
    Object.keys(generatorPoints.value).forEach(key => {
      generatorPoints.value[key] = createDecimal(0)
    })

    // Reset progress to 0
    Object.keys(levelProgress.value).forEach(key => {
      levelProgress.value[key] = createDecimal(0)
    })

    // Reset upgrade levels to 0
    generatorUpgrades.value.forEach(upgrade => {
      upgrade.level = createDecimal(0)
    })
  }

  // Format level for display
  const formatLevel = (generatorId: string) => {
    return formatDecimal(generatorLevels.value[generatorId], 0)
  }

  // Format points for display
  const formatPoints = (generatorId: string) => {
    return formatDecimal(generatorPoints.value[generatorId], 0)
  }

  // Format progress percentage for display
  const formatProgressPercentage = (generatorId: string) => {
    const currentLevel = generatorLevels.value[generatorId]
    const requirement = getLevelRequirement(generatorId, currentLevel)
    const progress = levelProgress.value[generatorId]

    const percentage = progress.div(requirement).mul(100).toNumber()
    return Math.min(100, Math.round(percentage))
  }

  // Format next level requirement for display
  const formatNextLevelRequirement = (generatorId: string) => {
    const currentLevel = generatorLevels.value[generatorId]
    const requirement = getLevelRequirement(generatorId, currentLevel)

    return formatDecimal(requirement, 0)
  }

  // Get state for saving
  const getState = () => {
    return {
      generatorLevels: Object.entries(generatorLevels.value).reduce((acc, [key, value]) => {
        acc[key] = value.toString()
        return acc
      }, {}),
      generatorPoints: Object.entries(generatorPoints.value).reduce((acc, [key, value]) => {
        acc[key] = value.toString()
        return acc
      }, {}),
      levelProgress: Object.entries(levelProgress.value).reduce((acc, [key, value]) => {
        acc[key] = value.toString()
        return acc
      }, {}),
      upgrades: generatorUpgrades.value.map(upgrade => ({
        id: upgrade.id,
        level: upgrade.level.toString(),
      })),
    }
  }

  // Load state
  const loadState = (state: any) => {
    if (state.generatorLevels) {
      Object.entries(state.generatorLevels).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || value instanceof Decimal) {
          generatorLevels.value[key] = createDecimal(value)
        }
      })
    }

    if (state.generatorPoints) {
      Object.entries(state.generatorPoints).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || value instanceof Decimal) {
          generatorPoints.value[key] = createDecimal(value)
        }
      })
    }

    if (state.levelProgress) {
      Object.entries(state.levelProgress).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || value instanceof Decimal) {
          levelProgress.value[key] = createDecimal(value)
        }
      })
    }

    if (state.upgrades && Array.isArray(state.upgrades)) {
      state.upgrades.forEach(upgradeState => {
        const upgrade = getUpgrade(upgradeState.id)
        if (
          upgrade &&
          upgradeState.level &&
          (typeof upgradeState.level === 'string' ||
            typeof upgradeState.level === 'number' ||
            upgradeState.level instanceof Decimal)
        ) {
          upgrade.level = createDecimal(upgradeState.level)
        }
      })
    }
  }

  return {
    generatorLevels,
    generatorPoints,
    levelProgress,
    generatorUpgrades,
    getUpgradesForGenerator,
    getUpgrade,
    getUpgradeMultiplier,
    getMultipliersForGenerator,
    updateWorkerProgress,
    updateNurseryProgress,
    updateQueenChamberProgress,
    updateColonyProgress,
    purchaseUpgrade,
    resetProgress,
    formatLevel,
    formatPoints,
    formatProgressPercentage,
    formatNextLevelRequirement,
    getState,
    loadState,
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'
import type { GeneratorId, GeneratorRecord, GeneratorUpgrade, GeneratorUpgradeState } from '@/types/generators'
import { generatorUpgrades as initialGeneratorUpgrades } from '@/data/generatorUpgrades'

export const useGeneratorUpgradeStore = defineStore('generatorUpgrade', () => {
  // Generator levels and points
  const generatorLevels = ref<GeneratorRecord>({
    worker: createDecimal(1),
    nursery: createDecimal(1),
    queenChamber: createDecimal(1),
    colony: createDecimal(1),
    megacolony: createDecimal(1),
    hivemind: createDecimal(1),
    antopolis: createDecimal(1),
  })

  const generatorPoints = ref<GeneratorRecord>({
    worker: createDecimal(0),
    nursery: createDecimal(0),
    queenChamber: createDecimal(0),
    colony: createDecimal(0),
    megacolony: createDecimal(0),
    hivemind: createDecimal(0),
    antopolis: createDecimal(0),
  })

  const levelProgress = ref<GeneratorRecord>({
    worker: createDecimal(0),
    nursery: createDecimal(0),
    queenChamber: createDecimal(0),
    colony: createDecimal(0),
    megacolony: createDecimal(0),
    hivemind: createDecimal(0),
    antopolis: createDecimal(0),
  })

  // Requirements for next level
  const getLevelRequirement = (generatorId: GeneratorId, level: Decimal) => {
    let baseRequirement: Decimal
    let growthRate: number

    // Set base requirements and growth rates based on generator type
    switch (generatorId) {
      case 'worker':
        baseRequirement = createDecimal(5)
        growthRate = 1.5
        break
      case 'nursery':
        baseRequirement = createDecimal(1000)
        growthRate = 10
        break
      case 'queenChamber':
        baseRequirement = createDecimal(10)
        growthRate = 1.3
        break
      case 'colony':
        baseRequirement = createDecimal(5)
        growthRate = 1.2
        break
      default:
        baseRequirement = createDecimal(100)
        growthRate = 1.5
    }

    return baseRequirement.mul(level.pow(growthRate))
  }

  // Generator upgrades
  const generatorUpgrades = ref<GeneratorUpgrade[]>(initialGeneratorUpgrades)

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

  // Get multipliers for a generator
  const getMultipliersForGenerator = (generatorId: GeneratorId) => {
    const upgrades = generatorUpgrades.value.filter(upgrade => upgrade.generatorId === generatorId)
    const multipliers: Record<string, Decimal> = {}

    upgrades.forEach(upgrade => {
      multipliers[upgrade.id] = upgrade.effect(upgrade.level)
    })

    return multipliers
  }

  // Update progress for generator levels
  const updateProgress = (generatorId: GeneratorId, amount: Decimal) => {
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

  // Update megacolony level based on colonies built
  const updateMegacolonyProgress = (coloniesBuilt: number) => {
    updateProgress('megacolony', createDecimal(coloniesBuilt))
  }

  // Update hivemind level based on megacolonies built
  const updateHivemindProgress = (megacoloniesBuilt: number) => {
    updateProgress('hivemind', createDecimal(megacoloniesBuilt))
  }

  // Update antopolis level based on hiveminds built
  const updateAntopolisProgress = (hivemindsBuilt: number) => {
    updateProgress('antopolis', createDecimal(hivemindsBuilt))
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

  // Get state for saving
  const getState = (): GeneratorUpgradeState => {
    return {
      generatorLevels: Object.entries(generatorLevels.value).reduce<Record<string, string>>((acc, [key, value]) => {
        if (isGeneratorId(key)) {
          acc[key] = value.toString()
        }
        return acc
      }, {}),
      generatorPoints: Object.entries(generatorPoints.value).reduce<Record<string, string>>((acc, [key, value]) => {
        if (isGeneratorId(key)) {
          acc[key] = value.toString()
        }
        return acc
      }, {}),
      levelProgress: Object.entries(levelProgress.value).reduce<Record<string, string>>((acc, [key, value]) => {
        if (isGeneratorId(key)) {
          acc[key] = value.toString()
        }
        return acc
      }, {}),
      upgrades: generatorUpgrades.value.map(upgrade => ({
        id: upgrade.id,
        level: upgrade.level.toString(),
      })),
    }
  }

  // Type guard for GeneratorId
  const isGeneratorId = (key: string): key is GeneratorId => {
    return ['worker', 'nursery', 'queenChamber', 'colony', 'megacolony', 'hivemind', 'antopolis'].includes(key)
  }

  // Load state
  const loadState = (state: Partial<GeneratorUpgradeState>) => {
    if (state.generatorLevels) {
      Object.entries(state.generatorLevels).forEach(([key, value]) => {
        if (isGeneratorId(key) && (typeof value === 'string' || typeof value === 'number')) {
          generatorLevels.value[key] = createDecimal(value)
        }
      })
    }

    if (state.generatorPoints) {
      Object.entries(state.generatorPoints).forEach(([key, value]) => {
        if (isGeneratorId(key) && (typeof value === 'string' || typeof value === 'number')) {
          generatorPoints.value[key] = createDecimal(value)
        }
      })
    }

    if (state.levelProgress) {
      Object.entries(state.levelProgress).forEach(([key, value]) => {
        if (isGeneratorId(key) && (typeof value === 'string' || typeof value === 'number')) {
          levelProgress.value[key] = createDecimal(value)
        }
      })
    }

    if (state.upgrades && Array.isArray(state.upgrades)) {
      state.upgrades.forEach((upgradeState: { id: string; level: string }) => {
        const upgrade = getUpgrade(upgradeState.id)
        if (
          upgrade &&
          upgradeState.level &&
          (typeof upgradeState.level === 'string' || typeof upgradeState.level === 'number')
        ) {
          upgrade.level = createDecimal(upgradeState.level)
        }
      })
    }
  }

  // Reset progress (called on evolution)
  const resetProgress = () => {
    const generatorIds = Object.keys(generatorLevels.value).filter(isGeneratorId)

    // Reset levels to 1
    generatorIds.forEach(key => {
      generatorLevels.value[key] = createDecimal(1)
    })

    // Reset points to 0
    generatorIds.forEach(key => {
      generatorPoints.value[key] = createDecimal(0)
    })

    // Reset progress to 0
    generatorIds.forEach(key => {
      levelProgress.value[key] = createDecimal(0)
    })

    // Reset upgrade levels to 0
    generatorUpgrades.value.forEach(upgrade => {
      upgrade.level = createDecimal(0)
    })
  }

  // Format level for display
  const formatLevel = (generatorId: GeneratorId) => {
    return formatDecimal(generatorLevels.value[generatorId], 0)
  }

  // Format points for display
  const formatPoints = (generatorId: GeneratorId) => {
    return formatDecimal(generatorPoints.value[generatorId], 0)
  }

  // Format progress percentage for display
  const formatProgressPercentage = (generatorId: GeneratorId) => {
    const currentLevel = generatorLevels.value[generatorId]
    const requirement = getLevelRequirement(generatorId, currentLevel)
    const progress = levelProgress.value[generatorId]

    const percentage = progress.div(requirement).mul(100).toNumber()
    return Math.min(100, Math.round(percentage))
  }

  // Format next level requirement for display
  const formatNextLevelRequirement = (generatorId: GeneratorId) => {
    const currentLevel = generatorLevels.value[generatorId]
    const requirement = getLevelRequirement(generatorId, currentLevel)

    return formatDecimal(requirement, 0)
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
    updateMegacolonyProgress,
    updateHivemindProgress,
    updateAntopolisProgress,
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

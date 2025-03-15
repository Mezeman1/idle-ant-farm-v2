import { createDecimal } from '@/utils/decimalUtils'
import type { PrestigeUpgrade } from '@/types/prestige'
import Decimal from 'break_infinity.js'
import { formatDecimal, formatPercentage } from '@/utils/decimalUtils'

// Helper functions for formatting effects
const formatPercentageEffect = (effectValue: Decimal): string => {
  const percentage = (effectValue.toNumber() - 1) * 100
  if (percentage >= 1000) {
    return `+${formatPercentage(percentage)}`
  } else {
    return `+${percentage.toFixed(0)}%`
  }
}

const formatReductionPercentageEffect = (effectValue: Decimal): string => {
  // For reduction effects, the value is typically less than 1
  // So we calculate how much is being reduced (1 - value)
  const percentage = (1 - effectValue.toNumber()) * 100
  if (percentage >= 1000) {
    return `-${formatPercentage(percentage)}`
  } else {
    return `-${percentage.toFixed(0)}%`
  }
}

const formatMultiplierEffect = (effectValue: Decimal): string => {
  return `${formatDecimal(effectValue, 2)}x`
}

const formatCountEffect = (effectValue: Decimal): string => {
  return `${formatDecimal(effectValue, 0)}`
}

const formatSecondsEffect = (effectValue: Decimal): string => {
  return `${formatDecimal(effectValue, 1)}s`
}

const formatUnlockEffect = (effectValue: Decimal): string => {
  return effectValue.gt(0) ? 'Unlocked' : 'Locked'
}

// Define a function to check if a specific upgrade is unlocked
const isUpgradeUnlocked = (upgradeId: string, upgrades: PrestigeUpgrade[]): boolean => {
  // Basic upgrades are always unlocked
  const basicUpgrades = [
    'foodProcessing',
    'efficientQueens',
    'shorterLoops',
    'strongerSoldiers',
    'mutatedWorkers',
    'nurseryEfficiency',
    'colonyExpansion',
    'exponentialGrowth',
    'compoundEvolution',
    'unlockMegacolony',
    'cycleTimeReduction',
    'epBoost',
    'cycleFoodReduction',
    'startingFood',
    'autoWorker',
    'autoNursery',
    'autoQueenChamber',
    'autoColony',
    'bulkAutomation',
    'generatorSynergy',
    'evolutionSynergy',
    'prestigeAcceleration',
    'inventorySlots',
  ]

  if (basicUpgrades.includes(upgradeId)) {
    return true
  }

  // Check for advanced generator unlocks and their related upgrades
  const megaColonyUpgrade = upgrades.find(u => u.id === 'unlockMegacolony')
  const hiveMindUpgrade = upgrades.find(u => u.id === 'unlockHivemind')
  const antopolisUpgrade = upgrades.find(u => u.id === 'unlockAntopolis')

  // Mega Colony related upgrades
  if (['autoMegacolony', 'megacolonyEfficiency', 'unlockHivemind'].includes(upgradeId)) {
    return megaColonyUpgrade ? megaColonyUpgrade.level.gt(0) : false
  }

  // Hive Mind related upgrades
  if (['autoHivemind', 'hivemindEfficiency', 'unlockAntopolis'].includes(upgradeId)) {
    return hiveMindUpgrade ? hiveMindUpgrade.level.gt(0) : false
  }

  // Antopolis related upgrades
  if (['autoAntopolis', 'antopolisEfficiency'].includes(upgradeId)) {
    return antopolisUpgrade ? antopolisUpgrade.level.gt(0) : false
  }

  // Advanced versions of upgrades that require the basic version to be maxed
  if (upgradeId === 'foodProcessingAdvanced') {
    return isUpgradeMaxed('foodProcessing', upgrades)
  }

  if (upgradeId === 'efficientQueensAdvanced') {
    return isUpgradeMaxed('efficientQueens', upgrades)
  }

  if (upgradeId === 'cycleTimeReductionAdvanced') {
    return isUpgradeMaxed('cycleTimeReduction', upgrades)
  }

  // Equipment slots upgrade is always available
  if (upgradeId === 'equipmentSlots') {
    return true
  }

  // Default to false for any other upgrades
  return false
}

const isUpgradeMaxed = (upgradeId: string, upgrades: PrestigeUpgrade[]): boolean => {
  const upgrade = upgrades.find(u => u.id === upgradeId)
  return upgrade ? upgrade.level.eq(upgrade.maxLevel || createDecimal(0)) : false
}

// Function to calculate the cost of an upgrade based on its base cost, level, and multiplier
const calculateUpgradeCost = (
  baseCost: Decimal,
  level: Decimal,
  costMultiplier?: (context: any) => Decimal
): Decimal => {
  if (level.eq(0)) {
    return baseCost
  }

  if (costMultiplier) {
    return costMultiplier({ cost: baseCost, level })
  } else {
    // Default multiplier if none provided (1.5^level)
    return baseCost.mul(createDecimal(1.5).pow(level))
  }
}

// Create a function that returns the upgrades array with proper isUnlocked functions
export const createPrestigeUpgrades = (): PrestigeUpgrade[] => {
  // We need to create the array first, then set up the isUnlocked functions
  // that reference the array itself
  const upgrades: PrestigeUpgrade[] = [
    {
      id: 'foodProcessing',
      name: 'Faster Food Processing',
      description: 'Increases food production by 10% per level',
      baseCost: createDecimal(1),
      cost: createDecimal(1), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.4).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => createDecimal(1).add(level.mul(0.1)), // 1 + (level * 0.1)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-cake',
      isUnlocked: () => true,
      category: 'production',
      appliesTo: ['worker'], // This upgrade only applies to worker ants
    },
    {
      id: 'foodProcessingAdvanced',
      name: 'Advanced Food Processing',
      description: 'Increases food production by 20% per level',
      baseCost: createDecimal(1e6),
      cost: createDecimal(1e6), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.4).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => createDecimal(1).add(level.mul(0.2)), // 1 + (level * 0.2)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-cake',
      isUnlocked: () => isUpgradeMaxed('foodProcessing', upgrades), // foodProcessing is maxed out
      category: 'production',
      appliesTo: ['worker'], // This upgrade only applies to worker ants
    },
    {
      id: 'efficientQueens',
      name: 'Efficient Queens',
      description: 'Queens produce 15% more nurseries per level',
      baseCost: createDecimal(2),
      cost: createDecimal(2), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.45).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => createDecimal(1).add(level.mul(0.15)), // 1 + (level * 0.15)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-crown',
      isUnlocked: () => true,
      category: 'production',
      appliesTo: ['queenChamber'], // This upgrade only applies to queen chambers
    },
    {
      id: 'efficientQueensAdvanced',
      name: 'Advanced Efficient Queens',
      description: 'Queens produce 30% more nurseries per level',
      baseCost: createDecimal(1e6),
      cost: createDecimal(1e6), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.45).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => createDecimal(1).add(level.mul(0.3)), // 1 + (level * 0.3)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-crown',
      isUnlocked: () => isUpgradeMaxed('efficientQueens', upgrades), // efficientQueens is maxed out
      category: 'production',
      appliesTo: ['queenChamber'], // This upgrade only applies to queen chambers
    },
    {
      id: 'shorterLoops',
      name: 'Shorter Cycle Duration',
      description: 'Reduces cycle completion time by 5% per level',
      baseCost: createDecimal(3),
      cost: createDecimal(3), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(20),
      effect: level => createDecimal(1).add(level.mul(0.05)), // 1 + (level * 0.05)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-clock',
      isUnlocked: () => true,
      category: 'efficiency',
      // No appliesTo field means this doesn't directly affect any generator
    },
    {
      id: 'strongerSoldiers',
      name: 'Stronger Soldier Ants',
      description: 'Increases overall colony efficiency by 5% per level',
      baseCost: createDecimal(5),
      cost: createDecimal(5), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.6).pow(context.level)),
      level: createDecimal(0),
      maxLevel: null, // No max level
      effect: level => createDecimal(1).add(level.mul(0.05)), // 1 + (level * 0.05)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-shield-check',
      isUnlocked: () => true,
      category: 'production',
      // No appliesTo field means this applies globally to all generators
    },
    {
      id: 'mutatedWorkers',
      name: 'Mutated Worker Ants',
      description: 'Worker ants produce 20% more food per level',
      baseCost: createDecimal(8),
      cost: createDecimal(8), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.7).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(15),
      effect: level => createDecimal(1).add(level.mul(0.2)), // 1 + (level * 0.2)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-sparkles',
      isUnlocked: () => true,
      category: 'production',
      appliesTo: ['worker'], // This upgrade only applies to worker ants
    },
    {
      id: 'nurseryEfficiency',
      name: 'Advanced Nursery Techniques',
      description: 'Nurseries produce 25% more worker ants per level',
      baseCost: createDecimal(10),
      cost: createDecimal(10), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.75).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(15),
      effect: level => createDecimal(1).add(level.mul(0.25)), // 1 + (level * 0.25)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-beaker',
      isUnlocked: () => true,
      category: 'production',
      appliesTo: ['nursery'], // This upgrade only applies to nurseries
    },
    {
      id: 'colonyExpansion',
      name: 'Colony Expansion Tactics',
      description: 'Colonies produce 30% more queen chambers per level',
      baseCost: createDecimal(15),
      cost: createDecimal(15), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.8).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.3)), // 1 + (level * 0.3)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-map',
      isUnlocked: () => true,
      category: 'production',
      appliesTo: ['colony'], // This upgrade only applies to colonies
    },
    {
      id: 'exponentialGrowth',
      name: 'Exponential Growth',
      description: 'All production increases by 2x per level',
      baseCost: createDecimal(25),
      cost: createDecimal(25), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(2).pow(level), // 2^level (2, 4, 8, 16, etc.)
      formatEffect: formatMultiplierEffect,
      icon: 'i-heroicons-chart-bar',
      isUnlocked: () => true,
      category: 'production',
      // No appliesTo field means this applies globally to all generators
    },
    {
      id: 'compoundEvolution',
      name: 'Compound Evolution',
      description: 'All production increases by 2% per level, compounding with other upgrades',
      baseCost: createDecimal(50),
      cost: createDecimal(50), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(1).add(level.mul(0.02)), // 1 + (level * 0.02)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-arrow-trending-up',
      isUnlocked: () => true,
      category: 'production',
      // No appliesTo field means this applies globally to all generators
    },
    {
      id: 'unlockMegacolony',
      name: 'Mega Colony',
      description: 'Unlocks the Mega Colony generator',
      baseCost: createDecimal(1000),
      cost: createDecimal(1000), // Initialize cost to baseCost
      level: createDecimal(0),
      maxLevel: createDecimal(1),
      effect: level => createDecimal(level), // 0 or 1 (unlocked or not)
      formatEffect: formatUnlockEffect,
      icon: 'i-heroicons-building-office-2',
      isUnlocked: () => true,
      category: 'research',
    },
    {
      id: 'unlockHivemind',
      name: 'Hive Mind',
      description: 'Unlocks the Hive Mind generator',
      baseCost: createDecimal(1e9),
      cost: createDecimal(1e9), // Initialize cost to baseCost
      level: createDecimal(0),
      maxLevel: createDecimal(1),
      effect: level => createDecimal(level), // 0 or 1 (unlocked or not)
      formatEffect: formatUnlockEffect,
      icon: 'i-heroicons-cpu-chip',
      isUnlocked: () => isUpgradeUnlocked('unlockMegacolony', upgrades),
      category: 'research',
    },
    {
      id: 'unlockAntopolis',
      name: 'Antopolis',
      description: 'Unlocks the Antopolis generator',
      baseCost: createDecimal(1e12),
      cost: createDecimal(1e12), // Initialize cost to baseCost
      level: createDecimal(0),
      maxLevel: createDecimal(1),
      effect: level => createDecimal(level), // 0 or 1 (unlocked or not)
      formatEffect: formatUnlockEffect,
      icon: 'i-heroicons-building-library',
      isUnlocked: () => isUpgradeUnlocked('unlockHivemind', upgrades),
      category: 'research',
    },
    {
      id: 'megacolonyEfficiency',
      name: 'Mega Colony Optimization',
      description: 'Mega Colonies produce 40% more colonies per level',
      baseCost: createDecimal(100),
      cost: createDecimal(100), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.4)), // 1 + (level * 0.4)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-building-office-2',
      isUnlocked: () => isUpgradeUnlocked('megacolonyEfficiency', upgrades),
      category: 'production',
      appliesTo: ['megacolony'], // This upgrade only applies to mega colonies
    },
    {
      id: 'hivemindEfficiency',
      name: 'Hive Mind Optimization',
      description: 'Hive Minds produce 50% more mega colonies per level',
      baseCost: createDecimal(500),
      cost: createDecimal(500), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2.2).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.5)), // 1 + (level * 0.5)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-cpu-chip',
      isUnlocked: () => isUpgradeUnlocked('hivemindEfficiency', upgrades),
      category: 'production',
      appliesTo: ['hivemind'], // This upgrade only applies to hive minds
    },
    {
      id: 'antopolisEfficiency',
      name: 'Antopolis Optimization',
      description: 'Antopolis produces 60% more hive minds per level',
      baseCost: createDecimal(2500),
      cost: createDecimal(2500), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(0.6)), // 1 + (level * 0.6)
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-building-library',
      isUnlocked: () => isUpgradeUnlocked('antopolisEfficiency', upgrades),
      category: 'production',
      appliesTo: ['antopolis'], // This upgrade only applies to antopolis
    },
    {
      id: 'cycleTimeReduction',
      name: 'Time Manipulation',
      description: 'Decreases cycle time by 0.2 seconds per level',
      baseCost: createDecimal(50),
      cost: createDecimal(50), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(20),
      effect: level => createDecimal(0.2).mul(level), // 0.2s reduction per level
      formatEffect: formatSecondsEffect,
      icon: 'i-heroicons-clock-solid',
      isUnlocked: () => true,
      category: 'efficiency',
    },
    {
      id: 'cycleTimeReductionAdvanced',
      name: 'Advanced Time Manipulation',
      description: 'Decreases cycle time by 0.4 seconds per level',
      baseCost: createDecimal(1e12),
      cost: createDecimal(1e12), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(0.4).mul(level), // 0.4s reduction per level
      formatEffect: formatSecondsEffect,
      icon: 'i-heroicons-clock-solid',
      isUnlocked: () => isUpgradeMaxed('cycleTimeReduction', upgrades), // cycleTimeReduction is maxed out
      category: 'efficiency',
    },
    {
      id: 'epBoost',
      name: 'Evolution Mastery',
      description: 'Increases Evolution Points gained per cycle by 10% per level',
      baseCost: createDecimal(25),
      cost: createDecimal(25), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.8).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => createDecimal(1).add(level.mul(0.1)), // +10% per level
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-star',
      isUnlocked: () => true,
      category: 'prestige',
    },
    {
      id: 'cycleFoodReduction',
      name: 'Cycle Food Reduction',
      description: 'Reduces the food required for each cycle by 5% per level (max 75%)',
      baseCost: createDecimal(50),
      cost: createDecimal(50), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(15),
      effect: level => createDecimal(1).sub(level.mul(0.05).min(0.75)), // Max 75% reduction
      formatEffect: formatReductionPercentageEffect,
      icon: 'i-heroicons-arrow-down-circle',
      isUnlocked: () => true,
      category: 'efficiency',
    },
    {
      id: 'startingFood',
      name: 'Starting Resources',
      description: 'Start with 10x more food per level after evolution',
      baseCost: createDecimal(100),
      cost: createDecimal(100), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(10).pow(level), // 10^level
      formatEffect: formatMultiplierEffect,
      icon: 'i-heroicons-banknotes',
      isUnlocked: () => true,
      category: 'prestige',
    },
    {
      id: 'autoWorker',
      name: 'Worker Automation',
      description: 'Automatically purchases Worker Ants each tick. Each level increases purchases per tick.',
      baseCost: createDecimal(5),
      cost: createDecimal(5), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.3).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      formatEffect: formatCountEffect,
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => true,
      category: 'automation',
    },
    {
      id: 'autoNursery',
      name: 'Nursery Automation',
      description: 'Automatically purchases Nurseries each tick. Each level increases purchases per tick.',
      baseCost: createDecimal(15),
      cost: createDecimal(15), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.35).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      formatEffect: formatCountEffect,
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => true,
      category: 'automation',
    },
    {
      id: 'autoQueenChamber',
      name: 'Queen Chamber Automation',
      description: 'Automatically purchases Queen Chambers each tick. Each level increases purchases per tick.',
      baseCost: createDecimal(50),
      cost: createDecimal(50), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.4).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      formatEffect: formatCountEffect,
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => true,
      category: 'automation',
    },
    {
      id: 'autoColony',
      name: 'Colony Automation',
      description: 'Automatically purchases Colonies each tick. Each level increases purchases per tick.',
      baseCost: createDecimal(200),
      cost: createDecimal(200), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.45).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      formatEffect: formatCountEffect,
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => true,
      category: 'automation',
    },
    {
      id: 'autoMegacolony',
      name: 'Mega Colony Automation',
      description: 'Automatically purchases Mega Colonies each tick. Each level increases purchases per tick.',
      baseCost: createDecimal(2000),
      cost: createDecimal(2000), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      formatEffect: formatCountEffect,
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => isUpgradeUnlocked('autoMegacolony', upgrades),
      category: 'automation',
    },
    {
      id: 'autoHivemind',
      name: 'Hive Mind Automation',
      description: 'Automatically purchases Hive Minds each tick. Each level increases purchases per tick.',
      baseCost: createDecimal(20000),
      cost: createDecimal(20000), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.55).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      formatEffect: formatCountEffect,
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => isUpgradeUnlocked('autoHivemind', upgrades),
      category: 'automation',
    },
    {
      id: 'autoAntopolis',
      name: 'Antopolis Automation',
      description: 'Automatically purchases Antopolis each tick. Each level increases purchases per tick.',
      baseCost: createDecimal(200000),
      cost: createDecimal(200000), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.6).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      formatEffect: formatCountEffect,
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => isUpgradeUnlocked('autoAntopolis', upgrades),
      category: 'automation',
    },
    {
      id: 'bulkAutomation',
      name: 'Bulk Automation',
      description: 'Multiplies the effectiveness of all automation upgrades',
      baseCost: createDecimal(50),
      cost: createDecimal(50), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(4)), // 1 + 4*level (5x, 9x, 13x, etc.)
      formatEffect: formatMultiplierEffect,
      icon: 'i-heroicons-bolt',
      isUnlocked: () => true,
      category: 'automation',
    },
    {
      id: 'generatorSynergy',
      name: 'Generator Synergy',
      description: 'Each generator type boosts all others by 2% per level',
      baseCost: createDecimal(100),
      cost: createDecimal(100), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(3).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(1).add(level.mul(0.02)), // Base effect, actual calculation in getAllMultipliers
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-puzzle-piece',
      isUnlocked: () => true,
      category: 'synergy',
      // No appliesTo field means this is handled specially in getAllMultipliers
    },
    {
      id: 'evolutionSynergy',
      name: 'Evolution Synergy',
      description: 'Each evolution completed boosts production by 1% per level',
      baseCost: createDecimal(200),
      cost: createDecimal(200), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(3).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(1).add(level.mul(0.01)), // Base effect, actual calculation in getAllMultipliers
      formatEffect: formatPercentageEffect,
      icon: 'i-heroicons-arrow-path',
      isUnlocked: () => true,
      category: 'synergy',
      // No appliesTo field means this is handled specially in getAllMultipliers
    },
    {
      id: 'prestigeAcceleration',
      name: 'Prestige Acceleration',
      description: 'Start with more cycles completed after evolution',
      baseCost: createDecimal(100),
      cost: createDecimal(100), // Initialize cost to baseCost
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => level, // Level directly determines starting cycles
      formatEffect: formatCountEffect,
      icon: 'i-heroicons-rocket-launch',
      isUnlocked: () => true,
      category: 'prestige',
    },
    {
      id: 'inventorySlots',
      name: 'Inventory Expansion',
      description: 'Increase maximum inventory slots by 5. Each level adds more slots, but costs increase rapidly.',
      baseCost: createDecimal(100),
      cost: createDecimal(100),
      level: createDecimal(0),
      maxLevel: null, // No max level
      effect: (level: Decimal) => {
        // Each level adds 5 slots
        return level.mul(5)
      },
      formatEffect: effectValue => {
        // For percentage-based upgrades, convert to percentage
        const percentage = (effectValue.toNumber() - 5) * 100
        if (percentage >= 1000) {
          return `+${formatPercentage(percentage)}`
        } else {
          return `+${percentage.toFixed(0)} slots`
        }
      },
      isUnlocked: () => true, // Always available
      costMultiplier: ({ cost, level }) => {
        // Exponential scaling: cost * (1.5 ^ level)
        return cost.mul(createDecimal(1.5).pow(level))
      },
      icon: 'i-heroicons-squares-2x2',
      category: 'prestige',
    },
    {
      id: 'equipmentSlots',
      name: 'Equipment Mastery',
      description:
        'Unlock an additional equipment slot. Each level unlocks one more slot, up to a maximum of 10 slots.',
      baseCost: createDecimal(1000),
      cost: createDecimal(1000),
      level: createDecimal(1),
      maxLevel: createDecimal(10),
      effect: (level: Decimal) => {
        // Each level unlocks one slot
        return level
      },
      formatEffect: effectValue => {
        return `${formatDecimal(effectValue, 0)} slots`
      },
      isUnlocked: () => true,
      icon: 'i-heroicons-shield-check',
      category: 'prestige',
      costMultiplier: (context: any) =>
        createDecimal(context.cost).mul(createDecimal(2).pow(createDecimal(2).pow(context.level))),
    },
  ]

  // Update each upgrade to recalculate its cost based on level
  upgrades.forEach(upgrade => {
    if (upgrade.level.gt(0) && upgrade.costMultiplier) {
      // If the upgrade already has a level > 0, calculate the correct cost
      upgrade.cost = calculateUpgradeCost(upgrade.baseCost, upgrade.level, upgrade.costMultiplier)
    }
  })

  return upgrades
}

// Export a default instance of the upgrades
export const prestigeUpgrades = createPrestigeUpgrades()

// Export the calculateUpgradeCost function for use in the store
export { calculateUpgradeCost }

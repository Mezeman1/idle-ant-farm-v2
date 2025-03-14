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
  costMultiplier?: (context: any) => Decimal
  level: Decimal
  maxLevel: Decimal | null // null means no max level
  effect: (level: Decimal) => Decimal // Returns multiplier based on level
  icon: string
  isUnlocked: () => boolean // Function to determine if upgrade is unlocked
  category: 'production' | 'efficiency' | 'automation' | 'research' | 'synergy' | 'prestige'
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

  // Define a function to check if a specific upgrade is unlocked
  const isUpgradeUnlocked = (upgradeId: string): boolean => {
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
      'epSquared',
      'autoWorker',
      'autoNursery',
      'autoQueenChamber',
      'autoColony',
      'bulkAutomation',
      'generatorSynergy',
      'evolutionSynergy',
      'prestigeAcceleration',
    ]

    if (basicUpgrades.includes(upgradeId)) {
      return true
    }

    // Check for advanced generator unlocks and their related upgrades
    const megaColonyUpgrade = evolutionUpgrades.value.find(u => u.id === 'unlockMegacolony')
    const hiveMindUpgrade = evolutionUpgrades.value.find(u => u.id === 'unlockHivemind')
    const antopolisUpgrade = evolutionUpgrades.value.find(u => u.id === 'unlockAntopolis')

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

    // Default to false for any other upgrades
    return false
  }

  // Evolution upgrades
  const evolutionUpgrades = ref<EvolutionUpgrade[]>([
    {
      id: 'foodProcessing',
      name: 'Faster Food Processing',
      description: 'Increases food production by 10% per level',
      cost: createDecimal(1),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.4).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => createDecimal(1).add(level.mul(0.1)), // 1 + (level * 0.1)
      icon: 'i-heroicons-cake',
      isUnlocked: () => true,
      category: 'production',
    },
    {
      id: 'efficientQueens',
      name: 'Efficient Queens',
      description: 'Queens produce 15% more nurseries per level',
      cost: createDecimal(2),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.45).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => createDecimal(1).add(level.mul(0.15)), // 1 + (level * 0.15)
      icon: 'i-heroicons-crown',
      isUnlocked: () => true,
      category: 'production',
    },
    {
      id: 'shorterLoops',
      name: 'Shorter Cycle Duration',
      description: 'Reduces cycle completion time by 5% per level',
      cost: createDecimal(3),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(20),
      effect: level => createDecimal(1).add(level.mul(0.05)), // 1 + (level * 0.05)
      icon: 'i-heroicons-clock',
      isUnlocked: () => true,
      category: 'efficiency',
    },
    {
      id: 'strongerSoldiers',
      name: 'Stronger Soldier Ants',
      description: 'Increases overall colony efficiency by 5% per level',
      cost: createDecimal(5),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.6).pow(context.level)),
      level: createDecimal(0),
      maxLevel: null, // No max level
      effect: level => createDecimal(1).add(level.mul(0.05)), // 1 + (level * 0.05)
      icon: 'i-heroicons-shield-check',
      isUnlocked: () => true,
      category: 'production',
    },
    {
      id: 'mutatedWorkers',
      name: 'Mutated Worker Ants',
      description: 'Worker ants are 20% more efficient per level',
      cost: createDecimal(3),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(15),
      effect: level => createDecimal(1).add(level.mul(0.2)), // 1 + (level * 0.2)
      icon: 'i-heroicons-bug-ant',
      isUnlocked: () => true,
      category: 'production',
    },
    // New generator-specific upgrades
    {
      id: 'nurseryEfficiency',
      name: 'Advanced Nursery Techniques',
      description: 'Nurseries are 25% more efficient per level',
      cost: createDecimal(4),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.55).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(15),
      effect: level => createDecimal(1).add(level.mul(0.25)),
      icon: 'i-heroicons-home-modern',
      isUnlocked: () => true,
      category: 'production',
    },
    {
      id: 'colonyExpansion',
      name: 'Colony Expansion Tactics',
      description: 'Colonies are 30% more efficient per level',
      cost: createDecimal(8),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.6).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(15),
      effect: level => createDecimal(1).add(level.mul(0.3)),
      icon: 'i-heroicons-building',
      isUnlocked: () => true,
      category: 'production',
    },
    // Exponential scaling upgrades
    {
      id: 'exponentialGrowth',
      name: 'Exponential Growth',
      description: 'Each level provides a stacking 2x multiplier to all food production',
      cost: createDecimal(10_000),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(2).pow(level), // 2^level (2, 4, 8, 16, etc.)
      icon: 'i-heroicons-chart-bar',
      isUnlocked: () => true,
      category: 'production',
    },
    {
      id: 'compoundEvolution',
      name: 'Compound Evolution',
      description: 'Each level provides a stacking 1.5x multiplier to all generator production',
      cost: createDecimal(50_000),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(4).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(15),
      effect: level => createDecimal(1.5).pow(level), // 1.5^level
      icon: 'i-heroicons-arrow-trending-up',
      isUnlocked: () => true,
      category: 'production',
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
      isUnlocked: () => true,
      category: 'research',
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
      isUnlocked: () => isUpgradeUnlocked('unlockHivemind'),
      category: 'research',
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
      isUnlocked: () => isUpgradeUnlocked('unlockAntopolis'),
      category: 'research',
    },
    // Advanced generator efficiency upgrades
    {
      id: 'megacolonyEfficiency',
      name: 'Mega Colony Optimization',
      description: 'Mega Colonies are 40% more efficient per level',
      cost: createDecimal(2000),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.7).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(20),
      effect: level => createDecimal(1).add(level.mul(0.4)),
      icon: 'i-heroicons-building-office',
      isUnlocked: () => isUpgradeUnlocked('megacolonyEfficiency'),
      category: 'production',
    },
    {
      id: 'hivemindEfficiency',
      name: 'Hive Mind Optimization',
      description: 'Hive Minds are 50% more efficient per level',
      cost: createDecimal(2e6),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.8).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(20),
      effect: level => createDecimal(1).add(level.mul(0.5)),
      icon: 'i-heroicons-brain',
      isUnlocked: () => isUpgradeUnlocked('hivemindEfficiency'),
      category: 'production',
    },
    {
      id: 'antopolisEfficiency',
      name: 'Antopolis Optimization',
      description: 'Antopolis are 60% more efficient per level',
      cost: createDecimal(2e9),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.9).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(20),
      effect: level => createDecimal(1).add(level.mul(0.6)),
      icon: 'i-heroicons-building-storefront',
      isUnlocked: () => isUpgradeUnlocked('antopolisEfficiency'),
      category: 'production',
    },
    // Cycle and EP upgrades
    {
      id: 'cycleTimeReduction',
      name: 'Time Manipulation',
      description: 'Decreases cycle time by 0.2 seconds per level',
      cost: createDecimal(50),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(20),
      effect: level => createDecimal(0.2).mul(level), // 0.2s reduction per level
      icon: 'i-heroicons-clock-solid',
      isUnlocked: () => true,
      category: 'efficiency',
    },
    {
      id: 'epBoost',
      name: 'Evolution Mastery',
      description: 'Increases Evolution Points gained per cycle by 10% per level',
      cost: createDecimal(25),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.8).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => createDecimal(1).add(level.mul(0.1)), // +10% per level
      icon: 'i-heroicons-star',
      isUnlocked: () => true,
      category: 'prestige',
    },
    {
      id: 'cycleFoodReduction',
      name: 'Efficient Cycle Completion',
      description: 'Reduces food required for cycle completion by 5% per level',
      cost: createDecimal(30),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.6).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(15),
      effect: level => createDecimal(1).sub(level.mul(0.05).min(0.75)), // Max 75% reduction
      icon: 'i-heroicons-arrow-down-circle',
      isUnlocked: () => true,
      category: 'efficiency',
    },
    {
      id: 'startingFood',
      name: 'Starting Resources',
      description: 'Start with 10x more food after evolution per level',
      cost: createDecimal(20),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(10).pow(level), // 10^level
      icon: 'i-heroicons-banknotes',
      isUnlocked: () => true,
      category: 'prestige',
    },
    {
      id: 'epSquared',
      name: 'Squared Evolution',
      description: 'Gain an additional EP multiplier based on your current EP',
      cost: createDecimal(100),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(3).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(5),
      effect: level => createDecimal(1).add(level.mul(0.01)), // Each level adds 1% of current EP as a multiplier
      icon: 'i-heroicons-sparkles',
      isUnlocked: () => true,
      category: 'prestige',
    },
    // Auto-purchase upgrades
    {
      id: 'autoWorker',
      name: 'Worker Automation',
      description: 'Automatically purchases Worker Ants each tick. Each level increases purchases per tick.',
      cost: createDecimal(5),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.3).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => true,
      category: 'automation',
    },
    {
      id: 'autoNursery',
      name: 'Nursery Automation',
      description: 'Automatically purchases Nurseries each tick. Each level increases purchases per tick.',
      cost: createDecimal(15),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.35).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => true,
      category: 'automation',
    },
    {
      id: 'autoQueenChamber',
      name: 'Queen Chamber Automation',
      description: 'Automatically purchases Queen Chambers each tick. Each level increases purchases per tick.',
      cost: createDecimal(50),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.4).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => true,
      category: 'automation',
    },
    {
      id: 'autoColony',
      name: 'Colony Automation',
      description: 'Automatically purchases Colonies each tick. Each level increases purchases per tick.',
      cost: createDecimal(200),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.45).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => true,
      category: 'automation',
    },
    {
      id: 'autoMegacolony',
      name: 'Mega Colony Automation',
      description: 'Automatically purchases Mega Colonies each tick. Each level increases purchases per tick.',
      cost: createDecimal(2000),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => isUpgradeUnlocked('autoMegacolony'),
      category: 'automation',
    },
    {
      id: 'autoHivemind',
      name: 'Hive Mind Automation',
      description: 'Automatically purchases Hive Minds each tick. Each level increases purchases per tick.',
      cost: createDecimal(20000),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.55).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => isUpgradeUnlocked('autoHivemind'),
      category: 'automation',
    },
    {
      id: 'autoAntopolis',
      name: 'Antopolis Automation',
      description: 'Automatically purchases Antopolis each tick. Each level increases purchases per tick.',
      cost: createDecimal(200000),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.6).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(25),
      effect: level => level, // Level directly determines purchases per tick
      icon: 'i-heroicons-cog-6-tooth',
      isUnlocked: () => isUpgradeUnlocked('autoAntopolis'),
      category: 'automation',
    },
    // Bulk automation upgrades
    {
      id: 'bulkAutomation',
      name: 'Bulk Automation',
      description: 'Multiplies the effectiveness of all automation upgrades by 5x per level',
      cost: createDecimal(500),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2.5).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => createDecimal(1).add(level.mul(4)), // 1 + 4*level (5x, 9x, 13x, etc.)
      icon: 'i-heroicons-bolt',
      isUnlocked: () => true,
      category: 'automation',
    },
    // Synergy upgrades
    {
      id: 'generatorSynergy',
      name: 'Generator Synergy',
      description: 'Each generator type boosts the efficiency of all others by 2% per level',
      cost: createDecimal(75),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.7).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(20),
      effect: level => createDecimal(1).add(level.mul(0.02)), // 1 + 0.02*level per generator type
      icon: 'i-heroicons-puzzle-piece',
      isUnlocked: () => true,
      category: 'synergy',
    },
    {
      id: 'evolutionSynergy',
      name: 'Evolution Synergy',
      description: 'Each evolution completed boosts all production by 1% per level',
      cost: createDecimal(150),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(1.8).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(15),
      effect: level => createDecimal(1).add(level.mul(0.01)), // 1 + 0.01*level per evolution
      icon: 'i-heroicons-fire',
      isUnlocked: () => true,
      category: 'synergy',
    },
    // Prestige acceleration
    {
      id: 'prestigeAcceleration',
      name: 'Prestige Acceleration',
      description: 'Start with 1 completed cycle per level after evolution',
      cost: createDecimal(200),
      costMultiplier: (context: any) => createDecimal(context.cost).mul(createDecimal(2).pow(context.level)),
      level: createDecimal(0),
      maxLevel: createDecimal(10),
      effect: level => level, // Level directly determines starting cycles
      icon: 'i-heroicons-rocket-launch',
      isUnlocked: () => true,
      category: 'prestige',
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
    const generatorStore = useGeneratorStore()

    // Get basic multipliers from each upgrade
    evolutionUpgrades.value.forEach(upgrade => {
      multipliers[upgrade.id] = upgrade.effect(upgrade.level)
    })

    // Handle special synergy upgrades

    // Generator Synergy - Each generator type boosts all others
    const generatorSynergyUpgrade = evolutionUpgrades.value.find(u => u.id === 'generatorSynergy')
    if (generatorSynergyUpgrade && generatorSynergyUpgrade.level.gt(0)) {
      // Count unlocked generator types
      const unlockedGeneratorCount = generatorStore.generators.filter(g => g.unlocked || g.purchasable).length

      // Calculate synergy multiplier (2% per level per generator type)
      const synergyBonus = generatorSynergyUpgrade.level.mul(0.02).mul(unlockedGeneratorCount)
      multipliers['generatorSynergyBonus'] = createDecimal(1).add(synergyBonus)
    } else {
      multipliers['generatorSynergyBonus'] = createDecimal(1) // No effect
    }

    // Evolution Synergy - Each evolution boosts production
    const evolutionSynergyUpgrade = evolutionUpgrades.value.find(u => u.id === 'evolutionSynergy')
    if (evolutionSynergyUpgrade && evolutionSynergyUpgrade.level.gt(0)) {
      // Calculate evolution bonus (1% per level per evolution)
      const evolutionBonus = evolutionSynergyUpgrade.level.mul(0.01).mul(evolutionCount.value)
      multipliers['evolutionSynergyBonus'] = createDecimal(1).add(evolutionBonus)
    } else {
      multipliers['evolutionSynergyBonus'] = createDecimal(1) // No effect
    }

    // Bulk Automation - Multiplies automation effectiveness
    const bulkAutomationUpgrade = evolutionUpgrades.value.find(u => u.id === 'bulkAutomation')
    if (bulkAutomationUpgrade && bulkAutomationUpgrade.level.gt(0)) {
      // Calculate bulk automation multiplier (5x, 9x, 13x, etc. per level)
      multipliers['bulkAutomationMultiplier'] = createDecimal(1).add(bulkAutomationUpgrade.level.mul(4))
    } else {
      multipliers['bulkAutomationMultiplier'] = createDecimal(1) // No effect
    }

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

    // Apply Evolution Synergy upgrade (bonus based on evolution count)
    const evolutionSynergyMultiplier = getUpgradeMultiplier('evolutionSynergy')
    if (evolutionSynergyMultiplier.gt(1)) {
      // Calculate bonus based on evolution count
      const evolutionBonus = evolutionCount.value.mul(evolutionSynergyMultiplier.sub(1))
      totalEP = totalEP.mul(createDecimal(1).add(evolutionBonus))
    }

    // Apply EP Squared upgrade (bonus based on current EP)
    const epSquaredMultiplier = getUpgradeMultiplier('epSquared')
    if (epSquaredMultiplier.gt(1)) {
      // Calculate bonus based on current EP
      // The effect is (1 + level*0.01), so we subtract 1 to get just the percentage
      const epPercentage = epSquaredMultiplier.sub(1)
      const epBonus = evolutionPoints.value.mul(epPercentage)
      totalEP = totalEP.add(epBonus)
    }

    return totalEP
  }

  // Complete a foraging cycle and update requirements
  const completeLoop = () => {
    // Increment foraging cycles completed
    loopsCompleted.value = loopsCompleted.value.add(1)

    // Increase foraging trips required for next cycle (by 0.5 trips per cycle)
    ticksPerLoop.value = ticksPerLoop.value.add(0.5)

    // Increase food required for next cycle (exponential growth: ^1.1)
    const baseFoodIncrease = foodForNextLoop.value.pow(1.1)

    // Apply Cycle Food Reduction upgrade
    const cycleFoodReductionMultiplier = getUpgradeMultiplier('cycleFoodReduction')
    foodForNextLoop.value = baseFoodIncrease.mul(cycleFoodReductionMultiplier)

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

      // For advanced generators (tier 5+), check if they should remain purchasable
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
          // Keep purchasable only if the upgrade is purchased (level > 0)
          generator.purchasable = upgrade ? upgrade.level.gt(0) : false
          generator.unlocked = false // Always keep advanced generators "locked" for nextUnlockableGenerator
        } else {
          generator.purchasable = false
          generator.unlocked = false
        }
      }
    })

    // Apply Starting Resources upgrade for initial food
    const startingFoodMultiplier = getUpgradeMultiplier('startingFood')
    const baseStartingFood = createDecimal(10) // Default starting food
    generatorStore.food = baseStartingFood.mul(startingFoodMultiplier) // Start with boosted food if upgrade purchased

    // Reset cycle progress
    currentLoopTicks.value = createDecimal(0)

    // Apply Prestige Acceleration upgrade for starting cycles
    const prestigeAccelerationLevel =
      evolutionUpgrades.value.find(u => u.id === 'prestigeAcceleration')?.level || createDecimal(0)
    loopsCompleted.value = prestigeAccelerationLevel.gt(0)
      ? new Decimal(prestigeAccelerationLevel.toString())
      : createDecimal(0)

    // Apply Cycle Food Reduction upgrade to reduce food requirement
    const cycleFoodReductionMultiplier = getUpgradeMultiplier('cycleFoodReduction')
    const baseFoodRequirement = createDecimal(1000) // Base requirement
    foodForNextLoop.value = baseFoodRequirement.mul(cycleFoodReductionMultiplier)

    ticksPerLoop.value = createDecimal(3) // Reset to base requirement

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

    // Check if the upgrade is unlocked
    if (!upgrade.isUnlocked()) {
      return false
    }

    // Check dependencies for advanced generator upgrades
    if (upgradeId === 'unlockHivemind') {
      // Also check if player has at least one Mega Colony
      const generatorStore = useGeneratorStore()
      const megacolony = generatorStore.getGenerator('megacolony')
      if (!megacolony || megacolony.count.eq(0)) {
        return false // Cannot purchase Hive Mind upgrade without having at least one Mega Colony
      }
    } else if (upgradeId === 'unlockAntopolis') {
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

    // Increase cost for next level
    if (upgrade.costMultiplier) {
      upgrade.cost = upgrade.costMultiplier({ cost: upgrade.cost, level: upgrade.level })
    } else {
      upgrade.cost = upgrade.cost.mul(1.5)
    }

    // Handle special upgrades for unlocking advanced generators
    if (upgradeId === 'unlockMegacolony') {
      // Make Mega Colony generator purchasable
      const generatorStore = useGeneratorStore()
      const megacolony = generatorStore.generators.find(g => g.id === 'megacolony')
      if (megacolony) {
        megacolony.purchasable = true
        // Keep unlocked as false to not break nextUnlockableGenerator
        megacolony.unlocked = false
      }
    } else if (upgradeId === 'unlockHivemind') {
      // Make Hive Mind generator purchasable
      const generatorStore = useGeneratorStore()
      const hivemind = generatorStore.generators.find(g => g.id === 'hivemind')
      if (hivemind) {
        hivemind.purchasable = true
        // Keep unlocked as false to not break nextUnlockableGenerator
        hivemind.unlocked = false
      }
    } else if (upgradeId === 'unlockAntopolis') {
      // Make Antopolis generator purchasable
      const generatorStore = useGeneratorStore()
      const antopolis = generatorStore.generators.find(g => g.id === 'antopolis')
      if (antopolis) {
        antopolis.purchasable = true
        // Keep unlocked as false to not break nextUnlockableGenerator
        antopolis.unlocked = false
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
    isUpgradeUnlocked,
  }
})

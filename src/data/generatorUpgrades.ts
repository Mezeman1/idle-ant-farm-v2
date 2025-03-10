import { createDecimal } from '@/utils/decimalUtils'
import type { GeneratorUpgrade } from '@/types/generators'

export const generatorUpgrades: GeneratorUpgrade[] = [
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
  {
    id: 'workerForaging',
    generatorId: 'worker',
    name: 'Advanced Foraging',
    description: 'Workers find higher quality food sources',
    cost: createDecimal(2),
    level: createDecimal(0),
    maxLevel: createDecimal(8),
    effect: level => createDecimal(1).add(level.mul(0.15)), // +15% per level
    icon: 'i-heroicons-map',
    unlocked: true,
  },
  {
    id: 'workerEndurance',
    generatorId: 'worker',
    name: 'Worker Endurance',
    description: 'Workers can carry more food per trip',
    cost: createDecimal(2),
    level: createDecimal(0),
    maxLevel: createDecimal(7),
    effect: level => createDecimal(1).add(level.mul(0.1)), // +10% per level
    icon: 'i-heroicons-battery-100',
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
  {
    id: 'nurseryNutrition',
    generatorId: 'nursery',
    name: 'Larval Nutrition',
    description: 'Better nutrition leads to faster worker development',
    cost: createDecimal(2),
    level: createDecimal(0),
    maxLevel: createDecimal(8),
    effect: level => createDecimal(1).add(level.mul(0.12)), // +12% per level
    icon: 'i-heroicons-beaker',
    unlocked: true,
  },
  {
    id: 'nurseryCapacity',
    generatorId: 'nursery',
    name: 'Nursery Capacity',
    description: 'Nurseries can care for more larvae simultaneously',
    cost: createDecimal(2),
    level: createDecimal(0),
    maxLevel: createDecimal(6),
    effect: level => createDecimal(1).add(level.mul(0.15)), // +15% per level
    icon: 'i-heroicons-cube',
    unlocked: true,
  },

  // Queen Chamber Upgrades
  {
    id: 'queenChamberEfficiency',
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
    id: 'queenChamberLongevity',
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
    id: 'queenChamberFertility',
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
  {
    id: 'queenChamberRoyalJelly',
    generatorId: 'queenChamber',
    name: 'Royal Jelly',
    description: 'Special food increases queen egg production',
    cost: createDecimal(2),
    level: createDecimal(0),
    maxLevel: createDecimal(7),
    effect: level => createDecimal(1).add(level.mul(0.15)), // +15% per level
    icon: 'i-heroicons-fire',
    unlocked: true,
  },
  {
    id: 'queenChamberGuards',
    generatorId: 'queenChamber',
    name: 'Royal Guards',
    description: 'Special guards protect the queen, increasing productivity',
    cost: createDecimal(2),
    level: createDecimal(0),
    maxLevel: createDecimal(6),
    effect: level => createDecimal(1).add(level.mul(0.1)), // +10% per level
    icon: 'i-heroicons-shield-check',
    unlocked: true,
  },
]

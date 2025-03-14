import type { Item } from '@/stores/itemStore'

import { createDecimal } from '@/utils/decimalUtils'

export const items: Record<string, Item> = {
  // Training Equipment
  training_sword: {
    id: 'training_sword',
    name: 'Training Sword',
    description: 'A basic sword for training. Better than nothing!',
    type: 'equipment',
    rarity: 'common',
    stats: {
      damage: createDecimal(5),
    },
    productionModifiers: {
      worker: createDecimal(2), // 100% increase in worker production
    },
    quantity: createDecimal(1),
  },
  training_armor: {
    id: 'training_armor',
    name: 'Training Armor',
    description: 'Basic protective gear for training.',
    type: 'equipment',
    rarity: 'common',
    stats: {
      health: createDecimal(20),
    },
    productionModifiers: {
      worker: createDecimal(1.5), // 50% increase in worker production
    },
    quantity: createDecimal(1),
  },

  // Worker Equipment
  worker_sword: {
    id: 'worker_sword',
    name: 'Worker Sword',
    description: 'A sturdy sword used by worker ants.',
    type: 'equipment',
    rarity: 'uncommon',
    stats: {
      damage: createDecimal(15),
    },
    productionModifiers: {
      worker: createDecimal(3), // 200% increase in worker production
      soldier: createDecimal(1.5), // 50% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  worker_armor: {
    id: 'worker_armor',
    name: 'Worker Armor',
    description: 'Durable armor worn by worker ants.',
    type: 'equipment',
    rarity: 'uncommon',
    stats: {
      health: createDecimal(50),
    },
    productionModifiers: {
      worker: createDecimal(2.5), // 150% increase in worker production
      soldier: createDecimal(1.25), // 25% increase in soldier production
    },
    quantity: createDecimal(1),
  },

  // Soldier Equipment
  soldier_sword: {
    id: 'soldier_sword',
    name: 'Soldier Sword',
    description: 'A powerful sword wielded by soldier ants.',
    type: 'equipment',
    rarity: 'rare',
    stats: {
      damage: createDecimal(30),
    },
    productionModifiers: {
      soldier: createDecimal(4), // 300% increase in soldier production
      worker: createDecimal(2), // 100% increase in worker production
    },
    quantity: createDecimal(1),
  },
  soldier_armor: {
    id: 'soldier_armor',
    name: 'Soldier Armor',
    description: 'Heavy armor worn by soldier ants.',
    type: 'equipment',
    rarity: 'rare',
    stats: {
      health: createDecimal(100),
    },
    productionModifiers: {
      soldier: createDecimal(3.5), // 250% increase in soldier production
      worker: createDecimal(1.75), // 75% increase in worker production
    },
    quantity: createDecimal(1),
  },
}

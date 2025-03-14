import type Decimal from 'break_infinity.js'
import { createDecimal } from '@/utils/decimalUtils'
import type { Bug } from '@/stores/bugStore'

export interface BugDrop {
  itemId: string
  chance: number
  minQuantity: number
  maxQuantity: number
}

export const bugs: Bug[] = [
  {
    id: 'safe',
    name: 'Training Bug',
    description: 'A weak bug used for training. Perfect for beginners.',
    health: createDecimal(100),
    maxHealth: createDecimal(100),
    damage: createDecimal(0),
    defense: createDecimal(0),
    drops: [
      {
        itemId: 'training_sword',
        chance: 0.5,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'training_armor',
        chance: 0.5,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'wooden_shield',
        chance: 0.4,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'leaf_cloak',
        chance: 0.4,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'void_reaver',
        chance: 0.0001,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'worker',
    name: 'Worker Ant',
    description: 'A common worker ant. Slightly tougher than training bugs.',
    health: createDecimal(200),
    maxHealth: createDecimal(200),
    damage: createDecimal(10),
    defense: createDecimal(5),
    drops: [
      {
        itemId: 'worker_sword',
        chance: 0.4,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'worker_armor',
        chance: 0.4,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'foraging_tools',
        chance: 0.45,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'pebble_hammer',
        chance: 0.35,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'reinforced_mandibles',
        chance: 0.2,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'soldier',
    name: 'Soldier Ant',
    description: 'A powerful soldier ant. Much tougher than worker ants.',
    health: createDecimal(500),
    maxHealth: createDecimal(500),
    damage: createDecimal(25),
    defense: createDecimal(15),
    drops: [
      {
        itemId: 'soldier_sword',
        chance: 0.3,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'soldier_armor',
        chance: 0.3,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'resin_helmet',
        chance: 0.25,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'thorn_spear',
        chance: 0.25,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'ladybug',
    name: 'Ladybug',
    health: createDecimal(1e3),
    maxHealth: createDecimal(1e3),
    damage: createDecimal(50),
    defense: createDecimal(20),
    description: 'Looks cute but can be surprisingly tough!',
    drops: [
      {
        itemId: 'mandible_crusher',
        chance: 0.05,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'beetle_shell_shield',
        chance: 0.15,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'spider_fang_blade',
        chance: 0.08,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'housefly',
    name: 'Housefly',
    health: createDecimal(5e3),
    maxHealth: createDecimal(5e3),
    damage: createDecimal(200),
    defense: createDecimal(50),
    description: 'Annoying and surprisingly durable.',
    drops: [
      {
        itemId: 'exoskeleton_plate',
        chance: 0.04,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'dragonfly_wing_cloak',
        chance: 0.1,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'mosquito',
    name: 'Mosquito',
    health: createDecimal(2e4),
    maxHealth: createDecimal(2e4),
    damage: createDecimal(1e3),
    defense: createDecimal(100),
    description: 'Small but extremely irritating.',
    drops: [
      {
        itemId: 'venom_dagger',
        chance: 0.03,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'hornet_stinger_dagger',
        chance: 0.12,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'beetle',
    name: 'Beetle',
    health: createDecimal(1e5),
    maxHealth: createDecimal(1e5),
    damage: createDecimal(5e3),
    defense: createDecimal(200),
    description: 'Hard shell, strong bite.',
    drops: [
      {
        itemId: 'exoskeleton_plate',
        chance: 0.08,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'beetle_shell_shield',
        chance: 0.2,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'grasshopper',
    name: 'Grasshopper',
    health: createDecimal(5e5),
    maxHealth: createDecimal(5e5),
    damage: createDecimal(2e4),
    defense: createDecimal(300),
    description: 'Jumps around and avoids attacks!',
    drops: [
      {
        itemId: 'mandible_crusher',
        chance: 0.07,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'thorn_spear',
        chance: 0.15,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'cockroach',
    name: 'Cockroach',
    health: createDecimal(2e6),
    maxHealth: createDecimal(2e6),
    damage: createDecimal(1e5),
    defense: createDecimal(500),
    description: "Survivor of everything. Just won't die.",
    drops: [
      {
        itemId: 'venom_dagger',
        chance: 0.06,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'chronos_shell',
        chance: 0.001,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'firefly_lantern_shield',
        chance: 0.1,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'fire_ant',
    name: 'Fire Ant',
    health: createDecimal(1e7),
    maxHealth: createDecimal(1e7),
    damage: createDecimal(5e5),
    defense: createDecimal(1e3),
    description: 'Burns everything in its path.',
    drops: [
      {
        itemId: 'queen_stinger',
        chance: 0.01,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'void_reaver',
        chance: 0.002,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'spider_fang_blade',
        chance: 0.15,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'termite',
    name: 'Termite',
    health: createDecimal(5e7),
    maxHealth: createDecimal(5e7),
    damage: createDecimal(2e6),
    defense: createDecimal(2e3),
    description: 'Destroys everything it touches.',
    drops: [
      {
        itemId: 'mandible_crusher',
        chance: 0.1,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'reinforced_mandibles',
        chance: 0.25,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'wasp',
    name: 'Wasp',
    health: createDecimal(2e8),
    maxHealth: createDecimal(2e8),
    damage: createDecimal(1e7),
    defense: createDecimal(5e3),
    description: 'Faster and angrier than a hornet!',
    drops: [
      {
        itemId: 'queen_stinger',
        chance: 0.02,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'entropy_fangs',
        chance: 0.003,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'hornet_stinger_dagger',
        chance: 0.2,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'scorpion',
    name: 'Scorpion',
    health: createDecimal(1e9),
    maxHealth: createDecimal(1e9),
    damage: createDecimal(5e7),
    defense: createDecimal(1e4),
    description: 'Big pincers, bigger stinger.',
    drops: [
      {
        itemId: 'venom_dagger',
        chance: 0.15,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'void_reaver',
        chance: 0.004,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'hornet_stinger_dagger',
        chance: 0.25,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'giant_moth',
    name: 'Giant Moth',
    health: createDecimal(5e9),
    maxHealth: createDecimal(5e9),
    damage: createDecimal(2e8),
    defense: createDecimal(2e4),
    description: "Loves lights. Too bad it's also huge.",
    drops: [
      {
        itemId: 'cosmic_carapace',
        chance: 0.005,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'chronos_shell',
        chance: 0.002,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'dragonfly_wing_cloak',
        chance: 0.2,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'tarantula',
    name: 'Tarantula',
    health: createDecimal(2e10),
    maxHealth: createDecimal(2e10),
    damage: createDecimal(1e9),
    defense: createDecimal(5e4),
    description: 'Fluffy but terrifying.',
    drops: [
      {
        itemId: 'exoskeleton_plate',
        chance: 0.12,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'entropy_fangs',
        chance: 0.005,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'spider_fang_blade',
        chance: 0.3,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'giant_stag_beetle',
    name: 'Giant Stag Beetle',
    health: createDecimal(1e12),
    maxHealth: createDecimal(1e12),
    damage: createDecimal(5e10),
    defense: createDecimal(1e5),
    description: 'Massive pincers that can crush anything.',
    drops: [
      {
        itemId: 'mandible_crusher',
        chance: 0.2,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'entropy_fangs',
        chance: 0.008,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'beetle_shell_shield',
        chance: 0.35,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: 'army_ant',
    name: 'Army Ant',
    health: createDecimal(1e15),
    maxHealth: createDecimal(1e15),
    damage: createDecimal(1e13),
    defense: createDecimal(2e5),
    description: 'A relentless horde of ants.',
    drops: [
      {
        itemId: 'queen_stinger',
        chance: 0.03,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'infinity_shard',
        chance: 0.0005,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'reinforced_mandibles',
        chance: 0.4,
        minQuantity: 1,
        maxQuantity: 3,
      },
    ],
  },
  {
    id: 'stag_beetle_swarm',
    name: 'Stag Beetle Swarm',
    health: createDecimal(1e18),
    maxHealth: createDecimal(1e18),
    damage: createDecimal(1e16),
    defense: createDecimal(5e5),
    description: 'Too many beetles to count.',
    drops: [
      {
        itemId: 'quantum_mandibles',
        chance: 0.008,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'eternity_weave',
        chance: 0.0008,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'beetle_shell_shield',
        chance: 0.5,
        minQuantity: 1,
        maxQuantity: 5,
      },
    ],
  },
  {
    id: 'mutant_fly',
    name: 'Mutant Fly',
    health: createDecimal(1e21),
    maxHealth: createDecimal(1e21),
    damage: createDecimal(1e19),
    defense: createDecimal(1e6),
    description: 'Somehow even more annoying than a normal fly.',
    drops: [
      {
        itemId: 'cosmic_carapace',
        chance: 0.01,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'void_reaver',
        chance: 0.01,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'dragonfly_wing_cloak',
        chance: 0.3,
        minQuantity: 1,
        maxQuantity: 2,
      },
    ],
  },
  {
    id: 'giant_firefly',
    name: 'Giant Firefly',
    health: createDecimal(1e25),
    maxHealth: createDecimal(1e25),
    damage: createDecimal(1e23),
    defense: createDecimal(2e6),
    description: 'Brighter than the sun, dangerous too.',
    drops: [
      {
        itemId: 'cosmic_carapace',
        chance: 0.015,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'chronos_shell',
        chance: 0.01,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'firefly_lantern_shield',
        chance: 0.35,
        minQuantity: 1,
        maxQuantity: 2,
      },
    ],
  },
  {
    id: 'ultra_beetle',
    name: 'Ultra Beetle',
    health: createDecimal(1e30),
    maxHealth: createDecimal(1e30),
    damage: createDecimal(1e28),
    defense: createDecimal(5e6),
    description: 'Bigger. Stronger. Shinier.',
    drops: [
      {
        itemId: 'quantum_mandibles',
        chance: 0.012,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'entropy_fangs',
        chance: 0.015,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'beetle_shell_shield',
        chance: 0.6,
        minQuantity: 2,
        maxQuantity: 5,
      },
    ],
  },
  {
    id: 'queen_wasp',
    name: 'Queen Wasp',
    health: createDecimal(1e35),
    maxHealth: createDecimal(1e35),
    damage: createDecimal(1e33),
    defense: createDecimal(1e7),
    description: 'Controls an entire hive of wasps.',
    drops: [
      {
        itemId: 'queen_stinger',
        chance: 0.05,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'infinity_shard',
        chance: 0.002,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'hornet_stinger_dagger',
        chance: 0.5,
        minQuantity: 1,
        maxQuantity: 3,
      },
    ],
  },
  {
    id: 'colossal_cockroach',
    name: 'Colossal Cockroach',
    health: createDecimal(1e40),
    maxHealth: createDecimal(1e40),
    damage: createDecimal(1e38),
    defense: createDecimal(2e7),
    description: 'Even harder to kill than before.',
    drops: [
      {
        itemId: 'exoskeleton_plate',
        chance: 0.025,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'eternity_weave',
        chance: 0.003,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'firefly_lantern_shield',
        chance: 0.4,
        minQuantity: 1,
        maxQuantity: 3,
      },
    ],
  },
  {
    id: 'apocalyptic_termites',
    name: 'Apocalyptic Termites',
    health: createDecimal(1e50),
    maxHealth: createDecimal(1e50),
    damage: createDecimal(1e48),
    defense: createDecimal(5e7),
    description: 'Capable of reducing everything to dust.',
    drops: [
      {
        itemId: 'quantum_mandibles',
        chance: 0.02,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'genesis_claw',
        chance: 0.001,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'reinforced_mandibles',
        chance: 0.6,
        minQuantity: 2,
        maxQuantity: 5,
      },
    ],
  },
  {
    id: 'radioactive_spider',
    name: 'Radioactive Spider',
    health: createDecimal(1e60),
    maxHealth: createDecimal(1e60),
    damage: createDecimal(1e58),
    defense: createDecimal(1e8),
    description: 'Not the kind that gives you superpowers.',
    drops: [
      {
        itemId: 'venom_dagger',
        chance: 0.03,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'infinity_shard',
        chance: 0.004,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'spider_fang_blade',
        chance: 0.5,
        minQuantity: 2,
        maxQuantity: 4,
      },
    ],
  },
  {
    id: 'endless_ant_swarms',
    name: 'Endless Ant Swarm',
    health: createDecimal(1e75),
    maxHealth: createDecimal(1e75),
    damage: createDecimal(1e73),
    defense: createDecimal(2e8),
    description: 'A never-ending army of ants.',
    drops: [
      {
        itemId: 'queen_stinger',
        chance: 0.04,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'eternity_weave',
        chance: 0.005,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'reinforced_mandibles',
        chance: 0.7,
        minQuantity: 3,
        maxQuantity: 8,
      },
    ],
  },
  {
    id: 'galactic_moth',
    name: 'Galactic Moth',
    health: createDecimal(1e100),
    maxHealth: createDecimal(1e100),
    damage: createDecimal(1e98),
    defense: createDecimal(5e8),
    description: 'It seeks the biggest, brightest lights in the universe.',
    drops: [
      {
        itemId: 'cosmic_carapace',
        chance: 0.03,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'genesis_claw',
        chance: 0.002,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'dragonfly_wing_cloak',
        chance: 0.6,
        minQuantity: 2,
        maxQuantity: 5,
      },
    ],
  },
  {
    id: 'quantum_beetle',
    name: 'Quantum Beetle',
    health: createDecimal(1e150),
    maxHealth: createDecimal(1e150),
    damage: createDecimal(1e148),
    defense: createDecimal(1e9),
    description: 'Exists in multiple places at once.',
    drops: [
      {
        itemId: 'quantum_mandibles',
        chance: 0.05,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'genesis_claw',
        chance: 0.01,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'infinity_shard',
        chance: 0.01,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        itemId: 'eternity_weave',
        chance: 0.01,
        minQuantity: 1,
        maxQuantity: 1,
      },
      // Guaranteed drops of lower tier items
      {
        itemId: 'beetle_shell_shield',
        chance: 1,
        minQuantity: 5,
        maxQuantity: 10,
      },
      {
        itemId: 'spider_fang_blade',
        chance: 1,
        minQuantity: 3,
        maxQuantity: 8,
      },
    ],
  },
]

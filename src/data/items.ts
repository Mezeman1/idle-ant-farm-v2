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

  // Additional Common Equipment
  wooden_shield: {
    id: 'wooden_shield',
    name: 'Wooden Shield',
    description: 'A simple wooden shield that offers basic protection.',
    type: 'equipment',
    rarity: 'common',
    stats: {
      health: createDecimal(15),
      defense: createDecimal(3),
    },
    productionModifiers: {
      worker: createDecimal(1.3), // 30% increase in worker production
    },
    quantity: createDecimal(1),
  },
  foraging_tools: {
    id: 'foraging_tools',
    name: 'Foraging Tools',
    description: 'Basic tools that help ants gather resources more efficiently.',
    type: 'equipment',
    rarity: 'common',
    stats: {
      damage: createDecimal(2),
    },
    productionModifiers: {
      worker: createDecimal(2.2), // 120% increase in worker production
    },
    quantity: createDecimal(1),
  },
  leaf_cloak: {
    id: 'leaf_cloak',
    name: 'Leaf Cloak',
    description: 'A simple cloak made from leaves that provides minimal protection.',
    type: 'equipment',
    rarity: 'common',
    stats: {
      health: createDecimal(10),
      defense: createDecimal(1),
    },
    productionModifiers: {
      worker: createDecimal(1.7), // 70% increase in worker production
    },
    quantity: createDecimal(1),
  },
  pebble_hammer: {
    id: 'pebble_hammer',
    name: 'Pebble Hammer',
    description: 'A small pebble attached to a stick. Crude but effective.',
    type: 'equipment',
    rarity: 'common',
    stats: {
      damage: createDecimal(7),
    },
    productionModifiers: {
      worker: createDecimal(1.8), // 80% increase in worker production
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

  // Additional Uncommon Equipment
  reinforced_mandibles: {
    id: 'reinforced_mandibles',
    name: 'Reinforced Mandibles',
    description: 'Strengthened mandibles that can cut through tougher materials.',
    type: 'equipment',
    rarity: 'uncommon',
    stats: {
      damage: createDecimal(20),
      defense: createDecimal(5),
    },
    productionModifiers: {
      worker: createDecimal(3.2), // 220% increase in worker production
      soldier: createDecimal(1.4), // 40% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  resin_helmet: {
    id: 'resin_helmet',
    name: 'Resin Helmet',
    description: 'A helmet crafted from hardened tree resin, offering good protection.',
    type: 'equipment',
    rarity: 'uncommon',
    stats: {
      health: createDecimal(40),
      defense: createDecimal(10),
    },
    productionModifiers: {
      worker: createDecimal(2.7), // 170% increase in worker production
      soldier: createDecimal(1.3), // 30% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  thorn_spear: {
    id: 'thorn_spear',
    name: 'Thorn Spear',
    description: 'A spear tipped with a sharp rose thorn. Excellent for piercing.',
    type: 'equipment',
    rarity: 'uncommon',
    stats: {
      damage: createDecimal(25),
    },
    productionModifiers: {
      worker: createDecimal(2.8), // 180% increase in worker production
      soldier: createDecimal(1.6), // 60% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  beetle_shell_shield: {
    id: 'beetle_shell_shield',
    name: 'Beetle Shell Shield',
    description: "A shield made from a small beetle's shell. Surprisingly durable.",
    type: 'equipment',
    rarity: 'uncommon',
    stats: {
      health: createDecimal(60),
      defense: createDecimal(15),
    },
    productionModifiers: {
      worker: createDecimal(2.6), // 160% increase in worker production
      soldier: createDecimal(1.7), // 70% increase in soldier production
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

  // Additional Rare Equipment
  spider_fang_blade: {
    id: 'spider_fang_blade',
    name: 'Spider Fang Blade',
    description: 'A deadly blade crafted from the fang of a spider. Cuts through enemies with ease.',
    type: 'equipment',
    rarity: 'rare',
    stats: {
      damage: createDecimal(40),
      regen: createDecimal(2),
    },
    productionModifiers: {
      soldier: createDecimal(4.2), // 320% increase in soldier production
      worker: createDecimal(2.1), // 110% increase in worker production
    },
    quantity: createDecimal(1),
  },
  dragonfly_wing_cloak: {
    id: 'dragonfly_wing_cloak',
    name: 'Dragonfly Wing Cloak',
    description: 'A cloak made from iridescent dragonfly wings, granting enhanced mobility.',
    type: 'equipment',
    rarity: 'rare',
    stats: {
      health: createDecimal(80),
      defense: createDecimal(20),
      regen: createDecimal(1),
    },
    productionModifiers: {
      soldier: createDecimal(3.8), // 280% increase in soldier production
      worker: createDecimal(1.9), // 90% increase in worker production
    },
    quantity: createDecimal(1),
  },
  hornet_stinger_dagger: {
    id: 'hornet_stinger_dagger',
    name: 'Hornet Stinger Dagger',
    description: "A dagger fashioned from a hornet's stinger. Delivers a painful sting with each strike.",
    type: 'equipment',
    rarity: 'rare',
    stats: {
      damage: createDecimal(35),
      regen: createDecimal(3),
    },
    productionModifiers: {
      soldier: createDecimal(4.5), // 350% increase in soldier production
      worker: createDecimal(1.8), // 80% increase in worker production
    },
    quantity: createDecimal(1),
  },
  firefly_lantern_shield: {
    id: 'firefly_lantern_shield',
    name: 'Firefly Lantern Shield',
    description: 'A shield with captured fireflies that illuminate the battlefield and distract enemies.',
    type: 'equipment',
    rarity: 'rare',
    stats: {
      health: createDecimal(120),
      defense: createDecimal(25),
    },
    productionModifiers: {
      soldier: createDecimal(3.7), // 270% increase in soldier production
      worker: createDecimal(2.2), // 120% increase in worker production
    },
    quantity: createDecimal(1),
  },

  // Special Rare Equipment with Global Production Bonus
  productivity_amulet: {
    id: 'productivity_amulet',
    name: 'Productivity Amulet',
    description: 'An ancient amulet that enhances the productivity of all ants in the colony.',
    type: 'equipment',
    rarity: 'rare',
    stats: {
      damage: createDecimal(10),
      health: createDecimal(30),
    },
    productionModifiers: {
      global: createDecimal(1.25), // 25% increase in ALL production
    },
    quantity: createDecimal(1),
  },

  // Epic Equipment
  mandible_crusher: {
    id: 'mandible_crusher',
    name: 'Mandible Crusher',
    description: 'A fearsome weapon forged from the mandibles of giant beetles.',
    type: 'equipment',
    rarity: 'epic',
    stats: {
      damage: createDecimal(100),
      defense: createDecimal(25),
    },
    productionModifiers: {
      worker: createDecimal(5), // 400% increase in worker production
      soldier: createDecimal(7), // 600% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  exoskeleton_plate: {
    id: 'exoskeleton_plate',
    name: 'Exoskeleton Plate',
    description: 'Armor crafted from the hardened exoskeleton of a giant stag beetle.',
    type: 'equipment',
    rarity: 'epic',
    stats: {
      health: createDecimal(300),
      defense: createDecimal(50),
      regen: createDecimal(5),
    },
    productionModifiers: {
      worker: createDecimal(4), // 300% increase in worker production
      soldier: createDecimal(6), // 500% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  venom_dagger: {
    id: 'venom_dagger',
    name: 'Venom Dagger',
    description: 'A deadly dagger coated with scorpion venom that melts through defenses.',
    type: 'equipment',
    rarity: 'epic',
    stats: {
      damage: createDecimal(150),
      regen: createDecimal(3),
    },
    productionModifiers: {
      soldier: createDecimal(8), // 700% increase in soldier production
      worker: createDecimal(3), // 200% increase in worker production
    },
    quantity: createDecimal(1),
  },

  // Special Epic Equipment with EP Boost
  evolution_crystal: {
    id: 'evolution_crystal',
    name: 'Evolution Crystal',
    description: 'A mysterious crystal that resonates with evolutionary energy, enhancing EP gains.',
    type: 'equipment',
    rarity: 'epic',
    stats: {
      damage: createDecimal(50),
      health: createDecimal(100),
      regen: createDecimal(2),
    },
    productionModifiers: {
      worker: createDecimal(3.5), // 250% increase in worker production
      soldier: createDecimal(4.5), // 350% increase in soldier production
    },
    specialModifiers: {
      epBoost: createDecimal(1.3), // 30% increase in EP gain
    },
    quantity: createDecimal(1),
  },

  // Special Epic Equipment with Global Production Bonus
  hive_amplifier: {
    id: 'hive_amplifier',
    name: 'Hive Amplifier',
    description: 'A powerful artifact that amplifies the productivity of the entire colony.',
    type: 'equipment',
    rarity: 'epic',
    stats: {
      damage: createDecimal(75),
      health: createDecimal(150),
      defense: createDecimal(30),
    },
    productionModifiers: {
      global: createDecimal(1.5), // 50% increase in ALL production
    },
    quantity: createDecimal(1),
  },

  // Legendary Equipment
  queen_stinger: {
    id: 'queen_stinger',
    name: 'Queen Stinger',
    description: 'The legendary stinger of a queen wasp, capable of piercing any defense.',
    type: 'equipment',
    rarity: 'legendary',
    stats: {
      damage: createDecimal(500),
      defense: createDecimal(100),
      regen: createDecimal(10),
    },
    productionModifiers: {
      worker: createDecimal(10), // 900% increase in worker production
      soldier: createDecimal(15), // 1400% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  cosmic_carapace: {
    id: 'cosmic_carapace',
    name: 'Cosmic Carapace',
    description: 'Armor forged from the otherworldly shell of a galactic moth, shimmering with cosmic energy.',
    type: 'equipment',
    rarity: 'legendary',
    stats: {
      health: createDecimal(1000),
      defense: createDecimal(200),
      regen: createDecimal(20),
    },
    productionModifiers: {
      worker: createDecimal(12), // 1100% increase in worker production
      soldier: createDecimal(18), // 1700% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  quantum_mandibles: {
    id: 'quantum_mandibles',
    name: 'Quantum Mandibles',
    description: 'Mandibles that exist in multiple dimensions at once, striking from impossible angles.',
    type: 'equipment',
    rarity: 'legendary',
    stats: {
      damage: createDecimal(1000),
      defense: createDecimal(150),
      regen: createDecimal(15),
    },
    productionModifiers: {
      worker: createDecimal(20), // 1900% increase in worker production
      soldier: createDecimal(25), // 2400% increase in soldier production
    },
    quantity: createDecimal(1),
  },

  // Special Legendary Equipment with EP Boost
  evolutionary_nexus: {
    id: 'evolutionary_nexus',
    name: 'Evolutionary Nexus',
    description: 'A powerful nexus of evolutionary energy that greatly enhances EP gains.',
    type: 'equipment',
    rarity: 'legendary',
    stats: {
      damage: createDecimal(300),
      health: createDecimal(500),
      defense: createDecimal(100),
      regen: createDecimal(10),
    },
    productionModifiers: {
      worker: createDecimal(8), // 700% increase in worker production
      soldier: createDecimal(12), // 1100% increase in soldier production
    },
    specialModifiers: {
      epBoost: createDecimal(2), // 100% increase in EP gain (doubles EP)
    },
    quantity: createDecimal(1),
  },

  // Special Legendary Equipment with Global Production Bonus
  colony_accelerator: {
    id: 'colony_accelerator',
    name: 'Colony Accelerator',
    description: 'A legendary artifact that dramatically increases the productivity of all ants.',
    type: 'equipment',
    rarity: 'legendary',
    stats: {
      damage: createDecimal(400),
      health: createDecimal(600),
      defense: createDecimal(120),
      regen: createDecimal(12),
    },
    productionModifiers: {
      global: createDecimal(2), // 100% increase in ALL production (doubles production)
    },
    quantity: createDecimal(1),
  },

  // Mythic Equipment
  void_reaver: {
    id: 'void_reaver',
    name: 'Void Reaver',
    description: 'A mythical blade that tears through the fabric of reality, harvesting energy from the void.',
    type: 'equipment',
    rarity: 'mythic',
    stats: {
      damage: createDecimal(5000),
      defense: createDecimal(500),
      regen: createDecimal(50),
    },
    productionModifiers: {
      worker: createDecimal(50), // 4900% increase in worker production
      soldier: createDecimal(75), // 7400% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  chronos_shell: {
    id: 'chronos_shell',
    name: 'Chronos Shell',
    description: 'Armor that manipulates time itself, allowing the wearer to exist slightly out of phase with reality.',
    type: 'equipment',
    rarity: 'mythic',
    stats: {
      health: createDecimal(10000),
      defense: createDecimal(1000),
      regen: createDecimal(100),
    },
    productionModifiers: {
      worker: createDecimal(60), // 5900% increase in worker production
      soldier: createDecimal(90), // 8900% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  entropy_fangs: {
    id: 'entropy_fangs',
    name: 'Entropy Fangs',
    description: 'Mandibles that accelerate entropy in whatever they touch, causing instant decay and dissolution.',
    type: 'equipment',
    rarity: 'mythic',
    stats: {
      damage: createDecimal(7500),
      defense: createDecimal(750),
      regen: createDecimal(75),
    },
    productionModifiers: {
      worker: createDecimal(80), // 7900% increase in worker production
      soldier: createDecimal(120), // 11900% increase in soldier production
    },
    quantity: createDecimal(1),
  },

  // Special Mythic Equipment with EP Boost
  ascension_matrix: {
    id: 'ascension_matrix',
    name: 'Ascension Matrix',
    description: 'A mythical matrix of pure evolutionary potential that vastly enhances EP gains.',
    type: 'equipment',
    rarity: 'mythic',
    stats: {
      damage: createDecimal(3000),
      health: createDecimal(5000),
      defense: createDecimal(500),
      regen: createDecimal(50),
    },
    productionModifiers: {
      worker: createDecimal(40), // 3900% increase in worker production
      soldier: createDecimal(60), // 5900% increase in soldier production
    },
    specialModifiers: {
      epBoost: createDecimal(5), // 400% increase in EP gain (5x EP)
    },
    quantity: createDecimal(1),
  },

  // Special Mythic Equipment with Global Production Bonus
  omnipotent_catalyst: {
    id: 'omnipotent_catalyst',
    name: 'Omnipotent Catalyst',
    description: 'A mythical catalyst that exponentially increases the productivity of all ants.',
    type: 'equipment',
    rarity: 'mythic',
    stats: {
      damage: createDecimal(4000),
      health: createDecimal(6000),
      defense: createDecimal(600),
      regen: createDecimal(60),
    },
    productionModifiers: {
      global: createDecimal(5), // 400% increase in ALL production (5x production)
    },
    quantity: createDecimal(1),
  },

  // Divine Equipment
  infinity_shard: {
    id: 'infinity_shard',
    name: 'Infinity Shard',
    description: "A fragment of the universe's beginning, containing limitless potential and power.",
    type: 'equipment',
    rarity: 'divine',
    stats: {
      damage: createDecimal(50000),
      defense: createDecimal(5000),
      regen: createDecimal(500),
      health: createDecimal(50000),
    },
    productionModifiers: {
      worker: createDecimal(500), // 49900% increase in worker production
      soldier: createDecimal(750), // 74900% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  eternity_weave: {
    id: 'eternity_weave',
    name: 'Eternity Weave',
    description: 'Armor woven from the threads of eternity itself, granting near immortality to its wearer.',
    type: 'equipment',
    rarity: 'divine',
    stats: {
      health: createDecimal(100000),
      defense: createDecimal(10000),
      regen: createDecimal(1000),
      damage: createDecimal(10000),
    },
    productionModifiers: {
      worker: createDecimal(600), // 59900% increase in worker production
      soldier: createDecimal(900), // 89900% increase in soldier production
    },
    quantity: createDecimal(1),
  },
  genesis_claw: {
    id: 'genesis_claw',
    name: 'Genesis Claw',
    description: 'A weapon that contains the power of creation itself, able to reshape reality with each strike.',
    type: 'equipment',
    rarity: 'divine',
    stats: {
      damage: createDecimal(75000),
      defense: createDecimal(7500),
      regen: createDecimal(750),
      health: createDecimal(25000),
    },
    productionModifiers: {
      worker: createDecimal(1000), // 99900% increase in worker production
      soldier: createDecimal(1500), // 149900% increase in soldier production
    },
    quantity: createDecimal(1),
  },

  // Special Divine Equipment with EP Boost
  transcendence_core: {
    id: 'transcendence_core',
    name: 'Transcendence Core',
    description: 'A divine core of pure evolutionary essence that astronomically enhances EP gains.',
    type: 'equipment',
    rarity: 'divine',
    stats: {
      damage: createDecimal(30000),
      health: createDecimal(50000),
      defense: createDecimal(5000),
      regen: createDecimal(500),
    },
    productionModifiers: {
      worker: createDecimal(300), // 29900% increase in worker production
      soldier: createDecimal(450), // 44900% increase in soldier production
    },
    specialModifiers: {
      epBoost: createDecimal(10), // 900% increase in EP gain (10x EP)
    },
    quantity: createDecimal(1),
  },

  // Special Divine Equipment with Global Production Bonus
  universal_amplifier: {
    id: 'universal_amplifier',
    name: 'Universal Amplifier',
    description: 'A divine artifact that amplifies the productivity of all ants to godlike levels.',
    type: 'equipment',
    rarity: 'divine',
    stats: {
      damage: createDecimal(40000),
      health: createDecimal(60000),
      defense: createDecimal(6000),
      regen: createDecimal(600),
    },
    productionModifiers: {
      global: createDecimal(10), // 900% increase in ALL production (10x production)
    },
    quantity: createDecimal(1),
  },
}

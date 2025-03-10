import type { GeneratorId } from '@/types/generators'

/**
 * Generator information mapping with names and icons
 */
export const generatorInfo: Record<GeneratorId, { name: string; icon: string }> = {
  worker: { name: 'Worker Ants', icon: 'i-heroicons-bug-ant' },
  nursery: { name: 'Nursery', icon: 'i-heroicons-home-modern' },
  queenChamber: { name: 'Queen Chamber', icon: 'i-heroicons-crown' },
  colony: { name: 'Colony', icon: 'i-heroicons-building-storefront' },
  megacolony: { name: 'Mega Colony', icon: 'i-heroicons-building-office-2' },
  hivemind: { name: 'Hive Mind', icon: 'i-heroicons-cpu-chip' },
  antopolis: { name: 'Antopolis', icon: 'i-heroicons-building-library' },
}

/**
 * Get level requirement description for a generator
 */
export function getLevelRequirementDescription(generatorId: GeneratorId | null): string {
  if (!generatorId) return ''

  switch (generatorId) {
    case 'worker':
      return 'Levels up based on ticks in current evolution'
    case 'nursery':
      return 'Levels up based on amount of food gained'
    case 'queenChamber':
      return 'Levels up based on total manual purchases'
    case 'colony':
      return 'Levels up based on amount of upgrades purchased'
    case 'megacolony':
      return 'Levels up based on total evolution points'
    case 'hivemind':
      return 'Levels up based on total ant types unlocked'
    case 'antopolis':
      return 'Levels up based on total colony level'
    default:
      return ''
  }
}

/**
 * Get level requirement unit for a generator
 */
export function getLevelRequirementUnit(generatorId: GeneratorId | null): string {
  if (!generatorId) return ''

  switch (generatorId) {
    case 'worker':
      return 'ticks'
    case 'nursery':
      return 'food'
    case 'queenChamber':
      return 'purchases'
    case 'colony':
      return 'upgrades'
    case 'megacolony':
      return 'points'
    case 'hivemind':
      return 'types'
    case 'antopolis':
      return 'levels'
    default:
      return ''
  }
}

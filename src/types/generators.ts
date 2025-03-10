import type Decimal from 'break_infinity.js'

export type GeneratorId = 'worker' | 'nursery' | 'queenChamber' | 'colony' | 'megacolony' | 'hivemind' | 'antopolis'

export type GeneratorRecord = Record<GeneratorId, Decimal>

export interface GeneratorUpgrade {
  id: string
  generatorId: GeneratorId
  name: string
  description: string
  cost: Decimal
  level: Decimal
  maxLevel: Decimal | null
  effect: (level: Decimal) => Decimal
  icon: string
  unlocked: boolean
}

export interface GeneratorUpgradeState {
  generatorLevels: Record<string, string>
  generatorPoints: Record<string, string>
  levelProgress: Record<string, string>
  upgrades: Array<{
    id: string
    level: string
  }>
}

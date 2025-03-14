import Decimal from 'break_infinity.js'

export interface PrestigeUpgrade {
  id: string
  name: string
  description: string
  baseCost: Decimal
  cost: Decimal // Make this required since we're setting it directly
  costMultiplier?: (context: any) => Decimal
  level: Decimal
  maxLevel: Decimal | null // null means no max level
  effect: (level: Decimal) => Decimal // Returns multiplier based on level
  icon: string
  isUnlocked: () => boolean // Function to determine if upgrade is unlocked
  category: 'production' | 'efficiency' | 'automation' | 'research' | 'synergy' | 'prestige'
  // Field to specify which generators this upgrade applies to
  // If empty or undefined, it applies globally to all generators
  appliesTo?: string[]
}

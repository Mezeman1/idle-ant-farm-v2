import { defineStore } from 'pinia'
import { computed } from 'vue'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'
import { useGeneratorStore } from './generatorStore'
import { usePrestigeStore } from './prestigeStore'
import { useGeneratorUpgradeStore } from './generatorUpgradeStore'
import { useInventoryStore } from './inventoryStore'
import { useItemStore } from './itemStore'
import type { Generator } from '@/stores/generatorStore'
import type { PrestigeUpgrade } from '@/types/prestige'

export interface MultiplierBreakdown {
  name: string
  value: Decimal
  formatted: string
}

interface MultiplierSource {
  id: string
  name: string
  getMultiplier: (generatorId: string) => Decimal
  appliesTo: (generatorId: string) => boolean
}

export const useMultiplierStore = defineStore('multiplier', () => {
  // Get stores
  const generatorStore = useGeneratorStore()
  const prestigeStore = usePrestigeStore()
  const generatorUpgradeStore = useGeneratorUpgradeStore()
  const inventoryStore = useInventoryStore()
  const itemStore = useItemStore()

  // Define global multipliers that apply to all generators
  const getGlobalMultipliers = (): MultiplierSource[] => {
    const globalMultipliers: MultiplierSource[] = []

    // Get all prestige upgrades
    const allPrestigeMultipliers = prestigeStore.getAllMultipliers()
    const allUpgrades = prestigeStore.evolutionUpgrades

    // Process each prestige upgrade
    allUpgrades.forEach(upgrade => {
      // Skip upgrades with no level purchased
      if (upgrade.level.eq(0)) return

      // Skip upgrades that don't affect production
      if (upgrade.category !== 'production' && upgrade.category !== 'synergy') return

      // If the upgrade has no appliesTo field or it's an empty array, it applies globally
      if (!upgrade.appliesTo || upgrade.appliesTo.length === 0) {
        // Special handling for synergy upgrades which are calculated differently
        if (upgrade.id === 'generatorSynergy' || upgrade.id === 'evolutionSynergy') {
          const synergyId = upgrade.id === 'generatorSynergy' ? 'generatorSynergyBonus' : 'evolutionSynergyBonus'
          if (allPrestigeMultipliers[synergyId] && allPrestigeMultipliers[synergyId].gt(1)) {
            globalMultipliers.push({
              id: synergyId,
              name: upgrade.name,
              getMultiplier: () => allPrestigeMultipliers[synergyId] || createDecimal(1),
              appliesTo: () => true,
            })
          }
        } else {
          // Regular global upgrade
          globalMultipliers.push({
            id: upgrade.id,
            name: upgrade.name,
            getMultiplier: () => prestigeStore.getUpgradeMultiplier(upgrade.id),
            appliesTo: () => true,
          })
        }
      }
    })

    // Add global production multiplier from items
    const specialModifiers = inventoryStore.totalSpecialModifiers
    if (specialModifiers.global && specialModifiers.global.gt(1)) {
      globalMultipliers.push({
        id: 'item_global_multiplier',
        name: 'Global Production Bonus',
        getMultiplier: () => specialModifiers.global,
        appliesTo: () => true,
      })
    }

    return globalMultipliers
  }

  // Get generator-specific multipliers from prestige upgrades
  const getPrestigeMultipliers = (): MultiplierSource[] => {
    const multipliers: MultiplierSource[] = []

    // Get all prestige upgrades
    const allUpgrades = prestigeStore.evolutionUpgrades

    // Process each prestige upgrade
    allUpgrades.forEach(upgrade => {
      // Skip upgrades with no level purchased
      if (upgrade.level.eq(0)) return

      // Skip upgrades that don't affect production
      if (upgrade.category !== 'production' && upgrade.category !== 'synergy') return

      // If the upgrade has an appliesTo field with specific generators, add it for each generator
      if (upgrade.appliesTo && upgrade.appliesTo.length > 0) {
        multipliers.push({
          id: upgrade.id,
          name: upgrade.name,
          getMultiplier: () => prestigeStore.getUpgradeMultiplier(upgrade.id),
          appliesTo: generatorId => upgrade.appliesTo?.includes(generatorId) || false,
        })
      }
    })

    // Add the advanced efficiency multiplier for high-tier generators
    multipliers.push({
      id: 'advancedEfficiency',
      name: 'Advanced Efficiency',
      getMultiplier: () => prestigeStore.getUpgradeMultiplier('strongerSoldiers'),
      appliesTo: generatorId => {
        const generator = generatorStore.getGenerator(generatorId)
        return generator ? generator.tier > 4 : false
      },
    })

    return multipliers
  }

  // Get generator-specific multipliers from generator upgrades
  const getGeneratorUpgradeMultipliers = (): MultiplierSource[] => {
    const multipliers: MultiplierSource[] = []

    // Get all generator upgrades
    const allUpgrades = generatorUpgradeStore.generatorUpgrades

    // Filter for upgrades that affect production (not cost reduction or other effects)
    const productionUpgrades = allUpgrades.filter(upgrade => {
      // Exclude upgrades that are known to affect costs or have other non-production effects
      const nonProductionKeywords = ['Training', 'Expansion', 'Longevity', 'Automation', 'Fertility', 'Dominance']

      // Check if the upgrade ID contains any of the non-production keywords
      return !nonProductionKeywords.some(keyword => upgrade.id.includes(keyword))
    })

    // Create multiplier sources for each production upgrade
    productionUpgrades.forEach(upgrade => {
      // Only include upgrades that have been purchased (level > 0)
      if (upgrade.level.gt(0)) {
        multipliers.push({
          id: upgrade.id,
          name: upgrade.name,
          getMultiplier: () => generatorUpgradeStore.getUpgradeMultiplier(upgrade.id),
          appliesTo: generatorId => generatorId === upgrade.generatorId,
        })
      }
    })

    return multipliers
  }

  // Get equipment multipliers
  const getEquipmentMultipliers = (): MultiplierSource[] => {
    const multipliers: MultiplierSource[] = []

    // Process each equipped item
    inventoryStore.equipmentSlots.forEach(slot => {
      if (slot.item) {
        const item = inventoryStore.getItem(slot.item)
        if (item?.productionModifiers) {
          // Add a multiplier source for each generator this item affects
          Object.entries(item.productionModifiers).forEach(([generatorId, multiplier]) => {
            // Skip global modifiers as they're handled separately
            if (generatorId === 'global') return

            multipliers.push({
              id: `equipment_${item.id}_${generatorId}`,
              name: `${item.name} Bonus`,
              getMultiplier: () => multiplier as Decimal,
              appliesTo: id => id === generatorId,
            })
          })
        }
      }
    })

    return multipliers
  }

  // Get special multipliers like tier bonuses
  const getSpecialMultipliers = (): MultiplierSource[] => {
    return [
      // Tier bonus for advanced generators
      {
        id: 'tierBonus',
        name: 'Tier Bonus',
        getMultiplier: generatorId => {
          const generator = generatorStore.getGenerator(generatorId)
          if (generator && generator.tier > 4) {
            const tierBonusValue = 1 + (generator.tier - 4) * 0.1 // +10% per tier above colony
            return createDecimal(tierBonusValue)
          }
          return createDecimal(1)
        },
        appliesTo: generatorId => {
          const generator = generatorStore.getGenerator(generatorId)
          return generator ? generator.tier > 4 : false
        },
      },
    ]
  }

  // Combine all multiplier sources
  const getMultiplierSources = (): MultiplierSource[] => {
    return [
      ...getGlobalMultipliers(),
      ...getPrestigeMultipliers(),
      ...getGeneratorUpgradeMultipliers(),
      ...getEquipmentMultipliers(),
      ...getSpecialMultipliers(),
    ]
  }

  /**
   * Calculate the total production multiplier for a specific generator
   * by combining all applicable multiplier sources
   * @param generatorId The ID of the generator
   * @returns The total production multiplier
   */
  const calculateTotalMultiplier = (generatorId: string): Decimal => {
    let totalMultiplier = createDecimal(1)
    const multiplierSources = getMultiplierSources()

    // Apply each multiplier source that applies to this generator
    for (const source of multiplierSources) {
      if (source.appliesTo(generatorId)) {
        const value = source.getMultiplier(generatorId)
        if (value.gt(1)) {
          totalMultiplier = totalMultiplier.mul(value)
        }
      }
    }

    return totalMultiplier
  }

  /**
   * Get the total production multiplier for a specific generator
   * @param generatorId The ID of the generator
   * @returns The total production multiplier
   */
  const getProductionMultiplier = (generatorId: string): Decimal => {
    return calculateTotalMultiplier(generatorId)
  }

  /**
   * Get a formatted string representation of the production multiplier
   * @param generatorId The ID of the generator
   * @returns Formatted multiplier string
   */
  const getFormattedMultiplier = (generatorId: string): string => {
    const multiplier = getProductionMultiplier(generatorId)
    if (multiplier.lt(1000)) {
      return `${multiplier.toFixed(2)}x`
    } else {
      return formatDecimal(multiplier, 2) + 'x'
    }
  }

  /**
   * Get a detailed breakdown of all multipliers affecting a generator
   * @param generatorId The ID of the generator
   * @returns Array of multiplier breakdown items
   */
  const getMultiplierBreakdown = (generatorId: string): MultiplierBreakdown[] => {
    const breakdown: MultiplierBreakdown[] = []
    const multiplierSources = getMultiplierSources()

    // Process each multiplier source
    for (const source of multiplierSources) {
      // Check if this multiplier applies to the current generator
      if (source.appliesTo(generatorId)) {
        // Get the multiplier value
        const value = source.getMultiplier(generatorId)

        // Only add to breakdown if it provides a bonus (greater than 1)
        if (value.gt(1)) {
          breakdown.push({
            name: source.name,
            value: value,
            formatted: formatDecimal(value, 2) + 'x',
          })
        }
      }
    }

    return breakdown
  }

  /**
   * Get the EP boost multiplier from items
   * @returns The EP boost multiplier
   */
  const getEPBoostMultiplier = (): Decimal => {
    const specialModifiers = inventoryStore.totalSpecialModifiers
    return specialModifiers.epBoost || createDecimal(1)
  }

  return {
    getProductionMultiplier,
    getFormattedMultiplier,
    getMultiplierBreakdown,
    getEPBoostMultiplier,
  }
})

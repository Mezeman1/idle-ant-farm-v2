import { defineStore } from 'pinia'
import { computed } from 'vue'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'
import { useGeneratorStore } from './generatorStore'
import { usePrestigeStore } from './prestigeStore'
import { useGeneratorUpgradeStore } from './generatorUpgradeStore'
import type { Generator } from '@/stores/generatorStore'

export interface MultiplierBreakdown {
  name: string
  value: Decimal
  formatted: string
}

export const useMultiplierStore = defineStore('multiplier', () => {
  // Get stores
  const generatorStore = useGeneratorStore()
  const prestigeStore = usePrestigeStore()
  const generatorUpgradeStore = useGeneratorUpgradeStore()

  /**
   * Get the total production multiplier for a specific generator
   * @param generatorId The ID of the generator
   * @returns The total production multiplier
   */
  const getProductionMultiplier = (generatorId: string): Decimal => {
    return generatorStore.getProductionMultiplier(generatorId)
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

    // Add general multipliers from prestige store
    const strongerSoldiers = prestigeStore.getUpgradeMultiplier('strongerSoldiers')
    if (strongerSoldiers.gt(1)) {
      breakdown.push({
        name: 'Stronger Soldiers',
        value: strongerSoldiers,
        formatted: formatDecimal(strongerSoldiers, 2) + 'x',
      })
    }

    // Add exponential multipliers
    const exponentialGrowth = prestigeStore.getUpgradeMultiplier('exponentialGrowth')
    if (exponentialGrowth.gt(1)) {
      breakdown.push({
        name: 'Exponential Growth',
        value: exponentialGrowth,
        formatted: formatDecimal(exponentialGrowth, 2) + 'x',
      })
    }

    const compoundEvolution = prestigeStore.getUpgradeMultiplier('compoundEvolution')
    if (compoundEvolution.gt(1)) {
      breakdown.push({
        name: 'Compound Evolution',
        value: compoundEvolution,
        formatted: formatDecimal(compoundEvolution, 2) + 'x',
      })
    }

    // Add synergy multipliers
    const generatorSynergy = prestigeStore.getAllMultipliers()['generatorSynergyBonus']
    if (generatorSynergy && generatorSynergy.gt(1)) {
      breakdown.push({
        name: 'Generator Synergy',
        value: generatorSynergy,
        formatted: formatDecimal(generatorSynergy, 2) + 'x',
      })
    }

    const evolutionSynergy = prestigeStore.getAllMultipliers()['evolutionSynergyBonus']
    if (evolutionSynergy && evolutionSynergy.gt(1)) {
      breakdown.push({
        name: 'Evolution Synergy',
        value: evolutionSynergy,
        formatted: formatDecimal(evolutionSynergy, 2) + 'x',
      })
    }

    // Add generator-specific multipliers from both stores
    if (generatorId === 'worker') {
      // Worker-specific prestige upgrades
      const foodProcessing = prestigeStore.getUpgradeMultiplier('foodProcessing')
      if (foodProcessing.gt(1)) {
        breakdown.push({
          name: 'Food Processing',
          value: foodProcessing,
          formatted: formatDecimal(foodProcessing, 2) + 'x',
        })
      }

      const mutatedWorkers = prestigeStore.getUpgradeMultiplier('mutatedWorkers')
      if (mutatedWorkers.gt(1)) {
        breakdown.push({
          name: 'Mutated Workers',
          value: mutatedWorkers,
          formatted: formatDecimal(mutatedWorkers, 2) + 'x',
        })
      }

      // Worker-specific generator upgrades
      const workerEfficiency = generatorUpgradeStore.getUpgradeMultiplier('workerEfficiency')
      if (workerEfficiency.gt(1)) {
        breakdown.push({
          name: 'Worker Efficiency',
          value: workerEfficiency,
          formatted: formatDecimal(workerEfficiency, 2) + 'x',
        })
      }

      const workerForaging = generatorUpgradeStore.getUpgradeMultiplier('workerForaging')
      if (workerForaging.gt(1)) {
        breakdown.push({
          name: 'Advanced Foraging',
          value: workerForaging,
          formatted: formatDecimal(workerForaging, 2) + 'x',
        })
      }

      const workerEndurance = generatorUpgradeStore.getUpgradeMultiplier('workerEndurance')
      if (workerEndurance.gt(1)) {
        breakdown.push({
          name: 'Worker Endurance',
          value: workerEndurance,
          formatted: formatDecimal(workerEndurance, 2) + 'x',
        })
      }
    } else if (generatorId === 'nursery') {
      // Nursery-specific prestige upgrades
      const nurseryEfficiencyPrestige = prestigeStore.getUpgradeMultiplier('nurseryEfficiency')
      if (nurseryEfficiencyPrestige.gt(1)) {
        breakdown.push({
          name: 'Advanced Nursery Techniques',
          value: nurseryEfficiencyPrestige,
          formatted: formatDecimal(nurseryEfficiencyPrestige, 2) + 'x',
        })
      }

      // Nursery-specific generator upgrades
      const nurseryEfficiency = generatorUpgradeStore.getUpgradeMultiplier('nurseryEfficiency')
      if (nurseryEfficiency.gt(1)) {
        breakdown.push({
          name: 'Nursery Efficiency',
          value: nurseryEfficiency,
          formatted: formatDecimal(nurseryEfficiency, 2) + 'x',
        })
      }

      const nurseryNutrition = generatorUpgradeStore.getUpgradeMultiplier('nurseryNutrition')
      if (nurseryNutrition.gt(1)) {
        breakdown.push({
          name: 'Larval Nutrition',
          value: nurseryNutrition,
          formatted: formatDecimal(nurseryNutrition, 2) + 'x',
        })
      }

      const nurseryCapacity = generatorUpgradeStore.getUpgradeMultiplier('nurseryCapacity')
      if (nurseryCapacity.gt(1)) {
        breakdown.push({
          name: 'Nursery Capacity',
          value: nurseryCapacity,
          formatted: formatDecimal(nurseryCapacity, 2) + 'x',
        })
      }
    } else if (generatorId === 'queenChamber') {
      // Queen-specific prestige upgrades
      const efficientQueens = prestigeStore.getUpgradeMultiplier('efficientQueens')
      if (efficientQueens.gt(1)) {
        breakdown.push({
          name: 'Efficient Queens',
          value: efficientQueens,
          formatted: formatDecimal(efficientQueens, 2) + 'x',
        })
      }

      // Queen-specific generator upgrades
      const queenChamberEfficiency = generatorUpgradeStore.getUpgradeMultiplier('queenChamberEfficiency')
      if (queenChamberEfficiency.gt(1)) {
        breakdown.push({
          name: 'Queen Efficiency',
          value: queenChamberEfficiency,
          formatted: formatDecimal(queenChamberEfficiency, 2) + 'x',
        })
      }

      const queenChamberRoyalJelly = generatorUpgradeStore.getUpgradeMultiplier('queenChamberRoyalJelly')
      if (queenChamberRoyalJelly.gt(1)) {
        breakdown.push({
          name: 'Royal Jelly',
          value: queenChamberRoyalJelly,
          formatted: formatDecimal(queenChamberRoyalJelly, 2) + 'x',
        })
      }

      const queenChamberGuards = generatorUpgradeStore.getUpgradeMultiplier('queenChamberGuards')
      if (queenChamberGuards.gt(1)) {
        breakdown.push({
          name: 'Royal Guards',
          value: queenChamberGuards,
          formatted: formatDecimal(queenChamberGuards, 2) + 'x',
        })
      }
    } else if (generatorId === 'colony') {
      // Colony-specific prestige upgrades
      const colonyExpansion = prestigeStore.getUpgradeMultiplier('colonyExpansion')
      if (colonyExpansion.gt(1)) {
        breakdown.push({
          name: 'Colony Expansion Tactics',
          value: colonyExpansion,
          formatted: formatDecimal(colonyExpansion, 2) + 'x',
        })
      }

      // Colony-specific generator upgrades
      const colonyEfficiency = generatorUpgradeStore.getUpgradeMultiplier('colonyEfficiency')
      if (colonyEfficiency.gt(1)) {
        breakdown.push({
          name: 'Colony Efficiency',
          value: colonyEfficiency,
          formatted: formatDecimal(colonyEfficiency, 2) + 'x',
        })
      }
    } else if (generatorId === 'megacolony') {
      // Megacolony-specific prestige upgrades
      const megacolonyEfficiency = prestigeStore.getUpgradeMultiplier('megacolonyEfficiency')
      if (megacolonyEfficiency.gt(1)) {
        breakdown.push({
          name: 'Mega Colony Optimization',
          value: megacolonyEfficiency,
          formatted: formatDecimal(megacolonyEfficiency, 2) + 'x',
        })
      }

      // Tier bonus for advanced generators
      const generator = generatorStore.getGenerator(generatorId)
      if (generator) {
        const tierBonusValue = 1 + (generator.tier - 4) * 0.1 // +10% per tier above colony
        const tierBonus = createDecimal(tierBonusValue)
        breakdown.push({
          name: 'Tier Bonus',
          value: tierBonus,
          formatted: tierBonusValue.toFixed(2) + 'x',
        })
      }

      // Additional stronger soldiers bonus for advanced generators
      if (strongerSoldiers.gt(1)) {
        breakdown.push({
          name: 'Advanced Efficiency',
          value: strongerSoldiers,
          formatted: formatDecimal(strongerSoldiers, 2) + 'x',
        })
      }
    } else if (generatorId === 'hivemind') {
      // Hivemind-specific prestige upgrades
      const hivemindEfficiency = prestigeStore.getUpgradeMultiplier('hivemindEfficiency')
      if (hivemindEfficiency.gt(1)) {
        breakdown.push({
          name: 'Hive Mind Optimization',
          value: hivemindEfficiency,
          formatted: formatDecimal(hivemindEfficiency, 2) + 'x',
        })
      }

      // Tier bonus for advanced generators
      const generator = generatorStore.getGenerator(generatorId)
      if (generator) {
        const tierBonusValue = 1 + (generator.tier - 4) * 0.1 // +10% per tier above colony
        const tierBonus = createDecimal(tierBonusValue)
        breakdown.push({
          name: 'Tier Bonus',
          value: tierBonus,
          formatted: tierBonusValue.toFixed(2) + 'x',
        })
      }

      // Additional stronger soldiers bonus for advanced generators
      if (strongerSoldiers.gt(1)) {
        breakdown.push({
          name: 'Advanced Efficiency',
          value: strongerSoldiers,
          formatted: formatDecimal(strongerSoldiers, 2) + 'x',
        })
      }
    } else if (generatorId === 'antopolis') {
      // Antopolis-specific prestige upgrades
      const antopolisEfficiency = prestigeStore.getUpgradeMultiplier('antopolisEfficiency')
      if (antopolisEfficiency.gt(1)) {
        breakdown.push({
          name: 'Antopolis Optimization',
          value: antopolisEfficiency,
          formatted: formatDecimal(antopolisEfficiency, 2) + 'x',
        })
      }

      // Tier bonus for advanced generators
      const generator = generatorStore.getGenerator(generatorId)
      if (generator) {
        const tierBonusValue = 1 + (generator.tier - 4) * 0.1 // +10% per tier above colony
        const tierBonus = createDecimal(tierBonusValue)
        breakdown.push({
          name: 'Tier Bonus',
          value: tierBonus,
          formatted: tierBonusValue.toFixed(2) + 'x',
        })
      }

      // Additional stronger soldiers bonus for advanced generators
      if (strongerSoldiers.gt(1)) {
        breakdown.push({
          name: 'Advanced Efficiency',
          value: strongerSoldiers,
          formatted: formatDecimal(strongerSoldiers, 2) + 'x',
        })
      }
    }

    return breakdown
  }

  return {
    getProductionMultiplier,
    getFormattedMultiplier,
    getMultiplierBreakdown,
  }
})

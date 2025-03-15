import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'
import { useGeneratorStore } from './generatorStore'
import { useGameStore } from './gameStore'
import { useGeneratorUpgradeStore } from './generatorUpgradeStore'
import { useMultiplierStore } from './multiplierStore'
import { prestigeUpgrades, calculateUpgradeCost } from '@/data/prestigeUpgrades'
import type { PrestigeUpgrade } from '@/types/prestige'

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

  // Reference to the prestige upgrades
  const evolutionUpgrades = ref<PrestigeUpgrade[]>(prestigeUpgrades)

  // Get multiplier for a specific upgrade
  const getUpgradeMultiplier = (upgradeId: string) => {
    const upgrade = evolutionUpgrades.value.find(u => u.id === upgradeId)
    if (!upgrade) return createDecimal(1) // Default multiplier is 1 (no effect)

    return upgrade.effect(upgrade.level)
  }

  const getUpgradeCount = (upgradeId: string) => {
    const upgrade = evolutionUpgrades.value.find(u => u.id === upgradeId)
    if (!upgrade) return createDecimal(0) // Default count is 0

    return upgrade.level
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

    // Apply EP boost from items
    const multiplierStore = useMultiplierStore()
    const itemEPBoost = multiplierStore.getEPBoostMultiplier()
    if (itemEPBoost.gt(1)) {
      totalEP = totalEP.mul(itemEPBoost)
    }

    return totalEP
  }

  // Complete a foraging cycle and update requirements
  const completeLoop = () => {
    console.log('completeLoop')
    // Increment foraging cycles completed
    loopsCompleted.value = loopsCompleted.value.add(1)

    console.log('loopsCompleted', loopsCompleted.value)
    console.log('ticksPerLoop', ticksPerLoop.value)
    // Increase foraging trips required for next cycle (by 10% trips per cycle)
    ticksPerLoop.value = createDecimal(3)
      .plus(loopsCompleted.value)
      .mul(createDecimal(1.1).pow(createDecimal(loopsCompleted.value)))
      .ceil()
    console.log('ticksPerLoop', ticksPerLoop.value)
    // Increase food required for next cycle 1000×10^(loop count^1.5)
    const baseFoodIncrease = createDecimal(1000).mul(
      createDecimal(1.1).pow(createDecimal(loopsCompleted.value).pow(1.1))
    )

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
      completeLoop()
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
          // Recalculate cost based on level and baseCost
          const costMultiplierFn = upgrade.costMultiplier
          if (costMultiplierFn) {
            // Use the costMultiplier function if available
            upgrade.cost = costMultiplierFn({ cost: upgrade.baseCost, level: upgrade.level })
          } else {
            // Default multiplier if none provided (1.5^level)
            upgrade.cost = upgrade.baseCost.mul(createDecimal(1.5).pow(upgrade.level))
          }
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

    // Update cost for next level
    const costMultiplierFn = upgrade.costMultiplier
    if (costMultiplierFn) {
      // Use the costMultiplier function if available
      upgrade.cost = costMultiplierFn({ cost: upgrade.baseCost, level: upgrade.level })
    } else {
      // Default multiplier if none provided (1.5^level)
      upgrade.cost = upgrade.baseCost.mul(createDecimal(1.5).pow(upgrade.level))
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

  // Helper function to check if an upgrade is unlocked
  const isUpgradeUnlocked = (upgradeId: string): boolean => {
    const upgrade = evolutionUpgrades.value.find(u => u.id === upgradeId)
    return upgrade ? upgrade.isUnlocked() : false
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
    getUpgradeCount,
  }
})

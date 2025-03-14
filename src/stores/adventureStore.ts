import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGeneratorStore } from './generatorStore'
import { useBugStore } from './bugStore'
import { useInventoryStore } from './inventoryStore'
import Decimal from 'break_infinity.js'
import { createDecimal, formatDecimal } from '@/utils/decimalUtils'

interface LogEntry {
  timestamp: number
  message: string
  type: 'info' | 'combat' | 'reward'
}

export const useAdventureStore = defineStore('adventure', () => {
  const generatorStore = useGeneratorStore()
  const bugStore = useBugStore()
  const inventoryStore = useInventoryStore()

  const playerDamage = computed((): Decimal => {
    // Base damage from worker ants
    const baseDamage = generatorStore.generators[0].count.mul(Decimal.fromNumber(10))

    // Additional damage from equipped items based on worker ants
    const workerCount = generatorStore.generators[0].count
    const equipmentDamageBoost = inventoryStore.totalStats.damage.mul(workerCount)

    // Return the combined damage
    return baseDamage.plus(equipmentDamageBoost)
  })

  const playerMaxHealth = computed((): Decimal => {
    // Base health from worker ants
    const baseHealth = generatorStore.generators[0].count.mul(Decimal.fromNumber(100))

    // Additional health from equipped items based on worker ants
    const workerCount = generatorStore.generators[0].count
    const equipmentHealthBoost = inventoryStore.totalStats.health.mul(workerCount)

    // Return the combined health
    return baseHealth.plus(equipmentHealthBoost)
  })

  const playerRegen = computed((): Decimal => {
    // Base regen from worker ants
    const baseRegen = generatorStore.generators[0].count

    // Additional regen from equipped items based on worker ants
    const workerCount = generatorStore.generators[0].count
    const equipmentRegenBoost = inventoryStore.totalStats.regen.mul(workerCount)

    // Return the combined regen
    return baseRegen.plus(equipmentRegenBoost)
  })

  const playerDefense = computed((): Decimal => {
    const baseDefense = generatorStore.generators[0].count.mul(Decimal.fromNumber(10))
    const workerCount = generatorStore.generators[0].count
    const equipmentDefenseBoost = inventoryStore.totalStats.defense.mul(workerCount)

    // Return the combined defense
    return baseDefense.plus(equipmentDefenseBoost)
  })

  const currentHealth = ref<Decimal>(playerMaxHealth.value)
  const isInCombat = ref(true) // Always in combat
  const autoCombatEnabled = ref(true)
  const selectedBugId = ref<string>('safe') // Default to safe bug
  const logs = ref<LogEntry[]>([])
  const MAX_LOGS = 50 // Increased from 20 to show more history
  const isSpawning = ref(false) // Track if we're in the spawn phase

  // Damage calculation function
  const calculateDamage = (attackerDamage: Decimal, defenderDefense: Decimal): Decimal => {
    // Base damage reduction formula: damage * (100 / (100 + defense))
    // This creates diminishing returns for defense
    const damageReduction = defenderDefense.div(defenderDefense.plus(Decimal.fromNumber(100)))
    return attackerDamage.mul(Decimal.fromNumber(1).minus(damageReduction))
  }

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const entry: LogEntry = {
      timestamp: Date.now(),
      message,
      type,
    }
    logs.value.push(entry)
    // Keep only the last MAX_LOGS entries
    if (logs.value.length > MAX_LOGS) {
      logs.value = logs.value.slice(-MAX_LOGS)
    }
  }

  const handleDeath = () => {
    addLog('You died! Returning to safe training...', 'info')
    currentHealth.value = playerMaxHealth.value
    selectedBugId.value = 'safe'
    startCombat('safe')
    isSpawning.value = true // Start with spawning after death
  }

  const spawnEnemy = () => {
    if (bugStore.selectedBug) {
      bugStore.selectedBug.health = bugStore.selectedBug.maxHealth
      addLog(
        `A new ${bugStore.selectedBug.name} appears with ${formatDecimal(bugStore.selectedBug.maxHealth)} health!`,
        'info'
      )
    }
  }

  const tick = () => {
    regenHealth()

    if (bugStore.selectedBug) {
      if (isSpawning.value) {
        // Spawn phase
        spawnEnemy()
        isSpawning.value = false
      } else {
        // Combat phase
        if (!bugStore.isBugDead) {
          // Player attacks first
          const damage = calculateDamage(playerDamage.value, bugStore.selectedBug.defense)
          bugStore.attackBug(damage)
          addLog(
            `You deal ${formatDecimal(damage)} damage to ${bugStore.selectedBug.name} (${formatDecimal(bugStore.selectedBug.health)}/${formatDecimal(bugStore.selectedBug.maxHealth)} HP)`,
            'combat'
          )

          // Enemy counterattacks
          if (!bugStore.isBugDead) {
            const enemyDamage = calculateDamage(bugStore.selectedBug.damage, playerDefense.value)
            takeDamage(enemyDamage)
            addLog(
              `${bugStore.selectedBug.name} deals ${formatDecimal(enemyDamage)} damage to you (${formatDecimal(currentHealth.value)}/${formatDecimal(playerMaxHealth.value)} HP)`,
              'combat'
            )

            // Check for death after taking damage
            if (isDead.value) {
              handleDeath()
            }
          } else {
            // Bug defeated, give rewards
            const bug = bugStore.selectedBug
            const reward = bug.maxHealth.mul(0.1) // 10% of max health as reward
            generatorStore.food = generatorStore.food.add(reward)
            addLog(`You defeated ${bug.name} and gained ${formatDecimal(reward)} food!`, 'reward')

            // Handle item drops
            const drops = bugStore.getRandomDrops()
            if (drops.length > 0) {
              drops.forEach(drop => {
                inventoryStore.addItem(drop.itemId, Decimal.fromNumber(drop.quantity))
                addLog(`You found ${drop.quantity}x ${drop.itemId}!`, 'reward')
              })
            } else {
              addLog(`No items dropped from ${bug.name}.`, 'info')
            }

            isSpawning.value = true // Switch to spawn phase after defeating
          }
        }
      }
    }
  }

  const regenHealth = () => {
    const oldHealth = currentHealth.value
    currentHealth.value = currentHealth.value.plus(playerRegen.value).clamp(0, playerMaxHealth.value)
    if (currentHealth.value.gt(oldHealth) && playerRegen.value.gt(0)) {
      const regenAmount = currentHealth.value.minus(oldHealth)
      if (regenAmount.gt(0)) {
        addLog(
          `You regenerate ${formatDecimal(regenAmount)} health (${formatDecimal(currentHealth.value)}/${formatDecimal(playerMaxHealth.value)} HP)`,
          'info'
        )
      }
    }
  }

  const takeDamage = (amount: Decimal) => {
    currentHealth.value = currentHealth.value.minus(amount).clamp(0, playerMaxHealth.value)
  }

  const isDead = computed((): boolean => {
    return currentHealth.value.lte(0)
  })

  const startCombat = (bugId: string) => {
    const oldBug = bugStore.selectedBug
    bugStore.selectBug(bugId)
    if (oldBug?.id !== bugId) {
      addLog(
        `You start fighting ${bugStore.selectedBug?.name} (${formatDecimal(bugStore.selectedBug?.damage || Decimal.fromNumber(0))} damage, ${formatDecimal(bugStore.selectedBug?.maxHealth || Decimal.fromNumber(0))} health)`,
        'info'
      )

      // Log equipment damage boost information
      const baseDamage = generatorStore.generators[0].count.mul(Decimal.fromNumber(10))
      const workerCount = generatorStore.generators[0].count
      const equipmentDamageBoost = inventoryStore.totalStats.damage.mul(workerCount)

      if (equipmentDamageBoost.gt(0)) {
        addLog(
          `Your equipment provides a damage boost of ${formatDecimal(equipmentDamageBoost)} (${formatDecimal(baseDamage)} base + ${formatDecimal(equipmentDamageBoost)} equipment boost)`,
          'info'
        )
      }

      isSpawning.value = true // Start with spawning when switching bugs
    }
  }

  const toggleAutoCombat = (bugId: string) => {
    if (selectedBugId.value !== bugId) {
      addLog(
        `Switching target from ${bugStore.getBugById(selectedBugId.value)?.name || 'unknown'} to ${bugStore.getBugById(bugId)?.name || 'unknown'}`,
        'info'
      )
    }
    selectedBugId.value = bugId
    startCombat(bugId)
  }

  const loadState = (state: any) => {
    currentHealth.value = createDecimal(state.currentHealth)
    selectedBugId.value = state.selectedBugId || 'safe'
    startCombat(selectedBugId.value)
    addLog('Adventure state loaded', 'info')
  }

  const getState = () => {
    return {
      currentHealth: currentHealth.value.toString(),
      selectedBugId: selectedBugId.value,
    }
  }

  // Initialize combat with safe bug
  startCombat('safe')

  return {
    currentHealth,
    playerMaxHealth,
    playerDamage,
    playerRegen,
    playerDefense,
    isDead,
    isInCombat,
    autoCombatEnabled,
    selectedBugId,
    logs,
    tick,
    takeDamage,
    regenHealth,
    startCombat,
    toggleAutoCombat,
    loadState,
    getState,
  }
})

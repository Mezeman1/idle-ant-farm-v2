import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGeneratorStore } from './generatorStore'
import { useBugStore } from './bugStore'
import { useInventoryStore } from './inventoryStore'
import Decimal from 'break_infinity.js'
import { createDecimal } from '@/utils/decimalUtils'

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
    return generatorStore.generators[0].count.mul(Decimal.fromNumber(10))
  })

  const playerMaxHealth = computed((): Decimal => {
    return generatorStore.generators[0].count.mul(Decimal.fromNumber(100))
  })

  const playerRegen = computed((): Decimal => {
    return generatorStore.generators[0].count
  })

  const playerDefense = computed((): Decimal => {
    return inventoryStore.totalStats.defense || Decimal.fromNumber(0)
  })

  const currentHealth = ref<Decimal>(playerMaxHealth.value)
  const isInCombat = ref(true) // Always in combat
  const autoCombatEnabled = ref(true)
  const selectedBugId = ref<string>('safe') // Default to safe bug
  const logs = ref<LogEntry[]>([])
  const MAX_LOGS = 20
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
      addLog(`A new ${bugStore.selectedBug.name} appears!`, 'info')
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
          addLog(`You deal ${damage} damage to ${bugStore.selectedBug.name}`, 'combat')

          // Enemy counterattacks
          if (!bugStore.isBugDead) {
            const enemyDamage = calculateDamage(bugStore.selectedBug.damage, playerDefense.value)
            takeDamage(enemyDamage)
            addLog(`${bugStore.selectedBug.name} deals ${enemyDamage} damage to you`, 'combat')

            // Check for death after taking damage
            if (isDead.value) {
              handleDeath()
            }
          } else {
            // Bug defeated, give rewards
            const bug = bugStore.selectedBug
            const reward = bug.maxHealth.mul(0.1) // 10% of max health as reward
            generatorStore.food = generatorStore.food.add(reward)
            addLog(`You defeated ${bug.name} and gained ${reward} food!`, 'reward')

            // Handle item drops
            const drops = bugStore.getRandomDrops()
            if (drops.length > 0) {
              drops.forEach(drop => {
                inventoryStore.addItem(drop.itemId, Decimal.fromNumber(drop.quantity))
                addLog(`You found ${drop.quantity}x ${drop.itemId}!`, 'reward')
              })
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
    if (currentHealth.value.gt(oldHealth)) {
      addLog(`You regenerate ${currentHealth.value.minus(oldHealth)} health`, 'info')
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
      addLog(`You start fighting ${bugStore.selectedBug?.name}`, 'info')
      isSpawning.value = true // Start with spawning when switching bugs
    }
  }

  const toggleAutoCombat = (bugId: string) => {
    selectedBugId.value = bugId
    startCombat(bugId)
  }

  const loadState = (state: any) => {
    currentHealth.value = createDecimal(state.currentHealth)
    selectedBugId.value = state.selectedBugId || 'safe'
    startCombat(selectedBugId.value)
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

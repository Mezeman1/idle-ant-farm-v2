import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGeneratorStore } from './generatorStore'
import { useBugStore } from './bugStore'
import type Decimal from 'break_infinity.js'
import { createDecimal } from '@/utils/decimalUtils'

interface LogEntry {
  timestamp: number
  message: string
  type: 'info' | 'combat' | 'reward'
}

export const useAdventureStore = defineStore('adventure', () => {
  const generatorStore = useGeneratorStore()
  const bugStore = useBugStore()

  const playerDamage = computed((): Decimal => {
    return generatorStore.generators[0].count.mul(10)
  })

  const playerMaxHealth = computed((): Decimal => {
    return generatorStore.generators[0].count.mul(100)
  })

  const playerRegen = computed((): Decimal => {
    return generatorStore.generators[0].count.mul(1)
  })

  const currentHealth = ref<Decimal>(playerMaxHealth.value)
  const isInCombat = ref(true) // Always in combat
  const autoCombatEnabled = ref(true)
  const selectedBugId = ref<string>('safe') // Default to safe bug
  const logs = ref<LogEntry[]>([])
  const MAX_LOGS = 20
  const isSpawning = ref(false) // Track if we're in the spawn phase

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
          const damage = playerDamage.value
          bugStore.attackBug(damage)
          addLog(`You deal ${damage} damage to ${bugStore.selectedBug.name}`, 'combat')

          // Enemy counterattacks
          if (!bugStore.isBugDead) {
            const enemyDamage = bugStore.selectedBug.damage
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

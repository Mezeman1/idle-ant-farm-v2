import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type Decimal from 'break_infinity.js'
import { createDecimal } from '@/utils/decimalUtils'

export interface Bug {
  id: string
  name: string
  health: Decimal
  maxHealth: Decimal
  damage: Decimal
  description: string
}

export const useBugStore = defineStore('bug', () => {
  const bugs = ref<Bug[]>([
    {
      id: 'safe',
      name: 'Training Bug',
      health: createDecimal(100),
      maxHealth: createDecimal(100),
      damage: createDecimal(0),
      description: 'A safe bug for training. No damage, just rewards!',
    },
    {
      id: 'worker',
      name: 'Worker Ant',
      health: createDecimal(100),
      maxHealth: createDecimal(100),
      damage: createDecimal(10),
      description: 'A basic worker ant. Easy to defeat but watch out for its bite!',
    },
    {
      id: 'soldier',
      name: 'Soldier Ant',
      health: createDecimal(200),
      maxHealth: createDecimal(200),
      damage: createDecimal(20),
      description: 'A strong soldier ant. Tough to defeat but worth the challenge!',
    },
  ])

  const selectedBug = ref<Bug | null>(bugs.value[0]) // Default to safe bug

  const isBugDead = computed((): boolean => {
    if (!selectedBug.value) return false
    return selectedBug.value.health.lte(0)
  })

  const getBugHealthPercentage = computed((): number => {
    if (!selectedBug.value) return 0
    if (selectedBug.value.maxHealth.eq(0)) return 0
    return selectedBug.value.health.div(selectedBug.value.maxHealth).mul(100).toNumber()
  })

  const selectBug = (bugId: string) => {
    const bug = bugs.value.find(b => b.id === bugId)
    if (bug) {
      selectedBug.value = bug
      bug.health = bug.maxHealth // Reset health when selecting
    }
  }

  const attackBug = (damage: Decimal) => {
    if (!selectedBug.value) return
    selectedBug.value.health = selectedBug.value.health.minus(damage).clamp(0, selectedBug.value.maxHealth)
  }

  const loadState = (state: any) => {
    if (state.selectedBugId) {
      selectBug(state.selectedBugId)
      if (state.selectedBugHealth) {
        selectedBug.value!.health = createDecimal(state.selectedBugHealth)
      }
    }
  }

  const getState = () => {
    return {
      selectedBugId: selectedBug.value?.id || null,
      selectedBugHealth: selectedBug.value?.health.toString() || null,
    }
  }

  return {
    bugs,
    selectedBug,
    isBugDead,
    getBugHealthPercentage,
    selectBug,
    attackBug,
    loadState,
    getState,
  }
})

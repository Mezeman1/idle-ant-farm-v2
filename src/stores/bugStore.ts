import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type Decimal from 'break_infinity.js'
import { createDecimal } from '@/utils/decimalUtils'
import { bugs } from '@/data/bugs'
import type { BugDrop } from '@/data/bugs'

export interface Bug {
  id: string
  name: string
  health: Decimal
  maxHealth: Decimal
  damage: Decimal
  defense: Decimal
  description: string
  drops: BugDrop[]
}

export const useBugStore = defineStore('bug', () => {
  const bugsRef = ref<Bug[]>(bugs)
  const selectedBug = ref<Bug | null>(bugsRef.value[0])
  const selectedBugId = ref<string>('safe')

  const isBugDead = computed(() => {
    if (!selectedBug.value) return false
    return selectedBug.value.health.lte(0)
  })

  const getBugHealthPercentage = computed(() => {
    if (!selectedBug.value) return 0
    return selectedBug.value.health.div(selectedBug.value.maxHealth).mul(100).toNumber()
  })

  const selectBug = (bugId: string) => {
    const bug = bugsRef.value.find(b => b.id === bugId)
    if (bug) {
      selectedBug.value = bug
      selectedBugId.value = bugId
      bug.health = bug.maxHealth // Reset health when selecting
    }
  }

  const attackBug = (damage: Decimal) => {
    if (!selectedBug.value) return
    selectedBug.value.health = selectedBug.value.health.minus(damage).clamp(0, selectedBug.value.maxHealth)
  }

  const getRandomDrops = () => {
    if (!selectedBug.value) return []

    const drops: { itemId: string; quantity: number }[] = []

    selectedBug.value.drops.forEach(drop => {
      if (Math.random() <= drop.chance) {
        const quantity = Math.floor(Math.random() * (drop.maxQuantity - drop.minQuantity + 1) + drop.minQuantity)
        drops.push({ itemId: drop.itemId, quantity })
      }
    })

    return drops
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

  const getBugById = (id: string) => {
    return bugsRef.value.find(bug => bug.id === id)
  }

  return {
    bugs: bugsRef,
    selectedBug,
    selectedBugId,
    isBugDead,
    getBugHealthPercentage,
    selectBug,
    attackBug,
    getRandomDrops,
    loadState,
    getState,
    getBugById,
  }
})

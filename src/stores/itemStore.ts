import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { items } from '@/data/items'
import Decimal from 'break_infinity.js'

export interface Item {
  id: string
  name: string
  description: string
  type: 'equipment' | 'consumable'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  stats: {
    damage?: Decimal
    health?: Decimal
    regen?: Decimal
    defense?: Decimal
  }
  quantity?: Decimal
  productionModifiers?: {
    [generatorId: string]: Decimal // Maps generator ID to multiplier
  }
}

export const useItemStore = defineStore('item', () => {
  const itemsRef = ref<Record<string, Item>>(items)

  const getItem = (id: string): Item | undefined => {
    return itemsRef.value[id]
  }

  const createItem = (id: string, quantity: Decimal = Decimal.fromNumber(1)): Item | undefined => {
    const baseItem = getItem(id)
    if (!baseItem) return undefined

    return {
      ...baseItem,
      quantity,
    }
  }

  // Rarity color utilities
  const rarityColors = {
    common: 'text-gray-600 dark:text-gray-400',
    uncommon: 'text-green-600 dark:text-green-400',
    rare: 'text-blue-600 dark:text-blue-400',
    epic: 'text-purple-600 dark:text-purple-400',
    legendary: 'text-yellow-600 dark:text-yellow-400',
  }

  const rarityBackgrounds = {
    common: 'bg-gray-100 dark:bg-gray-800',
    uncommon: 'bg-green-100 dark:bg-green-900/30',
    rare: 'bg-blue-100 dark:bg-blue-900/30',
    epic: 'bg-purple-100 dark:bg-purple-900/30',
    legendary: 'bg-yellow-100 dark:bg-yellow-900/30',
  }

  const getRarityColor = (rarity: string) => {
    return rarityColors[rarity as keyof typeof rarityColors] || rarityColors.common
  }

  const getRarityBackground = (rarity: string) => {
    return rarityBackgrounds[rarity as keyof typeof rarityBackgrounds] || rarityBackgrounds.common
  }

  return {
    items: itemsRef,
    getItem,
    createItem,
    getRarityColor,
    getRarityBackground,
  }
})

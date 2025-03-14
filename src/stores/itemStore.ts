import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { items } from '@/data/items'
import Decimal from 'break_infinity.js'

export interface Item {
  id: string
  name: string
  description: string
  type: 'equipment'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'divine'
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
  specialModifiers?: {
    epBoost?: Decimal // Multiplier for EP gain
    global?: Decimal // Global production multiplier
    [key: string]: Decimal | undefined // Other special modifiers
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

  // Get all special modifiers from equipped items
  const getSpecialModifiers = () => {
    const modifiers: Record<string, Decimal> = {
      epBoost: Decimal.fromNumber(1), // Default is 1 (no boost)
      global: Decimal.fromNumber(1), // Default is 1 (no boost)
    }

    // Iterate through all items and collect special modifiers
    Object.values(itemsRef.value).forEach(item => {
      if (item.quantity && item.quantity.gt(0) && item.specialModifiers) {
        // Apply EP boost modifier
        if (item.specialModifiers.epBoost) {
          modifiers.epBoost = modifiers.epBoost.mul(item.specialModifiers.epBoost)
        }

        // Apply global production modifier
        if (item.specialModifiers.global) {
          modifiers.global = modifiers.global.mul(item.specialModifiers.global)
        }

        // Apply any other special modifiers
        Object.entries(item.specialModifiers).forEach(([key, value]) => {
          if (key !== 'epBoost' && key !== 'global' && value !== undefined) {
            if (!modifiers[key]) {
              modifiers[key] = Decimal.fromNumber(1)
            }
            modifiers[key] = modifiers[key].mul(value)
          }
        })
      }
    })

    return modifiers
  }

  // Rarity color utilities
  const rarityColors = {
    common: 'text-gray-600 dark:text-gray-400',
    uncommon: 'text-green-600 dark:text-green-400',
    rare: 'text-blue-600 dark:text-blue-400',
    epic: 'text-purple-600 dark:text-purple-400',
    legendary: 'text-yellow-600 dark:text-yellow-400',
    mythic: 'text-pink-600 dark:text-pink-400',
    divine: 'text-cyan-600 dark:text-cyan-400',
  }

  const rarityBackgrounds = {
    common: 'bg-gray-100 dark:bg-gray-800',
    uncommon: 'bg-green-100 dark:bg-green-900/30',
    rare: 'bg-blue-100 dark:bg-blue-900/30',
    epic: 'bg-purple-100 dark:bg-purple-900/30',
    legendary: 'bg-yellow-100 dark:bg-yellow-900/30',
    mythic: 'bg-pink-100 dark:bg-pink-900/30',
    divine: 'bg-cyan-100 dark:bg-cyan-900/30',
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
    getSpecialModifiers,
    getRarityColor,
    getRarityBackground,
  }
})

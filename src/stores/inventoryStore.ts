import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Item } from './itemStore'
import { useItemStore } from './itemStore'
import Decimal from 'break_infinity.js'
import { formatDecimal } from '@/utils/decimalUtils'
import { usePrestigeStore } from './prestigeStore'
import { createDecimal } from '@/utils/decimalUtils'

export interface EquipmentSlot {
  id: number
  item: string | null
  locked: boolean
}

export const useInventoryStore = defineStore('inventory', () => {
  const itemStore = useItemStore()
  const prestigeStore = usePrestigeStore()
  const inventory = ref<Item[]>([])
  const baseInventorySlots = 20
  const equipmentSlots = ref<EquipmentSlot[]>([])
  const baseEquipmentSlots = 10
  const unlockedEquipmentSlots = computed(() => {
    return prestigeStore.getUpgradeCount('equipmentSlots')
  })

  // Calculate max inventory slots based on prestige upgrade
  const maxInventorySlots = computed(() => {
    const baseSlots = createDecimal(baseInventorySlots)
    const bonusSlots = prestigeStore.getUpgradeMultiplier('inventorySlots')
    return baseSlots.add(bonusSlots)
  })

  // Calculate max equipment slots based on prestige upgrade
  const maxEquipmentSlots = ref(baseEquipmentSlots)

  // Initialize equipment slots
  const initializeEquipmentSlots = () => {
    // Store current equipped items
    const currentEquippedItems = equipmentSlots.value.map(slot => ({
      id: slot.id,
      item: slot.item,
      locked: slot.locked,
    }))

    // Create new slots array
    const newSlots: EquipmentSlot[] = []
    const maxSlots = maxEquipmentSlots.value

    // Initialize new slots while preserving equipped items
    for (let i = 0; i < maxSlots; i++) {
      const existingSlot = currentEquippedItems.find(slot => slot.id === i)
      newSlots.push({
        id: i,
        item: existingSlot?.item || null,
        locked: i >= unlockedEquipmentSlots.value.toNumber(),
      })
    }

    // Update equipment slots
    equipmentSlots.value = newSlots
  }

  // Watch for changes in maxEquipmentSlots and reinitialize slots
  watch(maxEquipmentSlots, () => {
    initializeEquipmentSlots()
  })

  const getItem = (itemId: string): Item | undefined => {
    return itemStore.getItem(itemId)
  }

  const totalStats = computed(() => {
    const stats = {
      damage: Decimal.fromNumber(0),
      health: Decimal.fromNumber(0),
      regen: Decimal.fromNumber(0),
      defense: Decimal.fromNumber(0),
    }

    equipmentSlots.value.forEach(slot => {
      if (slot.item) {
        const item = getItem(slot.item)
        if (item?.stats) {
          if (item.stats.damage) stats.damage = stats.damage.plus(item.stats.damage)
          if (item.stats.health) stats.health = stats.health.plus(item.stats.health)
          if (item.stats.regen) stats.regen = stats.regen.plus(item.stats.regen)
          if (item.stats.defense) stats.defense = stats.defense.plus(item.stats.defense)
        }
      }
    })

    return stats
  })

  const totalProductionModifiers = computed(() => {
    const modifiers: Record<string, Decimal> = {}

    equipmentSlots.value.forEach(slot => {
      if (slot.item) {
        const item = getItem(slot.item)
        if (item?.productionModifiers) {
          Object.entries(item.productionModifiers).forEach(([generatorId, modifier]) => {
            if (!modifiers[generatorId]) {
              modifiers[generatorId] = Decimal.fromNumber(1)
            }
            modifiers[generatorId] = modifiers[generatorId].mul(modifier)
          })
        }
      }
    })

    // Only return modifiers that are greater than 1 (actual bonuses)
    return Object.fromEntries(Object.entries(modifiers).filter(([_, value]) => value.gt(1)))
  })

  const stackItems = () => {
    // Create a map to store unique items by ID
    const itemMap = new Map<string, Item>()

    // Process each item in the inventory
    inventory.value.forEach(item => {
      if (item.type === 'consumable') {
        // For consumables, stack quantities
        const existingItem = itemMap.get(item.id)
        if (existingItem) {
          const currentQuantity = existingItem.quantity || Decimal.fromNumber(1)
          const newQuantity = item.quantity || Decimal.fromNumber(1)
          existingItem.quantity = currentQuantity.plus(newQuantity)
        } else {
          itemMap.set(item.id, { ...item })
        }
      } else {
        // For equipment, just keep one copy
        if (!itemMap.has(item.id)) {
          itemMap.set(item.id, { ...item })
        }
      }
    })

    // Convert map back to array
    inventory.value = Array.from(itemMap.values())
  }

  const addItem = (itemId: string, quantity: Decimal = Decimal.fromNumber(1)) => {
    if (createDecimal(inventory.value.length).gte(maxInventorySlots.value)) return false

    const newItem = itemStore.createItem(itemId, quantity)
    if (!newItem) return false

    inventory.value.push(newItem)
    stackItems() // Stack items after adding
    return true
  }

  const removeItem = (index: number) => {
    inventory.value.splice(index, 1)
    stackItems() // Stack items after removing
  }

  const equipItem = (itemId: string, slotIndex: number) => {
    const slot = equipmentSlots.value[slotIndex]
    if (!slot || slot.locked) return false

    // Check if this item is already equipped
    const isAlreadyEquipped = equipmentSlots.value.some(s => s.item === itemId)
    if (isAlreadyEquipped) return false

    // Unequip current item if any
    if (slot.item) {
      const currentItem = getItem(slot.item)
      if (currentItem) {
        addItem(slot.item)
      }
    }

    // Equip new item
    slot.item = itemId
    stackItems() // Stack items after equipping
    return true
  }

  const unequipItem = (slotIndex: number) => {
    const slot = equipmentSlots.value[slotIndex]
    if (!slot || slot.locked) return false

    if (slot.item) {
      const item = getItem(slot.item)
      if (item) {
        addItem(slot.item)
      }
      slot.item = null
      stackItems() // Stack items after unequipping
      return true
    }

    return false
  }

  const getState = () => {
    return {
      inventory: inventory.value.map(item => ({
        id: item.id,
        quantity: item.quantity ? formatDecimal(item.quantity) : undefined,
      })),
      equipmentSlots: equipmentSlots.value.map(slot => ({
        item: slot.item,
        locked: slot.locked,
      })),
      unlockedEquipmentSlots: unlockedEquipmentSlots.value,
    }
  }

  const loadState = (state: any) => {
    // Then initialize equipment slots with the correct count
    initializeEquipmentSlots()

    // Finally apply the saved equipment state
    if (state.equipmentSlots) {
      console.log('Loading equipment slots:', state.equipmentSlots)
      state.equipmentSlots.forEach((savedSlot: any, index: number) => {
        console.log('Loading equipment slot:', savedSlot)
        if (equipmentSlots.value[index]) {
          console.log('Equipment slot found:', equipmentSlots.value[index])
          equipmentSlots.value[index].item = savedSlot.item
          equipmentSlots.value[index].locked = savedSlot.locked
        }
      })
    }

    // Load inventory state last
    if (state.inventory) {
      inventory.value = state.inventory
        .map((item: any) => {
          const baseItem = getItem(item.id)
          if (!baseItem) return null
          return {
            ...baseItem,
            quantity: item.quantity ? Decimal.fromString(item.quantity) : undefined,
          }
        })
        .filter(Boolean) as Item[]
    }

    // Stack items after loading all state
    stackItems()
  }

  return {
    inventory,
    maxInventorySlots,
    equipmentSlots,
    maxEquipmentSlots,
    unlockedEquipmentSlots,
    totalStats,
    totalProductionModifiers,
    addItem,
    removeItem,
    equipItem,
    unequipItem,
    stackItems,
    getState,
    loadState,
    getItem,
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Decimal from 'break_infinity.js'
import { useInventoryStore } from './inventoryStore'
import { createDecimal } from '@/utils/decimalUtils'

export const useAdventureStore = defineStore('adventure', () => {
  const tick = () => {
    console.log('Adventure store tick')
  }

  const loadState = (state: any) => {
    console.log('Adventure store loadState', state)
  }

  const getState = () => {
    console.log('Adventure store getState')
  }

  return {
    tick,
    loadState,
    getState,
  }
})

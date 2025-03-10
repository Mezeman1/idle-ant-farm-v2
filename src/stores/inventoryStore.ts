import { defineStore } from 'pinia'

export const useInventoryStore = defineStore('inventory', () => {
  const loadState = (state: any) => {
    console.log('Inventory store loadState', state)
  }

  const getState = () => {
    console.log('Inventory store getState')
  }

  return {
    loadState,
    getState,
  }
})

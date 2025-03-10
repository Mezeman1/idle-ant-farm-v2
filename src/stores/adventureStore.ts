import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGeneratorStore } from './generatorStore'
import type Decimal from 'break_infinity.js'
import { createDecimal } from '@/utils/decimalUtils'
export const useAdventureStore = defineStore('adventure', () => {
  const generatorStore = useGeneratorStore()
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

  const tick = () => {
    regenHealth()
    takeDamage(createDecimal(10))
  }

  const regenHealth = () => {
    currentHealth.value = currentHealth.value.plus(playerRegen.value).clamp(0, playerMaxHealth.value)
  }

  const takeDamage = (amount: Decimal) => {
    currentHealth.value = currentHealth.value.minus(amount).clamp(0, playerMaxHealth.value)
  }

  const isDead = computed((): boolean => {
    return currentHealth.value.lte(0)
  })

  const loadState = (state: any) => {
    console.log('Adventure store loadState', state)
  }

  const getState = () => {
    console.log('Adventure store getState')
  }

  return {
    currentHealth,
    playerMaxHealth,
    playerDamage,
    playerRegen,
    isDead,
    tick,
    takeDamage,
    regenHealth,
    loadState,
    getState,
  }
})

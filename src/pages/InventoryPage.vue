<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventoryStore'
import { useItemStore } from '@/stores/itemStore'
import { ref } from 'vue'
import InventoryTabsNavigation from '@/components/InventoryTabsNavigation.vue'
import EquipmentSection from '@/components/EquipmentSection.vue'
import InventorySection from '@/components/InventorySection.vue'
import ItemModal from '@/components/ItemModal.vue'
import LockedSlotModal from '@/components/LockedSlotModal.vue'

const inventoryStore = useInventoryStore()
const itemStore = useItemStore()

// Modal state
const selectedItem = ref<any>(null)
const showLockedSlotModal = ref(false)
const activeTab = ref<'equipment' | 'inventory'>('equipment')

const showItemModal = (item: any) => {
  selectedItem.value = item
}

const hideItemModal = () => {
  selectedItem.value = null
}

const handleEquipmentSlotClick = (slot: any, index: number) => {
  if (slot.locked) {
    showLockedSlotModal.value = true
    return
  }

  if (slot.item) {
    showItemModal(itemStore.getItem(slot.item))
  }
}

const handleInventoryItemClick = (item: any) => {
  showItemModal(item)
}

const handleEquipAction = (item: any) => {
  if (isItemEquipped(item.id)) {
    // Find the slot with this item and unequip it
    const slotIndex = inventoryStore.equipmentSlots.findIndex(slot => slot.item === item.id)
    if (slotIndex !== -1) {
      inventoryStore.unequipItem(slotIndex)
    }
  } else {
    // Find first empty equipment slot
    const emptySlotIndex = inventoryStore.equipmentSlots.findIndex(slot => !slot.locked && !slot.item)
    if (emptySlotIndex !== -1) {
      inventoryStore.equipItem(item.id, emptySlotIndex)
    }
  }
  hideItemModal()
}

const isItemEquipped = (itemId: string) => {
  return inventoryStore.equipmentSlots.some(slot => slot.item === itemId)
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold mb-2 flex items-center">
      <span class="i-heroicons-squares-2x2 text-purple-700 dark:text-purple-500 mr-2"></span>
      Inventory
    </h1>

    <!-- Mobile View -->
    <div
      class="md:hidden bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
      <!-- Tab Navigation -->
      <div class="sticky top-0 z-20 bg-white dark:bg-gray-800">
        <InventoryTabsNavigation v-model:activeTab="activeTab" />
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Equipment Section -->
        <EquipmentSection v-show="activeTab === 'equipment'" :on-slot-click="handleEquipmentSlotClick" />
        <InventorySection v-show="activeTab === 'inventory'" :on-item-click="handleInventoryItemClick"
          :is-item-equipped="isItemEquipped" />
      </div>
    </div>

    <!-- Desktop View -->
    <div class="hidden md:grid md:grid-cols-2 md:gap-4">
      <!-- Equipment Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-4 flex items-center">
            <span class="i-heroicons-shield-check text-purple-700 dark:text-purple-500 mr-2"></span>
            Equipment
          </h2>
          <EquipmentSection :on-slot-click="handleEquipmentSlotClick" />
        </div>
      </div>

      <!-- Inventory Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-4 flex items-center">
            <span class="i-heroicons-shopping-bag text-purple-700 dark:text-purple-500 mr-2"></span>
            Inventory
          </h2>
          <InventorySection :on-item-click="handleInventoryItemClick" :is-item-equipped="isItemEquipped" />
        </div>
      </div>
    </div>

    <!-- Locked Slot Modal -->
    <LockedSlotModal v-if="showLockedSlotModal" :on-close="() => showLockedSlotModal = false" />

    <!-- Item Modal -->
    <ItemModal v-if="selectedItem" :item="selectedItem" :is-item-equipped="isItemEquipped"
      :on-equip-action="handleEquipAction" :on-close="hideItemModal" />

    <ScrollToTopButton :threshold="400" />
  </div>
</template>

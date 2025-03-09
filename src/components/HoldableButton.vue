<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const props = defineProps<{
  /**
   * Whether the button is disabled
   */
  disabled?: boolean

  /**
   * CSS classes to apply to the button
   */
  class?: string

  /**
   * Initial delay in ms before starting repeated actions
   * @default 500
   */
  initialDelay?: number

  /**
   * Interval in ms between repeated actions
   * @default 100
   */
  repeatInterval?: number

  /**
   * Whether to accelerate the repeat rate over time
   * @default true
   */
  accelerate?: boolean

  /**
   * Minimum interval in ms when accelerating
   * @default 50
   */
  minInterval?: number
}>()

const emit = defineEmits<{
  /**
   * Emitted when the button is clicked or held
   */
  (e: 'action'): void
}>()

// Default values
const initialDelay = props.initialDelay ?? 500
const repeatInterval = props.repeatInterval ?? 100
const accelerate = props.accelerate ?? true
const minInterval = props.minInterval ?? 50

// State
const isHolding = ref(false)
const holdTimer = ref<number | null>(null)
const repeatTimer = ref<number | null>(null)
const currentInterval = ref(repeatInterval)
const holdStartTime = ref(0)

/**
 * Handle button press
 */
const onMouseDown = (event: MouseEvent) => {
  if (props.disabled) return

  // Prevent text selection during long press
  event.preventDefault()

  // Trigger action immediately
  emit('action')

  // Start holding state
  isHolding.value = true
  holdStartTime.value = Date.now()

  // Set timer for initial delay
  holdTimer.value = window.setTimeout(() => {
    startRepeating()
  }, initialDelay)
}

/**
 * Start repeating the action
 */
const startRepeating = () => {
  if (props.disabled) return

  // Clear any existing repeat timer
  if (repeatTimer.value !== null) {
    clearInterval(repeatTimer.value)
  }

  // Reset interval to initial value
  currentInterval.value = repeatInterval

  // Set up repeating timer
  repeatTimer.value = window.setInterval(() => {
    if (props.disabled) {
      stopHolding()
      return
    }

    // Emit action event
    emit('action')

    // Accelerate if enabled
    if (accelerate) {
      const elapsedTime = Date.now() - holdStartTime.value

      // Gradually decrease interval based on hold time
      // The longer the hold, the faster the repeat rate
      if (elapsedTime > 2000) {
        currentInterval.value = Math.max(
          minInterval,
          repeatInterval - Math.floor((elapsedTime - 2000) / 100) * 5
        )

        // Update interval if it changed
        if (currentInterval.value !== repeatInterval) {
          clearInterval(repeatTimer.value)
          repeatTimer.value = window.setInterval(() => {
            if (!props.disabled) emit('action')
          }, currentInterval.value)
        }
      }
    }
  }, currentInterval.value)
}

/**
 * Handle button release
 */
const onMouseUp = () => {
  stopHolding()
}

/**
 * Handle mouse leave
 */
const onMouseLeave = () => {
  stopHolding()
}

/**
 * Stop holding state and clear timers
 */
const stopHolding = () => {
  isHolding.value = false

  // Clear timers
  if (holdTimer.value !== null) {
    clearTimeout(holdTimer.value)
    holdTimer.value = null
  }

  if (repeatTimer.value !== null) {
    clearInterval(repeatTimer.value)
    repeatTimer.value = null
  }
}

// Clean up timers when component is unmounted
onUnmounted(() => {
  stopHolding()
})
</script>

<template>
  <button :class="[
    props.class,
    'transition-all duration-150 flex items-center justify-center',
    isHolding ? 'transform scale-95' : 'transform scale-100'
  ]" :disabled="disabled" @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseleave="onMouseLeave"
    @touchstart="onMouseDown" @touchend="onMouseUp" @touchcancel="onMouseUp">
    <slot></slot>
  </button>
</template>

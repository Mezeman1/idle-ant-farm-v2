import { ref } from 'vue'

// Define consent status types
export type ConsentStatus = 'pending' | 'accepted' | 'declined'

export function useGdprConsent() {
  // Store consent status in localStorage to persist between sessions
  const STORAGE_KEY = 'gdpr_consent_status'

  // Initialize consent status from localStorage or default to 'pending'
  const consentStatus = ref<ConsentStatus>((localStorage.getItem(STORAGE_KEY) as ConsentStatus) || 'pending')

  // Function to accept analytics consent
  const acceptConsent = () => {
    consentStatus.value = 'accepted'
    localStorage.setItem(STORAGE_KEY, consentStatus.value)
    return true
  }

  // Function to decline analytics consent
  const declineConsent = () => {
    consentStatus.value = 'declined'
    localStorage.setItem(STORAGE_KEY, consentStatus.value)
    return false
  }

  // Check if consent has been given
  const hasConsent = () => consentStatus.value === 'accepted'

  // Check if consent decision is pending
  const isPending = () => consentStatus.value === 'pending'

  return {
    consentStatus,
    acceptConsent,
    declineConsent,
    hasConsent,
    isPending,
  }
}

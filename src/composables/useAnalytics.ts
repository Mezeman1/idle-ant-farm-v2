import { useGdprConsent } from '@/composables/useGdprConsent'
import { useGtag } from 'vue-gtag-next'
import { watch } from 'vue'

export function useAnalytics() {
  const { consentStatus, hasConsent } = useGdprConsent()
  const { isEnabled, enable, disable, query, pageView, event, screenView, customMap, time, exception } = useGtag()

  // Watch for changes in consent status to enable/disable analytics
  watch(
    () => consentStatus.value,
    newStatus => {
      if (newStatus === 'accepted') {
        enable()
      } else {
        disable()
      }
    }
  )

  // Track page views only if consent is given
  const trackPageView = (path: string, title?: string) => {
    if (hasConsent()) {
      pageView(path, title)
    }
  }

  // Track events only if consent is given
  const trackEvent = (name: string, params?: Record<string, any>) => {
    if (hasConsent()) {
      event(name, params)
    }
  }

  return {
    isAnalyticsEnabled: isEnabled,
    trackPageView,
    trackEvent,
    // Expose other gtag methods that should respect consent
    screenView: (screenName: string, params?: Record<string, any>) => {
      if (hasConsent()) {
        screenView(screenName, params)
      }
    },
    exception: (description: string, fatal = false) => {
      if (hasConsent()) {
        exception(description, fatal)
      }
    },
    time: (name: string) => {
      if (hasConsent()) {
        return time(name)
      }
      return {
        // Return a dummy timer if consent is not given
        send: () => {},
      }
    },
  }
}

'use client'

import posthog from 'posthog-js'

// Create a singleton instance
let posthogInstance: any = null

function initializePostHog() {
  if (typeof window === 'undefined') return null
  if (posthogInstance) return posthogInstance
  
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  
  if (!apiKey) {
    console.error('PostHog API key is not defined')
    return null
  }
  
  try {
    // Using object literal without explicit type annotation
    const config = {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog_instance: any) => {
        if (process.env.NODE_ENV === 'development') posthog_instance.debug()
      },
      capture_pageview: false,
      persistence: "localStorage" as const, // Use a const assertion to fix the type
      bootstrap: {
        distinctID: localStorage.getItem('distinct_id') || undefined,
        isIdentifiedID: false,
      },
      autocapture: false,
      mask_all_text: true,
      mask_all_element_attributes: true,
      disable_session_recording: true,
      respect_dnt: true,
    }

    posthog.init(apiKey, config)
    posthogInstance = posthog
    return posthogInstance
  } catch (error) {
    console.error('Failed to initialize PostHog:', error)
    return null
  }
}

// Initialize PostHog if we're in the browser
// if (typeof window !== 'undefined') {
//   initializePostHog()
// }

export default posthog 
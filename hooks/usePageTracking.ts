'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from '@/lib/posthog'

// The inner hook that uses useSearchParams
export const usePageTrackingInner = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      
      // Track page view
      posthog.capture('$pageview', {
        $current_url: url,
        path: pathname,
      })
    }
  }, [pathname, searchParams])
}

// Legacy hook for backward compatibility
export const usePageTracking = usePageTrackingInner 
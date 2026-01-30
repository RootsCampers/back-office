'use client'

import React, { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from '@/lib/posthog'
import { WithSearchParamsSuspense } from './withSearchParamsSuspense'

interface PageViewEvent {
  $current_url: string
  path: string
  search_params?: string
  referrer?: string
}

function PageTrackerInner(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || typeof window === 'undefined') return

    try {
      const event: PageViewEvent = {
        $current_url: window.origin + pathname,
        path: pathname,
        referrer: document.referrer,
      }

      const params = searchParams?.toString()
      if (params) {
        event.$current_url += `?${params}`
        event.search_params = params
      }

      posthog.capture('$pageview', event)
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }, [pathname, searchParams])

  return null
}

export function PageTracker(): React.ReactElement {
  return (
    <WithSearchParamsSuspense>
      <PageTrackerInner />
    </WithSearchParamsSuspense>
  )
} 
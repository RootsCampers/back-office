'use client'

import { ReactNode, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePageTracking } from '@/hooks/usePageTracking'

/**
 * A general purpose provider that wraps useSearchParams with Suspense
 */
interface SearchParamsProps {
  children: (searchParams: ReturnType<typeof useSearchParams>) => ReactNode
  fallback?: ReactNode
}

export function SearchParamsProvider({ children, fallback = null }: SearchParamsProps) {
  return (
    <Suspense fallback={fallback}>
      <SearchParamsConsumer>
        {children}
      </SearchParamsConsumer>
    </Suspense>
  )
}

function SearchParamsConsumer({ children }: { children: (searchParams: ReturnType<typeof useSearchParams>) => ReactNode }) {
  const searchParams = useSearchParams()
  return <>{children(searchParams)}</>
}

/**
 * A component that wraps PageTracking functionality with Suspense
 */
export function PageTrackerWithSuspense() {
  return (
    <Suspense>
      <PageTrackerInner />
    </Suspense>
  )
}

function PageTrackerInner() {
  usePageTracking()
  return null
} 
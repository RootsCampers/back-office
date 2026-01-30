'use client'

import { ReactNode, Suspense } from 'react'

interface WithSearchParamsSuspenseProps {
  children: ReactNode
  fallback?: ReactNode
}

export function WithSearchParamsSuspense({ 
  children, 
  fallback = null 
}: WithSearchParamsSuspenseProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
} 
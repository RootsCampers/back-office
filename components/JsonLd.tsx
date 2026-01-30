'use client'

import Script from 'next/script'

interface JsonLdProps {
  organizationData: {
    name: string
    url: string
    logo: string
    sameAs: string[]
    [key: string]: any
  }
}

export function JsonLd({ organizationData }: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...organizationData
  }

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
} 
'use client'

import { DefaultSeo as NextDefaultSeo } from 'next-seo'

export function ClientSeo() {
  return (
    <NextDefaultSeo
      defaultTitle="RootsCampers | Find Your Perfect Camper Adventure"
      titleTemplate="%s | RootsCampers"
      description="Discover and book the perfect campervan for your next adventure, or share your RV with travelers worldwide."
      openGraph={{
        type: 'website',
        locale: 'en_US',
        url: 'https://rootscampers.com/',
        siteName: 'RootsCampers',
        images: [
          {
            url: 'https://rootscampers.com/logo-optimized.png',
            width: 1200,
            height: 630,
            alt: 'RootsCampers - Your Next Adventure Awaits',
          },
        ],
      }}
      twitter={{
        handle: '@rootscampers',
        site: '@rootscampers',
        cardType: 'summary_large_image',
      }}
      additionalLinkTags={[
        {
          rel: 'icon',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          href: '/favicon-16x16.png',
          sizes: '16x16'
        },
        {
          rel: 'manifest',
          href: '/manifest.json',
        },
      ]}
    />
  )
} 
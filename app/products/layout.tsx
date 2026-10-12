import type { Metadata } from 'next'
import React from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seranex.lk'

export const metadata: Metadata = {
  title: 'Official NFC Smart Card Range & Hardware | Sera Cards Sri Lanka',
  description:
    'Browse the full 8-card hardware lineup: Classic UV PVC, Full Custom Brand Card, Corporate Fleet Card, Crystal Gloss, and Surgical 304 Stainless Steel. Engineered with genuine NXP NTAG215 microchips.',
  keywords: [
    'NFC business card catalog Sri Lanka',
    'smart visiting cards online',
    'metal NFC business cards Colombo',
    'custom branded smart cards',
    'corporate NFC fleet cards Sri Lanka',
    'NXP NTAG215 cards',
    'LankaQR NFC card collection',
  ],
  alternates: {
    canonical: `${baseUrl}/products`,
  },
  openGraph: {
    title: 'Official NFC Smart Card Range & Hardware | Sera Cards Sri Lanka',
    description:
      'Engineered NFC cards across Matte PVC, Surgical 304 Stainless Steel, and 24K Electroplated Gold. Zero monthly subscriptions and free island-wide delivery.',
    url: `${baseUrl}/products`,
    siteName: 'Sera Cards',
    locale: 'en_LK',
    type: 'website',
    images: [
      {
        url: '/card-mockup.png',
        width: 1200,
        height: 630,
        alt: 'Sera Cards Complete NFC Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official NFC Smart Card Range | Sera Cards Sri Lanka',
    description:
      'Explore 8 premium NFC cards. 1-Year chip warranty on bulk orders (10+ units), NXP NTAG215 microchips, and free island-wide delivery.',
    images: ['/card-mockup.png'],
  },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const productsJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Products',
            item: `${baseUrl}/products`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Sera NFC Smart Cards Collection',
        itemListElement: [
          {
            '@type': 'Product',
            name: 'Classic White PVC Card (UV Print)',
            image: `${baseUrl}/card-mockup.png`,
            description: 'Minimalist arctic white matte PVC with direct UV print branding and embedded NXP NTAG215 chip.',
            offers: {
              '@type': 'Offer',
              price: '3500',
              priceCurrency: 'LKR',
              availability: 'https://schema.org/InStock',
            },
          },
          {
            '@type': 'Product',
            name: 'Full Custom Brand Card (Custom Print)',
            image: `${baseUrl}/card-mockup.png`,
            description: '100% bespoke corporate artwork printed edge-to-edge on front and reverse with 3D digital proof.',
            offers: {
              '@type': 'Offer',
              price: '5000',
              priceCurrency: 'LKR',
              availability: 'https://schema.org/InStock',
            },
          },
          {
            '@type': 'Product',
            name: 'Company Official Fleet Card',
            image: `${baseUrl}/card-mockup.png`,
            description: 'Standardized company branding for teams with employee name/title and tiered bulk volume discounts.',
            offers: {
              '@type': 'Offer',
              price: '5000',
              priceCurrency: 'LKR',
              availability: 'https://schema.org/InStock',
            },
          },
          {
            '@type': 'Product',
            name: 'Executive Matte Black Steel Card',
            image: `${baseUrl}/card-mockup.png`,
            description: '22g solid surgical 304 stainless steel with deep fiber laser etching and luxury velvet sleeve.',
            offers: {
              '@type': 'Offer',
              price: '10000',
              priceCurrency: 'LKR',
              availability: 'https://schema.org/InStock',
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
      />
      {children}
    </>
  )
}

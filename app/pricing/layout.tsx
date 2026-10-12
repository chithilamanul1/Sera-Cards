import type { Metadata } from 'next'
import React from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seranex.lk'

export const metadata: Metadata = {
  title: 'Pricing & Plans | Sera Smart NFC Business Cards Sri Lanka',
  description:
    'Choose your Sera NFC smart card in Sri Lanka: Classic PVC from LKR 3,500, Full Custom Brand for LKR 5,000, or Executive Metal for LKR 10,000. Free island-wide delivery and Mintpay installments available.',
  keywords: [
    'NFC business card price Sri Lanka',
    'Sera Cards pricing',
    'digital business card cost Colombo',
    'buy NFC card Sri Lanka',
    'smart card discount Sri Lanka',
    'metal business card price',
    'custom print NFC card price',
    'Mintpay NFC card Sri Lanka',
  ],
  alternates: {
    canonical: `${baseUrl}/pricing`,
  },
  openGraph: {
    title: 'Pricing & Plans | Sera Smart NFC Business Cards Sri Lanka',
    description:
      'Buy hardware once at cost. Free software plan forever or upgrade to Pro for two-way lead capture & analytics. Free island-wide delivery across Sri Lanka.',
    url: `${baseUrl}/pricing`,
    siteName: 'Sera Cards',
    locale: 'en_LK',
    type: 'website',
    images: [
      {
        url: '/card-mockup.png',
        width: 1200,
        height: 630,
        alt: 'Sera NFC Card Hardware Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Plans | Sera Smart NFC Business Cards Sri Lanka',
    description:
      'Choose your physical NFC smart card from LKR 3,500. Free island-wide delivery and Mintpay installments available.',
    images: ['/card-mockup.png'],
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  const pricingJsonLd = {
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
            name: 'Pricing',
            item: `${baseUrl}/pricing`,
          },
        ],
      },
      {
        '@type': 'AggregateOffer',
        priceCurrency: 'LKR',
        lowPrice: '3500',
        highPrice: '10000',
        offerCount: '8',
        offers: [
          {
            '@type': 'Offer',
            name: 'Classic White NFC Card',
            price: '3500',
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/pricing`,
          },
          {
            '@type': 'Offer',
            name: 'Full Custom Brand NFC Card',
            price: '5000',
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/pricing`,
          },
          {
            '@type': 'Offer',
            name: 'Executive Metal Steel Card',
            price: '10000',
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/pricing`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      {children}
    </>
  )
}

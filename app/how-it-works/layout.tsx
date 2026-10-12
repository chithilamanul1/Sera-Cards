import type { Metadata } from 'next'
import React from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seranex.lk'

export const metadata: Metadata = {
  title: 'How It Works | Sera Smart NFC Business Cards Sri Lanka',
  description:
    'From tap to saved contact in 0.2 seconds. Learn how Sera NFC business cards deliver your full profile to any iPhone or Android phone without apps, capture client leads, and boost Google reviews.',
  keywords: [
    'how NFC business cards work',
    'NFC card tap tutorial Sri Lanka',
    'digital business card no app',
    'smart business card setup',
    'how to use Sera Cards',
  ],
  alternates: {
    canonical: `${baseUrl}/how-it-works`,
  },
  openGraph: {
    title: 'How It Works | Sera Smart NFC Business Cards Sri Lanka',
    description:
      'Tap your card on any modern smartphone. Instant browser profile load, one-tap address book save, and lead capture. No apps required.',
    url: `${baseUrl}/how-it-works`,
    siteName: 'Sera Cards',
    locale: 'en_LK',
    type: 'website',
    images: [
      {
        url: '/card-mockup.png',
        width: 1200,
        height: 630,
        alt: 'How Sera NFC Cards Work',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works | Sera Smart NFC Business Cards Sri Lanka',
    description:
      'Learn how Sera NFC business cards deliver contacts in 0.2 seconds without any app download.',
    images: ['/card-mockup.png'],
  },
}

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  const howToJsonLd = {
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
            name: 'How It Works',
            item: `${baseUrl}/how-it-works`,
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to use a Sera NFC Smart Business Card',
        description: 'Share your digital business profile and capture client contact details in 3 seconds using NFC.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Tap or Scan',
            text: 'Hold your Sera Card near the top of any modern smartphone, or scan the dynamic laser-etched QR code on the back.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Instant Profile Load',
            text: 'Your branded profile launches instantly in their native mobile browser — zero apps or downloads required.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Connect & Convert',
            text: 'Your prospect saves your contact with a single tap, sends their details back via Two-Way Lead Capture, or pays via LankaQR.',
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {children}
    </>
  )
}

import type { Metadata } from 'next'
import React from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seranex.lk'

export const metadata: Metadata = {
  title: 'NFC Cards for Teams & Corporate Fleets | Sera Cards Sri Lanka',
  description:
    'Equip your corporate sales team, real estate agency, or organization with centralized NFC smart business cards. Central dashboard, brand locking, CRM export, and bulk volume discounts in Sri Lanka.',
  keywords: [
    'corporate NFC cards Sri Lanka',
    'business cards for sales teams',
    'enterprise NFC fleet Colombo',
    'team digital business cards',
    'bulk NFC card ordering Sri Lanka',
    'corporate volume discount smart cards',
  ],
  alternates: {
    canonical: `${baseUrl}/teams`,
  },
  openGraph: {
    title: 'NFC Cards for Teams & Corporate Fleets | Sera Cards Sri Lanka',
    description:
      'Manage company cards centrally. Update employee details in seconds, lock brand templates, and track company-wide networking ROI with GoSera Teams.',
    url: `${baseUrl}/teams`,
    siteName: 'Sera Cards',
    locale: 'en_LK',
    type: 'website',
    images: [
      {
        url: '/card-mockup.png',
        width: 1200,
        height: 630,
        alt: 'Sera Cards for Teams and Corporate Fleets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NFC Cards for Teams & Corporate Fleets | Sera Cards Sri Lanka',
    description:
      'Centralized admin portal, brand locking, team analytics, and bulk corporate pricing for Sri Lankan companies.',
    images: ['/card-mockup.png'],
  },
}

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  const teamsJsonLd = {
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
            name: 'For Teams',
            item: `${baseUrl}/teams`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamsJsonLd) }}
      />
      {children}
    </>
  )
}

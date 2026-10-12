import type { Metadata } from 'next'
import React from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seranex.lk'

export const metadata: Metadata = {
  title: 'Privacy Policy | Sera Cards Sri Lanka',
  description:
    'Read how Sera Cards (Seranex Pvt Ltd) protects your personal information, contact data, profile encryption, and payment security under Sri Lankan and international privacy standards.',
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy | Sera Cards Sri Lanka',
    description: 'Learn how your data, profile details, and payments are protected on Sera Cards.',
    url: `${baseUrl}/privacy`,
    siteName: 'Sera Cards',
    locale: 'en_LK',
    type: 'website',
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

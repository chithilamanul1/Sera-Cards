import type { Metadata } from 'next'
import React from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seranex.lk'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Sera Cards Sri Lanka',
  description:
    'Read the official terms and conditions for Sera Cards. Governing the purchase of NFC hardware, software plans, custom printing policies, and platform usage.',
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
  openGraph: {
    title: 'Terms and Conditions | Sera Cards Sri Lanka',
    description: 'Terms of service and hardware purchasing terms for Sera Cards in Sri Lanka.',
    url: `${baseUrl}/terms`,
    siteName: 'Sera Cards',
    locale: 'en_LK',
    type: 'website',
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

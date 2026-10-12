import type { Metadata } from 'next'
import React from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seranex.lk'

export const metadata: Metadata = {
  title: 'Refund, Replacement & Warranty Policy | Sera Cards Sri Lanka',
  description:
    'Read the official refund, return, and 1-year replacement warranty policy for Sera Cards. 1-year replacement applies to bulk orders of 10+ units for internal chip defects. Physical print damages excluded.',
  alternates: {
    canonical: `${baseUrl}/refund`,
  },
  openGraph: {
    title: 'Refund & 1-Year Replacement Policy | Sera Cards Sri Lanka',
    description:
      'Official returns, refunds, custom print terms, and 1-year chip replacement policy for Sera NFC smart cards in Sri Lanka.',
    url: `${baseUrl}/refund`,
    siteName: 'Sera Cards',
    locale: 'en_LK',
    type: 'website',
  },
}

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

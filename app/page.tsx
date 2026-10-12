import type { Metadata } from 'next'
import { LandingPage } from '@/components/LandingPage'

export const metadata: Metadata = {
  title: 'Sera Cards — The Last Business Card You Will Ever Need | Sri Lanka',
  description:
    'Tap to share contacts, capture client leads, accept LankaQR payments, and track tap analytics. High-speed NFC smart business cards engineered for modern Sri Lankan professionals. Free island-wide delivery.',
  alternates: {
    canonical: 'https://seranex.lk',
  },
}

export default function Home() {
  return <LandingPage />
}

import type { Metadata } from 'next'
import React from 'react'

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Card Setup & Onboarding Wizard | Sera Cards',
  description: 'Set up your new Sera NFC smart business card, choose your username, and launch your live digital networking profile in under 60 seconds.',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

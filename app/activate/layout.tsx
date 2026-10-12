import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Activate Your Physical NFC Card | Sera Cards',
  description: 'Tap or scan to pair your physical Sera NFC card with your account and link your live digital profile.',
}

export default function ActivateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Create Account | Sera Cards Sri Lanka',
  description: 'Register for a free GoSera account. Build your digital visiting card, share contacts, and start networking today.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

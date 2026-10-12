import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Sign In | Sera Cards Sri Lanka',
  description: 'Log in to your Sera Cards dashboard to edit your profile, view leads, and track tap analytics.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

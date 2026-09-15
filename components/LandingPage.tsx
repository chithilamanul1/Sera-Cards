'use client'

import React from 'react'
import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { Customizer } from '../components/Customizer'
import { Comparison } from '../components/Comparison'
import { Features } from '../components/Features'
import { TechSpecs } from '../components/TechSpecs'
import { Pricing } from '../components/Pricing'
import { Faq } from '../components/Faq'
import { Footer } from '../components/Footer'
import { useCardConfig } from '../hooks/useCardConfig'

export function LandingPage() {
  const api = useCardConfig()

  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased">
      <Nav />
      <main>
        <Hero config={api.config} />
        <HowItWorks />
        <Customizer api={api} />
        <Comparison />
        <Features />
        <TechSpecs />
        <Pricing config={api.config} />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}

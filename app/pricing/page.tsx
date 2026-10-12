'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckIcon,
  XIcon,
  SparklesIcon,
  TruckIcon,
  UsersIcon,
  BarChart3Icon,
  ZapIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CreditCardIcon,
  HelpCircleIcon,
  ChevronDownIcon,
} from 'lucide-react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { OrderModal } from '@/components/OrderModal'
import { ProductRangeCatalog } from '@/components/ProductRangeCatalog'
import { CARD_PRODUCTS, CardProduct } from '@/data/products'
import type { CardConfig } from '@/types/card'

const ease = [0.23, 1, 0.32, 1] as const

const plans = [
  {
    id: 'basic',
    name: 'GoSera Basic',
    price: 0,
    billing: 'Free Forever',
    description: 'Perfect for casual networking. No credit card required.',
    highlight: false,
    features: [
      { text: 'Standard Digital Profile', included: true },
      { text: 'Profile Photo & 1 Phone Number', included: true },
      { text: 'Downloadable vCard (.vcf)', included: true },
      { text: 'Unlimited Profile Views', included: true },
      { text: 'Two-Way Lead Capture Mode', included: false },
      { text: 'Unlimited Social & Web Links', included: false },
      { text: 'WhatsApp 1-Tap Routing', included: false },
      { text: 'Tap Analytics Dashboard', included: false },
      { text: 'LankaQR Payment Block', included: false },
      { text: 'Motion Profiles & Themes', included: false },
    ],
    cta: 'Get Started Free',
    ctaHref: '/register',
  },
  {
    id: 'pro',
    name: 'GoSera Pro',
    price: 2400,
    billing: 'per year (only LKR 200/mo)',
    description: 'The standard for freelancers, sales executives, and solo entrepreneurs who want results.',
    highlight: true,
    features: [
      { text: 'Everything in GoSera Basic', included: true },
      { text: 'Unlimited Links (WhatsApp, Socials, Portfolio)', included: true },
      { text: 'Two-Way Lead Capture Mode (Collect Client Info)', included: true },
      { text: 'Direct WhatsApp 1-Tap Chat Routing', included: true },
      { text: 'Google Review 1-Click Integration', included: true },
      { text: 'Integrated LankaQR Direct Bank Payments', included: true },
      { text: 'Basic Tap Analytics & Visitor Logs', included: true },
      { text: 'Motion Profiles (Animated headers & avatars)', included: true },
      { text: 'Custom Dynamic QR Code Download', included: true },
      { text: 'Priority WhatsApp & Phone Support', included: true },
    ],
    cta: 'Start Pro Plan',
    ctaHref: 'https://wa.me/94728382638?text=Hi%2C%20I%27d%20like%20to%20subscribe%20to%20GoSera%20Pro%20(LKR%202%2C400%2Fyear).',
  },
  {
    id: 'teams',
    name: 'GoSera Teams',
    price: 4800,
    billing: 'per user / year (LKR 400/mo)',
    description: 'Built for sales teams, real estate agencies, and corporate HR.',
    highlight: false,
    features: [
      { text: 'Everything in GoSera Pro for each member', included: true },
      { text: 'Centralized Admin Management Dashboard', included: true },
      { text: 'Company-Wide Brand & Template Locking', included: true },
      { text: 'Team-Wide Analytics & Lead Tracking', included: true },
      { text: 'CRM Export (Instant CSV Download of all leads)', included: true },
      { text: 'Instant Employee Onboarding & Offboarding', included: true },
      { text: 'Custom Subdomain (company.seranex.lk)', included: true },
      { text: 'Dedicated Account Manager & Bulk Printing', included: true },
    ],
    cta: 'Contact for Teams',
    ctaHref: '/teams',
  },
]

const faqs = [
  {
    q: 'Do I have to pay a yearly subscription to use my card?',
    a: 'No! You can use GoSera Basic for free forever with zero monthly or yearly fees. The physical card is a one-time purchase. If you want advanced conversion engines like Two-Way Lead Capture, WhatsApp routing, LankaQR payments, and Analytics, you can upgrade to GoSera Pro for just LKR 2,400/year.',
  },
  {
    q: 'How does the receiver view my card? Do they need an app?',
    a: 'They do NOT need any app. GoSera cards use native NFC technology supported by 99% of modern smartphones (iPhone and Android). When you tap your card against their phone, your digital profile opens instantly in their native browser (Safari, Chrome).',
  },
  {
    q: 'What if their phone does not have NFC?',
    a: 'Every single GoSera card includes a laser-etched dynamic QR code on the back. Any smartphone camera can scan it instantly to load the exact same digital profile.',
  },
  {
    q: 'Can I change my phone number or social links after I buy the card?',
    a: 'Yes, completely free of charge! Your physical card connects to your GoSera cloud profile. Whenever you change your job title, phone number, address, or portfolio, simply update it in your dashboard and the card updates immediately in real-time. No need to reprint.',
  },
  {
    q: 'How long does delivery take in Sri Lanka?',
    a: 'We ship island-wide via tracked courier. Standard cards ship within 2-4 business days. Delivery is 100% free across Sri Lanka.',
  },
  {
    q: 'What happens if I lose my card?',
    a: 'Your digital profile and captured leads remain 100% safe in your cloud dashboard. You can remotely lock the lost card from your portal with 1 click so no one else can view it, and order a replacement card to link to your account.',
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [selectedProductForModal, setSelectedProductForModal] = useState<CardProduct | undefined>(undefined)
  const [selectedConfig, setSelectedConfig] = useState<CardConfig>({
    business: 'SERANEX',
    tagline: 'Web & Software Solutions',
    name: 'Chithila Manul',
    title: 'Founder & CEO',
    slug: 'chithila',
    materialId: 'matte',
  })

  const openOrderWithEdition = (editionId: 'pvc' | 'premium' | 'metal') => {
    if (editionId === 'metal') {
      const metalProd = CARD_PRODUCTS.find((p) => p.id === 'metal-black')
      setSelectedProductForModal(metalProd)
      setSelectedConfig((prev) => ({ ...prev, materialId: 'metal_black' }))
      setIsOrderModalOpen(true)
      return
    }

    if (editionId === 'premium') {
      const customProd = CARD_PRODUCTS.find((p) => p.id === 'custom-card')
      setSelectedProductForModal(customProd)
      setSelectedConfig((prev) => ({ ...prev, materialId: 'custom' }))
    } else {
      const pvcProd = CARD_PRODUCTS.find((p) => p.id === 'classic-white')
      setSelectedProductForModal(pvcProd)
      setSelectedConfig((prev) => ({ ...prev, materialId: 'epic_white' }))
    }

    setIsOrderModalOpen(true)
  }

  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased">
      <Nav />
      <main className="pt-24">
        {/* Hero Banner */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[950px] -translate-x-1/2 rounded-full bg-accent-500/[0.08] blur-[150px]"
          />
          <div className="relative mx-auto max-w-content px-5 text-center sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-medium text-accent-400 mb-6"
            >
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden />
              Transparent, Fair Sri Lankan Pricing
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease }}
              className="text-4xl font-semibold tracking-tightest text-white sm:text-5xl lg:text-6xl"
            >
              Buy Hardware Once.{' '}
              <span className="text-accent-400">Scale Software Forever.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease }}
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
            >
              Choose your physical NFC smart card with limited-time promotional pricing. Then pick a software plan that fits your ambition — including a free plan that never expires.
            </motion.p>
          </div>
        </section>

        {/* Phase 1: Choose Your Physical Card — Official Hardware Catalog */}
        <ProductRangeCatalog
          id="hardware"
          phaseBadge="Phase 1: Choose Your Physical Card"
          title="Pick Your Physical NFC Smart Card (One-Time Payment)"
          subtitle="Crafted with genuine NXP NTAG215 microchips, durable waterproof composite layers, and laser-precision branding. Pay once, use for life with free island-wide delivery."
          hideTrustPillars={true}
        />

        {/* Phase 2: Choose Your Software Plan */}
        <section id="software" className="border-t border-white/[0.07] bg-ink-900/40 py-16 lg:py-24">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/25 bg-accent-500/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-400">
                Phase 2
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Choose Your Software Plan (Billed Annually)
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Start completely free. Upgrade anytime to unlock active lead capture, WhatsApp routing, and tap analytics.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: i * 0.06, ease }}
                  className={`relative flex flex-col justify-between rounded-3xl border p-7 sm:p-8 ${
                    plan.highlight
                      ? 'border-accent-500/50 bg-accent-500/[0.07] shadow-[0_0_80px_-30px_rgba(168,85,247,0.8)]'
                      : 'border-white/10 bg-ink-900/70'
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-500 px-4 py-1 text-xs font-bold text-ink-950">
                      Recommended
                    </span>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/55">{plan.description}</p>

                    <div className="mt-6 flex items-baseline gap-2">
                      {plan.price === 0 ? (
                        <span className="text-4xl font-extrabold text-white">Free</span>
                      ) : (
                        <>
                          <span className="text-xs font-medium text-white/40 uppercase">LKR</span>
                          <span className="text-4xl font-extrabold text-white">{plan.price.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-accent-300 font-medium">{plan.billing}</p>

                    <ul className="mt-8 space-y-3 border-t border-white/[0.08] pt-6">
                      {plan.features.map((f) => (
                        <li key={f.text} className="flex items-start gap-3 text-xs leading-relaxed">
                          {f.included ? (
                            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                          ) : (
                            <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-white/20" />
                          )}
                          <span className={f.included ? 'text-white/80' : 'text-white/30'}>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={plan.ctaHref}
                    target={plan.ctaHref.startsWith('http') ? '_blank' : undefined}
                    rel={plan.ctaHref.startsWith('http') ? 'noreferrer' : undefined}
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all active:scale-98 ${
                      plan.highlight
                        ? 'bg-accent-500 text-ink-950 shadow-[0_0_30px_-5px_rgba(168,85,247,0.8)] hover:bg-accent-400'
                        : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRightIcon className="h-4 w-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Summary Banner */}
        <section className="border-t border-white/[0.07] py-16">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-accent-500/10 via-ink-900 to-ink-950 p-8 sm:p-12 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent-400">
                  Risk-Free Guarantee
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  One Card Replaces 50,000 Paper Business Cards.
                </h3>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  Traditional printing costs LKR 10,000+ for every small detail change. With GoSera, update your profile anytime in seconds, track every interaction, and capture leads seamlessly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openOrderWithEdition('pvc')}
                className="shrink-0 rounded-full bg-accent-500 px-8 py-4 text-sm font-bold text-ink-950 shadow-[0_0_40px_-5px_rgba(168,85,247,0.9)] hover:bg-accent-400 active:scale-95 transition-all"
              >
                Order Your Card Now
              </button>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="border-t border-white/[0.07] py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                <HelpCircleIcon className="h-3.5 w-3.5 text-accent-400" />
                Got Questions?
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Frequently Asked Questions</h2>
              <p className="mt-2 text-sm text-white/50">Everything you need to know about GoSera pricing and hardware.</p>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {faqs.map((item, i) => (
                <div key={item.q} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 text-left transition-colors hover:text-accent-400"
                  >
                    <span className="text-base font-semibold text-white">{item.q}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-accent-400 transition-transform ${
                        openFaq === i ? 'rotate-180 bg-accent-500/20' : ''
                      }`}
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="mt-3 text-sm leading-relaxed text-white/60 pr-8">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Interactive Web Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialConfig={selectedConfig}
        preselectedProduct={selectedProductForModal}
      />
    </div>
  )
}

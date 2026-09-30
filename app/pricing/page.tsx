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
import type { CardConfig } from '@/types/card'

const ease = [0.23, 1, 0.32, 1] as const

interface HardwareItem {
  id: 'pvc' | 'premium' | 'metal'
  name: string
  price: number | null
  originalPrice?: number
  priceDisplay?: string
  tag: string
  description: string
  bestFor: string
  accent?: boolean
  features: string[]
}

const hardware: HardwareItem[] = [
  {
    id: 'pvc',
    name: 'Standard Matte PVC',
    price: 3500,
    originalPrice: 5000,
    tag: 'Limited-Time Discount',
    description: 'Sleek, durable, and waterproof matte finish. Available in Black or White with custom name printing.',
    bestFor: 'Everyday professional networking on a budget',
    accent: false,
    features: [
      'Genuine NXP NTAG215 high-speed NFC chip',
      'Waterproof, scratch-resistant matte composite',
      'Available in Black or Arctic White base',
      'Custom name & designation printing',
      'Dynamic laser-etched QR code on reverse',
      'Free island-wide Sri Lanka delivery',
    ],
  },
  {
    id: 'premium',
    name: 'Sera Premium Matte Finish',
    price: 5000,
    originalPrice: 7000,
    tag: 'Most Popular · Limited-Time',
    description: 'Enhanced ultra-matte texture with high durability, scratch resistance, and premium UV laser branding.',
    bestFor: 'Professionals wanting a luxurious, standout feel',
    accent: true,
    features: [
      'Everything in Standard Matte PVC',
      'Ultra-matte velvet texture with anti-fingerprint coating',
      'High-definition UV laser brand logo & wordmark printing',
      'Custom brand color styling on front & back',
      'Sub-surface embedded antenna for faster 0.2s read range',
      'Free island-wide Sri Lanka delivery & priority shipping',
    ],
  },
  {
    id: 'metal',
    name: 'Executive Metal Card',
    price: null,
    priceDisplay: 'Custom / Premium',
    tag: 'Executive Tier',
    description: 'Brushed stainless steel with embedded NFC chip, custom laser engraving, and weight that demands attention.',
    bestFor: 'Senior executives, founders, and high-end sales closers',
    accent: false,
    features: [
      'Solid aircraft-grade brushed stainless steel (24g weight)',
      'Precision fiber laser engraved branding & typography',
      'Sub-surface isolated contactless NFC antenna module',
      'Unmatched prestige and tactile hand-feel',
      'Dynamic QR code micro-etched on reverse',
      'VIP concierge onboarding & custom domain guidance',
    ],
  },
]

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
      window.open(
        'https://wa.me/94728382638?text=' +
          encodeURIComponent('Hi GoSera team, I would like to inquire about the Executive Metal Card tier.'),
        '_blank'
      )
      return
    }

    setSelectedConfig((prev) => ({
      ...prev,
      materialId: editionId === 'premium' ? 'custom' : 'matte',
    }))
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

        {/* Phase 1: Choose Your Physical Card */}
        <section id="hardware" className="border-t border-white/[0.07] py-16 lg:py-24">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/25 bg-accent-500/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-400">
                Phase 1
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Choose Your Physical Card (One-Time Payment)
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Crafted for durability, equipped with high-speed NXP NFC chips, and shipped free across Sri Lanka.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hardware.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.28, delay: i * 0.05, ease }}
                  className={`relative flex flex-col justify-between rounded-3xl border p-7 transition-all ${
                    h.accent
                      ? 'border-accent-500/50 bg-accent-500/[0.08] shadow-[0_0_70px_-25px_rgba(168,85,247,0.7)]'
                      : 'border-white/10 bg-ink-900/60 hover:border-white/20'
                  }`}
                >
                  {/* Badge */}
                  <span
                    className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-[11px] font-bold ${
                      h.accent ? 'bg-accent-500 text-ink-950' : 'bg-white/15 text-white/80'
                    }`}
                  >
                    {h.tag}
                  </span>

                  <div>
                    <h3 className="text-xl font-bold text-white">{h.name}</h3>
                    <p className="mt-2 text-xs font-medium text-accent-300">
                      Best For: <span className="text-white/70">{h.bestFor}</span>
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{h.description}</p>

                    {/* Price Block */}
                    <div className="mt-6 flex items-baseline gap-2 border-y border-white/[0.08] py-4">
                      {h.price ? (
                        <>
                          <span className="text-xs font-medium text-white/40 uppercase">LKR</span>
                          <span className="text-4xl font-extrabold text-white">{h.price.toLocaleString()}</span>
                          {h.originalPrice && (
                            <span className="text-sm text-white/30 line-through">
                              LKR {h.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-xs text-white/40">one-time</span>
                        </>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-3xl font-extrabold text-white">{h.priceDisplay}</span>
                          <span className="text-xs text-white/40">Inquire for custom production</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-3 flex items-center gap-2 text-xs font-medium text-accent-400">
                      <TruckIcon className="h-4 w-4" />
                      Free island-wide delivery included
                    </p>

                    {/* Feature list */}
                    <ul className="mt-6 space-y-2.5">
                      {h.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-xs text-white/70">
                          <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-400" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 space-y-2">
                    <button
                      type="button"
                      onClick={() => openOrderWithEdition(h.id)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all active:scale-98 ${
                        h.accent
                          ? 'bg-accent-500 text-ink-950 shadow-[0_0_30px_-5px_rgba(168,85,247,0.8)] hover:bg-accent-400'
                          : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {h.id === 'metal' ? 'Inquire for Metal Tier' : 'Order This Card'}
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                    <a
                      href={`https://wa.me/94728382638?text=Hi%2C%20I%27d%20like%20to%20order%20the%20${encodeURIComponent(
                        h.name
                      )}%20card.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 py-1.5 text-xs text-white/50 transition-colors hover:text-white"
                    >
                      <MessageSquareIcon className="h-3.5 w-3.5" />
                      Order via WhatsApp instead
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
      />
    </div>
  )
}

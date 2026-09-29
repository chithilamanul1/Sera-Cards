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
} from 'lucide-react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

const ease = [0.23, 1, 0.32, 1] as const

const hardware = [
  {
    id: 'pvc',
    name: 'Standard Matte PVC',
    price: 1500,
    description: 'Sleek, durable, and ready to ship. Available in Matte Black and Arctic White.',
    tag: 'Most Popular',
    accent: false,
  },
  {
    id: 'custom',
    name: 'Custom Brand Card',
    price: 3500,
    description: 'Fully printed with your company logo, brand colors, and custom design on both faces.',
    tag: 'Best Value',
    accent: true,
  },
  {
    id: 'metal',
    name: 'Executive Metal',
    price: 10000,
    description: 'Premium brushed stainless steel with an embedded NFC chip for maximum impact.',
    tag: 'Premium',
    accent: false,
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
      { text: 'Name, Photo & 1 Phone Number', included: true },
      { text: 'Downloadable vCard (.vcf)', included: true },
      { text: 'Two-Way Lead Capture', included: false },
      { text: 'Unlimited Social Links', included: false },
      { text: 'Tap Analytics Dashboard', included: false },
      { text: 'Custom QR Code', included: false },
      { text: 'Motion Profiles', included: false },
    ],
    cta: 'Get Started Free',
    ctaHref: 'https://wa.me/94728382638?text=Hi%2C%20I%27d%20like%20to%20get%20a%20GoSera%20Basic%20card.',
  },
  {
    id: 'pro',
    name: 'GoSera Pro',
    price: 2400,
    billing: 'per year',
    description: 'The standard for freelancers and solo entrepreneurs who want results.',
    highlight: true,
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Two-Way Lead Capture Form', included: true },
      { text: 'Unlimited Links (WhatsApp, Socials, Portfolio)', included: true },
      { text: 'Google Review 1-Click Integration', included: true },
      { text: 'Basic Tap Analytics', included: true },
      { text: 'Custom QR Code Generator', included: true },
      { text: 'Motion Profiles (Animated headers)', included: true },
      { text: 'Priority Support', included: true },
    ],
    cta: 'Start Pro Plan',
    ctaHref: 'https://wa.me/94728382638?text=Hi%2C%20I%27d%20like%20to%20subscribe%20to%20GoSera%20Pro%20(LKR%202%2C400%2Fyear).',
  },
  {
    id: 'teams',
    name: 'GoSera Teams',
    price: 4800,
    billing: 'per user / year',
    description: 'Built for sales teams, real estate agencies, and corporate HR.',
    highlight: false,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Centralized Admin Dashboard', included: true },
      { text: 'Company-wide Template Locking', included: true },
      { text: 'Team-wide Analytics & ROI Tracking', included: true },
      { text: 'CRM Export (CSV Download)', included: true },
      { text: 'Instant Employee Onboarding/Offboarding', included: true },
      { text: 'Dedicated Account Manager', included: true },
      { text: 'Custom Domain Integration', included: true },
    ],
    cta: 'Contact for Teams',
    ctaHref: '/teams',
  },
]

const faqs = [
  {
    q: 'Do I have to pay a yearly fee?',
    a: 'You can use GoSera Basic for free, forever. However, to unlock powerful business tools like WhatsApp routing, Lead Capture, and Analytics, you can upgrade to our Pro or Teams plans.',
  },
  {
    q: 'Is the hardware cost separate from the subscription?',
    a: 'Yes. The physical NFC card is a one-time hardware purchase. The software subscription unlocks the full digital profile features and analytics dashboard.',
  },
  {
    q: 'What happens if I lose my card?',
    a: 'Your digital profile and captured leads are safely backed up in the cloud. Just order a replacement physical card and link it to your existing profile instantly.',
  },
  {
    q: 'Can I upgrade my plan later?',
    a: 'Absolutely. You can start on the Basic plan and upgrade to Pro or Teams at any time from your dashboard.',
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased">
      <Nav />
      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent-500/[0.07] blur-[140px]"
          />
          <div className="relative mx-auto max-w-content px-5 sm:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1.5 pr-3 text-[11px] uppercase tracking-[0.16em] text-white/55 mb-6"
            >
              <SparklesIcon className="h-3.5 w-3.5 text-accent-400" aria-hidden />
              Transparent Pricing
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease }}
              className="text-4xl font-semibold tracking-tightest text-white sm:text-5xl"
            >
              Hardware once. Software always.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease }}
              className="mt-5 text-base text-white/55 max-w-xl mx-auto"
            >
              Buy your card once at cost. Then choose the software plan that matches your ambition — including a free option that never expires.
            </motion.p>
          </div>
        </section>

        {/* Step 1: Hardware */}
        <section className="border-t border-white/[0.07] py-16 lg:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">Step 1</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Choose Your Hardware</h2>
              <p className="mt-2 text-sm text-white/50">One-time cost. No subscription tied to hardware.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hardware.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.28, delay: i * 0.05, ease }}
                  className={`relative rounded-2xl border p-6 ${
                    h.accent
                      ? 'border-accent-500/40 bg-accent-500/[0.06]'
                      : 'border-white/[0.08] bg-ink-900/60 hover:border-white/20 transition-colors'
                  }`}
                >
                  {h.tag && (
                    <span className={`absolute -top-3 left-5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                      h.accent ? 'bg-accent-500 text-ink-950' : 'bg-white/10 text-white/70'
                    }`}>
                      {h.tag}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-white">{h.name}</h3>
                  <p className="mt-1 text-sm text-white/50">{h.description}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-sm font-medium text-white/40">LKR</span>
                    <span className="text-3xl font-bold text-white">{h.price.toLocaleString()}</span>
                    <span className="text-sm text-white/40">one-time</span>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs text-accent-400">
                    <TruckIcon className="h-3.5 w-3.5" aria-hidden />
                    Free island-wide delivery
                  </p>
                  <a
                    href={`https://wa.me/94728382638?text=Hi%2C%20I%27d%20like%20to%20order%20the%20${encodeURIComponent(h.name)}%20card%20(LKR%20${h.price.toLocaleString()}).`}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                      h.accent
                        ? 'bg-accent-500 text-ink-950 hover:bg-accent-400'
                        : 'border border-white/12 text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <MessageSquareIcon className="h-4 w-4" />
                    Order via WhatsApp
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Step 2: Software Plans */}
        <section className="border-t border-white/[0.07] bg-ink-900/30 py-16 lg:py-24">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">Step 2</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Choose Your Software Plan</h2>
              <p className="mt-2 text-sm text-white/50">Billed annually. Cancel anytime. Start free — no credit card needed.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: i * 0.06, ease }}
                  className={`relative flex flex-col rounded-2xl border p-7 ${
                    plan.highlight
                      ? 'border-accent-500/40 bg-accent-500/[0.06] shadow-[0_0_80px_-40px_rgba(168,85,247,0.9)]'
                      : 'border-white/[0.08] bg-ink-900/70'
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-500 px-4 py-1 text-[11px] font-bold text-ink-950">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    <p className="mt-1 text-sm text-white/50">{plan.description}</p>
                    <div className="mt-6 flex items-baseline gap-2">
                      {plan.price === 0 ? (
                        <span className="text-4xl font-bold text-white">Free</span>
                      ) : (
                        <>
                          <span className="text-sm text-white/40">LKR</span>
                          <span className="text-4xl font-bold text-white">{plan.price.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-white/40">{plan.billing}</p>
                  </div>

                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-3 text-sm">
                        {f.included ? (
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                        ) : (
                          <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-white/20" aria-hidden />
                        )}
                        <span className={f.included ? 'text-white/70' : 'text-white/25'}>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.ctaHref}
                    target={plan.ctaHref.startsWith('http') ? '_blank' : undefined}
                    rel={plan.ctaHref.startsWith('http') ? 'noreferrer' : undefined}
                    className={`mt-8 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                      plan.highlight
                        ? 'bg-accent-500 text-ink-950 hover:bg-accent-400 shadow-[0_0_30px_-8px_rgba(168,85,247,0.8)]'
                        : 'border border-white/12 text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/[0.07] py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl mb-10">Frequently Asked Questions</h2>
            <div className="divide-y divide-white/[0.07]">
              {faqs.map((item, i) => (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-base font-medium text-white">{item.q}</span>
                    <span className={`text-accent-400 text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <p className="pb-5 text-sm leading-relaxed text-white/55">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

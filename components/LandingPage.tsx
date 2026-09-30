'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRightIcon,
  UsersIcon,
  BarChart3Icon,
  ZapIcon,
  UserCheckIcon,
  SparklesIcon,
  ChevronRightIcon,
  StarIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  RadioIcon,
  QrCodeIcon,
  MessageSquareIcon,
  PhoneIcon,
  GlobeIcon,
  CheckIcon,
  XIcon,
  LockIcon,
  TruckIcon,
  FileTextIcon,
  LayersIcon,
  AwardIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  BriefcaseIcon,
  Building2Icon,
  StethoscopeIcon,
  PaletteIcon,
} from 'lucide-react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { NfcTapSimulator } from './NfcTapSimulator'
import { Customizer } from './Customizer'
import { OrderModal } from './OrderModal'
import { useCardConfig } from '../hooks/useCardConfig'
import { brand, comparison, steps, specs } from '../data/content'

const ease = [0.23, 1, 0.32, 1] as const

const industries = [
  {
    icon: Building2Icon,
    title: 'Real Estate Agents & Brokers',
    benefit: 'Close property deals on the spot.',
    desc: 'Buyers tap your card to instantly view property listings, floor plans, and start a WhatsApp conversation. Never lose a high-intent buyer again.',
    tag: 'Property & Land',
  },
  {
    icon: BriefcaseIcon,
    title: 'Corporate Sales & BD Teams',
    benefit: 'Eliminate outdated paper cards.',
    desc: 'Equip your entire sales force with centralized company branding, automated CRM lead capture, and live tap performance analytics.',
    tag: 'Enterprise & B2B',
  },
  {
    icon: PaletteIcon,
    title: 'Freelancers & Digital Agencies',
    benefit: 'Showcase your portfolio & get paid.',
    desc: 'Direct prospects to your Behance, GitHub, or case studies with one tap, and accept instant cashless deposits via integrated LankaQR.',
    tag: 'Creative & Tech',
  },
  {
    icon: StethoscopeIcon,
    title: 'Consultants, Lawyers & Doctors',
    benefit: 'Establish instant professional authority.',
    desc: 'Share verified credentials, hospital or office directions, and direct appointment booking links with clients and patients.',
    tag: 'Professional Services',
  },
]

const faqs = [
  {
    q: 'Does the other person need an app to view my card?',
    a: 'Absolutely not! GoSera uses the native NFC protocol built into modern smartphones. When you tap your card against their phone, your digital profile automatically opens in their native browser (Safari, Chrome). No apps, no downloads, and no registration required for the receiver.',
  },
  {
    q: 'What happens if an older phone does not support NFC?',
    a: 'Every single GoSera card features an integrated, high-contrast dynamic QR code laser-etched on the back. Any smartphone camera can scan it instantly to load the exact same digital profile.',
  },
  {
    q: 'Can I change my phone number or links after buying the card?',
    a: 'Yes, anytime for free! Your card connects to your GoSera cloud profile. Whenever your phone number, designation, address, or portfolio changes, simply log in to your dashboard and update it in 5 seconds. The physical card updates in real-time without reprinting.',
  },
  {
    q: 'Do I have to pay a monthly or yearly subscription?',
    a: 'No! The GoSera Basic plan is completely free forever. Once you buy the physical card, you have a lifetime digital profile. If you want advanced conversion engines like Two-Way Lead Capture, LankaQR payments, and Analytics, you can upgrade to GoSera Pro for just LKR 2,400/year.',
  },
  {
    q: 'How long does island-wide delivery take in Sri Lanka?',
    a: 'We deliver island-wide across Sri Lanka via tracked courier within 2–4 business days. Standard delivery is 100% free with every card purchase.',
  },
  {
    q: 'What if I lose my card?',
    a: 'Your digital profile and captured leads are safe in your cloud portal. You can instantly freeze profile access with 1 click from your dashboard so nobody else can view it, and order a replacement card.',
  },
]

export function LandingPage() {
  const cardApi = useCardConfig()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased selection:bg-accent-500 selection:text-ink-950">
      <Nav />
      <main>
        {/* ─── Hero Section ─── */}
        <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
          {/* Radial Purple Glow Background */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-56 left-1/2 h-[750px] w-[1200px] -translate-x-1/2 rounded-full bg-accent-500/[0.09] blur-[170px]"
          />

          <div className="relative mx-auto max-w-content px-5 text-center sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold text-accent-400 mb-6"
            >
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden />
              Sri Lanka's Next-Gen Smart Networking Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease }}
              className="mx-auto max-w-5xl text-[2.6rem] font-bold leading-[1.05] tracking-tightest text-white sm:text-6xl lg:text-[4.35rem]"
            >
              The Last Business Card <br className="hidden sm:block" />
              <span className="text-accent-400">You Will Ever Need.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease }}
              className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg lg:text-xl"
            >
              One tap delivers your full professional identity directly into any smartphone. Share contacts, route WhatsApp chats, accept LankaQR payments, and capture client leads in 0.2 seconds — zero app downloads needed.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease }}
              className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            >
              <a
                href="#simulator"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-sm font-bold text-ink-950 shadow-[0_0_50px_-10px_rgba(168,85,247,0.9)] transition-all hover:bg-accent-400 active:scale-[0.97]"
              >
                Watch 0.2s Tap Demo
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/[0.08] active:scale-[0.97]"
              >
                View Plans & Pricing (From LKR 3,500)
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25, ease }}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-white/[0.07] py-5 text-xs text-white/50 sm:text-sm"
            >
              <span className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-accent-400" />
                No app download required
              </span>
              <span className="flex items-center gap-2">
                <RadioIcon className="h-4 w-4 text-accent-400" />
                100% compatible with iOS & Android
              </span>
              <span className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-accent-400" />
                Free island-wide Sri Lanka delivery
              </span>
              <span className="flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-accent-400" />
                Free software plan available forever
              </span>
            </motion.div>
          </div>

          {/* ─── LIVE INTERACTIVE NFC TAP SIMULATOR CENTERPIECE ─── */}
          <div id="simulator" className="relative mx-auto mt-12 max-w-content px-5 sm:px-8 lg:mt-16">
            <NfcTapSimulator />
          </div>
        </section>

        {/* ─── "How It Works in 3 Seconds" Walkthrough ─── */}
        <section id="how" aria-labelledby="how-title" className="border-t border-white/[0.07] py-20 lg:py-28">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-400">
                Product Walkthrough
              </span>
              <h2 id="how-title" className="mt-4 text-3xl font-bold tracking-tightest text-white sm:text-4xl lg:text-5xl">
                How It Works In 3 Seconds.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/60">
                No apps for the receiver to install, no passwords, and no manual typing. This is the entire seamless interaction from handshake to saved lead.
              </p>
            </div>

            <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, i) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.28, delay: i * 0.08, ease }}
                  className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-ink-900/60 p-8 shadow-lg transition-colors hover:border-accent-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-3xl font-bold text-accent-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-accent-400 uppercase">
                        {step.detail}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">{step.body}</p>
                  </div>

                  <div className="mt-8 border-t border-white/[0.08] pt-4 text-xs font-medium text-accent-300">
                    {i === 0 && '⚡ High-speed NXP NTAG215 microchip'}
                    {i === 1 && '🌐 Works seamlessly in Safari & Chrome'}
                    {i === 2 && '💾 Auto-saves directly into phone contacts (.vcf)'}
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── Paper Cards vs. GoSera Comparison Matrix ─── */}
        <section id="compare" className="border-t border-white/[0.07] bg-ink-900/40 py-20 lg:py-28">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                The Comparison
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tightest text-white sm:text-4xl lg:text-5xl">
                Traditional Paper Cards vs. GoSera
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/60">
                A box of 500 paper cards is an outdated snapshot that usually ends up in the bin. A GoSera smart card is one durable card that grows with your career forever.
              </p>
            </div>

            {/* Desktop Table */}
            <div className="mt-14 hidden overflow-hidden rounded-3xl border border-white/10 md:block">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Paper business cards compared with GoSera smart cards</caption>
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th scope="col" className="w-[24%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">
                      Capability
                    </th>
                    <th scope="col" className="w-[38%] px-6 py-4 text-sm font-semibold text-white/60">
                      Paper Business Cards
                    </th>
                    <th scope="col" className="w-[38%] bg-accent-500/[0.08] px-6 py-4 text-sm font-bold text-accent-400">
                      GoSera Smart NFC Card
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {comparison.map((row) => (
                    <tr key={row.feature} className="transition-colors hover:bg-white/[0.02]">
                      <th scope="row" className="px-6 py-5 align-top text-sm font-semibold text-white">
                        {row.feature}
                      </th>
                      <td className="px-6 py-5 align-top text-sm leading-relaxed text-white/50">
                        <span className="flex gap-3">
                          <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-400/80" />
                          {row.paper}
                        </span>
                      </td>
                      <td className="bg-accent-500/[0.05] px-6 py-5 align-top text-sm leading-relaxed text-white/85">
                        <span className="flex gap-3">
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                          <span className="font-medium">{row.sera}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mt-10 space-y-4 md:hidden">
              {comparison.map((row) => (
                <div key={row.feature} className="rounded-2xl border border-white/10 bg-ink-950 p-5">
                  <p className="text-sm font-bold text-white">{row.feature}</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-2.5 text-xs text-white/50">
                      <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400/80" />
                      <span>{row.paper}</span>
                    </div>
                    <div className="flex gap-2.5 rounded-xl bg-accent-500/10 p-2.5 text-xs text-accent-300 font-medium">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-400" />
                      <span>{row.sera}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── "A Complete Lead Generation Engine" (Features) ─── */}
        <section id="features" className="border-t border-white/[0.07] py-20 lg:py-28">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-400">
                Active Conversion
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tightest text-white sm:text-4xl lg:text-5xl">
                Not Just A Card. A Conversion Engine.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/60">
                While competitors offer static links, GoSera gives you dynamic business tools that actively capture clients and generate revenue.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1: Two-Way Lead Capture */}
              <div className="flex flex-col justify-between rounded-3xl border border-accent-500/40 bg-accent-500/[0.07] p-8 shadow-[0_0_60px_-25px_rgba(168,85,247,0.7)] sm:col-span-2">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500 text-ink-950 shadow-md">
                    <UserCheckIcon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-accent-300">
                    Highest Converting Feature
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-white">Two-Way Lead Capture Mode</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Never lose a potential customer again. When someone views your card, an intuitive form prompts them to enter their name, phone number, and company. The lead is delivered instantly to your dashboard and emailed to you for zero-friction follow up.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-accent-500/20 pt-4">
                  {['Client Name', 'WhatsApp Number', 'Company & Notes', 'Instant Email Alert'].map((pill) => (
                    <span key={pill} className="rounded-full border border-accent-500/30 bg-ink-950/70 px-3 py-1 text-xs text-white/70">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feature 2: Integrated LankaQR */}
              <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-ink-900/60 p-8 hover:border-white/20 transition-all">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent-400">
                    <QrCodeIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">Integrated LankaQR Payments</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    Accept direct bank transfers anywhere in Sri Lanka. Display your official Central Bank LankaQR and bank account numbers right on your digital card.
                  </p>
                </div>
                <div className="mt-6 text-xs text-accent-300 font-medium">✓ Zero gateway transaction fees</div>
              </div>

              {/* Feature 3: Google Review Booster */}
              <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-ink-900/60 p-8 hover:border-white/20 transition-all">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent-400">
                    <StarIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">Google 5-Star Review Booster</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    Build instant trust and reputation. Hand your card to happy clients after a meeting or service, and route them directly to your Google review prompt with 1 tap.
                  </p>
                </div>
                <div className="mt-6 text-xs text-accent-300 font-medium">✓ 3x your 5-star Google reviews</div>
              </div>

              {/* Feature 4: Direct WhatsApp Routing */}
              <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-ink-900/60 p-8 hover:border-white/20 transition-all">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent-400">
                    <MessageSquareIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">1-Click WhatsApp Chat Routing</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    Skip the hassle of typing phone numbers. Clients click once to open an official WhatsApp chat with you, pre-filled with an introductory message.
                  </p>
                </div>
                <div className="mt-6 text-xs text-accent-300 font-medium">✓ 68% higher reply rate</div>
              </div>

              {/* Feature 5: Real-Time Tap Analytics */}
              <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-ink-900/60 p-8 hover:border-white/20 transition-all">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent-400">
                    <BarChart3Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">Real-Time Tap Analytics</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    Stop wondering if your networking is working. View total card taps, top clicked links, visitor locations, and lead conversion rates in your live portal.
                  </p>
                </div>
                <div className="mt-6 text-xs text-accent-300 font-medium">✓ Live metrics on every phone</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── "Who Uses GoSera?" (Sri Lankan Industry Showcase) ─── */}
        <section className="border-t border-white/[0.07] bg-ink-900/30 py-20 lg:py-28">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                Sri Lankan Professionals
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tightest text-white sm:text-4xl lg:text-5xl">
                Built For Every High-Performing Industry.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/60">
                From top corporate sales executives to freelance innovators, GoSera is transforming how Sri Lankan professionals connect.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((ind, i) => (
                <div
                  key={ind.title}
                  className="flex flex-col justify-between rounded-3xl border border-white/10 bg-ink-950 p-6 hover:border-accent-500/40 transition-colors"
                >
                  <div>
                    <span className="rounded-full bg-accent-500/10 px-3 py-1 text-[10px] font-bold text-accent-400 uppercase tracking-wider">
                      {ind.tag}
                    </span>
                    <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-accent-400">
                      <ind.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-white">{ind.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-accent-300">{ind.benefit}</p>
                    <p className="mt-3 text-xs leading-relaxed text-white/50">{ind.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LIVE INTERACTIVE CARD CUSTOMIZER ─── */}
        <Customizer api={cardApi} />

        {/* ─── Technical Specifications & Hardware Quality ─── */}
        <section aria-labelledby="specs-title" className="border-t border-white/[0.07] bg-ink-950 py-20 lg:py-24">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-400">
                  Engineering & Quality
                </span>
                <h2 id="specs-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Technical Specifications.
                </h2>
              </div>
              <p className="text-xs font-semibold text-accent-400 sm:text-sm">
                Tested to 100,000+ taps · Zero battery or charging ever
              </p>
            </div>

            <dl className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {specs.map((spec) => (
                <div key={spec.label} className="flex flex-col rounded-2xl border border-white/5 bg-ink-900/40 p-6">
                  <dt className="text-xs font-bold uppercase tracking-wider text-accent-400">{spec.label}</dt>
                  <dd className="mt-3 flex flex-1 flex-col">
                    <span className="text-lg font-bold text-white">{spec.value}</span>
                    <span className="mt-2 text-xs leading-relaxed text-white/50">{spec.body}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ─── FAQs ─── */}
        <section id="faq" className="border-t border-white/[0.07] py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                <HelpCircleIcon className="h-3.5 w-3.5 text-accent-400" />
                Frequently Asked Questions
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tightest text-white sm:text-4xl">
                Got Questions? We Have Answers.
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Everything you need to know about setting up and using your GoSera smart card.
              </p>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10">
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

        {/* ─── Final High-Converting CTA ─── */}
        <section className="relative overflow-hidden border-t border-white/[0.07] bg-gradient-to-b from-ink-900/60 to-ink-950 py-20 lg:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-full max-w-4xl -translate-x-1/2 rounded-full bg-accent-500/15 blur-[140px]"
          />
          <div className="relative mx-auto max-w-content px-5 sm:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-400">
              Upgrade Your Professional Image
            </span>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tightest text-white sm:text-5xl">
              Stop Giving Away Paper Cards. <br />
              <span className="text-accent-400">Start Capturing High-Value Leads.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/60">
              Join thousands of forward-thinking executives, business owners, and founders in Sri Lanka. Order your card today with free island-wide delivery.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/pricing"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-8 py-4 text-sm font-bold text-ink-950 shadow-[0_0_50px_-10px_rgba(168,85,247,0.9)] transition-all hover:bg-accent-400 active:scale-[0.97]"
              >
                Order Your Card Now (From LKR 3,500)
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://wa.me/94728382638?text=Hi%20GoSera%2C%20I%20have%20a%20question%20before%20ordering."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10 active:scale-[0.97]"
              >
                <MessageSquareIcon className="h-4 w-4 text-accent-400" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Web Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialConfig={cardApi.config}
      />
    </div>
  )
}

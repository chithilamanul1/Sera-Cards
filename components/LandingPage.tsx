'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { Nav } from './Nav'
import { Footer } from './Footer'

const ease = [0.23, 1, 0.32, 1] as const

const features = [
  {
    icon: UserCheckIcon,
    title: 'Two-Way Lead Capture',
    body: "Don't just share your info — collect theirs. Our Lead Capture mode prompts the receiver to enter their name and number before saving your vCard, sending leads directly to your dashboard.",
    accent: true,
  },
  {
    icon: BarChart3Icon,
    title: 'Real-Time Analytics',
    body: 'Stop guessing if your networking is working. Track exactly how many times your card is tapped, which links get the most clicks, and where you meet your best leads.',
  },
  {
    icon: SparklesIcon,
    title: 'Motion Profiles & Integrations',
    body: 'Stand out with animated Motion Profiles, one-click WhatsApp chat routing, and direct Google Review links tailored for Sri Lankan businesses.',
  },
  {
    icon: ZapIcon,
    title: 'Tap to Activate',
    body: 'Order your physical card, tap it to your phone when it arrives, and build your digital presence in under 60 seconds.',
  },
]

const trustItems = [
  { icon: ShieldCheckIcon, label: 'No app download required' },
  { icon: CreditCardIcon, label: 'Hardware from LKR 1,500' },
  { icon: StarIcon, label: 'Free plan available forever' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased">
      <Nav />
      <main>
        {/* ─── Hero ─── */}
        <section id="top" className="relative overflow-hidden pt-28 sm:pt-36 lg:pt-44 pb-20 lg:pb-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-56 left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-accent-500/[0.07] blur-[160px]"
          />
          <div className="relative mx-auto max-w-content px-5 sm:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-accent-500/25 bg-accent-500/[0.06] px-4 py-1.5 text-xs text-accent-400 mb-8"
            >
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden />
              Introducing GoSera — The Smart Networking Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease }}
              className="mx-auto max-w-5xl text-[2.8rem] font-semibold leading-[1.04] tracking-tightest text-white sm:text-6xl lg:text-[4.5rem]"
            >
              The Smartest Way to{' '}
              <span className="text-accent-400">Grow Your Network.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
            >
              Share your contact details, capture leads instantly, and track your networking performance with a single tap. Powered by NFC — no app needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="/pricing"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_0_50px_-12px_rgba(168,85,247,0.9)] transition-all hover:bg-accent-400 active:scale-[0.97]"
              >
                View Pricing & Plans
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white transition-all hover:border-white/30 hover:bg-white/[0.06] active:scale-[0.97]"
              >
                See How It Works
              </a>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25, ease }}
              className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-y border-white/[0.07] py-5"
            >
              {trustItems.map((t) => (
                <span key={t.label} className="flex items-center gap-2 text-sm text-white/40">
                  <t.icon className="h-4 w-4 text-accent-400" aria-hidden />
                  {t.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Product showcase card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="relative mx-auto mt-16 max-w-3xl px-5 sm:px-8"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-accent-500/20 blur-[80px]"
            />
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <img src="/logo-white.png" alt="GoSera" className="h-7 w-auto" />
                </div>
                <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-400">Pro Plan</span>
              </div>
              <div className="grid grid-cols-1 divide-y divide-white/[0.05] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="p-5 sm:p-6">
                  <p className="text-xs text-white/30 uppercase tracking-widest">Total Taps</p>
                  <p className="mt-2 text-3xl font-bold text-white">1,284</p>
                  <p className="mt-1 text-xs text-accent-400">↑ 18% this week</p>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs text-white/30 uppercase tracking-widest">Leads Captured</p>
                  <p className="mt-2 text-3xl font-bold text-white">237</p>
                  <p className="mt-1 text-xs text-accent-400">↑ 42 this month</p>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs text-white/30 uppercase tracking-widest">Top Link</p>
                  <p className="mt-2 text-3xl font-bold text-white">WhatsApp</p>
                  <p className="mt-1 text-xs text-accent-400">68% click rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Social Proof ─── */}
        <section className="border-t border-white/[0.07] bg-ink-900/40 py-10 lg:py-14">
          <div className="mx-auto max-w-content px-5 sm:px-8 text-center">
            <p className="text-sm text-white/40 tracking-wide">Powering modern professionals and sales teams across Sri Lanka.</p>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section id="features" className="border-t border-white/[0.07] py-20 lg:py-28">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center mb-14">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1.5 pr-3 text-[11px] uppercase tracking-[0.16em] text-white/55">
                <SparklesIcon className="h-3.5 w-3.5 text-accent-400" aria-hidden />
                The Software Advantage
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-[2.75rem]">
                Not just a card. A lead generation engine.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/55">
                Competitors charge for static web links. GoSera delivers tools that actively grow your business.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.28, delay: i * 0.05, ease }}
                  className={`rounded-2xl border p-7 sm:p-8 ${
                    f.accent
                      ? 'border-accent-500/30 bg-accent-500/[0.06] shadow-[0_0_60px_-30px_rgba(168,85,247,0.8)]'
                      : 'border-white/[0.07] bg-ink-900/50 hover:border-white/20 transition-colors'
                  }`}
                >
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                    f.accent ? 'bg-accent-500 text-ink-950' : 'bg-white/[0.06] text-accent-400'
                  }`}>
                    <f.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-white">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{f.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="border-t border-white/[0.07] bg-ink-900/40 py-20 lg:py-28">
          <div className="mx-auto max-w-content px-5 sm:px-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tightest text-white sm:text-4xl">
              Stop giving away paper cards.
              <br />
              <span className="text-accent-400">Start building digital connections.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/55">
              Choose your hardware and pick a software plan that scales with your ambition.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/pricing"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_0_40px_-10px_rgba(168,85,247,0.8)] transition-all hover:bg-accent-400 active:scale-[0.97]"
              >
                Compare Plans
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/teams"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white transition-all hover:border-white/30 hover:bg-white/[0.06] active:scale-[0.97]"
              >
                <UsersIcon className="h-4 w-4 text-accent-400" />
                For Teams & Enterprise
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

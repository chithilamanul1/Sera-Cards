'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDownIcon, PlayCircleIcon } from 'lucide-react'
import type { CardConfig } from '../types/card'

interface HeroProps {
  config: CardConfig
}

const ease = [0.23, 1, 0.32, 1] as const

export function Hero({ config }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-gold-500/[0.04] blur-[140px]"
      />
      <div className="relative mx-auto grid max-w-content items-center gap-16 px-5 pb-20 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-8 lg:pb-28">
        {/* ── Left Column: Copy ── */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              NFC Networking, Reimagined
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease }}
            className="mt-7 text-[2.8rem] font-bold leading-[1.05] tracking-tightest text-white sm:text-6xl lg:text-[4.5rem]"
          >
            The last<br />
            business card<br />
            <span className="text-gold-400">you&apos;ll ever<br />need.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease }}
            className="mt-6 max-w-md text-base leading-relaxed text-white/45"
          >
            Tap any smartphone to share your contact, portfolio and payment links instantly. Powered by NFC and dynamic cloud routing.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#customize"
              className="focus-ring group inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-150 ease-smooth hover:bg-gold-400 active:scale-[0.97]"
            >
              Customize your card
              <ArrowDownIcon
                className="h-4 w-4 transition-transform duration-150 ease-smooth group-hover:translate-y-0.5"
                aria-hidden
              />
            </a>
            <a
              href="#how"
              className="focus-ring inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/80 transition-all duration-150 ease-smooth hover:border-white/20 hover:text-white active:scale-[0.97]"
            >
              <PlayCircleIcon className="h-4 w-4" aria-hidden />
              Watch 5-sec demo
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.26, ease }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2"
          >
            {['No app required', 'iPhone & Android', 'Zero monthly fees'].map((t) => (
              <li key={t} className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ── Right Column: Floating 3D Card Visual ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.12, ease }}
          className="relative flex items-center justify-center"
        >
          {/* Concentric orbit rings */}
          <div className="absolute h-[420px] w-[420px] rounded-full border border-white/[0.04]" />
          <div className="absolute h-[560px] w-[560px] rounded-full border border-white/[0.03]" />
          <div className="absolute h-[700px] w-[700px] rounded-full border border-white/[0.02]" />

          {/* Card */}
          <div className="relative z-10 w-[340px] sm:w-[380px]">
            <div className="relative aspect-[1.6/1] w-full rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#1a1a2e] via-[#16162a] to-[#0d0d1a] p-6 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.85)]">
              {/* Card top row */}
              <div className="flex items-start justify-between">
                {/* NFC icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white/50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
                    <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                    <path d="M12.91 4.1a16.1 16.1 0 0 1 0 15.8" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">SERA</span>
              </div>

              {/* Name */}
              <div className="mt-auto pt-8">
                <p className="text-lg font-bold tracking-tight text-white">KASUN PERERA</p>
                <p className="mt-0.5 text-xs text-white/40">Founder · North Studio</p>
              </div>

              {/* Bottom row */}
              <div className="mt-4 flex items-end justify-between">
                {/* NFC bottom-right */}
                <span className="text-[9px] text-white/20 tracking-wide">serenex.lk</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.06]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-white/30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
                    <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                    <path d="M12.91 4.1a16.1 16.1 0 0 1 0 15.8" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating label: Dynamic profile */}
            <div className="absolute -left-4 top-4 rounded-lg border border-white/[0.06] bg-ink-950/80 px-3 py-1.5 text-[10px] text-white/50 backdrop-blur-md sm:-left-8">
              Dynamic profile
            </div>

            {/* Floating label: NFC enabled */}
            <div className="absolute -right-4 -top-2 rounded-lg border border-white/[0.06] bg-ink-950/80 px-3 py-1.5 text-[10px] text-white/50 backdrop-blur-md sm:-right-8">
              NFC enabled
            </div>

            {/* Floating label: Ready to share */}
            <div className="absolute -right-6 bottom-6 flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-ink-950/80 px-3 py-2 backdrop-blur-md sm:-right-16">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-cyan-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/70">Ready to share</p>
                <p className="text-[9px] text-white/30">Hold near phone</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" className="ml-1 h-3.5 w-3.5 text-cyan-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon, CloudIcon, SmartphoneIcon, SparklesIcon, WalletMinimalIcon } from 'lucide-react'
import { CardFlip } from './CardFlip'
import type { CardConfig } from '../types/card'

interface HeroProps {
  config: CardConfig
}

const badges = [
  { icon: SmartphoneIcon, label: '100% compatible with iOS & Android' },
  { icon: WalletMinimalIcon, label: 'Zero monthly fees' },
  { icon: CloudIcon, label: 'Instant cloud updates' },
]

const ease = [0.23, 1, 0.32, 1] as const

export function Hero({ config }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-56 left-1/2 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-accent-500/[0.08] blur-[150px]"
      />

      <div className="relative mx-auto max-w-content px-5 text-center sm:px-8">
        <motion.a
          href="#features"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-white/65 transition-colors duration-150 ease-smooth hover:border-accent-500/40 hover:text-white"
        >
          <SparklesIcon className="h-3.5 w-3.5 text-accent-400" aria-hidden />
          New: LankaQR payments are now built into every profile
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease }}
          className="mx-auto mt-7 max-w-4xl text-[2.6rem] font-semibold leading-[1.04] tracking-tightest text-white sm:text-6xl lg:text-[4.25rem]"
        >
          The Last Business Card <br className="hidden sm:block" />
          You Will Ever Need.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
        >
          One tap delivers your entire professional identity directly to any smartphone. Powered by
          high-speed NFC and dynamic cloud profiles — no apps required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#customize"
            className="focus-ring group inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_0_40px_-10px_rgba(18,185,129,0.8)] transition-[transform,background-color] duration-150 ease-smooth hover:bg-accent-400 active:scale-[0.97]"
          >
            Customize Your Sera Card
            <ArrowRightIcon
              className="h-4 w-4 transition-transform duration-150 ease-smooth group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
          <a
            href="#how"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white transition-[transform,border-color,background-color] duration-150 ease-smooth hover:border-white/30 hover:bg-white/[0.06] active:scale-[0.97]"
          >
            How It Works
          </a>
        </motion.div>
      </div>

      {/* Product pedestal */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.18, ease }}
        className="relative mx-auto mt-16 max-w-content px-5 sm:px-8 lg:mt-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-16 left-1/2 h-64 w-[min(90%,720px)] -translate-x-1/2 rounded-[50%] bg-accent-500/20 blur-[90px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[4.5rem] left-1/2 h-px w-[min(80%,620px)] -translate-x-1/2 bg-accent-400/40"
        />
        <div className="relative">
          <CardFlip config={config} />
        </div>
      </motion.div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.24, ease }}
        className="relative mx-auto mt-16 max-w-content px-5 sm:px-8 lg:mt-20"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-y border-white/[0.07] py-5">
          {badges.map((b) => (
            <li key={b.label} className="flex items-center gap-2 text-sm text-white/45">
              <b.icon className="h-4 w-4 text-accent-400" aria-hidden />
              {b.label}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}

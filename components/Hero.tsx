'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon, CloudIcon, SmartphoneIcon, WalletIcon } from 'lucide-react'
import { CardFlip } from './CardFlip'
import type { CardConfig } from '../types/card'

interface HeroProps {
  config: CardConfig
}

const badges = [
  { icon: SmartphoneIcon, label: '100% compatible with iOS & Android' },
  { icon: WalletIcon, label: 'Zero monthly fees' },
  { icon: CloudIcon, label: 'Instant cloud updates' },
]

const ease = [0.23, 1, 0.32, 1] as const

export function Hero({ config }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-gold-500/[0.07] blur-[140px]"
      />
      <div className="relative mx-auto grid max-w-content items-center gap-16 px-5 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-28">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease }}
            className="text-[11px] uppercase tracking-[0.3em] text-gold-500"
          >
            NFC smart business cards · Sri Lanka
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease }}
            className="mt-5 text-[2.6rem] font-semibold leading-[1.03] tracking-tightest text-white sm:text-6xl lg:text-[4.25rem]"
          >
            The Last Business Card{' '}
            <span className="font-serif font-normal italic text-gold-400">You Will Ever Need.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/60"
          >
            One tap delivers your entire professional identity directly to any smartphone. Powered by
            high-speed NFC and dynamic cloud profiles — no apps required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#customize"
              className="focus-ring group inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-150 ease-smooth hover:bg-gold-400 active:scale-[0.97]"
            >
              Customize Your Sera Card
              <ArrowRightIcon
                className="h-4 w-4 transition-transform duration-150 ease-smooth group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
            <a
              href="#how"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3.5 text-sm font-medium text-white transition-[transform,border-color,background-color] duration-150 ease-smooth hover:border-white/30 hover:bg-white/[0.04] active:scale-[0.97]"
            >
              How It Works
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.22, ease }}
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/[0.07] pt-7"
          >
            {badges.map((b) => (
              <li key={b.label} className="flex items-center gap-2 text-sm text-white/50">
                <b.icon className="h-4 w-4 text-cyan-400" aria-hidden />
                {b.label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.12, ease }}
          className="relative"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-10 h-56 rounded-full bg-cyan-500/[0.08] blur-[90px]"
          />
          <CardFlip config={config} />
        </motion.div>
      </div>
    </section>
  )
}

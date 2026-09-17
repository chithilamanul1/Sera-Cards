'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRightIcon, GlobeIcon, LockIcon, QrCodeIcon, StarIcon } from 'lucide-react'
import { features } from '../data/content'
import { SectionHeading } from './SectionHeading'

const icons: Record<string, any> = {
  exchange: ArrowLeftRightIcon,
  payment: QrCodeIcon,
  review: StarIcon,
  identity: GlobeIcon,
  lock: LockIcon,
}

export function Features() {
  const [featured, ...rest] = features
  const FeaturedIcon = icons[featured.icon]

  return (
    <section id="features" aria-labelledby="features-title" className="border-t border-white/[0.07] bg-ink-900/40 py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          id="features-title"
          eyebrow="Core capabilities"
          title="Not just a card. A conversion engine."
          lead="Everything below runs from your cloud portal, and works the second someone taps."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-accent-500/25 bg-accent-500/[0.06] p-7 shadow-[0_0_80px_-40px_rgba(18,185,129,0.9)] sm:p-9 lg:col-span-2"
          >
            <div className="max-w-xl">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-500 text-ink-950">
                <FeaturedIcon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/60">{featured.body}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Name', 'WhatsApp number', 'Company', 'Notes'].map((chip) => (
                <span key={chip} className="rounded-full border border-white/12 bg-ink-950/60 px-3 py-1.5 text-xs text-white/55">
                  {chip}
                </span>
              ))}
              <span className="rounded-full bg-accent-500/15 px-3 py-1.5 text-xs font-medium text-accent-300">
                → Straight to your inbox
              </span>
            </div>
          </motion.article>

          {rest.map((feature, i) => {
            const Icon = icons[feature.icon]
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.28, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                className="flex gap-4 rounded-2xl border border-white/[0.07] bg-ink-950/50 p-6 transition-colors duration-150 ease-smooth hover:border-white/20"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-accent-400">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{feature.body}</p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

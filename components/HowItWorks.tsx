'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { steps } from '../data/content'
import { SectionHeading } from './SectionHeading'

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="border-t border-white/[0.07] py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          id="how-title"
          eyebrow="Product overview"
          align="center"
          title="How it works."
          lead="No app to download, no account for them to make, no typing. This is the entire interaction, from handshake to saved contact."
        />

        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.06] lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.28, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col bg-ink-950 p-7 lg:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl text-accent-400">{String(i + 1).padStart(2, '0')}</span>
                <span className="rounded-full border border-accent-500/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-accent-400">
                  {step.detail}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

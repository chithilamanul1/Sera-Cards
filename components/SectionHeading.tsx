'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DotIcon } from 'lucide-react'

interface SectionHeadingProps {
  title: string
  lead?: string
  eyebrow?: string
  align?: 'left' | 'center'
  id?: string
}

export function SectionHeading({ title, lead, eyebrow, align = 'left', id }: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      {eyebrow ? (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1.5 pr-3 text-[11px] uppercase tracking-[0.16em] text-white/55 ${
            centered ? 'mx-auto' : ''
          }`}
        >
          <DotIcon className="h-4 w-4 text-accent-400" aria-hidden />
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={id}
        className={`text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08] ${
          eyebrow ? 'mt-5' : ''
        }`}
      >
        {title}
      </h2>
      {lead ? <p className="mt-4 text-base leading-relaxed text-white/55">{lead}</p> : null}
    </motion.div>
  )
}

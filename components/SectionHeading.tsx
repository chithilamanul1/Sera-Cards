'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SectionHeadingProps {
  title: string
  lead?: string
  align?: 'left' | 'center'
  id?: string
}

export function SectionHeading({ title, lead, align = 'left', id }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <h2
        id={id}
        className="text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
      >
        {title}
      </h2>
      {lead ? <p className="mt-4 text-base leading-relaxed text-white/55">{lead}</p> : null}
    </motion.div>
  )
}

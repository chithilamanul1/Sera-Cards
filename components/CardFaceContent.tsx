'use client'

import React from 'react'
import { motion, type MotionValue } from 'framer-motion'
import { MailIcon, MapPinIcon, MousePointer2Icon, PhoneIcon } from 'lucide-react'
import { getMaterial } from '../data/materials'
import { brand } from '../data/content'
import { CardFacets } from './CardFacets'
import { QrMock } from './QrMock'
import type { CardConfig } from '../types/card'

interface CardFaceContentProps {
  config: CardConfig
  side: 'front' | 'back'
  glare?: MotionValue<string>
}

export function CardFaceContent({ config, side, glare }: CardFaceContentProps) {
  const material = getMaterial(config.materialId)
  const surface = side === 'front' ? material.face : material.backFace

  const business = config.business.trim() || 'YOUR BRAND'
  const tagline = config.tagline.trim()
  const name = config.name.trim() || 'Your Name'
  const title = config.title.trim() || 'Designation'
  const slug = config.slug || 'yourname'

  const contacts = [
    { icon: MapPinIcon, value: brand.address },
    { icon: PhoneIcon, value: brand.phone },
    { icon: MailIcon, value: brand.email },
    { icon: MousePointer2Icon, value: `${slug}.${brand.domain}` },
  ]

  return (
    <div className="absolute inset-0" style={{ ...surface, boxShadow: `inset 0 0 0 1px ${material.edge}` }}>
      <CardFacets tone={side === 'front' ? 'dark' : 'light'} />
      {glare ? (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />
      ) : null}

      {side === 'front' ? (
        <div className="relative flex h-full flex-col items-center justify-center px-[8%] text-center">
          <p
            className="font-card w-full truncate text-[1.6rem] font-light uppercase leading-none tracking-[0.14em] sm:text-[2.1rem]"
            style={{ color: material.ink }}
          >
            {business}
          </p>
          <span
            aria-hidden
            className="mt-[5%] block h-px w-[18%]"
            style={{ backgroundColor: material.ink, opacity: 0.4 }}
          />
          {tagline ? (
            <p
              className="font-card mt-[5%] w-full truncate text-[0.72rem] tracking-[0.08em] sm:text-[0.8rem]"
              style={{ color: material.inkMuted }}
            >
              {tagline}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="relative flex h-full flex-col justify-between p-[6.5%]">
          <div className="min-w-0">
            <p
              className="font-card truncate text-[1.05rem] font-medium uppercase leading-tight tracking-[0.05em] sm:text-[1.3rem]"
              style={{ color: material.backInk }}
            >
              {name}
            </p>
            <p
              className="font-card mt-0.5 truncate text-[0.72rem] sm:text-[0.82rem]"
              style={{ color: material.backInkMuted }}
            >
              {title}
            </p>
          </div>

          <div className="flex items-end justify-between gap-[5%]">
            <QrMock
              color={material.backInk}
              background="#ffffff"
              className="h-[44%] w-auto shrink-0 rounded-[3px] p-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.18)]"
            />
            <ul className="min-w-0 space-y-1.5 text-right">
              {contacts.map((c) => (
                <li
                  key={c.value}
                  className="font-card flex items-center justify-end gap-2 text-[0.62rem] sm:text-[0.72rem]"
                  style={{ color: material.backInk }}
                >
                  <span className="truncate">{c.value}</span>
                  <c.icon className="h-3 w-3 shrink-0" style={{ color: material.backInkMuted }} aria-hidden />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

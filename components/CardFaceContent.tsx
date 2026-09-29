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
    <div
      className="absolute inset-0 select-none overflow-hidden"
      style={{
        ...surface,
        boxShadow: `inset 0 0 0 1px ${material.edge}`,
      }}
    >
      <CardFacets tone={side === 'front' ? 'dark' : 'light'} />
      {glare ? (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />
      ) : null}

      {side === 'front' ? (
        <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
          {/* Top Row: Contactless NFC Tap Icon (Top-Right) */}
          <div className="flex items-center justify-end">
            <div className="flex items-center opacity-85">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 sm:h-6 sm:w-6 text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                <path d="M12 19a8.5 8.5 0 0 1 0-14" />
                <path d="M15.5 21.5a12 12 0 0 1 0-19" />
              </svg>
            </div>
          </div>

          {/* Center: The Official SERA Logo (or custom client business print) */}
          <div className="flex flex-1 items-center justify-center -mt-2">
            {config.materialId === 'custom' ? (
              <div className="text-center px-4">
                <p
                  className="font-card w-full truncate text-[1.6rem] font-bold uppercase leading-tight tracking-[0.14em] sm:text-[2.1rem]"
                  style={{ color: material.ink }}
                >
                  {business}
                </p>
                {tagline ? (
                  <p
                    className="font-card mt-1.5 w-full truncate text-[0.72rem] tracking-[0.08em] sm:text-[0.82rem]"
                    style={{ color: material.inkMuted }}
                  >
                    {tagline}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <img
                  src="/logo-white.png"
                  alt="SERA"
                  className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                />
              </div>
            )}
          </div>

          {/* Bottom subtle indicator */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/35">
            <span className="font-mono">NTAG215</span>
            <span className="font-medium text-white/30">Tap or scan to connect</span>
          </div>
        </div>
      ) : (
        /* BACK FACE */
        <div className="relative flex h-full flex-col justify-between p-6 sm:p-7 text-white">
          {/* Top row: Client Name & Designation on left, Contactless NFC icon on right */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p
                className="font-card truncate text-[1.1rem] font-semibold uppercase leading-tight tracking-[0.06em] sm:text-[1.35rem]"
                style={{ color: material.backInk }}
              >
                {name}
              </p>
              <p
                className="font-card mt-0.5 truncate text-[0.72rem] sm:text-[0.82rem] tracking-wide"
                style={{ color: material.backInkMuted }}
              >
                {title}
              </p>
            </div>

            <div className="opacity-80">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 sm:h-6 sm:w-6 text-white/80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                <path d="M12 19a8.5 8.5 0 0 1 0-14" />
                <path d="M15.5 21.5a12 12 0 0 1 0-19" />
              </svg>
            </div>
          </div>

          {/* Bottom row: QR Code on left, contacts on right */}
          <div className="flex items-end justify-between gap-4">
            <div className="rounded-lg bg-white p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              <QrMock
                color="#000000"
                background="#ffffff"
                className="h-14 w-14 sm:h-16 sm:w-16"
              />
            </div>

            <div className="min-w-0 space-y-1 text-right">
              <p className="font-mono text-xs font-semibold text-emerald-400 truncate">
                {slug}.{brand.domain}
              </p>
              <ul className="space-y-1">
                {contacts.slice(0, 3).map((c) => (
                  <li
                    key={c.value}
                    className="font-card flex items-center justify-end gap-1.5 text-[0.62rem] sm:text-[0.72rem]"
                    style={{ color: material.backInkMuted }}
                  >
                    <span className="truncate max-w-[180px]">{c.value}</span>
                    <c.icon className="h-2.5 w-2.5 shrink-0 opacity-70" aria-hidden />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

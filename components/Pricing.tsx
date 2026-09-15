'use client'

import React from 'react'
import { CheckIcon, TruckIcon } from 'lucide-react'
import { brand, packageIncludes } from '../data/content'
import { getMaterial } from '../data/materials'
import type { CardConfig } from '../types/card'

interface PricingProps {
  config: CardConfig
}

function buildWhatsappUrl(config: CardConfig): string {
  const material = getMaterial(config.materialId)
  const message = [
    `Hi Serenex — I'd like to order a Sera PVC Pro card (LKR ${brand.priceLkr.toLocaleString('en-US')}).`,
    '',
    `Brand wordmark (front): ${config.business.trim() || '—'}`,
    `Tagline (front): ${config.tagline.trim() || '—'}`,
    `Name on card: ${config.name.trim() || '—'}`,
    `Designation: ${config.title.trim() || '—'}`,
    `Finish: ${material.name}`,
    `Preferred sub-page: ${(config.slug || 'yourname')}.${brand.domain}`,
  ].join('\n')
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`
}

export function Pricing({ config }: PricingProps) {
  const material = getMaterial(config.materialId)

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative overflow-hidden border-t border-white/[0.07] bg-ink-900/40 py-20 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-gold-500/[0.07] blur-[130px]"
      />
      <div className="relative mx-auto max-w-content px-5 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-gold-500/25 bg-ink-950/80">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold-500">Most popular package</p>
              <h2 id="pricing-title" className="mt-4 text-3xl font-semibold tracking-tightest text-white sm:text-4xl">
                Sera PVC Pro
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55">
                One card, printed with your logo, linked to a dashboard you control for life. No subscription,
                no renewal, no reprints.
              </p>

              <ul className="mt-9 grid gap-3 sm:grid-cols-2">
                {packageIncludes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/65">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between gap-8 border-t border-white/[0.07] bg-white/[0.02] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-white/45">LKR</span>
                  <span className="text-5xl font-semibold tracking-tightest text-white">
                    {brand.priceLkr.toLocaleString('en-US')}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-cyan-400">
                  <TruckIcon className="h-4 w-4" aria-hidden />
                  Free delivery island-wide
                </p>

                <dl className="mt-8 space-y-3 border-t border-white/[0.07] pt-6 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Brand on front</dt>
                    <dd className="truncate font-medium text-white">{config.business.trim() || '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Name on back</dt>
                    <dd className="truncate font-medium text-white">{config.name.trim() || '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Finish</dt>
                    <dd className="font-medium text-white">{material.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Sub-page</dt>
                    <dd className="truncate font-mono text-xs text-gold-400">
                      {(config.slug || 'yourname')}.{brand.domain}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <a
                  href={buildWhatsappUrl(config)}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-4 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-150 ease-smooth hover:bg-gold-400 active:scale-[0.98]"
                >
                  Order via WhatsApp
                </a>
                <p className="mt-3 text-center text-xs text-white/40">
                  Your name and chosen finish are pre-filled in the message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

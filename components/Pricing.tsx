'use client';

import React, { useState } from 'react';
import { CheckIcon, TruckIcon, CreditCardIcon, MessageSquareIcon, SparklesIcon } from 'lucide-react';
import { brand, packageIncludes } from '../data/content';
import { getMaterial } from '../data/materials';
import type { CardConfig } from '../types/card';
import { OrderModal } from './OrderModal';

interface PricingProps {
  config: CardConfig;
}

export function Pricing({ config }: PricingProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const material = getMaterial(config.materialId);

  const originalPrice = brand.originalPriceLkr || 5000;
  const currentPrice = brand.priceLkr || 3500;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative overflow-hidden border-t border-white/[0.07] bg-ink-900/40 py-20 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-accent-500/[0.09] blur-[130px]"
      />
      <div className="relative mx-auto max-w-content px-5 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-accent-500/25 bg-ink-950/80 shadow-[0_0_120px_-60px_rgba(18,185,129,1)]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left Column: Package Details */}
            <div className="p-7 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-400">
                <SparklesIcon className="h-3 w-3" />
                Limited Promotional Offer
              </div>
              <h2 id="pricing-title" className="mt-4 text-3xl font-semibold tracking-tightest text-white sm:text-4xl">
                Sera PVC Pro Card
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55">
                One card, custom printed with your brand logo, connected to your cloud portal for life.
                No subscription, no renewal fees, zero reprints.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {packageIncludes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/65">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-white/50">
                <span className="font-semibold text-white/70">Finish Note:</span> Standard ultra-durable
                high-gloss PVC finish is included at this discounted price. Matte finish is not offered under
                this promotional package.
              </div>
            </div>

            {/* Right Column: Pricing & Checkout Actions */}
            <div className="flex flex-col justify-between gap-8 border-t border-white/[0.07] bg-white/[0.02] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-medium text-white/45">LKR</span>
                  <span className="text-5xl font-semibold tracking-tightest text-white">
                    {currentPrice.toLocaleString('en-US')}
                  </span>
                  <span className="text-xl text-white/35 line-through">
                    LKR {originalPrice.toLocaleString('en-US')}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-accent-400">
                  <TruckIcon className="h-4 w-4" aria-hidden />
                  Island-wide delivery available
                </p>

                <dl className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Brand on front</dt>
                    <dd className="truncate font-medium text-white">{config.business.trim() || '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Name on back</dt>
                    <dd className="truncate font-medium text-white">{config.name.trim() || '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Selected Finish</dt>
                    <dd className="font-medium text-white">{material.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Sub-page</dt>
                    <dd className="truncate font-mono text-xs text-accent-400">
                      {(config.slug || 'yourname')}.{brand.domain}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-4 text-sm font-semibold text-ink-950 shadow-[0_0_50px_-12px_rgba(18,185,129,0.9)] transition-all duration-150 hover:bg-accent-400 active:scale-[0.98]"
                >
                  <CreditCardIcon className="h-4 w-4" />
                  Order Online (PayHere / Card)
                </button>

                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white transition-all duration-150 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <MessageSquareIcon className="h-4 w-4 text-accent-400" />
                  Order via WhatsApp
                </button>

                <p className="text-center text-xs text-white/40">
                  Secure checkout powered by PayHere & instant WhatsApp confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialConfig={config}
      />
    </section>
  );
}

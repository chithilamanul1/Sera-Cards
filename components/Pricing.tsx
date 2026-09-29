'use client';

import React, { useState } from 'react';
import { CheckIcon, TruckIcon, CreditCardIcon, MessageSquareIcon, SparklesIcon, ShieldCheckIcon } from 'lucide-react';
import { brand, packageIncludes } from '../data/content';
import { getMaterial } from '../data/materials';
import type { CardConfig } from '../types/card';
import { OrderModal } from './OrderModal';

interface PricingProps {
  config: CardConfig;
}

export function Pricing({ config }: PricingProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'signature' | 'custom'>('signature');
  const material = getMaterial(config.materialId);

  const activePrice = selectedPlan === 'signature' ? 3500 : 5000;
  const originalPrice = selectedPlan === 'signature' ? 5000 : 7000;

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
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
            <SparklesIcon className="h-3.5 w-3.5" />
            Transparent Pricing
          </span>
          <h2 id="pricing-title" className="mt-4 text-3xl font-bold tracking-tightest text-white sm:text-4xl">
            Choose Your Card Package
          </h2>
          <p className="mt-3 text-sm text-white/55">
            One-time purchase, zero monthly subscriptions. Island-wide delivery available across Sri Lanka.
          </p>

          {/* Tier Switcher Pills */}
          <div className="mt-6 inline-flex p-1 rounded-2xl bg-zinc-900 border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedPlan('signature')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                selectedPlan === 'signature'
                  ? 'bg-accent-500 text-ink-950 shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sera Signature (LKR 3,500)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('custom')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                selectedPlan === 'custom'
                  ? 'bg-accent-500 text-ink-950 shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Full Custom Print (LKR 5,000)
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-accent-500/25 bg-ink-950/80 shadow-[0_0_120px_-60px_rgba(18,185,129,1)]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left Column: Package Details */}
            <div className="p-7 sm:p-10 lg:p-12">
              <span className="text-[11px] uppercase tracking-[0.24em] text-accent-400 font-bold">
                {selectedPlan === 'signature' ? 'Best Value Edition' : 'Enterprise & Custom Brand'}
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {selectedPlan === 'signature'
                  ? 'SERA Signature PVC Card'
                  : 'Full Custom Print PVC Card'}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
                {selectedPlan === 'signature'
                  ? 'Official SERA sleek signature card design featuring the official SERA logo. Delivered ready to tap with your 100% custom digital profile, contact exchange, and payments.'
                  : 'Printed with your own company logo, custom branding, colors, and typography on both card faces, linked to your custom digital profile.'}
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {selectedPlan === 'signature' ? (
                  <>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      Official SERA logo card print
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      100% custom sub-page ([slug].seranex.lk)
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      One-tap vCard address book save
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      Two-way client lead exchange form
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      LankaQR & direct bank payment links
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      Laser dynamic backup QR code
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      Your own company logo & custom print on card
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      Custom typography & brand colors
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      Dedicated sub-page ([slug].seranex.lk)
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      Two-way client lead capture inbox
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      LankaQR payment & review booster
                    </li>
                    <li className="flex gap-2.5 text-xs sm:text-sm text-white/70">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      Priority design proof before printing
                    </li>
                  </>
                )}
              </ul>

              <div className="mt-7 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-white/50">
                <span className="font-semibold text-white/70">Note:</span> Standard durable PVC printing is
                provided. Special materials (metal, wood, matte carbon) can be arranged on custom enterprise
                request.
              </div>
            </div>

            {/* Right Column: Pricing & Checkout Actions */}
            <div className="flex flex-col justify-between gap-8 border-t border-white/[0.07] bg-white/[0.02] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-medium text-white/45">LKR</span>
                  <span className="text-5xl font-bold tracking-tightest text-white font-mono">
                    {activePrice.toLocaleString('en-US')}
                  </span>
                  <span className="text-lg text-white/35 line-through font-mono">
                    LKR {originalPrice.toLocaleString('en-US')}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-accent-400">
                  <TruckIcon className="h-4 w-4" />
                  Island-wide delivery available (LKR 350)
                </p>

                <dl className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Edition</dt>
                    <dd className="font-semibold text-white">
                      {selectedPlan === 'signature' ? 'SERA Signature PVC' : 'Full Custom Print PVC'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Card Branding</dt>
                    <dd className="text-white">
                      {selectedPlan === 'signature' ? 'Official SERA Logo' : 'Client Custom Artwork'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Digital Profile</dt>
                    <dd className="text-emerald-400 font-mono text-xs">
                      100% Customized (yourname.{brand.domain})
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/40">Chip Latency</dt>
                    <dd className="text-white">NTAG215 (0.2s instant tap)</dd>
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
                  Instant design proof & delivery tracking via WhatsApp.
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
        initialConfig={{
          ...config,
          materialId: selectedPlan === 'signature' ? 'matte' : 'custom',
        }}
      />
    </section>
  );
}

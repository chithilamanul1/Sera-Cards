'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon,
  RotateCcwIcon,
  CheckIcon,
  MessageSquareIcon,
  RadioIcon,
  FileTextIcon,
  AwardIcon,
  DropletIcon,
  LayersIcon,
  ZapIcon,
  ArrowRightIcon,
  XIcon,
  ExternalLinkIcon,
} from 'lucide-react';
import { CARD_PRODUCTS, PRODUCT_RANGES, CardProduct } from '@/data/products';
import { brand } from '@/data/content';

const valuePillars = [
  {
    icon: ShieldCheckIcon,
    title: '1-Year Full Warranty',
    body: 'If your card develops any manufacturing defect, we will replace it with a brand new card 100% free of charge.',
    tag: 'Guaranteed',
  },
  {
    icon: AwardIcon,
    title: 'Zero Monthly Fees',
    body: 'One-time hardware purchase. You never pay monthly or annual hosting fees for your digital profile.',
    tag: 'No Subscriptions',
  },
  {
    icon: DropletIcon,
    title: '100% Water Resistant',
    body: 'Engineered with IP68 rated composites and sealed NFC circuitry. Completely washable and weatherproof.',
    tag: 'IP68 Certified',
  },
  {
    icon: TruckIcon,
    title: 'Free Island-Wide Delivery',
    body: 'Tracked express courier delivery across all 25 districts in Sri Lanka in 2 to 4 business days.',
    tag: 'Free Shipping',
  },
  {
    icon: LayersIcon,
    title: 'Dynamic Cloud Profile',
    body: 'Update your phone, email, designation, or company brochure anytime via your portal without reprinting.',
    tag: 'Instant Updates',
  },
  {
    icon: ZapIcon,
    title: '0.2s Ultra-Fast Response',
    body: 'Equipped with genuine NXP NTAG215 microchips for instantaneous tap response on iOS and Android.',
    tag: 'NXP Certified',
  },
];

const unboxingItems = [
  {
    num: '01',
    title: 'Custom NFC Smart Business Card',
    detail: 'Engineered in your chosen finish with embedded NXP NTAG215 microchip.',
  },
  {
    num: '02',
    title: 'Matte Protective Velvet Sleeve',
    detail: 'Luxury anti-scratch sleeve for protection in wallets and briefcases.',
  },
  {
    num: '03',
    title: 'Instant Tap Setup & Activation Guide',
    detail: 'Step-by-step instructions to configure your profile in under 60 seconds.',
  },
  {
    num: '04',
    title: '1-Year Warranty & Authenticity Seal',
    detail: 'Official serial verification certificate with priority WhatsApp support.',
  },
];

export function ProductRangeCatalog() {
  const [selectedRange, setSelectedRange] = useState<string>('all');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [activeSpecProduct, setActiveSpecProduct] = useState<CardProduct | null>(null);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts =
    selectedRange === 'all'
      ? CARD_PRODUCTS
      : CARD_PRODUCTS.filter((p) => p.rangeId === selectedRange);

  const buildWhatsappOrderLink = (product: CardProduct) => {
    const text = [
      `Hi Sera Cards — I would like to order the following card:`,
      ``,
      `*Product:* ${product.name}`,
      `*Range:* ${product.rangeName}`,
      `*Finish:* ${product.surfaceType}`,
      `*Price:* LKR ${product.priceLkr.toLocaleString()} (Free Island-Wide Delivery)`,
      ``,
      `Please guide me with the design & delivery details.`,
    ].join('\n');
    return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="products" className="relative border-t border-white/[0.07] bg-ink-950 py-20 lg:py-28">
      {/* Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-accent-500/[0.07] blur-[160px]"
      />

      <div className="relative mx-auto max-w-content px-5 sm:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-400">
            <RadioIcon className="h-3.5 w-3.5" />
            Engineered Hardware Collection
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tightest text-white sm:text-4xl lg:text-5xl">
            3 Product Ranges. <br className="hidden sm:block" />
            <span className="text-accent-400">10 Masterpiece Cards.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Choose from stealth matte PVC composites, surgical-grade stainless steel, and 24K electroplated mirror gold. All cards feature genuine NXP NTAG215 microchips, laser-etched dynamic QR codes, and 100% waterproof construction.
          </p>
        </div>

        {/* Range Filter Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {PRODUCT_RANGES.map((r) => {
            const isActive = selectedRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRange(r.id)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  isActive
                    ? 'bg-accent-500 text-ink-950 shadow-[0_0_30px_-5px_rgba(168,85,247,0.8)]'
                    : 'border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                {r.name}
              </button>
            );
          })}
        </div>

        {/* 10 Products Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const isFlipped = !!flippedCards[product.id];
            const design = product.cardDesign;

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-ink-900/60 p-6 shadow-xl transition-all hover:border-accent-500/40 hover:bg-ink-900/80"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                      {product.rangeName}
                    </span>
                    <span className="rounded-full bg-accent-500/10 px-3 py-1 text-[11px] font-bold text-accent-300 border border-accent-500/20">
                      {product.badge}
                    </span>
                  </div>

                  {/* ─── REAL PHYSICAL CARD VISUAL MOCKUP (Front / Back Flip) ─── */}
                  <div className="relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                    <div
                      className="absolute inset-0 p-5 flex flex-col justify-between select-none transition-transform duration-500"
                      style={{
                        backgroundColor: design.backgroundColor,
                        backgroundImage: design.backgroundImage,
                        color: design.textColor,
                        boxShadow: `inset 0 0 0 1px ${design.edgeBorder}`,
                      }}
                    >
                      {/* Subtle Specular Sheen */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent"
                      />

                      {!isFlipped ? (
                        /* ── CARD FRONT ── */
                        <>
                          <div className="flex items-center justify-between relative z-10">
                            <span className="text-[9px] font-mono tracking-widest uppercase opacity-60">
                              {product.specs.chipset.split(' ')[0]}
                            </span>
                            {/* Contactless Wave Icon */}
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5 opacity-80"
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

                          {/* Center Brand / Typography */}
                          <div className="flex-1 flex flex-col items-center justify-center text-center px-3 relative z-10">
                            {design.hasLogo ? (
                              <div className="space-y-1">
                                <span className="text-xl sm:text-2xl font-black tracking-tightest uppercase block">
                                  SERA
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.25em] block opacity-70">
                                  SMART CARD
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="text-lg sm:text-xl font-bold tracking-tight uppercase block leading-tight">
                                  CHITHILA MANUL
                                </span>
                                <span className="text-[9px] uppercase tracking-widest block opacity-75">
                                  FOUNDER & CEO
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest opacity-60 relative z-10">
                            <span>SERANEX.LK</span>
                            <span>{product.surfaceType}</span>
                          </div>
                        </>
                      ) : (
                        /* ── CARD BACK (DYNAMIC QR + CREDENTIALS) ── */
                        <>
                          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider opacity-70 relative z-10">
                            <span className="font-bold">BACK VIEW</span>
                            <span>DYNAMIC QR</span>
                          </div>

                          <div className="flex items-center justify-between gap-3 relative z-10 my-auto">
                            {/* Realistic Dynamic QR Mock */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1.5 rounded-lg shadow-md shrink-0 flex items-center justify-center">
                              <div className="w-full h-full bg-slate-900 rounded p-1 flex flex-col justify-between">
                                <div className="flex justify-between">
                                  <div className="w-2.5 h-2.5 bg-white rounded-xs" />
                                  <div className="w-2.5 h-2.5 bg-white rounded-xs" />
                                </div>
                                <div className="text-[7px] text-white font-mono text-center font-bold">
                                  SERA
                                </div>
                                <div className="flex justify-between">
                                  <div className="w-2.5 h-2.5 bg-white rounded-xs" />
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                </div>
                              </div>
                            </div>

                            {/* Details List */}
                            <div className="text-right text-[9px] leading-tight space-y-1 opacity-80 min-w-0">
                              <p className="font-bold truncate text-[10px]">CHITHILA MANUL</p>
                              <p className="opacity-75 truncate">072 838 2638</p>
                              <p className="opacity-75 truncate">hello@seranex.lk</p>
                              <p className="font-mono text-purple-300 truncate">chithila.seranex.lk</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[8px] font-mono opacity-50 relative z-10">
                            <span>SCAN WITH CAMERA</span>
                            <span>IP68 WATERPROOF</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Flip Front / Back Toggle Button */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleFlip(product.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition"
                    >
                      <RotateCcw className="h-3 w-3" />
                      {isFlipped ? 'Show Front Face' : 'Show Back Face (QR)'}
                    </button>
                    <span className="text-[11px] font-mono text-white/40">
                      {product.weightGrams}g Weight
                    </span>
                  </div>

                  {/* Product Title & Price */}
                  <div className="mt-5">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <p className="text-xs text-white/50 mt-1">{product.tagline}</p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-white/40">LKR</span>
                      <span className="text-3xl font-extrabold text-white">
                        {product.priceLkr.toLocaleString()}
                      </span>
                      <span className="text-xs text-accent-400 font-semibold">● Free Delivery</span>
                    </div>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="mt-5 space-y-2 border-t border-white/[0.08] pt-4 text-xs text-white/65">
                    {product.bullets.slice(0, 4).map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckIcon className="h-3.5 w-3.5 text-accent-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Actions */}
                <div className="mt-6 space-y-2.5">
                  <a
                    href={buildWhatsappOrderLink(product)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-3 text-xs font-bold text-ink-950 shadow-[0_0_30px_-8px_rgba(168,85,247,0.8)] hover:bg-accent-400 transition active:scale-[0.98]"
                  >
                    <MessageSquareIcon className="h-3.5 w-3.5" />
                    Order via WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={() => setActiveSpecProduct(product)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.03] py-2.5 text-xs font-semibold text-white hover:bg-white/[0.08] transition"
                  >
                    <FileTextIcon className="h-3.5 w-3.5 text-accent-400" />
                    View Technical Specifications
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── 6 CORE VALUE PILLARS (Luviroyal Benchmark) ─── */}
        <div className="mt-24 border-t border-white/[0.08] pt-16">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-400">
              The Sera Standard
            </span>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Why Sri Lankan Professionals Choose Sera Cards
            </h3>
            <p className="mt-2 text-sm text-white/50">
              Zero monthly fees, bulletproof water resistance, and free island-wide replacement warranty.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {valuePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-ink-900/50 p-6 hover:border-white/20 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center">
                    <pillar.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-300 bg-accent-500/10 px-2.5 py-0.5 rounded-full border border-accent-500/20">
                    {pillar.tag}
                  </span>
                </div>
                <h4 className="mt-4 text-base font-bold text-white">{pillar.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── WHAT'S IN THE BOX UNBOXING BREAKDOWN ─── */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-r from-ink-900/90 via-ink-950 to-ink-900/90 p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-400">
                Premium Unboxing Experience
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                What's In Your Sera Card Package
              </h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                Every order is meticulously inspected, encoded, and packaged in a luxury matte presentation box before dispatch via tracked island-wide delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:max-w-xl">
              {unboxingItems.map((item) => (
                <div key={item.title} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  <span className="font-mono text-sm font-bold text-accent-400">{item.num}</span>
                  <h4 className="text-xs font-bold text-white mt-1">{item.title}</h4>
                  <p className="text-[11px] text-white/50 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── FULL TECHNICAL SPECIFICATIONS MODAL ─── */}
      <AnimatePresence>
        {activeSpecProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-ink-900 p-6 sm:p-8 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveSpecProduct(null)}
                className="absolute top-5 right-5 text-white/50 hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </button>

              <span className="text-xs font-bold uppercase tracking-wider text-accent-400">
                {activeSpecProduct.rangeName}
              </span>
              <h3 className="text-2xl font-bold mt-1">{activeSpecProduct.name}</h3>
              <p className="text-xs text-white/50 mt-1">{activeSpecProduct.description}</p>

              {/* Spec Table */}
              <div className="mt-6 divide-y divide-white/[0.08] text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40">Material Composition</span>
                  <span className="font-semibold">{activeSpecProduct.materialComposition}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40">Dimensions</span>
                  <span className="font-semibold">{activeSpecProduct.specs.dimensions}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40">Thickness & Weight</span>
                  <span className="font-semibold">{activeSpecProduct.specs.thickness} ({activeSpecProduct.specs.weight})</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40">Microchip</span>
                  <span className="font-semibold text-accent-300">{activeSpecProduct.specs.chipset}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40">Read Range</span>
                  <span className="font-semibold">{activeSpecProduct.specs.readDistance}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40">Water Resistance</span>
                  <span className="font-semibold text-emerald-400">{activeSpecProduct.specs.waterproof}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40">Warranty</span>
                  <span className="font-semibold text-emerald-400">{activeSpecProduct.specs.warranty}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-white/40">Monthly / Yearly Fees</span>
                  <span className="font-semibold text-accent-400">{activeSpecProduct.specs.monthlyFee}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={buildWhatsappOrderLink(activeSpecProduct)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent-500 py-3 text-xs font-bold text-ink-950 hover:bg-accent-400 transition"
                >
                  <MessageSquareIcon className="h-4 w-4" />
                  Order via WhatsApp (LKR {activeSpecProduct.priceLkr.toLocaleString()})
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Icon helper
function RotateCcw(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

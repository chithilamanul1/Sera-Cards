'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  TruckIcon,
  AwardIcon,
  DropletIcon,
  LayersIcon,
  ZapIcon,
  CheckIcon,
  XIcon,
  MessageSquareIcon,
  SparklesIcon,
  StarIcon,
} from 'lucide-react';
import { CARD_PRODUCTS, PRODUCT_RANGES, CardProduct } from '@/data/products';
import { brand } from '@/data/content';
import { StackedCardMockup } from './StackedCardMockup';
import { MintpayBadge } from './MintpayBadge';
import { MintpayModal } from './MintpayModal';
import { OrderModal } from './OrderModal';
import { useCardConfig } from '@/hooks/useCardConfig';

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

export function ProductRangeCatalog() {
  const cardApi = useCardConfig();
  const [selectedRange, setSelectedRange] = useState<string>('all');
  const [activeSpecProduct, setActiveSpecProduct] = useState<CardProduct | null>(null);
  const [mintpayModalProduct, setMintpayModalProduct] = useState<CardProduct | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderProduct, setSelectedOrderProduct] = useState<CardProduct | null>(null);

  const filteredProducts =
    selectedRange === 'all'
      ? CARD_PRODUCTS
      : CARD_PRODUCTS.filter((p) => p.rangeId === selectedRange);

  const handlePlaceOrder = (product: CardProduct) => {
    setSelectedOrderProduct(product);
    if (product.materialId) {
      cardApi.setMaterial(product.materialId);
    }
    setIsOrderModalOpen(true);
  };

  const buildWhatsappLink = (product: CardProduct) => {
    if (product.isCustomQuote || !product.priceLkr) {
      const text = [
        `Hi Sera Cards — I would like to inquire about a custom 24K Gold Card:`,
        ``,
        `*Product:* ${product.name}`,
        `*Finish:* ${product.surfaceType}`,
        `*Material:* ${product.materialComposition}`,
        ``,
        `Please share bespoke quotation details and design options.`,
      ].join('\n');
      return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;
    }

    const installment = (product.priceLkr / 3).toFixed(2);
    const text = [
      `Hi Sera Cards — I would like to order the following card:`,
      ``,
      `*Product:* ${product.name}`,
      `*Material:* ${product.materialType}`,
      `*Design Type:* ${product.designType}`,
      `*Price:* LKR ${product.priceLkr.toLocaleString()} (or 3 x LKR ${installment} with Mintpay)`,
      ``,
      `Please guide me with the design & delivery details.`,
    ].join('\n');
    return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="products" className="relative border-t border-white/[0.07] bg-black py-20 lg:py-28">
      {/* Background Radial Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-purple-500/[0.06] blur-[160px]"
      />

      <div className="relative mx-auto max-w-content px-5 sm:px-8">
        {/* ─── SECTION TITLE (Matching user screenshot) ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Pick the card that matches your style and business.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/50 max-w-xl mx-auto">
            High-speed NFC smart business cards engineered for modern Sri Lankan professionals. Zero monthly subscriptions and free island-wide delivery.
          </p>
        </div>

        {/* Range Filter Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {PRODUCT_RANGES.map((r) => {
            const isActive = selectedRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRange(r.id)}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                {r.name}
              </button>
            );
          })}
        </div>

        {/* ─── PRODUCTS GRID (Exact 2-Column Card Layout) ─── */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
          {filteredProducts.map((product) => {
            const isBestSeller = !!product.isBestSeller;
            const isGold = !!product.isCustomQuote || product.id.includes('gold');

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className={`group relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all overflow-hidden ${
                  isGold
                    ? 'border border-amber-500/40 bg-gradient-to-b from-amber-950/25 via-[#12141a] to-[#12141a] shadow-[0_0_60px_-25px_rgba(245,158,11,0.35)]'
                    : isBestSeller
                    ? 'border border-purple-500/35 bg-gradient-to-b from-purple-950/20 via-[#12141a] to-[#12141a] shadow-[0_0_60px_-25px_rgba(168,85,247,0.3)]'
                    : 'border border-white/10 bg-[#12141a] hover:border-white/20 hover:bg-[#151720]'
                }`}
              >
                {/* Gold / Ribbon Badge */}
                {product.badge && (
                  <div className="absolute top-0 left-0">
                    <div
                      className={`relative flex items-center gap-1 px-4 py-1.5 rounded-br-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-black shadow-lg ${
                        isGold || isBestSeller
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : 'bg-gradient-to-r from-zinc-200 to-zinc-300'
                      }`}
                    >
                      <StarIcon className="h-3 w-3 fill-black text-black" />
                      {product.badge}
                    </div>
                  </div>
                )}

                <div>
                  {/* Card Header: Title & Subtitle */}
                  <div className="text-center pt-2">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-white/50 font-medium">
                      {product.subtitle || 'Smart Business Card'}
                    </p>
                  </div>

                  {/* ─── 3D STACKED FLOATING CARD MOCKUP WITH IMAGES ─── */}
                  <div className="my-2">
                    <StackedCardMockup product={product} />
                  </div>

                  {/* Price Section */}
                  <div className="text-center space-y-1.5 mt-2 min-h-[58px] flex flex-col items-center justify-center">
                    {product.isCustomQuote || !product.priceLkr ? (
                      /* Custom Gold Card — WITHOUT FIXED PRICE */
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 text-sm sm:text-base font-extrabold text-amber-400">
                          <SparklesIcon className="h-4 w-4 text-amber-400" />
                          <span>{product.priceDisplay || 'Price on Request'}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-amber-200/60 font-medium">
                          Bespoke 24K Gold · Custom Quote on WhatsApp
                        </p>
                      </div>
                    ) : (
                      /* Fixed Price Cards */
                      <>
                        <div className="flex items-center justify-center gap-2.5">
                          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            LKR {product.priceLkr.toLocaleString()}
                          </span>

                          {product.originalPriceLkr && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs sm:text-sm text-red-400/80 line-through">
                                LKR {product.originalPriceLkr.toLocaleString()}
                              </span>
                              <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                                -{product.discountPercent}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Mintpay BNPL Installment Display */}
                        <div className="flex justify-center">
                          <MintpayBadge
                            price={product.priceLkr}
                            onInfoClick={() => setMintpayModalProduct(product)}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Feature Bullets (Matching screenshot) */}
                  <div className="mt-6 space-y-2 border-t border-white/[0.07] pt-5 text-center text-xs sm:text-sm text-white/70">
                    <p className="flex items-center justify-center gap-2">
                      <CheckIcon className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{product.designType}</span>
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <CheckIcon className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{product.materialType}</span>
                    </p>
                  </div>
                </div>

                {/* ─── ACTION BUTTONS ─── */}
                <div className="mt-7 space-y-2.5">
                  {product.isCustomQuote || !product.priceLkr ? (
                    /* Bespoke Inquire Button for Custom Gold */
                    <a
                      href={buildWhatsappLink(product)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 py-3.5 text-sm sm:text-base font-extrabold text-black hover:brightness-105 transition active:scale-[0.98] shadow-lg shadow-amber-500/25"
                    >
                      <MessageSquareIcon className="h-4 w-4" />
                      Inquire via WhatsApp
                    </a>
                  ) : (
                    /* Primary High-Contrast "Place Order" button from screenshot */
                    <button
                      type="button"
                      onClick={() => handlePlaceOrder(product)}
                      className="w-full rounded-2xl bg-white py-3.5 text-sm sm:text-base font-bold text-black hover:bg-zinc-200 transition active:scale-[0.98] shadow-md shadow-white/10"
                    >
                      Place Order
                    </button>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-white/40 px-1">
                    <button
                      type="button"
                      onClick={() => setActiveSpecProduct(product)}
                      className="hover:text-white transition underline underline-offset-4"
                    >
                      Technical Specs
                    </button>
                    <a
                      href={buildWhatsappLink(product)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition"
                    >
                      <MessageSquareIcon className="h-3 w-3" />
                      {product.isCustomQuote ? 'Inquire on WhatsApp' : 'Order via WhatsApp'}
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── 6 CORE TRUST PILLARS ─── */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Executive Guarantee
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Why Sri Lankan Leaders Choose Sera Cards
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {valuePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#12141a] p-6 hover:border-white/20 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                      <pillar.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 rounded-full border border-purple-500/30 px-2.5 py-0.5">
                      {pillar.tag}
                    </span>
                  </div>
                  <h4 className="mt-4 text-base font-bold text-white">{pillar.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">{pillar.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TECH SPECS MODAL ─── */}
      <AnimatePresence>
        {activeSpecProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#111317] p-6 sm:p-8 text-white">
              <button
                type="button"
                onClick={() => setActiveSpecProduct(null)}
                className="absolute top-5 right-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-bold text-white">{activeSpecProduct.name}</h3>
              <p className="text-xs text-white/50 mt-1">{activeSpecProduct.surfaceType} · Technical Specs</p>

              <dl className="mt-6 divide-y divide-white/10 text-xs">
                {Object.entries(activeSpecProduct.specs).map(([k, v]) => (
                  <div key={k} className="py-2.5 flex justify-between gap-4">
                    <dt className="text-white/50 uppercase tracking-wider text-[10px]">{k}</dt>
                    <dd className="font-semibold text-white text-right">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6">
                {activeSpecProduct.isCustomQuote ? (
                  <a
                    href={buildWhatsappLink(activeSpecProduct)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-sm font-bold text-black hover:brightness-105 transition"
                  >
                    <MessageSquareIcon className="h-4 w-4" />
                    Inquire on WhatsApp for {activeSpecProduct.name}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const p = activeSpecProduct;
                      setActiveSpecProduct(null);
                      handlePlaceOrder(p);
                    }}
                    className="w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-zinc-200 transition"
                  >
                    Place Order for {activeSpecProduct.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MINTPAY INFO MODAL ─── */}
      <MintpayModal
        isOpen={!!mintpayModalProduct}
        onClose={() => setMintpayModalProduct(null)}
        productPrice={mintpayModalProduct?.priceLkr}
        productName={mintpayModalProduct?.name}
      />

      {/* ─── ORDER MODAL ─── */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialConfig={{
          ...cardApi.config,
          business: selectedOrderProduct?.name || cardApi.config.business,
          materialId: selectedOrderProduct?.materialId || cardApi.config.materialId,
        }}
        preselectedProduct={
          selectedOrderProduct
            ? {
                name: selectedOrderProduct.name,
                price: selectedOrderProduct.priceLkr,
                finish: selectedOrderProduct.surfaceType,
                isCustomQuote: selectedOrderProduct.isCustomQuote,
              }
            : undefined
        }
      />
    </section>
  );
}

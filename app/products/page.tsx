'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ProductRangeCatalog } from '@/components/ProductRangeCatalog';
import { SparklesIcon, ShieldCheckIcon, RadioIcon, TruckIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased selection:bg-accent-500 selection:text-ink-950">
      <Nav />
      <main className="pt-24">
        {/* Hero Banner */}
        <section className="relative overflow-hidden py-16 lg:py-24 border-b border-white/[0.07]">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent-500/[0.08] blur-[140px]"
          />
          <div className="relative mx-auto max-w-content px-5 sm:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold text-accent-400 mb-6"
            >
              <SparklesIcon className="h-3.5 w-3.5" />
              Official Hardware Catalog
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tightest text-white">
              Engineered NFC Cards. <br />
              <span className="text-accent-400">Crafted For Impact.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Explore our full collection across Matte PVC, Surgical 304 Stainless Steel, and 24K Electroplated Gold. Zero monthly subscriptions and free island-wide delivery.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-white/50">
              <span className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-accent-400" />
                1-Year Free Replacement Guarantee
              </span>
              <span className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-accent-400" />
                Free Island-Wide Tracked Delivery
              </span>
              <span className="flex items-center gap-2">
                <RadioIcon className="h-4 w-4 text-accent-400" />
                NXP NTAG215 High-Speed Chips
              </span>
            </div>
          </div>
        </section>

        {/* Full Interactive Product Catalog */}
        <ProductRangeCatalog />
      </main>
      <Footer />
    </div>
  );
}

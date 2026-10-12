'use client';

import React from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ShieldAlertIcon, CheckCircle2Icon, AlertTriangleIcon, HelpCircleIcon, ArrowLeftIcon, FileTextIcon } from 'lucide-react';
import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased selection:bg-purple-500 selection:text-white">
      <Nav />
      <main className="pt-24 pb-20">
        {/* Header */}
        <section className="relative overflow-hidden py-14 lg:py-20 border-b border-white/[0.07]">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-purple-500/[0.07] blur-[140px]"
          />
          <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition mb-6"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300 mb-4">
              <FileTextIcon className="h-3.5 w-3.5" />
              Official Policy Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Refund, Return &amp; Replacement Policy
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl">
              Thank you for choosing Sera Cards (operated by Seranex Pvt Ltd). We value your satisfaction and strive to provide the finest NFC smart networking hardware and software in Sri Lanka.
            </p>
            <p className="mt-2 text-xs text-white/40 font-mono">
              Last Updated: October 2026 · Applies to all online, corporate, and WhatsApp purchases.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-5 sm:px-8 space-y-10 text-sm sm:text-base text-white/80 leading-relaxed">
            {/* Critical Policy Highlights Callout Boxes */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <ShieldAlertIcon className="h-4 w-4" />
                  1-Year Replacement: 10+ Units Only
                </div>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Our 1-Year Free Hardware Replacement Policy applies exclusively to bulk, fleet, and corporate orders of <strong>ten (10) pieces or more</strong>. Orders below 10 pieces include a 48-hour delivery inspection guarantee.
                </p>
              </div>

              <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.06] p-5 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <AlertTriangleIcon className="h-4 w-4" />
                  Physical Print Damage Disclaimer
                </div>
                <p className="text-xs text-red-200/80 leading-relaxed">
                  <strong>Physical damage to the print, finish, or coating is NOT our fault and is not covered.</strong> Scratching, abrasive friction, key wear, drops, or chemical exposure after delivery are strictly excluded from warranty claims.
                </p>
              </div>
            </div>

            {/* 1. Personalized & Custom-Printed Items */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">1.</span> Personalized &amp; Custom-Made Products
              </h2>
              <p>
                Every Sera NFC card is a bespoke product custom-manufactured and printed with your specific personal name, designation, business wordmark, custom artwork, and laser-etched dynamic QR code.
              </p>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs sm:text-sm text-white/70 space-y-2">
                <p>
                  <strong>Non-Returnable Nature:</strong> Because these items are personalized to your individual identity, they are strictly non-returnable and non-refundable once production or printing has begun.
                </p>
                <p>
                  We encourage all customers to double-check spelling, designations, phone numbers, and design proofs prior to placing their order or approving the digital mockup.
                </p>
              </div>
            </div>

            {/* 2. 1-Year Hardware Replacement Policy */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">2.</span> 1-Year Replacement Warranty (Minimum 10 Pieces)
              </h2>
              <p>
                We stand firmly behind the semiconductor quality of our genuine NXP NTAG215 microchips. Our warranty terms are structured as follows:
              </p>
              <ul className="space-y-2.5 list-disc pl-5 text-sm text-white/70">
                <li>
                  <strong className="text-white">Orders of 10 or More Units (Bulk / Corporate):</strong> Eligible for our <strong>1-Year Hardware Replacement Policy</strong> covering internal electronic NFC transmission failure under normal professional usage. If an eligible card stops transmitting due to internal antenna or silicon chip malfunction within 12 months, we will manufacture and dispatch a brand-new replacement card free of charge.
                </li>
                <li>
                  <strong className="text-white">Orders of 1 to 9 Units (Individual Purchases):</strong> Covered by a <strong>48-Hour Dead-On-Arrival (DOA) Guarantee</strong> upon receipt. If the NFC chip fails to scan immediately out of the box on compatible smartphones, notify us within 48 hours for an instant replacement.
                </li>
              </ul>
            </div>

            {/* 3. Physical Print & Wear-and-Tear Exclusions */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">3.</span> What Is NOT Covered (Print &amp; Surface Damages)
              </h2>
              <p>
                Please note that physical damage to the exterior print and card body is <strong>not our fault</strong> and will void any replacement claims. The warranty does <strong>NOT</strong> cover:
              </p>
              <div className="grid gap-2 sm:grid-cols-2 text-xs sm:text-sm text-white/70">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                  <p className="font-semibold text-white">Surface Abrasions &amp; Scratches</p>
                  <p className="text-xs text-white/50">Scratches, gouges, or color rub-off caused by friction with metal keys, coins, zippers, or rough wallets.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                  <p className="font-semibold text-white">Chemical &amp; Solvent Exposure</p>
                  <p className="text-xs text-white/50">Discoloration, smudging, or peeling resulting from contact with hand sanitizers, perfumes, alcohol, acetone, or abrasive cleaning agents.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                  <p className="font-semibold text-white">Structural &amp; Impact Damage</p>
                  <p className="text-xs text-white/50">Cracked cards, heavy bending beyond elastic tolerances, snapped metallic edges, or punctures.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                  <p className="font-semibold text-white">Thermal &amp; Environmental Abuse</p>
                  <p className="text-xs text-white/50">Warpage or antenna failure caused by leaving the card on vehicle dashboards exposed to extreme tropical direct sunlight.</p>
                </div>
              </div>
            </div>

            {/* 4. Damaged or Defective Items on Arrival */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">4.</span> Damaged or Defective on Delivery (48-Hour Window)
              </h2>
              <p>
                In the rare event that your package arrives visibly damaged in transit or the card does not scan upon initial unboxing:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-sm text-white/70">
                <li>Contact our customer support team within <strong>48 hours</strong> of courier delivery.</li>
                <li>Provide your Order ID, recipient phone number, and a short 10-second video demonstrating the card being tapped against an NFC-enabled smartphone (ensuring phone NFC is turned on).</li>
                <li>Once our technical team verifies the defect, we will immediately fast-track a free reprint and courier it to your address.</li>
              </ol>
            </div>

            {/* 5. Returns & Return Shipping */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">5.</span> Return Shipping Responsibilities
              </h2>
              <p>
                If a physical inspection is required for a disputed warranty claim:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/70">
                <li>
                  You will be responsible for sending the card back to our Seeduwa facility using a tracked domestic courier service.
                </li>
                <li>
                  If the defect is verified as a legitimate internal manufacturing or factory silicon failure, we will reimburse standard return courier charges or include credit toward future card orders.
                </li>
              </ul>
            </div>

            {/* 6. Processing Time & Refunds */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">6.</span> Processing Time &amp; Refunds
              </h2>
              <p>
                If an order is cancelled <em>before printing or manufacturing commences</em>, or if a refund is approved by our management in an exceptional circumstance:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/70">
                <li>
                  Refunds will be processed back to the original method of payment (bank transfer, PayHere card reversal, or Mintpay reversal) within <strong>5 to 7 business days</strong>.
                </li>
                <li>
                  Bank processing times may take an additional 2 to 4 business days depending on your financial institution in Sri Lanka.
                </li>
                <li>
                  Any courier fees already incurred prior to cancellation cannot be refunded.
                </li>
              </ul>
            </div>

            {/* 7. Contact Us */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircleIcon className="h-5 w-5 text-purple-400" />
                Need Assistance With a Warranty or Order?
              </h2>
              <p className="text-sm text-white/60">
                If you have any questions regarding your order status, NFC troubleshooting, or warranty claims, please contact our Sri Lankan support desk:
              </p>
              <div className="grid gap-2 sm:grid-cols-3 pt-2 text-xs">
                <div>
                  <p className="text-white/40 uppercase tracking-wider font-semibold">WhatsApp &amp; Hotline</p>
                  <p className="font-bold text-white mt-0.5">+94 72 838 2638</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase tracking-wider font-semibold">Official Email</p>
                  <p className="font-bold text-white mt-0.5">info@seranex.lk</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase tracking-wider font-semibold">Operations Office</p>
                  <p className="font-bold text-white mt-0.5">No. 20 A Amuna Rd, Seeduwa</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

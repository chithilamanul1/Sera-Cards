'use client';

import React from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ShieldCheckIcon, AlertTriangleIcon, ScaleIcon, ArrowLeftIcon, FileTextIcon, HelpCircleIcon } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
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
              Official Terms of Service
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Terms &amp; Conditions
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl">
              Welcome to Sera Cards. These Terms and Conditions govern your access to our website (seranex.lk), purchase of physical NFC smart business cards, and use of our digital networking software services.
            </p>
            <p className="mt-2 text-xs text-white/40 font-mono">
              Last Updated: October 2026 · Governing Entity: Seranex (Pvt) Ltd.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-5 sm:px-8 space-y-10 text-sm sm:text-base text-white/80 leading-relaxed">
            {/* Highlighted Terms Box */}
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/[0.06] p-6 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-base">
                <ScaleIcon className="h-5 w-5" />
                Key Purchase &amp; Warranty Terms at a Glance
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-white/70 list-disc pl-5">
                <li>
                  <strong>1-Year Replacement Warranty:</strong> Exclusively available on orders of <strong>ten (10) cards or more</strong> for internal NFC silicon chip defects. Orders of 1–9 cards include a 48-hour delivery inspection guarantee.
                </li>
                <li>
                  <strong>Print &amp; Exterior Damage Disclaimer:</strong> Physical damage, surface scratches, key abrasion, dropping, or chemical solvent damage to the print is <strong>not our fault and not covered under warranty</strong>.
                </li>
                <li>
                  <strong>Personalized &amp; Custom Artwork:</strong> Custom-printed cards with user names, logos, or artwork cannot be returned or refunded once printing begins.
                </li>
              </ul>
            </div>

            {/* 1. Use of the Website & Platform */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">1.</span> Use of the Website &amp; Services
              </h2>
              <p>
                By accessing this website, creating an account, or ordering products, you agree to comply with these Terms:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/70">
                <li>You must be at least 18 years of age or possess legal parental/guardian consent.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials and passwords.</li>
                <li>You agree to provide true, accurate, and current information during registration, card customization, and checkout.</li>
                <li>You may not use our cards, web profiles, or QR codes for unlawful, deceptive, impersonation, phishing, or malicious activities. We reserve the right to freeze profiles violating this term without notice.</li>
              </ul>
            </div>

            {/* 2. Custom Printing, Artwork & Proofs */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">2.</span> Custom Printing &amp; Artwork Proofs
              </h2>
              <p>
                For custom-printed cards (Full Custom Brand Cards, Corporate Fleet Cards, and Executive Laser Cards):
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/70">
                <li>
                  <strong>Client Responsibility:</strong> Customers are solely responsible for ensuring the correctness of names, designations, phone numbers, spelling, and logo resolution submitted.
                </li>
                <li>
                  <strong>Color Calibration:</strong> While we use industrial high-definition UV laser printing, minor optical color variances between digital RGB screen previews and physical CMYK/UV matte prints are standard in industrial printing and do not constitute a defect.
                </li>
                <li>
                  <strong>Intellectual Property of Uploaded Assets:</strong> You warrant that you own or possess valid licensing rights to all logos, trademarks, and artwork uploaded for card printing.
                </li>
              </ul>
            </div>

            {/* 3. Product Pricing & Payments */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">3.</span> Product Pricing &amp; Payment Methods
              </h2>
              <p>
                All prices on this website are listed in Sri Lankan Rupees (LKR).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/70">
                <li>
                  <strong>Accepted Payment Channels:</strong> We accept online credit/debit cards via PayHere, Mintpay (3 interest-free installments), direct bank transfer, and verified LankaQR.
                </li>
                <li>
                  <strong>Payment Authorization:</strong> You authorize us to charge your selected payment method for the total amount, including applicable taxes or custom design fees.
                </li>
                <li>
                  <strong>Price Adjustments:</strong> Prices are subject to promotional updates. Quotations for bespoke 24K Gold or large corporate fleets (50+ cards) remain valid for 14 days from issuance.
                </li>
              </ul>
            </div>

            {/* 4. Shipping & Delivery */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">4.</span> Shipping &amp; Island-Wide Delivery
              </h2>
              <p>
                We deliver across all 25 districts of Sri Lanka via tracked courier services:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/70">
                <li>Standard card orders typically dispatch within <strong>2 to 4 business days</strong> following artwork confirmation.</li>
                <li>Delivery timeframes are reasonable estimates and may be subject to minor delays during extreme weather or domestic courier service disruptions.</li>
                <li>Delivery is provided free of charge across Sri Lanka as advertised on standard retail card orders.</li>
              </ul>
            </div>

            {/* 5. Returns, Refunds & Warranty Restrictions */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">5.</span> Returns, Refunds &amp; Warranty Policy
              </h2>
              <p>
                Please review our dedicated <Link href="/refund" className="text-purple-400 underline underline-offset-4 hover:text-purple-300">Refund &amp; Replacement Policy</Link>, which forms an integral part of these Terms:
              </p>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs sm:text-sm text-white/70 space-y-2">
                <p>
                  <strong>Personalized Goods:</strong> Due to custom printing of identity details, custom NFC cards cannot be returned or refunded once produced.
                </p>
                <p>
                  <strong>1-Year Replacement Condition:</strong> Our 1-Year Free Replacement Warranty is granted <em>strictly on purchases of 10 units or more</em> and applies only to internal NFC silicon chip reading failures under normal handling.
                </p>
                <p>
                  <strong>Exclusion of Print Damages:</strong> Physical wear, scratches, color rubbing, chipping, cracks, or chemical solvent exposure to the print is <em>not our fault</em> and is strictly excluded from warranty claims.
                </p>
              </div>
            </div>

            {/* 6. Intellectual Property */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">6.</span> Intellectual Property Rights
              </h2>
              <p>
                All proprietary content on this website—including the Sera Cards and GoSera trademarks, brand styling, 3D mockups, UI software architecture, dynamic routing engines, and documentation—remains the exclusive property of Seranex (Pvt) Ltd. You may not copy, reverse-engineer, or reproduce platform materials without prior written consent.
              </p>
            </div>

            {/* 7. Limitation of Liability */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">7.</span> Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by applicable law, Seranex (Pvt) Ltd, its directors, employees, and agents shall not be held liable for any indirect, incidental, or consequential losses arising out of:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                <li>Inability to tap cards due to third-party smartphone hardware malfunctions or disabled NFC system settings.</li>
                <li>Temporary internet service outages affecting cloud profile load latency.</li>
                <li>Inaccurate contact details entered by cardholders or prospective leads.</li>
              </ul>
            </div>

            {/* 8. Governing Law & Dispute Resolution */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">8.</span> Governing Law
              </h2>
              <p>
                These Terms and Conditions shall be governed by, construed, and enforced in accordance with the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes shall be subject to the exclusive jurisdiction of the competent courts of Colombo, Sri Lanka.
              </p>
            </div>

            {/* Contact Box */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircleIcon className="h-5 w-5 text-purple-400" />
                Questions Regarding Our Terms?
              </h2>
              <p className="text-sm text-white/60">
                For legal inquiries, corporate service contracts, or invoice clarifications:
              </p>
              <div className="grid gap-2 sm:grid-cols-3 pt-2 text-xs">
                <div>
                  <p className="text-white/40 uppercase tracking-wider font-semibold">Corporate Office</p>
                  <p className="font-bold text-white mt-0.5">No. 20 A Amuna Rd, Seeduwa</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase tracking-wider font-semibold">Legal Desk Email</p>
                  <p className="font-bold text-white mt-0.5">info@seranex.lk</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase tracking-wider font-semibold">Direct Telephone</p>
                  <p className="font-bold text-white mt-0.5">+94 72 838 2638</p>
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

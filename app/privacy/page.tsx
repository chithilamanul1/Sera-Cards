'use client';

import React from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ShieldCheckIcon, LockIcon, DatabaseIcon, EyeOffIcon, ArrowLeftIcon, FileTextIcon, HelpCircleIcon } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl">
              At Sera Cards (operated by Seranex Pvt Ltd), we are committed to protecting the privacy, confidentiality, and security of our customers’ personal data and networking profiles.
            </p>
            <p className="mt-2 text-xs text-white/40 font-mono">
              Last Updated: October 2026 · Compliant with Sri Lankan Data Protection Guidelines.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-5 sm:px-8 space-y-10 text-sm sm:text-base text-white/80 leading-relaxed">
            {/* Quick Summary Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <EyeOffIcon className="h-4 w-4" />
                  We Never Sell Data
                </div>
                <p className="text-xs text-white/50">
                  Your identity, email, and captured leads are never sold or rented to third-party marketers.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <LockIcon className="h-4 w-4" />
                  PCI-DSS Gateways
                </div>
                <p className="text-xs text-white/50">
                  Payment details are securely encrypted via certified processors (PayHere, Mintpay). We never store raw card numbers.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <DatabaseIcon className="h-4 w-4" />
                  Remote Card Lock
                </div>
                <p className="text-xs text-white/50">
                  If you misplace your physical card, you can freeze your public profile instantly from your dashboard.
                </p>
              </div>
            </div>

            {/* 1. Information We Collect */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">1.</span> Information We Collect
              </h2>
              <p>
                When you visit our website, place an order, or activate an NFC smart card, we collect the following types of information:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-white/70">
                <li>
                  <strong className="text-white">Personal Contact &amp; Shipping Details:</strong> Full name, phone number, delivery address (district, city, street), and email address provided during order checkout.
                </li>
                <li>
                  <strong className="text-white">Digital Profile &amp; Customization Assets:</strong> Designation, company name, brand logos, portfolio links, WhatsApp numbers, social media handles, and LankaQR payment details uploaded to configure your physical card and digital microsite.
                </li>
                <li>
                  <strong className="text-white">Payment &amp; Billing Information:</strong> Transaction IDs and payment confirmation status. Credit card and debit card transactions are securely tokenized and handled directly by trusted third-party payment gateways (e.g., PayHere, Mintpay).
                </li>
                <li>
                  <strong className="text-white">Usage &amp; Interaction Analytics:</strong> Tap count timestamps, link click rates, device operating systems (iOS / Android), and referral sources to power your real-time analytics dashboard.
                </li>
              </ul>
            </div>

            {/* 2. How We Use Your Information */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">2.</span> How We Use Your Information
              </h2>
              <p>
                We process your information for the following legitimate business purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-white/70">
                <li>
                  To manufacture, UV print, encode, and courier your physical NFC smart business cards across Sri Lanka.
                </li>
                <li>
                  To host and maintain your personalized cloud profile (e.g., <code>[yourname].seranex.lk</code>).
                </li>
                <li>
                  To facilitate the <strong>Two-Way Lead Capture</strong> engine by securely routing contact details entered by card viewers straight to your account and email inbox.
                </li>
                <li>
                  To send essential transactional notifications, including order confirmations, proof approvals, tracking links, and onboarding guides.
                </li>
                <li>
                  To detect and protect against fraud, unauthorized card hijacking, and platform misuse.
                </li>
              </ul>
            </div>

            {/* 3. Information Sharing & Third Parties */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">3.</span> Information Sharing &amp; Disclosure
              </h2>
              <p>
                We respect your personal privacy. We do not sell or trade your data. We share information only with trusted service partners necessary to fulfill our service:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-white/70">
                <li>
                  <strong className="text-white">Courier &amp; Logistics Partners:</strong> Delivery couriers (e.g., Pronto, Domex, Koombiyo, Citypak) receive your shipping name, address, and mobile number exclusively to deliver your physical parcel.
                </li>
                <li>
                  <strong className="text-white">Payment Gateways:</strong> PayHere and Mintpay receive necessary transaction amounts to process your payments securely under PCI-DSS compliance.
                </li>
                <li>
                  <strong className="text-white">Legal Obligations:</strong> We may disclose information if legally mandated by applicable laws of the Democratic Socialist Republic of Sri Lanka or court orders.
                </li>
              </ul>
            </div>

            {/* 4. Data Security & Card Locking */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">4.</span> Data Security &amp; Protection
              </h2>
              <p>
                We employ industry-standard 256-bit SSL encryption across all web traffic and database storage. In addition, our platform provides a built-in <strong>Remote Card Freeze</strong> function. If your physical NFC card is misplaced or stolen, you can toggle card lock from your admin dashboard to immediately disable profile viewing until the card is recovered.
              </p>
            </div>

            {/* 5. Cookies & Tracking Technologies */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">5.</span> Cookies &amp; Tracking Technologies
              </h2>
              <p>
                We use strictly necessary cookies to maintain secure user login sessions, remember customizer preferences, and generate anonymous tap analytics. You may configure your browser to reject cookies, though certain functions (such as profile editing and session authentication) may be restricted.
              </p>
            </div>

            {/* 6. Changes to this Privacy Policy */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">6.</span> Policy Updates
              </h2>
              <p>
                We reserve the right to amend this Privacy Policy periodically. Any updates will be published on this page with an updated revision date.
              </p>
            </div>

            {/* 7. Contact Us */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircleIcon className="h-5 w-5 text-purple-400" />
                Data Protection Officer &amp; Privacy Queries
              </h2>
              <p className="text-sm text-white/60">
                If you have questions regarding data privacy, account deletion, or lead exports, please reach out to:
              </p>
              <div className="grid gap-2 sm:grid-cols-3 pt-2 text-xs">
                <div>
                  <p className="text-white/40 uppercase tracking-wider font-semibold">Email Contact</p>
                  <p className="font-bold text-white mt-0.5">info@seranex.lk</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase tracking-wider font-semibold">Hotline &amp; WhatsApp</p>
                  <p className="font-bold text-white mt-0.5">+94 72 838 2638</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase tracking-wider font-semibold">Company Office</p>
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

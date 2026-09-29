'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2Icon, ArrowRightIcon, MessageSquareIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || '94728382638';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050506] px-5 py-12 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0e0e12] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
          <CheckCircle2Icon className="h-10 w-10" />
        </div>

        <span className="mt-6 inline-block rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-400">
          Order Confirmed
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Thank You for Your Order!
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-white/60">
          We have received your Sera Smart NFC Card order. Our production team will review your details,
          generate your digital profile, and prepare your laser-encoded card.
        </p>

        {orderId && (
          <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm">
            <span className="text-xs uppercase tracking-wider text-white/40">Order Reference</span>
            <p className="mt-1 font-mono text-base font-semibold text-purple-400">{orderId}</p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Hi Sera Cards team! I just placed order ${orderId || ''} on your website. Looking forward to the design preview!`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-purple-500 px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-purple-400 active:scale-95"
          >
            <MessageSquareIcon className="h-4 w-4" />
            Chat with Production on WhatsApp
          </a>

          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/[0.08]"
          >
            Back to Home
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050506]" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

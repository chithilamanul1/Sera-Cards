'use client';

import React from 'react';
import { XIcon, CheckCircle2Icon, ShieldCheckIcon, CreditCardIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { brand } from '@/data/content';

interface MintpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  productPrice?: number;
  productName?: string;
}

export function MintpayModal({ isOpen, onClose, productPrice = 3590, productName = 'Smart Business Card' }: MintpayModalProps) {
  if (!isOpen) return null;

  const installment = (productPrice / 3).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const whatsappMintpayUrl = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    `Hi Sera Cards — I would like to order the ${productName} (LKR ${productPrice.toLocaleString()}) using Mintpay 3x installments (3 x LKR ${installment}). Please send me the Mintpay payment link.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111317] p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Header with Mintpay Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 mb-4">
            <span className="text-[#00e5be] font-black text-lg not-italic">///</span>
            <span className="text-xl font-bold italic tracking-tight">
              mint<span className="text-[#00e5be]">pay</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Pay In 3 Interest-Free Installments
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-white/60">
            Split your total into 3 monthly payments of <strong className="text-[#00e5be]">LKR {installment}</strong>. Zero extra interest, zero hidden charges.
          </p>
        </div>

        {/* 3 Step Timeline */}
        <div className="mt-6 space-y-3 border-y border-white/10 py-5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00e5be]/20 text-[#00e5be] text-xs font-bold">
                1
              </span>
              <div>
                <p className="text-xs font-bold text-white">1st Payment: Today</p>
                <p className="text-[11px] text-white/50">Upon placing order</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-white">LKR {installment}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 text-xs font-bold">
                2
              </span>
              <div>
                <p className="text-xs font-bold text-white">2nd Payment: Month 1</p>
                <p className="text-[11px] text-white/50">Auto-debited after 30 days</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-white">LKR {installment}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 text-xs font-bold">
                3
              </span>
              <div>
                <p className="text-xs font-bold text-white">3rd Payment: Month 2</p>
                <p className="text-[11px] text-white/50">Auto-debited after 60 days</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-white">LKR {installment}</span>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 text-[11px] text-white/70">
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="h-4 w-4 text-[#00e5be] shrink-0" />
            <span>0% Interest Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-[#00e5be] shrink-0" />
            <span>No Hidden Fees</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4 text-[#00e5be] shrink-0" />
            <span>Any Debit / Credit Card</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-[#00e5be] shrink-0" />
            <span>Instant Mobile Approval</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col gap-2">
          <a
            href={whatsappMintpayUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#00e5be] py-3 text-sm font-bold text-[#090a0f] hover:brightness-110 transition active:scale-[0.98] shadow-lg shadow-[#00e5be]/20"
          >
            Order with Mintpay on WhatsApp
            <ArrowRightIcon className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 py-2.5 text-xs font-medium text-white/60 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

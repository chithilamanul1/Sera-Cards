'use client';

import React from 'react';
import { HelpCircleIcon } from 'lucide-react';

interface MintpayBadgeProps {
  price?: number;
  onInfoClick?: () => void;
  className?: string;
}

export function MintpayBadge({ price, onInfoClick, className = '' }: MintpayBadgeProps) {
  if (!price || price <= 0) return null;

  // 3 equal monthly installments
  const installment = (price / 3).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      onClick={onInfoClick}
      className={`inline-flex items-center gap-1.5 text-xs text-white/60 cursor-pointer select-none transition-colors hover:text-white ${className}`}
      title="Click to learn how to split this purchase into 3 interest-free installments with Mintpay"
    >
      <span>or 3 x LKR {installment} with</span>

      {/* Official Mintpay Wordmark */}
      <span className="inline-flex items-center gap-1 font-bold italic tracking-tight text-white group-hover:brightness-110">
        <span className="inline-flex text-[#00e5be] font-black not-italic text-[13px] leading-none tracking-tighter">
          ///
        </span>
        <span className="text-white font-bold">mint</span>
        <span className="text-[#00e5be] font-bold">pay</span>
      </span>

      {onInfoClick && (
        <HelpCircleIcon className="h-3 w-3 text-white/40 hover:text-[#00e5be] transition-colors" />
      )}
    </div>
  );
}

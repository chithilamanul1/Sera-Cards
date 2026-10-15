'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  XIcon,
  UploadCloudIcon,
  CheckIcon,
  CreditCardIcon,
  MessageSquareIcon,
  AlertCircleIcon,
  Loader2Icon,
  SparklesIcon,
  Building2Icon,
  ShieldCheckIcon,
  TruckIcon,
  ChevronDownIcon,
  Trash2Icon,
  LayersIcon,
  StarIcon,
} from 'lucide-react';
import type { CardConfig } from '../types/card';
import { brand } from '../data/content';
import { CARD_PRODUCTS, CardProduct } from '../data/products';

export interface OrderModalProduct {
  id?: string;
  name: string;
  subtitle?: string;
  price?: number;
  priceLkr?: number;
  originalPrice?: number;
  originalPriceLkr?: number;
  finish?: string;
  surfaceType?: string;
  materialType?: string;
  designType?: string;
  badge?: string;
  rangeId?: string;
  isCustomQuote?: boolean;
  bulkDiscountNotice?: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: CardConfig;
  preselectedProduct?: OrderModalProduct | CardProduct;
}

export function OrderModal({ isOpen, onClose, initialConfig, preselectedProduct }: OrderModalProps) {
  // Find or match initial product
  const initialProduct = useMemo(() => {
    if (!preselectedProduct) return CARD_PRODUCTS[3]; // Default to Full Custom Brand Card
    if ('id' in preselectedProduct && preselectedProduct.id) {
      const found = CARD_PRODUCTS.find((p) => p.id === preselectedProduct.id);
      if (found) return found;
    }
    // Match by name
    const byName = CARD_PRODUCTS.find(
      (p) => p.name.toLowerCase() === preselectedProduct.name.toLowerCase()
    );
    if (byName) return byName;
    return CARD_PRODUCTS[3];
  }, [preselectedProduct]);

  const [currentProduct, setCurrentProduct] = useState<CardProduct>(initialProduct);
  const [quantity, setQuantity] = useState<number>(1);

  // Customer Contact & Shipping Details
  const [customerName, setCustomerName] = useState(initialConfig?.name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');

  // Card Personalization Details
  const [brandName, setBrandName] = useState(initialConfig?.business || 'SERANEX');
  const [tagline, setTagline] = useState(initialConfig?.tagline || 'Web & Software Solutions');
  const [nameOnCard, setNameOnCard] = useState(initialConfig?.name || 'Chithila Manul');
  const [designation, setDesignation] = useState(initialConfig?.title || 'Founder & CEO');
  const [slug, setSlug] = useState(initialConfig?.slug || 'chithila');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [corporateRosterNotes, setCorporateRosterNotes] = useState('');

  // Digital Profile & Social Media Links
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'WHATSAPP' | 'PAYHERE' | 'MINTPAY'>('WHATSAPP');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderNumber: string;
    whatsappUrl: string;
    accountDetails?: {
      isNewUser: boolean;
      email: string;
      password?: string | null;
      slug: string;
      dashboardUrl: string;
      loginUrl: string;
      liveProfileUrl: string;
    } | null;
  } | null>(null);

  // Sync state when preselectedProduct changes
  useEffect(() => {
    if (initialProduct) {
      setCurrentProduct(initialProduct);
    }
  }, [initialProduct]);

  // Sync state when initialConfig changes or modal opens
  useEffect(() => {
    if (initialConfig && isOpen) {
      if (initialConfig.name) {
        setCustomerName((prev) => prev || initialConfig.name);
        setNameOnCard((prev) => (prev === 'Chithila Manul' ? initialConfig.name : prev || initialConfig.name));
      }
      if (initialConfig.business) setBrandName((prev) => (prev === 'SERANEX' ? initialConfig.business : prev || initialConfig.business));
      if (initialConfig.tagline) setTagline((prev) => (prev === 'Web & Software Solutions' ? initialConfig.tagline : prev || initialConfig.tagline));
      if (initialConfig.title) setDesignation((prev) => (prev === 'Founder & CEO' ? initialConfig.title : prev || initialConfig.title));
      if (initialConfig.slug) setSlug((prev) => (prev === 'chithila' ? initialConfig.slug : prev || initialConfig.slug));
      if (initialConfig.phone) setCustomerPhone((prev) => prev || initialConfig.phone || '');
      if (initialConfig.email) setCustomerEmail((prev) => prev || initialConfig.email || '');
    }
  }, [initialConfig, isOpen]);

  if (!isOpen) return null;

  // ─── DYNAMIC PRICING & VOLUME DISCOUNT CALCULATIONS ───
  const rawPreselectedPrice = preselectedProduct
    ? ('priceLkr' in preselectedProduct && preselectedProduct.priceLkr
        ? preselectedProduct.priceLkr
        : 'price' in preselectedProduct && typeof (preselectedProduct as any).price === 'number'
        ? (preselectedProduct as any).price
        : null)
    : null;

  const baseUnitPrice = currentProduct.priceLkr || rawPreselectedPrice || 5000;

  // Corporate / Bulk Tier Discount:
  // 1-4 cards: 0% discount
  // 5-9 cards: 10% discount
  // 10-24 cards: 20% discount
  // 25+ cards: 30% discount
  let discountPercent = 0;
  if (quantity >= 25) discountPercent = 30;
  else if (quantity >= 10) discountPercent = 20;
  else if (quantity >= 5) discountPercent = 10;

  const unitPriceAfterDiscount = Math.round(baseUnitPrice * (1 - discountPercent / 100));
  const subtotal = unitPriceAfterDiscount * quantity;

  // Free delivery for 5+ cards islandwide
  const deliveryFee = quantity >= 5 ? 0 : 350;
  const totalAmount = subtotal + deliveryFee;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Logo file must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setLogoPreview(canvas.toDataURL('image/png', 0.85));
        } else {
          setLogoPreview(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Please fill in your name, WhatsApp phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finishName = `${currentProduct.name} (Qty: ${quantity}, Unit: LKR ${unitPriceAfterDiscount.toLocaleString()}${discountPercent > 0 ? ` - ${discountPercent}% Bulk Disc.` : ''}) - ${currentProduct.surfaceType}`;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          deliveryAddress,
          city,
          brandName,
          tagline,
          nameOnCard,
          designation,
          slug,
          finish: finishName,
          customAmount: totalAmount - deliveryFee,
          unitPrice: unitPriceAfterDiscount,
          deliveryFee,
          logoUrl: logoPreview,
          notes: corporateRosterNotes || null,
          bio,
          instagram,
          linkedin,
          facebook,
          tiktok,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detailStr = data?.details ? ` (${data.details})` : '';
        throw new Error((data?.error || 'Failed to submit order') + detailStr);
      }

      if (paymentMethod === 'PAYHERE' && data.payhereParams) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payhereParams.checkout_url;

        Object.keys(data.payhereParams).forEach((key) => {
          if (key !== 'checkout_url') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data.payhereParams[key];
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      } else if (data.whatsappUrl) {
        setSubmittedOrder({
          orderNumber: data.order?.orderNumber || 'SERA',
          whatsappUrl: data.whatsappUrl,
          accountDetails: data.accountDetails || null,
        });
        setIsSubmitting(false);

        // Open WhatsApp in new tab so credentials remain accessible
        try {
          window.open(data.whatsappUrl, '_blank');
        } catch {
          // fallback
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md overflow-y-auto touch-scroll">
      <div className="relative flex max-h-[96dvh] sm:max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0a0a0c] shadow-[0_25px_60px_rgba(0,0,0,0.95)] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-3.5 sm:py-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400">
              <SparklesIcon className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
                Direct Order Form
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                {currentProduct.name} Setup &amp; Order
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {submittedOrder ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-8 text-center space-y-5">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.35)] ring-1 ring-purple-500/30">
              <CheckIcon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400">
                Order Generated Successfully
              </span>
              <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                #{submittedOrder.orderNumber}
              </h3>
              <p className="mt-2 text-sm text-white/60 max-w-sm mx-auto">
                Your order for {currentProduct.name} ({quantity} {quantity === 1 ? 'card' : 'cards'}) is recorded.
              </p>

              {/* Auto Provisioned Account Information */}
              {submittedOrder.accountDetails && (
                <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.08] p-4 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">✓</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {submittedOrder.accountDetails.isNewUser ? 'GoSera Account Auto-Created & Logged In!' : 'GoSera Account Linked!'}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Your digital profile is live at{' '}
                    <a
                      href={submittedOrder.accountDetails.liveProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-accent-400 underline"
                    >
                      {submittedOrder.accountDetails.slug}.seranex.lk ↗
                    </a>
                    . You can start customizing your card and profile anytime.
                  </p>
                  {submittedOrder.accountDetails.password && (
                    <div className="mt-2.5 rounded-xl border border-white/10 bg-black/50 p-2.5 font-mono text-[11px] space-y-1">
                      <p className="text-white/50">Login Email: <strong className="text-white">{submittedOrder.accountDetails.email}</strong></p>
                      <p className="text-white/50">Temporary Password: <strong className="text-amber-400">{submittedOrder.accountDetails.password}</strong></p>
                    </div>
                  )}
                </div>
              )}

              {logoPreview && (
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/[0.07] p-3 text-left max-w-sm mx-auto">
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-10 w-10 shrink-0 rounded-xl object-contain bg-white/5 p-1 ring-1 ring-white/10"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-purple-400 block">✓ Logo Attached to Order</span>
                    <span className="text-white/60 text-[11px] leading-tight block">
                      A direct download link is also included in your WhatsApp message.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full max-w-md pt-2 space-y-2.5">
              <a
                href={submittedOrder.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-black hover:bg-emerald-400 transition shadow-lg"
              >
                <MessageSquareIcon className="h-4 w-4" />
                Open WhatsApp to Confirm Design &rarr;
              </a>
              <a
                href="/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-accent-500/40 bg-accent-500/10 py-3 text-xs font-bold text-accent-300 hover:bg-accent-500/20 transition"
              >
                <CreditCardIcon className="h-3.5 w-3.5" />
                Go to My Dashboard 📊
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-white/10 py-2.5 text-xs text-white/50 hover:bg-white/5"
              >
                Close Order Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto touch-scroll p-4 sm:p-6 space-y-5 sm:space-y-6 pb-safe">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-300">
                <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ─── DEDICATED PRODUCT SUMMARY BANNER ─── */}
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-zinc-950 to-zinc-900 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                      {currentProduct.badge || 'Selected Card'}
                    </span>
                    <span className="text-[10px] text-white/40">·</span>
                    <span className="text-xs text-white/60 font-medium">{currentProduct.rangeName}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {currentProduct.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">
                    {currentProduct.designType} · {currentProduct.materialType}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-xs text-white/40 block">Unit Price</span>
                  <div className="flex items-baseline sm:justify-end gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                      LKR {unitPriceAfterDiscount.toLocaleString()}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-xs text-emerald-400 font-bold font-mono">
                        ({discountPercent}% OFF)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    ● Lifetime Cloud Profile Included
                  </span>
                </div>
              </div>

              {/* Quantity & Fleet Volume Adjustment Selector */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70 font-semibold">Quantity:</span>
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-0.5">
                    {[1, 5, 10, 25].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantity(q)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                          quantity === q
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {q} {q === 1 ? 'card' : 'cards'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Quantity Input */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/50">Custom Qty:</span>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-center font-mono text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Volume Discount Notice */}
              {discountPercent > 0 && (
                <div className="mt-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-300 flex items-center justify-between">
                  <span>🏢 Corporate Volume Tier Applied: <strong>{discountPercent}% OFF</strong> + Free Island-Wide Delivery!</span>
                  <span className="font-mono font-bold">LKR {unitPriceAfterDiscount.toLocaleString()}/card</span>
                </div>
              )}
            </div>

            {/* ─── SECTION 1: DEDICATED PRODUCT CONFIGURATION ─── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 block">
                  1. {currentProduct.id === 'company-card' ? 'Corporate Company Setup' : currentProduct.id === 'metal-black' || currentProduct.id === 'metal-silver' ? 'Laser-Etched Metal Setup' : 'Custom Printed Information'}
                </span>
                <span className="text-[11px] text-white/40">Specific to {currentProduct.name}</span>
              </div>

              {/* ─── FORM TYPE A: COMPANY CARD DEDICATED FORM ─── */}
              {currentProduct.id === 'company-card' && (
                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-300">
                    🏢 <strong>Fixed Corporate Design:</strong> Your official company logo will be etched on the front face. Employee name, title, and dynamic QR are printed on the back.
                  </div>

                  {/* Company Logo Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Company Logo (Front Face) *
                    </label>
                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <div className="relative h-16 w-16 shrink-0 rounded-xl border border-purple-500/40 bg-black/60 p-1">
                          <img src={logoPreview} alt="Company logo preview" className="h-full w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setLogoPreview(null)}
                            className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 p-0.5 text-white"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 text-xs text-white/60 hover:border-purple-400 hover:text-white transition">
                          <UploadCloudIcon className="h-4 w-4 text-purple-400" />
                          <span>Upload High-Res Company Logo (PNG / SVG / JPEG)</span>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-white/70">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g. Aura Living & Investments"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70">Company Tagline / Slogan</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Luxury Living & Architecture"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70">Cardholder Employee Name (Back) *</label>
                      <input
                        type="text"
                        required
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="e.g. Kasun Fernando"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70">Employee Designation *</label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Senior Project Architect"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {quantity > 1 && (
                    <div>
                      <label className="block text-xs font-medium text-white/70">
                        Multiple Employee Roster &amp; Names (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={corporateRosterNotes}
                        onChange={(e) => setCorporateRosterNotes(e.target.value)}
                        placeholder="Enter employee names & designations for your fleet (or send Excel / WhatsApp roster after order)."
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ─── FORM TYPE B: FULL CUSTOM BRAND CARD DEDICATED FORM ─── */}
              {currentProduct.id === 'custom-card' && (
                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-300">
                    🎨 <strong>100% Bespoke Artwork:</strong> Edge-to-edge full color UV printing on both card faces. You can upload custom graphics or logo below.
                  </div>

                  {/* Artwork / Logo Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Front &amp; Back Custom Artwork / Logo File
                    </label>
                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <div className="relative h-16 w-16 shrink-0 rounded-xl border border-purple-500/40 bg-black/60 p-1">
                          <img src={logoPreview} alt="Custom artwork preview" className="h-full w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setLogoPreview(null)}
                            className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 p-0.5 text-white"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 text-xs text-white/60 hover:border-purple-400 hover:text-white transition">
                          <UploadCloudIcon className="h-4 w-4 text-purple-400" />
                          <span>Upload Vector Artwork, Logo or Graphic Design (PDF / PNG / SVG)</span>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-white/70">Brand Name (Front) *</label>
                      <input
                        type="text"
                        required
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g. SERANEX"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70">Tagline / Slogan</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Web & Software Solutions"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70">Name on Card (Back) *</label>
                      <input
                        type="text"
                        required
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="e.g. Chithila Manul"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70">Designation (Back) *</label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Founder & CEO"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─── FORM TYPE C: EXECUTIVE METAL CARD DEDICATED FORM ─── */}
              {(currentProduct.id === 'metal-black' || currentProduct.id === 'metal-silver') && (
                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-300">
                    ⚡ <strong>Solid Surgical 304 Stainless Steel (22g):</strong> Diamond-laser etching typography that will never fade. Includes luxury presentation velvet box.
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-white/70">Laser-Etched Full Name *</label>
                      <input
                        type="text"
                        required
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="e.g. DR. SANJEEWA PERERA"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70">Laser-Etched Designation *</label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. MANAGING DIRECTOR"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none uppercase"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-white/70">Company Wordmark / Monogram (Front Center) *</label>
                      <input
                        type="text"
                        required
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g. APEX CAPITAL PARTNERS"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─── FORM TYPE D: CLASSIC UV / MATTE / GLOSS PVC DEDICATED FORM ─── */}
              {currentProduct.id !== 'company-card' &&
                currentProduct.id !== 'custom-card' &&
                currentProduct.id !== 'metal-black' &&
                currentProduct.id !== 'metal-silver' && (
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-300">
                      ✨ <strong>{currentProduct.name}:</strong> Physical card features crisp typography on the front and your dynamic contact QR on the back.
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-white/70">Brand Wordmark (Front) *</label>
                        <input
                          type="text"
                          required
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder="e.g. SERANEX"
                          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70">Tagline / Designation (Front)</label>
                        <input
                          type="text"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          placeholder="e.g. Web Solutions"
                          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70">Cardholder Name (Back) *</label>
                        <input
                          type="text"
                          required
                          value={nameOnCard}
                          onChange={(e) => setNameOnCard(e.target.value)}
                          placeholder="e.g. Chithila Manul"
                          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70">Designation (Back) *</label>
                        <input
                          type="text"
                          required
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="e.g. Founder & CEO"
                          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

              {/* Subdomain Handle (Shared) */}
              <div>
                <label className="block text-xs font-medium text-white/70">
                  Card Digital Subdomain Link *
                </label>
                <div className="mt-1 flex items-stretch rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-purple-500">
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="yourname"
                    className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none"
                  />
                  <span className="flex items-center border-l border-white/10 bg-white/[0.03] px-3 text-xs text-purple-400 font-mono">
                    .{brand.domain}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── SECTION 2: CUSTOMER CONTACT & DELIVERY ADDRESS ─── */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 block">
                2. Contact &amp; Delivery Address
              </span>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-white/70">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Chithila Manul"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0728382638"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-white/70">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. you@domain.com"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-white/70">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House number, Street, Area"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-white/70">City / District</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Colombo, Seeduwa, Kandy"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ─── SECTION 3: PRICING BREAKDOWN & TOTAL ─── */}
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-white/50 block">Order Total</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">
                    LKR {totalAmount.toLocaleString()}
                  </span>
                  <span className="text-xs text-white/40">
                    ({quantity} {quantity === 1 ? 'card' : 'cards'})
                  </span>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="text-white/60 block">
                  Delivery: {deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `LKR ${deliveryFee}`}
                </span>
                <span className="text-purple-400 font-bold font-mono text-sm">
                  Net: LKR {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 block">
                3. Choose Payment Method
              </span>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  onClick={() => setPaymentMethod('WHATSAPP')}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                    paymentMethod === 'WHATSAPP'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'WHATSAPP'}
                      onChange={() => setPaymentMethod('WHATSAPP')}
                      className="text-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">WhatsApp Direct Order</span>
                      <span className="text-[11px] text-white/50 block">Bank transfer / Cash on delivery</span>
                    </div>
                  </div>
                  <MessageSquareIcon className="h-4 w-4 text-emerald-400" />
                </label>

                <label
                  onClick={() => setPaymentMethod('PAYHERE')}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                    paymentMethod === 'PAYHERE'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'PAYHERE'}
                      onChange={() => setPaymentMethod('PAYHERE')}
                      className="text-purple-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">PayHere Online Gateway</span>
                      <span className="text-[11px] text-white/50 block">Visa, Mastercard, Frimi, Genie</span>
                    </div>
                  </div>
                  <CreditCardIcon className="h-4 w-4 text-purple-400" />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-4 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  Generating Order Proof...
                </>
              ) : paymentMethod === 'PAYHERE' ? (
                <>
                  <CreditCardIcon className="h-4 w-4" />
                  Pay Online (LKR {totalAmount.toLocaleString()}) &rarr;
                </>
              ) : (
                <>
                  <MessageSquareIcon className="h-4 w-4" />
                  Confirm &amp; Order {currentProduct.name} (LKR {totalAmount.toLocaleString()}) &rarr;
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-white/40 leading-relaxed pt-1">
              By confirming this order, you agree to our{' '}
              <a href="/terms" target="_blank" className="text-purple-400 underline hover:text-purple-300">
                Terms
              </a>{' '}
              and{' '}
              <a href="/refund" target="_blank" className="text-purple-400 underline hover:text-purple-300">
                Refund &amp; Warranty Policy
              </a>{' '}
              (1-Year replacement on 10+ units; physical print wear excluded).
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

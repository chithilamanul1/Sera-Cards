'use client';

import React, { useState } from 'react';
import { XIcon, UploadCloudIcon, CheckIcon, CreditCardIcon, MessageSquareIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react';
import type { CardConfig } from '../types/card';
import { brand } from '../data/content';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig: CardConfig;
}

export function OrderModal({ isOpen, onClose, initialConfig }: OrderModalProps) {
  const [customerName, setCustomerName] = useState(initialConfig.name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');

  // Card details
  const [brandName, setBrandName] = useState(initialConfig.business || 'SERANEX');
  const [tagline, setTagline] = useState(initialConfig.tagline || 'Web & Software Solutions');
  const [nameOnCard, setNameOnCard] = useState(initialConfig.name || 'Chithila Manul');
  const [designation, setDesignation] = useState(initialConfig.title || 'Founder & CEO');
  const [slug, setSlug] = useState(initialConfig.slug || 'chithila');
  const [finish, setFinish] = useState('Standard Glossy PVC');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Digital Profile & Social Media Links
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'PAYHERE' | 'WHATSAPP'>('PAYHERE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const unitPrice = 3500;
  const originalPrice = 5000;
  const deliveryFee = 350;
  const totalAmount = unitPrice + deliveryFee;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Logo file must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
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
          finish,
          logoUrl: logoPreview,
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
        throw new Error(data.error || 'Failed to submit order');
      }

      if (paymentMethod === 'PAYHERE' && data.payhereParams) {
        // Create an HTML form and submit to PayHere
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
        window.location.href = data.whatsappUrl;
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0c] shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
              Direct Order Portal
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">Order Your Custom Sera Card</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 space-y-6 overflow-y-auto px-6 py-6 text-sm">
          {errorMessage && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300">
              <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pricing Highlight Banner */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-white/50">Promotional Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">LKR {unitPrice.toLocaleString()}</span>
                  <span className="text-sm text-white/40 line-through">LKR {originalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right text-xs text-emerald-400">
                <span className="block font-medium">Island-wide delivery: LKR {deliveryFee}</span>
                <span className="text-white/40">Total at checkout: LKR {totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-white/50">
              * Note: Matte finish is not available for this promotion. Standard ultra-durable finish included.
            </p>
          </div>

          {/* Section 1: Customer & Delivery Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              1. Customer & Delivery Address
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-white/70">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Chithila Manul"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0728382638"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-white/70">Email Address (Optional)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. you@domain.com"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
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
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">City / District</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Colombo, Negombo, Kandy"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">Card Finish Choice</label>
                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141418] px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Standard Glossy PVC">Standard High-Gloss PVC (Included)</option>
                  <option value="Cyber Silver">Cyber Silver Finish</option>
                  <option value="Brushed Gold">Brushed Gold Finish</option>
                  <option value="Midnight Navy">Midnight Navy Finish</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Card Customization */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              2. Printed Card Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-white/70">Brand Name (Front) *</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. SERANEX"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">Tagline (Front)</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Web & Software Solutions"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
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
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">Designation (Back)</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Founder & CEO"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-white/70">Sub-page Profile Link</label>
                <div className="mt-1.5 flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2">
                  <span className="text-white/40">https://</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="yourname"
                    className="min-w-0 flex-1 bg-transparent px-1 font-mono text-emerald-400 outline-none"
                  />
                  <span className="font-mono text-xs text-emerald-400">.{brand.domain}</span>
                </div>
              </div>

              {/* Logo / Artwork Upload */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-white/70">Upload Logo or Profile Photo</label>
                <div className="mt-2 flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-3 text-xs text-white/70 transition-colors hover:border-emerald-500 hover:text-white">
                    <UploadCloudIcon className="h-4 w-4 text-emerald-400" />
                    <span>{logoPreview ? 'Change Image' : 'Choose Logo / Photo file (PNG, JPG)'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {logoPreview && (
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-1.5">
                      <img src={logoPreview} alt="Logo preview" className="h-8 w-8 rounded-lg object-contain" />
                      <span className="text-[11px] text-emerald-400">Image attached</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Digital Profile & Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              3. Digital Profile & Social Links (Live on NFC Tap)
            </h3>
            <div>
              <label className="block text-xs font-medium text-white/70">Short Bio / Introduction</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Turnkey web & software development solutions for businesses."
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-white/70">Instagram URL / Username</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourhandle"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">Facebook URL</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70">TikTok URL (Optional)</label>
                <input
                  type="text"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  placeholder="https://tiktok.com/@yourhandle"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Payment Method Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">4. Select Payment Method</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                onClick={() => setPaymentMethod('PAYHERE')}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                  paymentMethod === 'PAYHERE'
                    ? 'border-emerald-500 bg-emerald-500/[0.08]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'PAYHERE'}
                  onChange={() => setPaymentMethod('PAYHERE')}
                  className="mt-0.5 text-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-white">Pay Online (PayHere)</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    Pay securely using Visa, MasterCard, FriMi, Genie, eZ Cash, or Internet Banking.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('WHATSAPP')}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                  paymentMethod === 'WHATSAPP'
                    ? 'border-emerald-500 bg-emerald-500/[0.08]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'WHATSAPP'}
                  onChange={() => setPaymentMethod('WHATSAPP')}
                  className="mt-0.5 text-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-white">Order via WhatsApp</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    Submit order and finalize payment / design confirmation directly with our team on WhatsApp.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-semibold text-black shadow-[0_0_40px_-10px_rgba(18,185,129,0.8)] transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                  Processing Order...
                </>
              ) : paymentMethod === 'PAYHERE' ? (
                `Proceed to PayHere Checkout (LKR ${totalAmount.toLocaleString()})`
              ) : (
                `Confirm & Send Order via WhatsApp (LKR ${totalAmount.toLocaleString()})`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

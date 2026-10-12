'use client';

import React, { useState, useEffect, useId } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  SparklesIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  ArrowLeftIcon,
  UserIcon,
  BriefcaseIcon,
  Building2Icon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  GlobeIcon,
  StarIcon,
  QrCodeIcon,
  LayersIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  SmartphoneIcon,
  ShieldCheckIcon,
  DownloadIcon,
  MessageSquareIcon,
  Share2Icon,
} from 'lucide-react';
import { TEMPLATE_PRESETS, TemplateData } from '@/lib/templates';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

function OnboardingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard Step: 1 | 2 | 3 | 4 | 5
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Slug Availability State
  const [slugChecking, setSlugChecking] = useState<boolean>(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugMessage, setSlugMessage] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState<TemplateData>({
    slug: '',
    name: '',
    title: '',
    company: '',
    bio: '',
    phone: '',
    whatsapp: '',
    email: '',
    location: 'Colombo, Sri Lanka',
    website: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    instagram: '',
    linkedin: '',
    facebook: '',
    tiktok: '',
    lankaQrText: '',
    googleReviewUrl: '',
    catalogPdfUrl: '',
    catalogPdfTitle: '',
  });

  const [selectedPreset, setSelectedPreset] = useState<string>('personal_hero');
  const [error, setError] = useState<string>('');

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

  // Pre-fill from query params or current session
  useEffect(() => {
    const qSlug = searchParams.get('slug');
    const qName = searchParams.get('name');
    const qEmail = searchParams.get('email');
    const qPhone = searchParams.get('phone');

    if (qSlug || qName || qEmail || qPhone) {
      setFormData((prev) => ({
        ...prev,
        slug: qSlug ? qSlug.toLowerCase().replace(/[^a-z0-9-]/g, '') : prev.slug,
        name: qName || prev.name,
        email: qEmail || prev.email,
        phone: qPhone || prev.phone,
        whatsapp: qPhone ? qPhone.replace(/[^0-9]/g, '') : prev.whatsapp,
      }));
    }

    // Also check current logged-in user
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.authenticated && data.user) {
          const u = data.user;
          setFormData((prev) => ({
            ...prev,
            slug: prev.slug || u.cardSlug || u.name?.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16) || '',
            name: prev.name || u.name || '',
            email: prev.email || u.email || '',
            phone: prev.phone || u.phone || '',
            whatsapp: prev.whatsapp || (u.phone ? u.phone.replace(/[^0-9]/g, '') : ''),
          }));
        }
      })
      .catch(() => {});
  }, [searchParams]);

  // Debounced check for slug availability
  useEffect(() => {
    if (!formData.slug || formData.slug.length < 2) {
      setSlugAvailable(null);
      setSlugMessage('');
      return;
    }

    const timer = setTimeout(async () => {
      setSlugChecking(true);
      try {
        const res = await fetch(`/api/onboarding?checkSlug=${encodeURIComponent(formData.slug)}`);
        const data = await res.json();
        if (res.ok) {
          setSlugAvailable(data.available);
          setSlugMessage(data.message || (data.available ? 'Link is available!' : 'Link is taken'));
        } else {
          setSlugAvailable(false);
          setSlugMessage(data.message || 'Cannot use this handle');
        }
      } catch {
        setSlugAvailable(null);
      } finally {
        setSlugChecking(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [formData.slug]);

  // Handle Input Changes
  const handleChange = (field: keyof TemplateData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-suggest slug from name if user hasn't explicitly customized slug yet
      if (field === 'name' && (!prev.slug || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14))) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14);
      }
      return updated;
    });
  };

  const handleSlugInput = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24);
    setFormData((prev) => ({ ...prev, slug: sanitized }));
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    setError('');
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return false;
      }
      if (!formData.slug.trim() || formData.slug.length < 2) {
        setError('Please enter a valid card handle (at least 2 characters).');
        return false;
      }
      if (slugAvailable === false) {
        setError('This card link is already taken. Please choose another unique link.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.phone.trim() && !formData.whatsapp.trim()) {
        setError('Please provide at least a mobile or WhatsApp number.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit & Complete Onboarding
  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          preset: selectedPreset,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete onboarding');
      }

      setSuccessData(data.card);
      setStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong while launching your card.');
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick Avatar Samples
  const avatarPresets = [
    { label: 'Executive Male', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80' },
    { label: 'Professional Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
    { label: 'Modern Creative', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { label: 'Minimal Monochrome', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
  ];

  const currentSlug = formData.slug || 'yourname';
  const previewLiveUrl = `https://${currentSlug}.${rootDomain}`;

  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased flex flex-col justify-between">
      <Nav />

      <main className="flex-1 px-4 pt-24 pb-16 max-w-6xl mx-auto w-full">
        {/* Onboarding Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold text-accent-400 mb-4">
            <SparklesIcon className="h-4 w-4" />
            Digital Card Onboarding Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {step === 5 ? '🎉 Your Card is Live!' : 'Set Up Your Smart Digital Profile'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/50">
            {step === 5
              ? 'Your NFC smart card and cloud link are officially active. Start sharing now!'
              : 'Complete your card setup in less than 2 minutes. Tapping your card will instantly display these details.'}
          </p>
        </div>

        {/* Step Progress Bar (Hidden on step 5) */}
        {step < 5 && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-between text-xs font-medium text-white/40 mb-3">
              <span className={step >= 1 ? 'text-accent-400 font-semibold' : ''}>1. Identity</span>
              <span className={step >= 2 ? 'text-accent-400 font-semibold' : ''}>2. Contact</span>
              <span className={step >= 3 ? 'text-accent-400 font-semibold' : ''}>3. Socials</span>
              <span className={step >= 4 ? 'text-accent-400 font-semibold' : ''}>4. Template</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-accent-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            {error}
          </div>
        )}

        {/* Main Content Grid: Form (Left) & Live Phone Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Card (Col 7 on Desktop) */}
          <div className={`${step === 5 ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
            <div className="rounded-3xl border border-white/10 bg-ink-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              {/* ──────────────── STEP 1: IDENTITY & SUBDOMAIN ──────────────── */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Personal & Professional Identity</h2>
                    <p className="text-xs text-white/50">Your name, role, and custom web subdomain.</p>
                  </div>

                  {/* Subdomain Handle Input */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      Claim Your Digital Card Link *
                    </label>
                    <div className="flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-accent-500 transition-colors">
                      <div className="flex items-center pl-3.5 text-white/30">
                        <GlobeIcon className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleSlugInput(e.target.value)}
                        placeholder="yourname"
                        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-white/20 outline-none"
                      />
                      <span className="flex items-center border-l border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-accent-400 select-none">
                        .{rootDomain}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-xs">
                      <span className="text-white/40 font-mono">
                        https://{formData.slug || 'yourname'}.{rootDomain}
                      </span>
                      {slugChecking && <span className="text-yellow-400">Checking availability...</span>}
                      {!slugChecking && slugAvailable === true && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2Icon className="h-3.5 w-3.5" /> Available
                        </span>
                      )}
                      {!slugChecking && slugAvailable === false && (
                        <span className="text-purple-400">{slugMessage || 'Not available'}</span>
                      )}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g. Kasun Perera"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Title & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Designation / Role
                      </label>
                      <div className="relative">
                        <BriefcaseIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          placeholder="e.g. Managing Director"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Company / Brand
                      </label>
                      <div className="relative">
                        <Building2Icon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleChange('company', e.target.value)}
                          placeholder="e.g. Seranex Group"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      Professional Bio (Short summary)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Specialized in digital transformation, investments, and luxury living solutions in Sri Lanka."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      Profile Photo URL
                    </label>
                    <input
                      type="url"
                      value={formData.avatarUrl}
                      onChange={(e) => handleChange('avatarUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors mb-2"
                    />
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      <span className="text-[11px] text-white/40 shrink-0">Sample Presets:</span>
                      {avatarPresets.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleChange('avatarUrl', preset.url)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                            formData.avatarUrl === preset.url
                              ? 'border-accent-500 bg-accent-500/20 text-accent-300'
                              : 'border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────── STEP 2: INSTANT COMMUNICATIONS ──────────────── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Instant 1-Tap Communications</h2>
                    <p className="text-xs text-white/50">
                      When someone taps your card, these direct actions connect them instantly.
                    </p>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Mobile Phone Number *
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="077 123 4567 or +9472..."
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        WhatsApp Number
                      </label>
                      <div className="relative">
                        <MessageSquareIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-400" />
                        <input
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) => handleChange('whatsapp', e.target.value)}
                          placeholder="077 123 4567"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                        />
                      </div>
                      {formData.phone && !formData.whatsapp && (
                        <button
                          type="button"
                          onClick={() => handleChange('whatsapp', formData.phone)}
                          className="mt-1 text-[11px] text-accent-400 hover:underline"
                        >
                          Same as mobile phone
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <MailIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Location & Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Location / City
                      </label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleChange('location', e.target.value)}
                          placeholder="Colombo 03, Sri Lanka"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Website / Portfolio
                      </label>
                      <div className="relative">
                        <GlobeIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleChange('website', e.target.value)}
                          placeholder="https://company.lk"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────── STEP 3: SOCIALS & CONVERSION BOOSTERS ──────────────── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Social Profiles &amp; Lead Boosters</h2>
                    <p className="text-xs text-white/50">
                      Connect your channels, boost your 5★ Google reviews, and accept LankaQR payments.
                    </p>
                  </div>

                  {/* LinkedIn & Instagram */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={(e) => handleChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => handleChange('instagram', e.target.value)}
                        placeholder="@username"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Google Review URL */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <StarIcon className="h-4 w-4" /> Google 5-Star Review Booster Link
                      </span>
                    </label>
                    <input
                      type="url"
                      value={formData.googleReviewUrl}
                      onChange={(e) => handleChange('googleReviewUrl', e.target.value)}
                      placeholder="https://g.page/r/.../review"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                    />
                    <p className="mt-1 text-[11px] text-white/40">
                      When prospects rate you 4 or 5 stars, they are automatically forwarded to this link to post on your Google Business profile!
                    </p>
                  </div>

                  {/* LankaQR / Bank Details */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <QrCodeIcon className="h-4 w-4" /> LankaQR or Direct Bank Transfer
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.lankaQrText}
                      onChange={(e) => handleChange('lankaQrText', e.target.value)}
                      placeholder="Commercial Bank / A/C: 1000293847 / Seeduwa Branch"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                    />
                    <p className="mt-1 text-[11px] text-white/40">
                      Displays a dedicated 1-tap payment block so clients can pay you on the spot.
                    </p>
                  </div>
                </div>
              )}

              {/* ──────────────── STEP 4: DESIGN & TEMPLATE STUDIO ──────────────── */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Select Your Card Template</h2>
                    <p className="text-xs text-white/50">
                      Choose the presentation layout that represents your style and industry.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TEMPLATE_PRESETS.map((preset) => {
                      const isSelected = selectedPreset === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => setSelectedPreset(preset.id)}
                          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                            isSelected
                              ? 'border-accent-500 bg-accent-500/10 shadow-[0_0_30px_-10px_rgba(168,85,247,0.5)]'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-white/10 text-accent-300">
                              {preset.badge}
                            </span>
                            {isSelected && <CheckCircle2Icon className="h-4 w-4 text-accent-400" />}
                          </div>
                          <h3 className="mt-3 font-semibold text-white text-sm">{preset.name}</h3>
                          <p className="mt-1 text-xs text-white/50 line-clamp-2">{preset.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ──────────────── STEP 5: CELEBRATION & LIVE LAUNCH ──────────────── */}
              {step === 5 && (
                <div className="space-y-8 text-center py-4">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto">
                    <SparklesIcon className="h-10 w-10 animate-pulse" />
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Card is Activated!</h2>
                    <p className="mt-2 text-sm text-white/60 max-w-md mx-auto">
                      Congratulations {formData.name}! Your dedicated subdomain and digital profile are published and ready for real-time contact sharing.
                    </p>
                  </div>

                  {/* Live Link Box */}
                  <div className="max-w-md mx-auto p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                      Your Dedicated Subdomain
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={previewLiveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-bold text-white hover:underline truncate"
                      >
                        {previewLiveUrl}
                      </a>
                      <button
                        type="button"
                        onClick={() => copyUrl(previewLiveUrl)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
                      >
                        {copied ? <CheckIcon className="h-4 w-4 text-emerald-400" /> : <CopyIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-4 max-w-md mx-auto">
                    <a
                      href={`/c/${formData.slug || 'card'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[180px] flex items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-semibold text-ink-950 shadow-lg hover:bg-accent-400 active:scale-[0.98] transition-all"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      View Live Card
                    </a>
                    <a
                      href="/dashboard"
                      className="flex-1 min-w-[180px] flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] py-3.5 text-sm font-semibold text-white hover:bg-white/[0.1] active:scale-[0.98] transition-all"
                    >
                      Open Dashboard &rarr;
                    </a>
                  </div>

                  {/* NFC Tapping Guide Box */}
                  <div className="max-w-lg mx-auto text-left rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <SmartphoneIcon className="h-4 w-4 text-accent-400" />
                      How to Tap Your Physical Card:
                    </h3>
                    <ul className="space-y-2 text-xs text-white/60">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold shrink-0">iPhone:</span>
                        <span>Tap the top of your card against the top-back edge of the iPhone (next to the camera lenses). No app required.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">Android:</span>
                        <span>Ensure NFC is turned ON in settings, then tap against the center of the phone back.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">QR Code:</span>
                        <span>Open phone camera to scan the dynamic laser QR code on the back of your card.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Controls (Steps 1 to 4) */}
              {step < 5 && (
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <ArrowLeftIcon className="h-3.5 w-3.5" /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-2.5 text-xs font-semibold text-ink-950 shadow-md hover:bg-accent-400 active:scale-[0.98] transition-all"
                    >
                      Next Step <ArrowRightIcon className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleSubmit}
                      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-xs font-semibold text-ink-950 shadow-lg hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Publishing Profile...' : 'Complete & Launch Live Card 🚀'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Live Mobile Phone Simulator (Col 5 on Desktop) */}
          {step < 5 && (
            <div className="lg:col-span-5 sticky top-24 hidden lg:block">
              <div className="relative mx-auto w-[320px] rounded-[44px] border-[6px] border-zinc-800 bg-zinc-950 p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-900 rounded-full z-20 flex items-center justify-center">
                  <div className="w-10 h-1 bg-zinc-700 rounded-full" />
                </div>

                {/* Simulated Phone Screen */}
                <div className="rounded-[36px] bg-slate-950 h-[560px] overflow-y-auto no-scrollbar pt-8 px-4 text-center flex flex-col justify-between pb-6 border border-white/5">
                  <div>
                    {/* Avatar */}
                    <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden border-2 border-accent-500 shadow-md mt-4">
                      <img
                        src={formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name & Title */}
                    <h3 className="mt-3 font-bold text-white text-base truncate">
                      {formData.name || 'Your Full Name'}
                    </h3>
                    <p className="text-xs text-accent-400 font-semibold uppercase tracking-wider mt-0.5 truncate">
                      {formData.title || 'Designation'}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {formData.company || 'Company Name'}
                    </p>

                    {/* Action Bar */}
                    <div className="grid grid-cols-3 gap-2 mt-4 px-2">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                        <PhoneIcon className="h-3.5 w-3.5 text-blue-400 mb-1" />
                        <span className="text-[10px] text-white/70">Call</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                        <MessageSquareIcon className="h-3.5 w-3.5 text-emerald-400 mb-1" />
                        <span className="text-[10px] text-white/70">WhatsApp</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                        <DownloadIcon className="h-3.5 w-3.5 text-purple-400 mb-1" />
                        <span className="text-[10px] text-white/70">vCard</span>
                      </div>
                    </div>

                    {/* Bio */}
                    {formData.bio && (
                      <p className="mt-4 text-[11px] text-white/60 line-clamp-3 px-2 italic">
                        "{formData.bio}"
                      </p>
                    )}

                    {/* Details list */}
                    <div className="mt-4 space-y-2 text-left px-2">
                      {formData.email && (
                        <div className="p-2 rounded-lg bg-white/[0.03] text-[11px] text-white/70 truncate flex items-center gap-2">
                          <MailIcon className="h-3 w-3 text-white/30 shrink-0" />
                          <span className="truncate">{formData.email}</span>
                        </div>
                      )}
                      {formData.location && (
                        <div className="p-2 rounded-lg bg-white/[0.03] text-[11px] text-white/70 truncate flex items-center gap-2">
                          <MapPinIcon className="h-3 w-3 text-white/30 shrink-0" />
                          <span className="truncate">{formData.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer watermark in simulator */}
                  <div className="text-[9px] text-white/30 pt-4 border-t border-white/5">
                    Live at <span className="text-accent-400 font-mono">{formData.slug || 'slug'}.{rootDomain}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased flex flex-col justify-between">
          <Nav />
          <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-900/80 p-10 text-center text-white/50">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-400 border-t-transparent mb-3" />
              Loading setup wizard...
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <OnboardingWizardContent />
    </React.Suspense>
  );
}

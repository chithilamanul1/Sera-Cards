'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCardIcon,
  UsersIcon,
  BarChart3Icon,
  QrCodeIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  LogOutIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  SparklesIcon,
  Share2Icon,
  TruckIcon,
  SaveIcon,
  Trash2Icon,
  SearchIcon,
  UploadCloudIcon,
  StarIcon,
  LayersIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  PaletteIcon,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { OrderModal } from '@/components/OrderModal';
import { TEMPLATE_PRESETS, generateTemplateHtml, TemplateData } from '@/lib/templates';
import type { CardConfig } from '@/types/card';

export const dynamic = 'force-dynamic';

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'leads' | 'order'>('profile');
  const [leads, setLeads] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Template & Preset Selection
  const [selectedPreset, setSelectedPreset] = useState<string>('personal_hero');

  // Corporate Fleet Lock State
  const [isCorporateLocked, setIsCorporateLocked] = useState(false);
  const [corporateTeamName, setCorporateTeamName] = useState('');

  // Comprehensive Profile Form
  const [profileForm, setProfileForm] = useState<TemplateData>({
    slug: '',
    name: '',
    title: '',
    company: '',
    bio: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    location: 'Colombo, Sri Lanka',
    instagram: '',
    linkedin: '',
    facebook: '',
    tiktok: '',
    lankaQrText: '',
    googleReviewUrl: '',
    catalogPdfUrl: '',
    catalogPdfTitle: '',
  });

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

  // Load User, Profile, Leads, and Orders on mount
  useEffect(() => {
    async function initDashboard() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login?redirect=/dashboard');
          return;
        }

        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          const slug = data.user.cardSlug || data.user.name?.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16) || 'card';

          if (
            slug.startsWith('apex-') ||
            data.user.email?.toLowerCase().includes('apex') ||
            data.user.plan === 'TEAMS' ||
            data.user.plan === 'ENTERPRISE'
          ) {
            setIsCorporateLocked(true);
            setCorporateTeamName('Apex Capital Partners');
          }

          setProfileForm((prev) => ({
            ...prev,
            slug,
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            whatsapp: (data.user.phone || '').replace(/[^0-9]/g, ''),
          }));

          // 1. Fetch saved card profile & metadata from DB
          fetchSavedCard(slug);

          // 2. Fetch user's captured leads
          fetchUserLeads(slug);

          // 3. Fetch user's physical card orders
          fetchUserOrders();
        } else {
          router.push('/login?redirect=/dashboard');
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        router.push('/login?redirect=/dashboard');
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
  }, [router]);

  // Fetch saved card details by slug
  const fetchSavedCard = async (slug: string) => {
    try {
      const res = await fetch(`/api/cards?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.metadata) {
          const m = data.metadata;
          if (m.isTeamCard || m.teamId) {
            setIsCorporateLocked(true);
            setCorporateTeamName(m.company || 'Corporate Fleet');
          }
          setProfileForm((prev) => ({
            ...prev,
            name: m.name || prev.name,
            title: m.title || '',
            company: m.company || '',
            bio: m.bio || '',
            phone: m.phone || prev.phone,
            whatsapp: m.whatsapp || prev.whatsapp,
            email: m.email || prev.email,
            website: m.website || '',
            avatarUrl: m.avatarUrl || prev.avatarUrl,
            coverUrl: m.coverUrl || prev.coverUrl,
            location: m.location || prev.location,
            instagram: m.instagram || '',
            linkedin: m.linkedin || '',
            facebook: m.facebook || '',
            tiktok: m.tiktok || '',
            lankaQrText: m.lankaQrText || '',
            googleReviewUrl: m.googleReviewUrl || '',
            catalogPdfUrl: m.catalogPdfUrl || '',
            catalogPdfTitle: m.catalogPdfTitle || '',
          }));
          if (m.presetId) {
            setSelectedPreset(m.presetId);
          }
        }
      }
    } catch (err) {
      console.warn('Could not load saved card metadata:', err);
    }
  };

  // Fetch leads for this card
  const fetchUserLeads = async (slug: string) => {
    try {
      const res = await fetch(`/api/leads?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Failed to load leads:', err);
    }
  };

  // Fetch orders for this customer
  const fetchUserOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Failed to load orders:', err);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(leadId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Lead deleted');
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
      } else {
        toast.error('Failed to delete lead');
      }
    } catch {
      toast.error('Error deleting lead');
    }
  };

  // Avatar Image Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data, fileName: file.name }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setProfileForm((prev) => ({ ...prev, avatarUrl: data.url }));
          toast.success('Profile photo updated!');
        } else {
          toast.error(data.error || 'Failed to upload photo');
        }
      } catch {
        toast.error('Error uploading photo');
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyLink = () => {
    const slug = profileForm.slug || user?.cardSlug || 'demo';
    const url = `https://${slug}.${rootDomain}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      window.location.href = '/login';
    }
  };

  // Save profile and compile live HTML
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = profileForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || user?.cardSlug;
    if (!slug) {
      toast.error('Please choose a card subdomain handle.');
      return;
    }

    setSaving(true);
    try {
      const templatePayload: TemplateData = {
        ...profileForm,
        slug,
        name: profileForm.name || user?.name || 'Professional',
      };

      // Generate HTML using selected template
      const compiledHtml = generateTemplateHtml(selectedPreset, templatePayload);

      // Metadata to be persisted
      const metadataPayload = {
        ...templatePayload,
        presetId: selectedPreset,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          html_content: compiledHtml,
          metadata: metadataPayload,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update card profile');
      }

      toast.success(`Card published live to https://${slug}.${rootDomain}!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const exportLeadsToCsv = () => {
    if (leads.length === 0) {
      toast.error('No leads available to export');
      return;
    }

    const headers = ['Name', 'Phone', 'Notes', 'Date'];
    const rows = leads.map((l) => [
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.notes || ''}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gosera-leads-${profileForm.slug || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads CSV exported!');
  };

  const filteredLeads = useMemo(() => {
    if (!leadSearch.trim()) return leads;
    const q = leadSearch.toLowerCase().trim();
    return leads.filter(
      (l) =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q)) ||
        (l.notes && l.notes.toLowerCase().includes(q))
    );
  }, [leads, leadSearch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-accent-400 border-t-transparent" />
          <p className="text-sm text-white/50">Loading your GoSera Portal...</p>
        </div>
      </div>
    );
  }

  const liveUrl = `https://${profileForm.slug || user?.cardSlug || 'demo'}.${rootDomain}`;
  const latestOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased flex flex-col justify-between">
      <Toaster position="top-right" />
      <Nav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-24 pb-16">
        {/* Top Management Bar */}
        <div className="bg-ink-900/90 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs uppercase font-bold tracking-widest text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full border border-accent-500/20">
                {user?.plan || 'Basic'} Plan
              </span>
              <span className="text-xs text-white/40 font-mono">ID: {user?.id?.slice(-6)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/50 mt-0.5">
              Live management hub for your GoSera smart NFC business card and leads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {(isCorporateLocked || user?.plan === 'TEAMS' || user?.plan === 'ENTERPRISE' || user?.role === 'ADMIN') && (
              <a
                href="/teams/portal"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition-colors active:scale-95 shadow-sm"
              >
                🏢 Enterprise Fleet Hub &rarr;
              </a>
            )}
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.08] transition-colors active:scale-95"
            >
              {copied ? <CheckIcon className="h-3.5 w-3.5 text-accent-400" /> : <CopyIcon className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a
              href={`/c/${profileForm.slug || user?.cardSlug || 'demo'}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-xs font-bold text-ink-950 hover:bg-accent-400 transition-colors shadow-md active:scale-95"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              View Live Card
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Logout"
            >
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/40">Card Link</span>
              <GlobeIcon className="h-4 w-4 text-accent-400" />
            </div>
            <p className="mt-2 text-lg font-bold text-white font-mono truncate">
              {profileForm.slug || user?.cardSlug}.{rootDomain}
            </p>
            <p className="text-xs text-accent-400 mt-1">● Active & Live</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/40">Captured Leads</span>
              <UsersIcon className="h-4 w-4 text-accent-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{leads.length}</p>
            <p className="text-xs text-white/40 mt-1">Two-way contact submissions</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/40">Hardware Card</span>
              <CreditCardIcon className="h-4 w-4 text-accent-400" />
            </div>
            <p className="mt-2 text-lg font-bold text-white">
              {latestOrder ? latestOrder.finish : 'GoSera NFC Card'}
            </p>
            <p className="text-xs text-accent-400 mt-1">
              {latestOrder ? `Status: ${latestOrder.fulfillmentStatus || 'ORDER_RECEIVED'}` : 'NTAG215 Contactless Chip'}
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-white/10 mb-6 overflow-x-auto no-scrollbar gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-accent-500 text-white'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            <CreditCardIcon className="h-4 w-4" />
            Edit Digital Profile
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'leads'
                ? 'border-accent-500 text-white'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            <UsersIcon className="h-4 w-4" />
            Captured Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'order'
                ? 'border-accent-500 text-white'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            <TruckIcon className="h-4 w-4" />
            Hardware & Order Tracker {orders.length > 0 && `(${orders.length})`}
          </button>
        </div>

        {/* TAB 1: Profile Editor & Live Phone Simulator */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-ink-900/80 border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Digital Profile Settings</h2>
                  <p className="text-xs text-white/40">
                    Live details updated on your card when anyone taps or scans it.
                  </p>
                </div>

                {/* Preset Selector */}
                <div className="flex items-center gap-2">
                  <PaletteIcon className="h-4 w-4 text-accent-400" />
                  <select
                    value={selectedPreset}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    className="rounded-xl border border-white/10 bg-ink-950 px-3 py-1.5 text-xs text-white focus:border-accent-500 focus:outline-none"
                  >
                    {TEMPLATE_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Corporate Fleet Lock Banner */}
                {isCorporateLocked && (
                  <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏢</span>
                      <div>
                        <p className="text-xs font-bold text-sky-300">
                          Corporate Fleet Account — {corporateTeamName || 'Apex Capital Partners'}
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Company branding (Company Name, Logo, Cover, Catalog PDF, Disclaimers) is locked centrally. You can update your direct personal details below.
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full border border-sky-500/30">
                      🔒 Brand Locked
                    </span>
                  </div>
                )}

                {/* Avatar / Photo Upload Bar */}
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-accent-500/40">
                    <img
                      src={profileForm.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all">
                      <UploadCloudIcon className="h-3.5 w-3.5 text-accent-400" />
                      {uploadingAvatar ? 'Uploading...' : 'Upload Profile Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-white/40 mt-1">PNG, JPG or WebP up to 5MB</p>
                  </div>
                </div>

                {/* Subdomain slug */}
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">
                    Card Subdomain Handle
                  </label>
                  <div className="flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-accent-500">
                    <input
                      type="text"
                      value={profileForm.slug}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                        })
                      }
                      placeholder="yourname"
                      className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    />
                    <span className="flex items-center bg-white/[0.04] px-3 font-mono text-xs text-accent-400 border-l border-white/10">
                      .{rootDomain}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. Kasun Perera"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Job Title / Designation</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      placeholder="e.g. Founder & CEO"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-white/60">Company / Brand</label>
                      {isCorporateLocked && (
                        <span className="text-[10px] text-sky-400 font-semibold">
                          🔒 Locked by Corporate HR
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      disabled={isCorporateLocked}
                      placeholder="e.g. Seranex Solutions"
                      className={`w-full rounded-xl border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none ${
                        isCorporateLocked
                          ? 'bg-white/[0.01] opacity-70 cursor-not-allowed border-sky-500/30 text-sky-200'
                          : 'bg-white/[0.03] focus:border-accent-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Location / City</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      placeholder="e.g. Colombo, Sri Lanka"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Direct Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+94711691008"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">WhatsApp Number (Digits only)</label>
                    <input
                      type="tel"
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                      placeholder="94771234567"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Bio / Headline</label>
                  <textarea
                    rows={2}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Short summary of your expertise and services..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="you@domain.lk"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Social & Advanced Integrations */}
                <div className="border-t border-white/10 pt-4 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-accent-400">
                    Social & Direct Payment Links
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={profileForm.instagram}
                        onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                        placeholder="https://instagram.com/username"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">LankaQR / Bank Account</label>
                      <input
                        type="text"
                        value={profileForm.lankaQrText}
                        onChange={(e) => setProfileForm({ ...profileForm, lankaQrText: e.target.value })}
                        placeholder="Commercial Bank: 8009214472"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Google Review 5★ Link</label>
                      <input
                        type="url"
                        value={profileForm.googleReviewUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, googleReviewUrl: e.target.value })}
                        placeholder="https://g.page/r/your-review-link"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Catalog / Brochure PDF Upload */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent-400">
                        📄 Company Catalog / Price List (PDF)
                      </span>
                      {profileForm.catalogPdfUrl && (
                        <span className="text-[10px] text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded-full border border-accent-500/20">
                          ✓ PDF Attached
                        </span>
                      )}
                    </div>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] text-white/50 mb-1">Catalog Display Title</label>
                        <input
                          type="text"
                          value={profileForm.catalogPdfTitle || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, catalogPdfTitle: e.target.value })}
                          placeholder="e.g. 2026 Price List & Brochure"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-accent-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-white/50 mb-1">Upload PDF Document</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setProfileForm((prev) => ({
                                  ...prev,
                                  catalogPdfUrl: ev.target?.result as string,
                                  catalogPdfTitle: prev.catalogPdfTitle || file.name.replace(/\.pdf$/i, ''),
                                }));
                                toast.success('Catalog PDF attached!');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-white/50 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-white/10 file:text-white file:text-xs hover:file:bg-white/20 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-accent-500 px-7 py-3.5 text-sm font-bold text-ink-950 hover:bg-accent-400 transition-all shadow-[0_0_25px_-5px_rgba(168,85,247,0.8)] active:scale-95 disabled:opacity-50"
                >
                  <SaveIcon className="h-4 w-4" />
                  {saving ? 'Publishing Updates...' : 'Publish to Live Card'}
                </button>
              </form>
            </div>

            {/* Live Card Preview Box */}
            <div className="lg:col-span-4 bg-ink-900/80 border border-white/10 rounded-3xl p-6 text-center sticky top-28">
              <h3 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4">Live Preview</h3>
              <div className="w-full max-w-[280px] mx-auto rounded-3xl border border-zinc-800 bg-black p-5 shadow-2xl">
                <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-accent-400 shadow-lg mb-3">
                  <img
                    src={profileForm.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                    alt="Preview avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-white text-base truncate">{profileForm.name || 'Your Name'}</h4>
                <p className="text-xs text-accent-400 font-medium truncate">{profileForm.title || 'Job Title'}</p>
                <p className="text-[11px] text-white/40 truncate mt-0.5">{profileForm.company || 'Company'}</p>
                
                {profileForm.bio && (
                  <p className="text-[10px] text-white/60 bg-white/5 p-2 rounded-lg mt-3 line-clamp-2">
                    {profileForm.bio}
                  </p>
                )}

                <div className="mt-4 space-y-1.5">
                  <div className="h-8 w-full rounded-xl bg-white/10 flex items-center justify-center text-[10px] text-white/70 font-medium">
                    💾 Save Contact (.vcf)
                  </div>
                  <div className="h-8 w-full rounded-xl bg-accent-500/20 border border-accent-500/40 flex items-center justify-center text-[10px] text-accent-400 font-bold">
                    💬 WhatsApp Direct
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 text-left">
                <p className="text-xs text-white/40 mb-2">Dedicated Subdomain:</p>
                <code className="text-xs font-mono text-accent-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/10 block break-all text-center">
                  {liveUrl}
                </code>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs text-accent-300 hover:text-accent-400 transition-colors"
                >
                  Open live page in new tab <ExternalLinkIcon className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Captured Leads Inbox */}
        {activeTab === 'leads' && (
          <div className="bg-ink-900/80 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Captured Leads Inbox</h2>
                <p className="text-xs text-white/40">
                  Clients who exchanged their contact information on your card appear here in real time.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <SearchIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-white/40" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search leads..."
                    className="w-full sm:w-48 rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-accent-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={exportLeadsToCsv}
                  disabled={leads.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.08] transition-colors disabled:opacity-40"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                <UsersIcon className="h-10 w-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-white/70">
                  {leadSearch ? 'No leads matched your search' : 'No leads captured yet'}
                </p>
                <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
                  Tap your physical card on client phones or share your link to start capturing contacts.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLeads.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between hover:border-accent-500/40 transition-colors"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-base">{l.name}</h4>
                        <button
                          type="button"
                          onClick={() => handleDeleteLead(l.id)}
                          className="text-white/30 hover:text-red-400 p-1 rounded-lg transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-accent-400 font-mono mt-1">{l.phone}</p>
                      <span className="text-[10px] text-white/40 block mt-1">
                        {new Date(l.createdAt).toLocaleDateString()} at{' '}
                        {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {l.notes && (
                        <p className="text-xs text-white/60 mt-3 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                          {l.notes}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <a
                        href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                          l.name
                        )}%2C%20great%20connecting%20with%20you!`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-accent-500/10 border border-accent-500/30 py-2 text-xs font-bold text-accent-400 hover:bg-accent-500/20 transition-colors"
                      >
                        💬 WhatsApp
                      </a>
                      <a
                        href={`tel:${l.phone}`}
                        className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10 transition-colors"
                      >
                        <PhoneIcon className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Physical Card Fulfillment & Order Tracker */}
        {activeTab === 'order' && (
          <div className="bg-ink-900/80 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-lg font-bold text-white">Physical Card Fulfillment Tracker</h2>
                <p className="text-xs text-white/40">
                  Real-time status of your physical NFC smart business card.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOrderModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-xs font-bold text-ink-950 hover:bg-accent-400 transition-colors shadow-md active:scale-95"
              >
                <CreditCardIcon className="h-3.5 w-3.5" />
                Order Another Card
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-2xl border border-accent-500/30 bg-accent-500/[0.06] p-8 text-center max-w-xl mx-auto my-6">
                <CreditCardIcon className="h-12 w-12 text-accent-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">You have not ordered a physical card yet</h3>
                <p className="text-xs text-white/60 mt-2 leading-relaxed">
                  Your digital profile is live online! Order your physical GoSera NFC card to start tapping client phones with 0.2s response time.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(true)}
                    className="rounded-xl bg-accent-500 px-6 py-2.5 text-xs font-bold text-ink-950 hover:bg-accent-400 transition-all shadow-lg"
                  >
                    Order Physical Card (From LKR 3,500)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((o) => {
                  const statusSteps = [
                    { key: 'ORDER_RECEIVED', title: 'Order Received', desc: 'Logged and queued for chip encoding.' },
                    { key: 'ENCODING_CHIP', title: 'NFC Chip Encoding', desc: `Programmed with ${o.slug}.${rootDomain}.` },
                    { key: 'PRINTING', title: 'Precision UV Laser Printing', desc: 'Custom logo and details applied.' },
                    { key: 'DISPATCHED', title: 'Dispatched with Courier', desc: 'In transit with tracking.' },
                    { key: 'DELIVERED', title: 'Delivered', desc: 'Handed over at delivery address.' },
                  ];

                  const stepOrder = ['ORDER_RECEIVED', 'ENCODING_CHIP', 'PRINTING', 'DISPATCHED', 'DELIVERED'];
                  const currentIdx = stepOrder.indexOf(o.fulfillmentStatus || 'ORDER_RECEIVED');

                  return (
                    <div key={o.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-accent-400">{o.orderNumber}</span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                o.paymentStatus === 'PAID'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {o.paymentStatus}
                            </span>
                          </div>
                          <p className="text-xs text-white/60 mt-1 font-semibold">{o.finish}</p>
                          <p className="text-[11px] text-white/40">
                            Ordered on {new Date(o.createdAt).toLocaleDateString()} · LKR {Number(o.totalAmount || o.unitPrice).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right sm:text-right">
                          <p className="text-xs text-white/50">Delivery Address:</p>
                          <p className="text-xs text-white/80 font-medium max-w-xs">{o.deliveryAddress}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="pt-6 max-w-xl mx-auto">
                        <div className="relative border-l-2 border-accent-500/40 ml-4 space-y-6 pb-2">
                          {statusSteps.map((step, idx) => {
                            const isDone = idx <= currentIdx;
                            return (
                              <div key={step.key} className="relative pl-7">
                                <span
                                  className={`absolute -left-[11px] top-0 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                    isDone
                                      ? 'bg-accent-500 border-accent-400 text-ink-950 font-bold text-[10px]'
                                      : 'bg-ink-950 border-white/20'
                                  }`}
                                >
                                  {isDone ? '✓' : ''}
                                </span>
                                <h4 className={`text-sm font-bold ${isDone ? 'text-white' : 'text-white/40'}`}>
                                  {step.title}
                                </h4>
                                <p className="text-xs text-white/50 mt-0.5">{step.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Web Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          fetchUserOrders();
        }}
        initialConfig={{
          business: profileForm.company || 'SERANEX',
          tagline: profileForm.title || '',
          name: profileForm.name || user?.name || '',
          title: profileForm.title || '',
          slug: profileForm.slug || user?.cardSlug || '',
          materialId: 'matte',
        }}
      />
    </div>
  );
}

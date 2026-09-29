'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'leads' | 'order'>('profile');
  const [leads, setLeads] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    company: '',
    bio: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    instagram: '',
    linkedin: '',
    lankaQr: '',
  });

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login?redirect=/dashboard');
          return;
        }

        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setProfileForm((prev) => ({
            ...prev,
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            whatsapp: data.user.phone || '',
          }));

          // Fetch user's captured leads if cardSlug exists
          if (data.user.cardSlug) {
            fetchUserLeads(data.user.cardSlug);
          }
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

    loadUserData();
  }, [router]);

  const fetchUserLeads = async (slug: string) => {
    try {
      const res = await fetch(`/api/leads?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : (data.leads || []));
      }
    } catch (err) {
      console.warn('Failed to load leads:', err);
    }
  };

  const handleCopyLink = () => {
    if (!user?.cardSlug) return;
    const url = `https://${user.cardSlug}.${rootDomain}`;
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.cardSlug) return;
    setSaving(true);

    try {
      // Build dynamic HTML for their profile
      const cleanSlug = user.cardSlug;
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${profileForm.name || user.name} | GoSera Digital Card</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-white min-h-screen flex flex-col items-center justify-center p-4 antialiased">
  <div class="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl text-center">
    <div class="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
      ${(profileForm.name || user.name || 'G').charAt(0).toUpperCase()}
    </div>
    <h1 class="text-2xl font-bold text-white">${profileForm.name || user.name}</h1>
    <p class="text-sm font-medium text-emerald-400 mt-0.5">${profileForm.title || 'Professional'}</p>
    <p class="text-xs text-zinc-400 mt-1">${profileForm.company || 'GoSera Verified'}</p>
    ${profileForm.bio ? `<p class="text-xs text-zinc-300 mt-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">${profileForm.bio}</p>` : ''}
    
    <div class="mt-6 space-y-2.5">
      ${profileForm.phone ? `<a href="tel:${profileForm.phone}" class="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-colors">📞 Call Phone</a>` : ''}
      ${profileForm.whatsapp ? `<a href="https://wa.me/${profileForm.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/40 transition-colors">💬 WhatsApp Direct</a>` : ''}
      ${profileForm.email ? `<a href="mailto:${profileForm.email}" class="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-colors">✉️ Send Email</a>` : ''}
      ${profileForm.website ? `<a href="${profileForm.website}" target="_blank" class="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-colors">🌐 Visit Website</a>` : ''}
    </div>

    <!-- Two-Way Lead Exchange Form -->
    <div class="mt-6 pt-5 border-t border-zinc-800 text-left">
      <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Exchange Contact</h3>
      <form onsubmit="event.preventDefault(); fetch('/api/leads', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ slug: '${cleanSlug}', name: document.getElementById('lead-name').value, phone: document.getElementById('lead-phone').value, notes: document.getElementById('lead-notes').value }) }).then(function(){ alert('Contact saved! Thank you.'); });" class="space-y-2">
        <input id="lead-name" type="text" placeholder="Your Name" required class="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs rounded-lg text-white">
        <input id="lead-phone" type="tel" placeholder="Your WhatsApp / Phone" required class="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs rounded-lg text-white">
        <input id="lead-notes" type="text" placeholder="Note or Company (optional)" class="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs rounded-lg text-white">
        <button type="submit" class="w-full py-2 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-lg">Send Contact Back &rarr;</button>
      </form>
    </div>

    <p class="text-[10px] text-zinc-500 mt-6">Powered by GoSera Smart NFC Card · seranex.lk</p>
  </div>
</body>
</html>`;

      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: cleanSlug,
          html_content: html,
        }),
      });

      if (!res.ok) throw new Error('Failed to update card profile');

      toast.success('Digital card updated and deployed live!');
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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gosera-leads-${user?.cardSlug || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads CSV downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-400 border-t-transparent" />
          <p className="text-sm text-white/50">Loading your GoSera Portal...</p>
        </div>
      </div>
    );
  }

  const liveUrl = `https://${user?.cardSlug || 'demo'}.${rootDomain}`;

  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased flex flex-col justify-between">
      <Toaster position="top-right" />
      <Nav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-24 pb-16">
        
        {/* Header Bar */}
        <div className="bg-ink-900/90 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-bold tracking-widest text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full border border-accent-500/20">
                {user?.plan || 'Basic'} Plan
              </span>
              <span className="text-xs text-white/40">ID: {user?.id?.slice(-6)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/50 mt-0.5">
              Manage your live NFC business card, view captured leads, and update profile links.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.08] transition-colors active:scale-95"
            >
              {copied ? <CheckIcon className="h-3.5 w-3.5 text-accent-400" /> : <CopyIcon className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-xs font-bold text-ink-950 hover:bg-accent-400 transition-colors shadow-md active:scale-95"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              View Card
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
              {user?.cardSlug}.{rootDomain}
            </p>
            <p className="text-xs text-accent-400 mt-1">● Active & Live</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/40">Leads Captured</span>
              <UsersIcon className="h-4 w-4 text-accent-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{leads.length}</p>
            <p className="text-xs text-white/40 mt-1">Two-way contact submissions</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/40">Hardware Edition</span>
              <CreditCardIcon className="h-4 w-4 text-accent-400" />
            </div>
            <p className="mt-2 text-lg font-bold text-white">GoSera NFC Card</p>
            <p className="text-xs text-accent-400 mt-1">NTAG215 Contactless Chip</p>
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
            Hardware & Order Tracker
          </button>
        </div>

        {/* TAB 1: Profile Editor */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-ink-900/80 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-1">Digital Card Profile</h2>
              <p className="text-xs text-white/40 mb-6">
                Whenever anyone taps your physical NFC card, they instantly see these details.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. Kasun Perera"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Job Title / Designation</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      placeholder="e.g. Managing Director"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Company / Brand</label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      placeholder="e.g. Seranex Tech"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                      placeholder="e.g. 94771234567"
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
                    placeholder="Short summary of what you do..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-accent-400 transition-all active:scale-95 disabled:opacity-50"
                >
                  <SaveIcon className="h-4 w-4" />
                  {saving ? 'Publishing Updates...' : 'Publish to Live Card'}
                </button>
              </form>
            </div>

            {/* Live Card Preview Box */}
            <div className="lg:col-span-4 bg-ink-900/80 border border-white/10 rounded-3xl p-6 text-center">
              <h3 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4">Live Preview</h3>
              <div className="w-full max-w-[260px] mx-auto rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
                <div className="h-16 w-16 rounded-full bg-accent-500/20 text-accent-400 font-bold text-xl flex items-center justify-center mx-auto mb-3 border border-accent-500/30">
                  {(profileForm.name || user?.name || 'G').charAt(0).toUpperCase()}
                </div>
                <h4 className="font-bold text-white text-base truncate">{profileForm.name || user?.name}</h4>
                <p className="text-xs text-accent-400 truncate">{profileForm.title || 'Professional'}</p>
                <p className="text-[11px] text-white/40 truncate mt-0.5">{profileForm.company || 'GoSera Verified'}</p>
                <div className="mt-4 space-y-1.5">
                  <div className="h-7 w-full rounded-lg bg-white/10 flex items-center justify-center text-[10px] text-white/60">
                    📞 Call Contact
                  </div>
                  <div className="h-7 w-full rounded-lg bg-accent-500/20 border border-accent-500/40 flex items-center justify-center text-[10px] text-accent-400 font-bold">
                    💬 WhatsApp Direct
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-white/40 mb-3">Permanent Card Subdomain:</p>
                <code className="text-xs font-mono text-accent-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/10 block break-all">
                  {liveUrl}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Captured Leads */}
        {activeTab === 'leads' && (
          <div className="bg-ink-900/80 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Captured Leads Inbox</h2>
                <p className="text-xs text-white/40">
                  Every time someone exchanges contact details on your card, they appear here.
                </p>
              </div>
              <button
                onClick={exportLeadsToCsv}
                disabled={leads.length === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.08] transition-colors disabled:opacity-40"
              >
                📥 Export CSV
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                <UsersIcon className="h-10 w-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-white/70">No leads captured yet</p>
                <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
                  Share your GoSera card URL or tap your physical card on client phones to start collecting leads.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {leads.map((l, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-white text-sm">{l.name}</h4>
                        <span className="text-[10px] text-white/40">{new Date(l.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-accent-400 font-mono mt-1">{l.phone}</p>
                      {l.notes && <p className="text-xs text-white/50 mt-2 bg-white/[0.02] p-2 rounded-lg">{l.notes}</p>}
                    </div>

                    <a
                      href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(l.name)}%2C%20great%20connecting%20with%20you!`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-accent-500/10 border border-accent-500/30 py-2 text-xs font-bold text-accent-400 hover:bg-accent-500/20 transition-colors"
                    >
                      💬 Message on WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Order Status Tracker */}
        {activeTab === 'order' && (
          <div className="bg-ink-900/80 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-1">Physical Card Fulfillment Tracker</h2>
            <p className="text-xs text-white/40 mb-8">
              Real-time production and delivery status for your physical GoSera NFC card.
            </p>

            <div className="max-w-2xl mx-auto py-6">
              <div className="relative border-l-2 border-accent-500/40 ml-4 space-y-8 pb-4">
                {[
                  { title: 'Order Received', desc: 'Hardware order verified and logged into production queue.', done: true },
                  { title: 'Chip Encoding', desc: 'NXP NTAG215 NFC chip encoded with your dedicated URL.', done: true },
                  { title: 'Laser Printing', desc: 'Matte composite finish applied with precision UV logo printing.', done: true },
                  { title: 'Dispatched with Courier', desc: 'Package assigned to courier for island-wide delivery.', done: false },
                  { title: 'Delivered', desc: 'Handed over directly to your delivery address.', done: false },
                ].map((step, idx) => (
                  <div key={step.title} className="relative pl-8">
                    <span className={`absolute -left-[11px] top-0 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      step.done ? 'bg-accent-500 border-accent-400 text-ink-950 font-bold text-[10px]' : 'bg-ink-950 border-white/20'
                    }`}>
                      {step.done ? '✓' : ''}
                    </span>
                    <h4 className={`text-sm font-bold ${step.done ? 'text-white' : 'text-white/40'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-white/50 mt-0.5">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

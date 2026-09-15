'use client';

import { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { TEMPLATE_PRESETS, generateTemplateHtml, TemplateData } from '@/lib/templates';

type Card = {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: { leads: number };
};

type Lead = {
  id: string;
  clientSlug: string;
  name: string;
  phone: string;
  notes: string | null;
  createdAt: string;
};

export default function AdminDashboard() {
  const [secret, setSecret] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'studio' | 'cards' | 'leads'>('studio');
  
  // Studio & Builder State
  const [editorMode, setEditorMode] = useState<'visual' | 'raw'>('visual');
  const [selectedPreset, setSelectedPreset] = useState<string>('personal_hero');
  const [slug, setSlug] = useState<string>('kosala');
  const [rawHtmlContent, setRawHtmlContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [templateForm, setTemplateForm] = useState<TemplateData>({
    slug: 'kosala',
    name: 'Kosala Fernando',
    title: 'CEO & Founder',
    company: 'CODEAERON',
    phone: '+94711691008',
    whatsapp: '947711691008',
    email: 'kosala.codeaeron@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    bio: "Hi! I'm Kosala Fernando. I'm the CEO & Founder of CODEAERON.",
    location: 'No 113A, Hakmana Road, Matara',
    website: 'https://www.codeaeron.com',
    googleReviewUrl: '',
    lankaQrText: 'Bank of Ceylon: 0008392810 / LankaQR: CODEAERON-PAY',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    tiktok: '',
    snapchat: '',
  });

  // Modals
  const [nfcModalCard, setNfcModalCard] = useState<Card | null>(null);
  const [viewLeadsSlug, setViewLeadsSlug] = useState<string | null>(null);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'serenex.lk';

  // Live compiled HTML for the phone simulator
  const liveHtml = useMemo(() => {
    if (editorMode === 'raw') {
      return rawHtmlContent || '<!-- Empty HTML payload -->';
    }
    const currentSlug = slug.trim() || 'preview';
    return generateTemplateHtml(selectedPreset, { ...templateForm, slug: currentSlug });
  }, [editorMode, rawHtmlContent, selectedPreset, templateForm, slug]);

  // Check session storage on mount
  useEffect(() => {
    const savedSecret = sessionStorage.getItem('adminSecret');
    if (savedSecret) {
      setSecret(savedSecret);
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch cards and leads when authenticated
  useEffect(() => {
    if (isAuthenticated && secret) {
      fetchCards();
      fetchLeads();
    }
  }, [isAuthenticated, secret]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards', {
        headers: { 'x-admin-secret': secret },
      });
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Invalid admin secret');
          handleLogout();
          return;
        }
        throw new Error('Failed to fetch cards');
      }
      const data = await res.json();
      setCards(data);
    } catch (error) {
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads', {
        headers: { 'x-admin-secret': secret },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  // Switch presets with friendly default data
  const handlePresetSwitch = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === 'company_profile') {
      setSlug('auraliving');
      setTemplateForm((prev) => ({
        ...prev,
        slug: 'auraliving',
        company: 'Aura Living Interiors',
        title: 'Architectural & Interior Design Studio',
        bio: 'Crafting luxury sustainable living spaces across Sri Lanka. Commercial & residential turnkey fit-outs.',
        phone: '+94112345678',
        whatsapp: '94771234567',
        email: 'contact@auraliving.lk',
        website: 'https://auraliving.lk',
        location: '45/2 Ward Place, Colombo 07',
        avatarUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        lankaQrText: 'Commercial Bank - Colombo 07: 1000 8492 1198',
        googleReviewUrl: 'https://g.page/r/review',
      }));
    } else if (presetId === 'personal_hero') {
      setSlug('kosala');
      setTemplateForm((prev) => ({
        ...prev,
        slug: 'kosala',
        name: 'Kosala Fernando',
        title: 'CEO & Founder',
        company: 'CODEAERON',
        phone: '+94711691008',
        whatsapp: '947711691008',
        email: 'kosala.codeaeron@gmail.com',
        location: 'No 113A, Hakmana Road, Matara',
        website: 'https://www.codeaeron.com',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
        bio: "Hi! I'm Kosala Fernando. I'm the CEO & Founder of CODEAERON.",
      }));
    }
  };

  // Deploy current card (from studio or raw editor)
  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    const finalHtml = editorMode === 'raw' ? rawHtmlContent.trim() : liveHtml;

    if (!targetSlug || !finalHtml) {
      toast.error('Slug and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: targetSlug, html_content: finalHtml }),
      });

      if (!res.ok) throw new Error('Failed to deploy');

      toast.success(`Profile https://${targetSlug}.${rootDomain} is LIVE!`);
      fetchCards();
    } catch (error) {
      toast.error('Failed to deploy card');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Card deleted');
      setCards(cards.filter((c) => c.id !== id));
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}!`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-4 md:p-8">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />
      
      {/* ── Top Header ── */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Sera Cards Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              SaaS Engine v2.5
            </span>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            Dynamic Profile Creator &middot; Real-Time Phone Simulator &middot; Multi-Owner Lead Hub &middot; Instant NFC Flashing
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Main Navigation Tabs */}
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'studio' ? 'bg-emerald-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🚀 Studio & Builder
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'cards' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              📇 Active Profiles ({cards.length})
            </button>
            <button
              onClick={() => { setActiveTab('leads'); fetchLeads(); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'leads' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              📬 Captured Leads ({leads.length})
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Main Workspaces ── */}
      <main className="max-w-7xl mx-auto">
        
        {/* ══════════════════════════════════════════════════════════════
            TAB 1: STUDIO & BUILDER (Interactive Configurator + Live Phone)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            
            {/* Top Bar: Preset Selector & Mode Switcher */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <span className="text-xs uppercase font-bold text-zinc-500 whitespace-nowrap mr-1">Preset:</span>
                {TEMPLATE_PRESETS.map((p) => {
                  const active = selectedPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetSwitch(p.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                        active
                          ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md'
                          : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <span className="text-xs text-zinc-500 uppercase font-medium">Mode:</span>
                <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setEditorMode('visual')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      editorMode === 'visual' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🎨 Visual Studio
                  </button>
                  <button
                    onClick={() => {
                      if (!rawHtmlContent) setRawHtmlContent(liveHtml);
                      setEditorMode('raw');
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      editorMode === 'raw' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    💻 Raw HTML
                  </button>
                </div>
              </div>
            </div>

            {/* Split Screen Studio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (7 Cols): Profile Form */}
              <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selectedPreset === 'company_profile' ? 'Company Profile Studio' : 'Personal Profile Studio'}
                    </h2>
                    <p className="text-xs text-zinc-400">All fields update the interactive phone simulator in real-time</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-zinc-800 text-amber-400 rounded-full font-mono font-semibold">
                    {slug || 'yourname'}.{rootDomain}
                  </span>
                </div>

                {editorMode === 'visual' ? (
                  <form onSubmit={handleDeploy} className="space-y-4">
                    {/* Slug & Dynamic Subdomain */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                        Profile Slug (Subdomain)
                      </label>
                      <div className="flex rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 focus-within:border-emerald-500">
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => {
                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                            setSlug(val);
                            setTemplateForm((prev) => ({ ...prev, slug: val }));
                          }}
                          placeholder="e.g. pradeep"
                          className="w-full px-4 py-2.5 bg-transparent text-white font-mono text-sm outline-none"
                          required
                        />
                        <span className="px-3.5 flex items-center text-xs font-mono text-emerald-400 bg-zinc-900 border-l border-zinc-800 select-none">
                          .{rootDomain}
                        </span>
                      </div>
                    </div>

                    {/* Identity Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                          {selectedPreset === 'company_profile' ? 'Company Name' : 'Full Name'}
                        </label>
                        <input
                          type="text"
                          value={selectedPreset === 'company_profile' ? templateForm.company : templateForm.name}
                          onChange={(e) => {
                            if (selectedPreset === 'company_profile') {
                              setTemplateForm({ ...templateForm, company: e.target.value });
                            } else {
                              setTemplateForm({ ...templateForm, name: e.target.value });
                            }
                          }}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                          {selectedPreset === 'company_profile' ? 'Business Category' : 'Designation / Title'}
                        </label>
                        <input
                          type="text"
                          value={templateForm.title}
                          onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                        />
                      </div>
                    </div>

                    {/* Owner WhatsApp Notification Hotline */}
                    <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          📲 Card Owner WhatsApp (For Instant Lead Alerts)
                        </label>
                        <span className="text-[10px] text-emerald-300 font-semibold">Dynamic per profile</span>
                      </div>
                      <input
                        type="tel"
                        value={templateForm.whatsapp}
                        onChange={(e) => setTemplateForm({ ...templateForm, whatsapp: e.target.value })}
                        placeholder="e.g. 94771234567"
                        className="w-full px-3.5 py-2 bg-zinc-950 border border-emerald-500/40 rounded-lg text-sm text-emerald-200 font-mono"
                        required
                      />
                      <p className="text-[11px] text-zinc-400 mt-1">
                        When someone views this card and taps "Connect", the alert and WhatsApp chat route directly to this number.
                      </p>
                    </div>

                    {/* Contact Rows */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">Hotline / Phone Number</label>
                        <input
                          type="text"
                          value={templateForm.phone}
                          onChange={(e) => setTemplateForm({ ...templateForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">Official Email</label>
                        <input
                          type="email"
                          value={templateForm.email}
                          onChange={(e) => setTemplateForm({ ...templateForm, email: e.target.value })}
                          className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">Official Website URL</label>
                        <input
                          type="url"
                          value={templateForm.website}
                          onChange={(e) => setTemplateForm({ ...templateForm, website: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">Location / Address</label>
                        <input
                          type="text"
                          value={templateForm.location}
                          onChange={(e) => setTemplateForm({ ...templateForm, location: e.target.value })}
                          placeholder="Colombo, Sri Lanka"
                          className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                        />
                      </div>
                    </div>

                    {/* Media URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">
                          {selectedPreset === 'company_profile' ? 'Company Logo URL' : 'Profile Photo URL'}
                        </label>
                        <input
                          type="url"
                          value={templateForm.avatarUrl}
                          onChange={(e) => setTemplateForm({ ...templateForm, avatarUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">Cover Banner URL (Company)</label>
                        <input
                          type="url"
                          value={templateForm.coverUrl || ''}
                          onChange={(e) => setTemplateForm({ ...templateForm, coverUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs text-zinc-400 font-medium mb-1">Bio / Tagline Description</label>
                      <input
                        type="text"
                        value={templateForm.bio}
                        onChange={(e) => setTemplateForm({ ...templateForm, bio: e.target.value })}
                        className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                      />
                    </div>

                    {/* LankaQR & Reviews */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">💳 LankaQR / Bank Account</label>
                        <input
                          type="text"
                          value={templateForm.lankaQrText || ''}
                          onChange={(e) => setTemplateForm({ ...templateForm, lankaQrText: e.target.value })}
                          placeholder="Commercial Bank: 1000 8492 1198"
                          className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">⭐ Google Review URL</label>
                        <input
                          type="url"
                          value={templateForm.googleReviewUrl || ''}
                          onChange={(e) => setTemplateForm({ ...templateForm, googleReviewUrl: e.target.value })}
                          placeholder="https://g.page/r/..."
                          className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white"
                        />
                      </div>
                    </div>

                    {/* Socials */}
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="url"
                        value={templateForm.facebook || ''}
                        onChange={(e) => setTemplateForm({ ...templateForm, facebook: e.target.value })}
                        placeholder="Facebook URL"
                        className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                      <input
                        type="url"
                        value={templateForm.instagram || ''}
                        onChange={(e) => setTemplateForm({ ...templateForm, instagram: e.target.value })}
                        placeholder="Instagram URL"
                        className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                      <input
                        type="url"
                        value={templateForm.linkedin || ''}
                        onChange={(e) => setTemplateForm({ ...templateForm, linkedin: e.target.value })}
                        placeholder="LinkedIn URL"
                        className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>

                    {/* Deploy Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Publishing...' : `🚀 Deploy & Make Live (${slug || 'yourname'}.${rootDomain})`}
                    </button>
                  </form>
                ) : (
                  /* Raw HTML View */
                  <form onSubmit={handleDeploy} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                        Profile Slug
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                        Raw Standalone HTML Payload
                      </label>
                      <textarea
                        value={rawHtmlContent}
                        onChange={(e) => setRawHtmlContent(e.target.value)}
                        className="w-full h-96 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 resize-y"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm"
                    >
                      {isSubmitting ? 'Deploying...' : 'Deploy Raw HTML to Edge'}
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column (5 Cols): Real-time Phone Simulator */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="text-center mb-3">
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Device Simulator Preview
                  </span>
                </div>

                {/* Smartphone Mockup Frame */}
                <div className="relative w-[340px] h-[680px] bg-black rounded-[46px] border-[8px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800"></div>
                  </div>

                  {/* Screen Content Iframe */}
                  <div className="flex-1 w-full h-full pt-1 bg-white overflow-hidden">
                    <iframe
                      title="Profile Simulator"
                      srcDoc={liveHtml}
                      className="w-full h-full border-none select-none"
                    />
                  </div>
                </div>

                {/* Quick Actions Below Simulator */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const w = window.open();
                      if (w) w.document.write(liveHtml);
                    }}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 rounded-lg transition-colors"
                  >
                    🔗 Open Test Tab
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`https://${slug}.${rootDomain}`, 'Profile URL')}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 rounded-lg transition-colors"
                  >
                    📋 Copy URL
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: ACTIVE PROFILES (Cards List + NFC Programmer)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'cards' && (
          <section className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Active Digital Profiles</h2>
                <p className="text-xs text-zinc-400">Profiles live on wildcard subdomains serving dynamic HTML</p>
              </div>
              <button
                onClick={() => setActiveTab('studio')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                + Create New Profile
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="pb-3 font-semibold">Subdomain</th>
                    <th className="pb-3 font-semibold">Leads</th>
                    <th className="pb-3 font-semibold">NFC Production</th>
                    <th className="pb-3 font-semibold text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-zinc-800/60">
                  {loading && cards.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-500">Loading cards...</td>
                    </tr>
                  ) : cards.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-500">
                        No profiles deployed yet. Go to <strong>Studio & Builder</strong> to create one!
                      </td>
                    </tr>
                  ) : (
                    cards.map((card) => {
                      const cardLeads = leads.filter((l) => l.clientSlug === card.slug);
                      return (
                        <tr key={card.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-4">
                            <span className="font-mono font-bold text-emerald-400 text-base">{card.slug}</span>
                            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                              <a
                                href={`https://${card.slug}.${rootDomain}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-400 hover:underline"
                              >
                                {card.slug}.{rootDomain} &rarr;
                              </a>
                            </div>
                          </td>
                          <td className="py-4">
                            {cardLeads.length > 0 ? (
                              <button
                                onClick={() => setViewLeadsSlug(card.slug)}
                                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 transition-colors"
                              >
                                {cardLeads.length} Lead{cardLeads.length > 1 ? 's' : ''}
                              </button>
                            ) : (
                              <span className="text-xs text-zinc-500">0 leads</span>
                            )}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setNfcModalCard(card)}
                                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                              >
                                ⚡ Program NFC
                              </button>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(`https://${card.slug}.${rootDomain}`, 'Link')}
                                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleDelete(card.id)}
                              className="text-red-400 hover:text-red-300 text-xs px-2.5 py-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: CAPTURED LEADS (Multi-Profile Leads Hub)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'leads' && (
          <section className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Multi-Profile Leads CRM</h2>
                <p className="text-xs text-zinc-400">Prospects captured across all individual & corporate profiles</p>
              </div>
              <button
                onClick={fetchLeads}
                className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
              >
                🔄 Refresh Leads
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="py-16 text-center text-zinc-500">
                <p className="text-3xl mb-2">📬</p>
                <p>No leads captured yet.</p>
                <p className="text-xs text-zinc-600 mt-1">
                  When prospects share details via any profile's "Connect" drawer, they appear here instantly.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                      <th className="pb-3 font-semibold">Prospect</th>
                      <th className="pb-3 font-semibold">Phone / WhatsApp</th>
                      <th className="pb-3 font-semibold">Profile Slug</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold text-right">Direct Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-zinc-800/60">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3.5">
                          <p className="font-semibold text-zinc-100">{lead.name}</p>
                          {lead.notes && <p className="text-xs text-zinc-400 mt-0.5">{lead.notes}</p>}
                        </td>
                        <td className="py-3.5 font-mono text-zinc-300 text-xs">
                          {lead.phone}
                        </td>
                        <td className="py-3.5">
                          <span className="font-mono text-xs px-2.5 py-0.5 bg-zinc-800 text-emerald-400 rounded-md font-semibold">
                            {lead.clientSlug}
                          </span>
                        </td>
                        <td className="py-3.5 text-xs text-zinc-500">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20connecting%20via%20Sera%20Cards!`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
                          >
                            💬 WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ── Modal: Programmer QR (NFC Flashing Automation) ── */}
      {nfcModalCard && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setNfcModalCard(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl font-bold"
            >
              &times;
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
              ⚡ NFC Production Programmer
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">
              Flash Card: <span className="text-amber-400 font-mono">{nfcModalCard.slug}</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Scan this QR with your NFC writer app to flash the NTAG215 chip in 15 seconds
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block mx-auto mb-5 shadow-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(`https://${nfcModalCard.slug}.${rootDomain}`)}`}
                alt={`NFC Programmer QR for ${nfcModalCard.slug}`}
                className="w-52 h-52 mx-auto block"
              />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 mb-5 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-amber-300 truncate text-left">
                https://{nfcModalCard.slug}.{rootDomain}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(`https://${nfcModalCard.slug}.${rootDomain}`, 'Target URL')}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-md shrink-0 transition-colors"
              >
                Copy URL
              </button>
            </div>

            <div className="text-left bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 text-xs text-zinc-400 space-y-1.5 mb-6">
              <p className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                NTAG215 15-Sec Flashing Workflow:
              </p>
              <p>1. Open <strong>NFC Tools</strong> (iOS/Android) &rarr; Tap <strong>Write</strong></p>
              <p>2. Add Record &rarr; <strong>URL / URI</strong> &rarr; Scan QR or paste copied URL</p>
              <p>3. Tap <strong>Write</strong> and hold card to the top edge of your handset</p>
              <p>4. Verify link opens in native browser &rarr; Pack & Ship</p>
            </div>

            <button
              type="button"
              onClick={() => setNfcModalCard(null)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-sm transition-colors"
            >
              Done / Close Programmer
            </button>
          </div>
        </div>
      )}

      {/* ── Modal: View Card Leads ── */}
      {viewLeadsSlug && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Leads for <span className="text-emerald-400 font-mono">{viewLeadsSlug}</span>
                </h3>
              </div>
              <button
                onClick={() => setViewLeadsSlug(null)}
                className="text-zinc-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {leads.filter((l) => l.clientSlug === viewLeadsSlug).length === 0 ? (
                <p className="text-zinc-500 text-sm py-4 text-center">No leads recorded for this card yet.</p>
              ) : (
                leads.filter((l) => l.clientSlug === viewLeadsSlug).map((lead) => (
                  <div key={lead.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-zinc-100">{lead.name}</p>
                      <p className="font-mono text-xs text-zinc-400">{lead.phone}</p>
                      {lead.notes && <p className="text-xs text-zinc-500 mt-1">{lead.notes}</p>}
                    </div>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20connecting!`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-500/30"
                    >
                      WhatsApp
                    </a>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setViewLeadsSlug(null)}
              className="mt-5 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

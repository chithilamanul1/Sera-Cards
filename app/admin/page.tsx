'use client';

import { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<'cards' | 'leads'>('cards');
  
  // Card Creation Form
  const [slug, setSlug] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Template Injector State
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('personal_hero');
  const [templateForm, setTemplateForm] = useState<TemplateData>({
    slug: '',
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

  // Programmer Modal State
  const [nfcModalCard, setNfcModalCard] = useState<Card | null>(null);

  // Card Leads Modal State
  const [viewLeadsSlug, setViewLeadsSlug] = useState<string | null>(null);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'serenex.lk';

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

  // Fetch data when authenticated
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) {
      sessionStorage.setItem('adminSecret', secret);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminSecret');
    setSecret('');
    setIsAuthenticated(false);
    setCards([]);
    setLeads([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !htmlContent.trim()) {
      toast.error('Slug and HTML content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ slug, html_content: htmlContent }),
      });

      if (!res.ok) throw new Error('Failed to save card');
      
      toast.success('Card deployed successfully!');
      setSlug('');
      setHtmlContent('');
      fetchCards();
    } catch (error) {
      toast.error('Failed to deploy card');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      });

      if (!res.ok) throw new Error('Failed to delete card');
      
      toast.success('Card deleted');
      setCards(cards.filter(c => c.id !== id));
    } catch (error) {
      toast.error('Failed to delete card');
    }
  };

  // Compile and inject template HTML into editor
  const handleInjectTemplate = () => {
    const targetSlug = templateForm.slug.trim() || slug.trim() || templateForm.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
    const compiledData = { ...templateForm, slug: targetSlug };
    const html = generateTemplateHtml(selectedPreset, compiledData);
    setHtmlContent(html);
    if (!slug) setSlug(targetSlug);
    setShowTemplateModal(false);
    toast.success(`Injected ${selectedPreset.toUpperCase()} template!`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Staff Portal</span>
            <h1 className="text-2xl font-bold mt-1 text-zinc-100">Sera Cards Admin</h1>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Admin Secret</label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-100 placeholder-zinc-600"
                placeholder="Enter admin password..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-4 md:p-10">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />
      
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Sera Cards Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Production v2.0
            </span>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Wildcard Subdomains &middot; Preset HTML Injector &middot; Lead Capture &middot; NFC Flashing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'cards' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Cards ({cards.length})
            </button>
            <button
              onClick={() => { setActiveTab('leads'); fetchLeads(); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'leads' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Leads ({leads.length})
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        {activeTab === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form & Template Injector (5 Cols) */}
            <section className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 h-fit backdrop-blur-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-zinc-100">Deploy Digital Card</h2>
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  ⚡ Template Injector
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                    Client Slug
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="e.g. pradeep"
                      className="w-full px-3.5 py-2.5 bg-transparent text-zinc-100 placeholder-zinc-600 font-mono text-sm outline-none"
                      required
                    />
                    <span className="px-3 flex items-center text-xs text-zinc-500 bg-zinc-900 border-l border-zinc-800 select-none">
                      .{rootDomain}
                    </span>
                  </div>
                  {slug && (
                    <div className="mt-2 text-xs text-zinc-500 flex flex-col gap-0.5">
                      <span className="text-emerald-400">🔗 Subdomain: https://{slug}.{rootDomain}</span>
                      <span className="text-zinc-500">🔗 Path: https://{rootDomain}/c/{slug}</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Standalone HTML / CSS / JS
                    </label>
                    {htmlContent && (
                      <span className="text-[11px] text-zinc-500">
                        {htmlContent.length.toLocaleString()} chars
                      </span>
                    )}
                  </div>
                  <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="<!-- Paste complete raw HTML document, or click 'Template Injector' above -->"
                    className="w-full h-80 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-300 font-mono text-xs leading-relaxed resize-y"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-emerald-950/40 flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? 'Deploying...' : '🚀 Deploy to Edge & Database'}
                  </button>
                  {htmlContent && (
                    <button
                      type="button"
                      onClick={() => { setHtmlContent(''); setSlug(''); }}
                      className="px-3 py-3 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-xs text-zinc-400"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Right Column: Active Cards Table (7 Cols) */}
            <section className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-100">Live Profiles</h2>
                  <p className="text-xs text-zinc-400">Cards registered and instantly serving custom code</p>
                </div>
                <span className="text-xs font-semibold bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700">
                  {cards.length} Total Cards
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                      <th className="pb-3 font-semibold">Client Slug</th>
                      <th className="pb-3 font-semibold">Actions</th>
                      <th className="pb-3 font-semibold text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-zinc-800/60">
                    {loading && cards.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-12 text-center text-zinc-500 text-sm">
                          Loading active cards...
                        </td>
                      </tr>
                    ) : cards.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-12 text-center text-zinc-500 text-sm">
                          No digital cards deployed yet. Click <strong>Template Injector</strong> to create your first one!
                        </td>
                      </tr>
                    ) : (
                      cards.map((card) => {
                        const cardLeads = leads.filter(l => l.clientSlug === card.slug);
                        return (
                          <tr key={card.id} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="py-4">
                              <div className="font-mono font-medium text-emerald-400 text-sm flex items-center gap-1.5">
                                <span>{card.slug}</span>
                              </div>
                              <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                <a
                                  href={`https://${card.slug}.${rootDomain}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-400 hover:underline flex items-center gap-1"
                                >
                                  {card.slug}.{rootDomain} &rarr;
                                </a>
                                {cardLeads.length > 0 && (
                                  <button
                                    onClick={() => setViewLeadsSlug(card.slug)}
                                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors"
                                  >
                                    {cardLeads.length} Lead{cardLeads.length > 1 ? 's' : ''}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setNfcModalCard(card)}
                                  className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                                  title="Open NFC flashing QR & instructions"
                                >
                                  ⚡ Program NFC
                                </button>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(`https://${card.slug}.${rootDomain}`, 'URL')}
                                  className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors"
                                  title="Copy Subdomain Link"
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

          </div>
        ) : (
          /* Leads Tab */
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Captured Leads Inbox</h2>
                <p className="text-xs text-zinc-400">Prospects who shared their contact info via digital cards</p>
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
                <p className="text-2xl mb-2">📬</p>
                <p>No leads captured yet.</p>
                <p className="text-xs text-zinc-600 mt-1">When someone taps "Connect" on any Sera Card, their details will appear here instantly.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                      <th className="pb-3 font-semibold">Prospect</th>
                      <th className="pb-3 font-semibold">Phone / WhatsApp</th>
                      <th className="pb-3 font-semibold">Card Slug</th>
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
                          <span className="font-mono text-xs px-2 py-0.5 bg-zinc-800 text-emerald-400 rounded-md">
                            {lead.clientSlug}
                          </span>
                        </td>
                        <td className="py-3.5 text-xs text-zinc-500">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20connecting%20via%20my%20Sera%20Card!`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors"
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

      {/* ── Modal 1: Template Injector ── */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-xl font-bold text-zinc-100">Template Injector</h3>
                <p className="text-xs text-zinc-400">Select a layout preset, customize key fields, and inject ready-to-deploy HTML</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-zinc-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Presets Selector (4 Presets) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {TEMPLATE_PRESETS.map((p) => {
                const active = selectedPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPreset(p.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      active
                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 block mb-1">
                      {p.badge}
                    </span>
                    <h4 className="font-bold text-sm text-zinc-100 mb-1">{p.name}</h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{p.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Fast Autofill Fields */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Fast Fields Customization</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Target Slug</label>
                  <input
                    type="text"
                    value={templateForm.slug}
                    onChange={(e) => setTemplateForm({ ...templateForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    placeholder="e.g. pradeep"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Client Full Name</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Designation / Title</label>
                  <input
                    type="text"
                    value={templateForm.title}
                    onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    value={templateForm.company}
                    onChange={(e) => setTemplateForm({ ...templateForm, company: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={templateForm.phone}
                    onChange={(e) => setTemplateForm({ ...templateForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">WhatsApp (Digits Only)</label>
                  <input
                    type="text"
                    value={templateForm.whatsapp}
                    onChange={(e) => setTemplateForm({ ...templateForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={templateForm.email}
                    onChange={(e) => setTemplateForm({ ...templateForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Avatar / Profile Photo URL</label>
                  <input
                    type="url"
                    value={templateForm.avatarUrl}
                    onChange={(e) => setTemplateForm({ ...templateForm, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Cover Banner URL <span className="text-zinc-600">(Company Profile)</span></label>
                  <input
                    type="url"
                    value={templateForm.coverUrl || ''}
                    onChange={(e) => setTemplateForm({ ...templateForm, coverUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Short Bio / Tagline</label>
                <input
                  type="text"
                  value={templateForm.bio}
                  onChange={(e) => setTemplateForm({ ...templateForm, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Location / Address</label>
                  <input
                    type="text"
                    value={templateForm.location}
                    onChange={(e) => setTemplateForm({ ...templateForm, location: e.target.value })}
                    placeholder="Colombo, Sri Lanka"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Website URL</label>
                  <input
                    type="url"
                    value={templateForm.website}
                    onChange={(e) => setTemplateForm({ ...templateForm, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  ⭐ Google Review URL <span className="text-zinc-600 font-normal">(optional — boosts review count)</span>
                </label>
                <input
                  type="url"
                  value={templateForm.googleReviewUrl || ''}
                  onChange={(e) => setTemplateForm({ ...templateForm, googleReviewUrl: e.target.value })}
                  placeholder="https://g.page/r/YOUR_CODE/review"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={templateForm.facebook || ''}
                    onChange={(e) => setTemplateForm({ ...templateForm, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">📸 Instagram URL</label>
                  <input
                    type="url"
                    value={templateForm.instagram || ''}
                    onChange={(e) => setTemplateForm({ ...templateForm, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">💼 LinkedIn URL</label>
                  <input
                    type="url"
                    value={templateForm.linkedin || ''}
                    onChange={(e) => setTemplateForm({ ...templateForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">💳 LankaQR / Payment Details <span className="text-zinc-600">(optional)</span></label>
                <input
                  type="text"
                  value={templateForm.lankaQrText || ''}
                  onChange={(e) => setTemplateForm({ ...templateForm, lankaQrText: e.target.value })}
                  placeholder="Bank of Ceylon: 000XXXXX / LankaQR: YOUR-MERCHANT"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                />
              </div>
            </div>


            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInjectTemplate}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg text-sm shadow-md"
              >
                ✨ Compile & Populate Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: Programmer QR (NFC Flashing Automation) ── */}
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
              Scan this high-contrast QR with your NFC writer app or desktop writer to program the NTAG215 chip
            </p>

            {/* High Contrast Production QR */}
            <div className="bg-white p-4 rounded-2xl inline-block mx-auto mb-5 shadow-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(`https://${nfcModalCard.slug}.${rootDomain}`)}`}
                alt={`NFC Programmer QR for ${nfcModalCard.slug}`}
                className="w-52 h-52 mx-auto block"
              />
            </div>

            {/* Target URL with Copy Button */}
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

            {/* Production 15-Second Flashing Checklist */}
            <div className="text-left bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 text-xs text-zinc-400 space-y-1.5 mb-6">
              <p className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                NTAG215 15-Sec Flashing Workflow:
              </p>
              <p>1. Open <strong>NFC Tools</strong> (iOS/Android) &rarr; Tap <strong>Write</strong></p>
              <p>2. Add Record &rarr; <strong>URL / URI</strong> &rarr; Paste copied URL</p>
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

      {/* ── Modal 3: View Card Leads ── */}
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
              {leads.filter(l => l.clientSlug === viewLeadsSlug).length === 0 ? (
                <p className="text-zinc-500 text-sm py-4 text-center">No leads recorded for this card yet.</p>
              ) : (
                leads.filter(l => l.clientSlug === viewLeadsSlug).map((lead) => (
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

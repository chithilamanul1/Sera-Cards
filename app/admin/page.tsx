'use client';

export const dynamic = 'force-dynamic';

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

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
  city: string | null;
  brandName: string;
  tagline: string | null;
  nameOnCard: string;
  designation: string | null;
  slug: string;
  finish: string;
  logoUrl: string | null;
  unitPrice: number;
  costPrice?: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  fulfillmentStatus?: string;
  bio?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  createdAt: string;
};

type WeeklySettlementItem = {
  id: string;
  weekId: string;
  startDate: string;
  endDate: string;
  totalCardsSold: number;
  totalRevenue: number;
  productionCostTotal: number;
  netProfitPool: number;
  friendCommission: number;
  ownerProfit: number;
  settlementStatus: string;
  settledAt: string | null;
  notes: string | null;
};

export default function AdminDashboard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settlementData, setSettlementData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'studio' | 'cards' | 'leads' | 'orders' | 'settlements'>('orders');

  // Quick Order Modal State
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [quickOrderForm, setQuickOrderForm] = useState({
    clientName: '',
    whatsappNumber: '',
    cardVariant: 'Sera Signature PVC',
    customAmount: '3500',
    paymentStatus: 'PAID',
    fulfillmentStatus: 'ORDER_RECEIVED',
  });
  
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

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

  // Live compiled HTML for the phone simulator
  const liveHtml = useMemo(() => {
    if (editorMode === 'raw') {
      return rawHtmlContent || '<!-- Empty HTML payload -->';
    }
    const currentSlug = slug.trim() || 'preview';
    return generateTemplateHtml(selectedPreset, { ...templateForm, slug: currentSlug });
  }, [editorMode, rawHtmlContent, selectedPreset, templateForm, slug]);

  // Operational Metrics Calculation (Turnkey Financial Summary)
  const liveMetrics = useMemo(() => {
    let uncollectedCash = 0;
    let totalMaterialBuffer = 0;
    let totalPaidRevenue = 0;
    let totalPaidCards = 0;

    for (const o of orders) {
      const isPaid = o.paymentStatus === 'PAID';
      const amount = Number(o.totalAmount || o.unitPrice || 3500);
      const cost = Number(o.costPrice || 1500);

      if (isPaid) {
        totalPaidRevenue += amount;
        totalMaterialBuffer += cost;
        totalPaidCards += 1;
      } else {
        uncollectedCash += amount;
      }
    }

    const netProfitPool = Math.max(0, totalPaidRevenue - totalMaterialBuffer);
    const friendCommission = Math.round(netProfitPool * 0.5);
    const ownerShare = netProfitPool - friendCommission;

    return {
      uncollectedCash,
      totalMaterialBuffer,
      totalPaidRevenue,
      netProfitPool,
      friendCommission,
      ownerShare,
      totalPaidCards,
    };
  }, [orders]);

  // Fetch cards, leads, orders, and settlements on mount
  useEffect(() => {
    fetchCards();
    fetchLeads();
    fetchOrders();
    fetchSettlements();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards');
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login';
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
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const fetchSettlements = async () => {
    try {
      const res = await fetch('/api/settlements');
      if (res.ok) {
        const data = await res.json();
        setSettlementData(data);
      }
    } catch (error) {
      console.error('Failed to load settlements:', error);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    params: { orderStatus?: string; fulfillmentStatus?: string; paymentStatus?: string; unitPrice?: number }
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        toast.success(`Order updated`);
        fetchOrders();
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const handleQuickCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: quickOrderForm.clientName,
          customerPhone: quickOrderForm.whatsappNumber,
          finish: quickOrderForm.cardVariant,
          customAmount: quickOrderForm.customAmount,
          paymentStatus: quickOrderForm.paymentStatus,
          fulfillmentStatus: quickOrderForm.fulfillmentStatus,
          deliveryFee: 350,
        }),
      });

      if (res.ok) {
        toast.success('Quick order created!');
        setIsQuickOrderOpen(false);
        setQuickOrderForm({
          clientName: '',
          whatsappNumber: '',
          cardVariant: 'Sera Signature PVC',
          customAmount: '3500',
          paymentStatus: 'PAID',
          fulfillmentStatus: 'ORDER_RECEIVED',
        });
        fetchOrders();
      } else {
        toast.error('Failed to create order');
      }
    } catch (error) {
      toast.error('Error creating order');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Order deleted');
        fetchOrders();
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const handleSettleWeek = async (weekId?: string) => {
    try {
      toast.loading('Locking and settling weekly ledger...', { id: 'settle' });
      const res = await fetch('/api/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekId }),
      });
      if (res.ok) {
        toast.success('Weekly ledger settled successfully!', { id: 'settle' });
        fetchSettlements();
        fetchOrders();
      } else {
        toast.error('Failed to settle week', { id: 'settle' });
      }
    } catch (err) {
      toast.error('Error settling week', { id: 'settle' });
    }
  };

  const handleGenerateProfileFromOrder = async (order: Order) => {
    try {
      toast.loading(`Deploying profile for ${order.slug}...`, { id: 'deploy-order' });
      const profileHtml = generateTemplateHtml('personal_hero', {
        slug: order.slug,
        name: order.nameOnCard,
        title: order.designation || 'Professional',
        company: order.brandName,
        phone: order.customerPhone,
        whatsapp: order.customerPhone.replace(/[^0-9]/g, ''),
        email: order.customerEmail || '',
        avatarUrl: order.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
        bio: order.bio || `Welcome to ${order.nameOnCard}'s digital identity.`,
        location: order.city || 'Sri Lanka',
        website: `https://${order.slug}.${rootDomain}`,
        instagram: order.instagram || '',
        linkedin: order.linkedin || '',
        facebook: order.facebook || '',
        tiktok: order.tiktok || '',
      });

      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: order.slug,
          html_content: profileHtml,
        }),
      });

      if (!res.ok) throw new Error('Failed to deploy profile');

      toast.success(`Profile deployed to https://${order.slug}.${rootDomain}!`, { id: 'deploy-order' });
      fetchCards();

      // Open NFC programmer QR modal directly
      setNfcModalCard({
        id: order.id,
        slug: order.slug,
        createdAt: order.createdAt,
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to deploy profile', { id: 'deploy-order' });
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

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Failed to deploy');
      }

      toast.success(`Profile https://${targetSlug}.${rootDomain} is LIVE!`);
      fetchCards();
    } catch (error: any) {
      toast.error(error.message || 'Failed to deploy card');
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

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end overflow-hidden">
          {/* Main Navigation Tabs */}
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'studio' ? 'bg-emerald-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🚀 Studio & Builder
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'cards' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              📇 Active Profiles ({cards.length})
            </button>
            <button
              onClick={() => { setActiveTab('leads'); fetchLeads(); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'leads' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              📬 Captured Leads ({leads.length})
            </button>
            <button
              onClick={() => { setActiveTab('orders'); fetchOrders(); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🛒 Orders ({orders.length})
            </button>
            <button
              onClick={() => { setActiveTab('settlements'); fetchSettlements(); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'settlements' ? 'bg-emerald-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ⚖️ Settlement Ledger
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Operational Summary Cards (At the Top) ── */}
      <section className="max-w-7xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Uncollected Cash */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase tracking-wider mb-2 font-medium">
            <span>Uncollected Cash</span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold">Pending</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
            LKR {liveMetrics.uncollectedCash.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Pending payments from clients</p>
        </div>

        {/* Card 2: Material Buffer */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs uppercase tracking-wider mb-2 font-medium">
            <span>Material Buffer Fund</span>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold">Restock</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-400 font-mono">
            LKR {liveMetrics.totalMaterialBuffer.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">LKR 1,500/card strictly for PVC & chips</p>
        </div>

        {/* Card 3: Friend's Earned Commission */}
        <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-emerald-950/30 to-zinc-900">
          <div className="flex items-center justify-between text-emerald-400 text-xs uppercase tracking-wider mb-2 font-medium">
            <span>Friend's Commission</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">50% Share</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
            LKR {liveMetrics.friendCommission.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Accumulated split ready to keep</p>
        </div>

        {/* Card 4: Your Owed Share */}
        <div className="bg-zinc-900/90 border border-purple-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-purple-950/30 to-zinc-900">
          <div className="flex items-center justify-between text-purple-400 text-xs uppercase tracking-wider mb-2 font-medium">
            <span>Owner's Profit Share</span>
            <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold">50% Share</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-purple-400 font-mono">
            LKR {liveMetrics.ownerShare.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Total profit to transfer to you</p>
        </div>
      </section>

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

                    {/* Media URLs (Upload or Paste) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">
                          {selectedPreset === 'company_profile' ? 'Company Logo' : 'Profile Photo'}
                        </label>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setTemplateForm({ ...templateForm, avatarUrl: ev.target?.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-emerald-950 file:text-emerald-400 hover:file:bg-emerald-900 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={templateForm.avatarUrl}
                            onChange={(e) => setTemplateForm({ ...templateForm, avatarUrl: e.target.value })}
                            placeholder="Or paste URL..."
                            className="w-full px-3.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] text-zinc-500 truncate focus:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 font-medium mb-1">Cover Banner (Company)</label>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setTemplateForm({ ...templateForm, coverUrl: ev.target?.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-emerald-950 file:text-emerald-400 hover:file:bg-emerald-900 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={templateForm.coverUrl || ''}
                            onChange={(e) => setTemplateForm({ ...templateForm, coverUrl: e.target.value })}
                            placeholder="Or paste URL..."
                            className="w-full px-3.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] text-zinc-500 truncate focus:text-white"
                          />
                        </div>
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

        {/* ══════════════════════════════════════════════════════════════════
            WORKSPACE 4: CUSTOMER ORDERS (TURNKEY CONTROL PANEL)
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <section className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🛒</span> Customer Orders & Fulfillment
                </h2>
                <p className="text-xs text-zinc-400">
                  Track client orders, custom amounts, chip encoding progress, and deploy profiles in 1 click
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsQuickOrderOpen(true)}
                  className="px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center gap-1.5"
                >
                  <span>+</span> Add New Order
                </button>
                <button
                  onClick={fetchOrders}
                  className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center text-zinc-500">
                <p className="text-3xl mb-2">📦</p>
                <p>No customer orders recorded yet.</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Click "Add New Order" above or receive orders from the client landing page.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                      <th className="pb-3 font-semibold">Order #</th>
                      <th className="pb-3 font-semibold">Client & Shipping</th>
                      <th className="pb-3 font-semibold">Card Details</th>
                      <th className="pb-3 font-semibold">Amount & Paid</th>
                      <th className="pb-3 font-semibold">Fulfillment Stage</th>
                      <th className="pb-3 font-semibold text-right">Production Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-zinc-800/60">
                    {orders.map((order) => {
                      const currentFulfillment = order.fulfillmentStatus || 'ORDER_RECEIVED';
                      const isPaid = order.paymentStatus === 'PAID';

                      return (
                        <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-4 align-top">
                            <span className="font-mono text-xs font-bold text-emerald-400">
                              {order.orderNumber}
                            </span>
                            <p className="text-[11px] text-zinc-500 mt-1">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </td>

                          <td className="py-4 align-top">
                            <p className="font-semibold text-zinc-100">{order.customerName}</p>
                            <p className="font-mono text-xs text-zinc-400">{order.customerPhone}</p>
                            <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                              📍 {order.deliveryAddress}{order.city ? `, ${order.city}` : ''}
                            </p>
                          </td>

                          <td className="py-4 align-top">
                            <div className="flex items-start gap-3">
                              {order.logoUrl && (
                                <img
                                  src={order.logoUrl}
                                  alt="Logo"
                                  className="w-10 h-10 object-contain rounded-lg border border-zinc-800 bg-black/40 p-1 shrink-0"
                                />
                              )}
                              <div>
                                <p className="font-medium text-xs text-zinc-200">
                                  <span className="text-zinc-500">Brand:</span> {order.brandName}
                                </p>
                                <p className="text-xs text-zinc-400">
                                  <span className="text-zinc-500">Name:</span> {order.nameOnCard}
                                </p>
                                <p className="text-[11px] font-mono text-emerald-400 mt-0.5">
                                  {order.slug}.{rootDomain}
                                </p>
                                <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                  {order.finish}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 align-top">
                            <p className="font-bold text-white font-mono">
                              LKR {order.totalAmount.toLocaleString()}
                            </p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateOrderStatus(order.id, {
                                    paymentStatus: isPaid ? 'PENDING' : 'PAID',
                                  })
                                }
                                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border transition-all ${
                                  isPaid
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                                }`}
                              >
                                {isPaid ? '✓ Paid' : '⏳ Pending'}
                              </button>
                              <span className="text-[10px] text-zinc-500">
                                via {order.paymentMethod}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 align-top">
                            <select
                              value={currentFulfillment}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.id, {
                                  fulfillmentStatus: e.target.value,
                                })
                              }
                              className={`text-xs rounded-lg px-2.5 py-1.5 font-medium border focus:outline-none ${
                                currentFulfillment === 'DELIVERED'
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                                  : currentFulfillment === 'DISPATCHED'
                                  ? 'bg-blue-950/40 text-blue-300 border-blue-800'
                                  : currentFulfillment === 'PRINTING'
                                  ? 'bg-purple-950/40 text-purple-300 border-purple-800'
                                  : currentFulfillment === 'ENCODING_CHIP'
                                  ? 'bg-amber-950/40 text-amber-300 border-amber-800'
                                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                              }`}
                            >
                              <option value="ORDER_RECEIVED">1. Order Received</option>
                              <option value="ENCODING_CHIP">2. Encoding Chip</option>
                              <option value="PRINTING">3. Printing Card</option>
                              <option value="DISPATCHED">4. Dispatched</option>
                              <option value="DELIVERED">5. Delivered</option>
                            </select>
                          </td>

                          <td className="py-4 align-top text-right space-y-1.5">
                            <div className="flex flex-col items-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleGenerateProfileFromOrder(order)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
                              >
                                ⚡ Generate Profile
                              </button>
                              <a
                                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(order.customerName)},%20this%20is%20Sera%20Cards%20regarding%20order%20${order.orderNumber}!`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition-colors"
                              >
                                💬 WhatsApp
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(order.id)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-zinc-500 hover:text-red-400 text-[11px] transition-colors"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            WORKSPACE 5: AUTOMATED SETTLEMENT & PAYOUT LEDGER
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settlements' && (
          <section className="space-y-6">
            {/* Live Weekly Math Breakdown Card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Transparent Financial Settlement
                  </span>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                    <span>⚖️</span> Weekly Settlement Ledger
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Current Period: <strong className="text-zinc-200">{settlementData?.currentWeekId || 'Active Week'}</strong> &middot; Automatic 50/50 split after production reserve
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSettleWeek(settlementData?.currentWeekId)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  ✓ Settle Week & Lock Ledger
                </button>
              </div>

              {/* Formula & Waterfall Step Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    1. Week's Total Revenue
                  </span>
                  <p className="text-2xl font-bold text-white mt-1 font-mono">
                    LKR {(settlementData?.currentWeekMetrics?.totalPaidRevenue || liveMetrics.totalPaidRevenue).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {(settlementData?.currentWeekMetrics?.totalCardsSold || liveMetrics.totalPaidCards)} Cards Sold
                  </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                    2. Less: Material Cost Buffer
                  </span>
                  <p className="text-2xl font-bold text-blue-400 mt-1 font-mono">
                    - LKR {(settlementData?.currentWeekMetrics?.totalMaterialBuffer || liveMetrics.totalMaterialBuffer).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    LKR 1,500/card reserved for next batch of raw PVC/chips
                  </p>
                </div>

                <div className="bg-zinc-950 border border-emerald-500/30 rounded-xl p-4 bg-emerald-950/10">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    3. Friend's 50% Payout
                  </span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                    LKR {(settlementData?.currentWeekMetrics?.friendCommission || liveMetrics.friendCommission).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Accumulated commission ready to keep
                  </p>
                </div>

                <div className="bg-zinc-950 border border-purple-500/30 rounded-xl p-4 bg-purple-950/10">
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                    4. Owner's 50% Share
                  </span>
                  <p className="text-2xl font-bold text-purple-400 mt-1 font-mono">
                    LKR {(settlementData?.currentWeekMetrics?.ownerShare || liveMetrics.ownerShare).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Accumulated profit to transfer to you
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Settled Ledgers Table */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4">Historical Settled Ledgers</h3>
              {!settlementData?.settlements || settlementData.settlements.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-sm">
                  <p>No historical settlements locked yet.</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Click "Settle Week & Lock Ledger" on Sunday nights to permanently archive weekly balances.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                        <th className="pb-3 font-semibold">Week ID</th>
                        <th className="pb-3 font-semibold">Cards Sold</th>
                        <th className="pb-3 font-semibold">Total Revenue</th>
                        <th className="pb-3 font-semibold">Material Buffer (LKR 1,500/card)</th>
                        <th className="pb-3 font-semibold">Friend Payout (50%)</th>
                        <th className="pb-3 font-semibold">Owner Profit (50%)</th>
                        <th className="pb-3 font-semibold">Settled Date</th>
                        <th className="pb-3 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
                      {settlementData.settlements.map((item: any) => (
                        <tr key={item.id} className="hover:bg-zinc-800/30">
                          <td className="py-3.5 font-bold text-white">{item.weekId}</td>
                          <td className="py-3.5 text-zinc-300">{item.totalCardsSold}</td>
                          <td className="py-3.5 text-zinc-200">LKR {item.totalRevenue.toLocaleString()}</td>
                          <td className="py-3.5 text-blue-400">LKR {item.productionCostTotal.toLocaleString()}</td>
                          <td className="py-3.5 text-emerald-400 font-bold">LKR {item.friendCommission.toLocaleString()}</td>
                          <td className="py-3.5 text-purple-400 font-bold">LKR {item.ownerProfit.toLocaleString()}</td>
                          <td className="py-3.5 text-zinc-500 font-sans">
                            {item.settledAt ? new Date(item.settledAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-3.5 text-right font-sans">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                              LOCKED / SETTLED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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

      {/* ── Modal: Add New Order (Friend's Quick Entry Form) ── */}
      {isQuickOrderOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsQuickOrderOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl font-bold"
            >
              &times;
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
              ⚡ Operator Quick Order
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Add New Client Order</h3>
            <p className="text-xs text-zinc-400 mb-5">
              Quickly record phone, WhatsApp, or in-person orders with custom pricing and fulfillment tracking
            </p>

            <form onSubmit={handleQuickCreateOrder} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-zinc-300">Client Name *</label>
                <input
                  type="text"
                  required
                  value={quickOrderForm.clientName}
                  onChange={(e) =>
                    setQuickOrderForm({ ...quickOrderForm, clientName: e.target.value })
                  }
                  placeholder="e.g. Kosala Fernando"
                  className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={quickOrderForm.whatsappNumber}
                  onChange={(e) =>
                    setQuickOrderForm({ ...quickOrderForm, whatsappNumber: e.target.value })
                  }
                  placeholder="e.g. 0771169108"
                  className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Card Variant</label>
                  <select
                    value={quickOrderForm.cardVariant}
                    onChange={(e) => {
                      const variant = e.target.value;
                      let defaultPrice = '3500';
                      if (variant === 'Full Custom Print PVC') defaultPrice = '5000';
                      else if (variant === 'Special Enterprise Request') defaultPrice = '5000';

                      setQuickOrderForm({
                        ...quickOrderForm,
                        cardVariant: variant,
                        customAmount: defaultPrice,
                      });
                    }}
                    className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Sera Signature PVC">Sera Signature PVC (LKR 3,500)</option>
                    <option value="Full Custom Print PVC">Full Custom Print PVC (LKR 5,000)</option>
                    <option value="Special Enterprise Request">Special Enterprise Request (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300">
                    Custom Amount (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quickOrderForm.customAmount}
                    onChange={(e) =>
                      setQuickOrderForm({ ...quickOrderForm, customAmount: e.target.value })
                    }
                    placeholder="3500"
                    className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-500">Editable for discounts or bulk</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Payment Status</label>
                  <div className="mt-1 flex rounded-xl border border-zinc-800 bg-zinc-950 p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setQuickOrderForm({ ...quickOrderForm, paymentStatus: 'PAID' })
                      }
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        quickOrderForm.paymentStatus === 'PAID'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      ✓ Paid
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickOrderForm({ ...quickOrderForm, paymentStatus: 'PENDING' })
                      }
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        quickOrderForm.paymentStatus === 'PENDING'
                          ? 'bg-amber-600 text-white shadow'
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      ⏳ Pending
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300">Fulfillment Stage</label>
                  <select
                    value={quickOrderForm.fulfillmentStatus}
                    onChange={(e) =>
                      setQuickOrderForm({ ...quickOrderForm, fulfillmentStatus: e.target.value })
                    }
                    className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ORDER_RECEIVED">1. Order Received</option>
                    <option value="ENCODING_CHIP">2. Encoding Chip</option>
                    <option value="PRINTING">3. Printing</option>
                    <option value="DISPATCHED">4. Dispatched</option>
                    <option value="DELIVERED">5. Delivered</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsQuickOrderOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-colors"
                >
                  Create Order &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

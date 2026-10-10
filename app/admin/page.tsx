'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Sparkles,
  CreditCard,
  Users,
  ShoppingCart,
  Scale,
  LogOut,
  ExternalLink,
  Copy,
  Plus,
  RefreshCw,
  Download,
  Trash2,
  MessageCircle,
  QrCode,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Smartphone,
  Palette,
  Code2,
  Eye,
  AlertCircle,
  Search,
  Zap,
  Pencil,
  Key,
  UserPlus,
  ShieldCheck,
  Mail,
  Send,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { TEMPLATE_PRESETS, generateTemplateHtml, TemplateData } from '@/lib/templates';

type CardItem = {
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

export default function AdminDashboard() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settlementData, setSettlementData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'studio' | 'cards' | 'leads' | 'settlements' | 'activations' | 'users'>('orders');

  // User Accounts State
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [provisionForm, setProvisionForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cardSlug: '',
    role: 'USER',
    plan: 'PRO',
  });
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Mailing System State
  const [mailLogs, setMailLogs] = useState<any[]>([]);
  const [mailStatus, setMailStatus] = useState<any>({ status: 'SIMULATED', provider: 'Resend API / Fallback', sender: 'info@seranex.lk' });
  const [isTestMailModalOpen, setIsTestMailModalOpen] = useState(false);
  const [testMailRecipient, setTestMailRecipient] = useState('chithilamanul1@gmail.com');
  const [isSendingTestMail, setIsSendingTestMail] = useState(false);

  // Search filter in leads
  const [leadSearch, setLeadSearch] = useState('');

  // Hardware Activation Codes State
  const [activations, setActivations] = useState<any[]>([]);
  const [batchCount, setBatchCount] = useState('10');
  const [batchPrefix, setBatchPrefix] = useState('SERA');
  const [batchName, setBatchName] = useState('BATCH-1');
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

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
    catalogPdfUrl: '',
    catalogPdfTitle: '',
  });

  // Modals
  const [nfcModalCard, setNfcModalCard] = useState<CardItem | null>(null);
  const [viewLeadsSlug, setViewLeadsSlug] = useState<string | null>(null);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

  // Live compiled HTML for simulator
  const liveHtml = useMemo(() => {
    if (editorMode === 'raw') {
      return rawHtmlContent || '<!-- Empty HTML payload -->';
    }
    const currentSlug = slug.trim() || 'preview';
    return generateTemplateHtml(selectedPreset, { ...templateForm, slug: currentSlug });
  }, [editorMode, rawHtmlContent, selectedPreset, templateForm, slug]);

  // Operational Metrics Calculation
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

  // Auth Guard & Initial Data Fetch
  useEffect(() => {
    const initAdmin = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          window.location.href = '/login?redirect=/admin';
          return;
        }
        const authData = await authRes.json();
        if (!authData.authenticated || authData.role !== 'ADMIN') {
          window.location.href = '/login?redirect=/admin';
          return;
        }
        fetchCards();
        fetchLeads();
        fetchOrders();
        fetchSettlements();
        fetchActivations();
        fetchUsers();
        fetchMailStatusAndLogs();
      } catch {
        window.location.href = '/login?redirect=/admin';
      }
    };
    initAdmin();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards');
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login?redirect=/admin';
          return;
        }
        throw new Error('Failed to fetch cards');
      }
      const data = await res.json();
      setCards(Array.isArray(data) ? data : []);
    } catch {
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
        setLeads(Array.isArray(data) ? data : []);
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
        setOrders(Array.isArray(data) ? data : []);
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

  const fetchActivations = async () => {
    try {
      const res = await fetch('/api/activate?action=list');
      if (res.ok) {
        const data = await res.json();
        setActivations(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load activation codes:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const fetchMailStatusAndLogs = async () => {
    try {
      const res = await fetch('/api/mail/test');
      if (res.ok) {
        const data = await res.json();
        setMailStatus({ status: data.status, provider: data.provider, sender: data.sender });
        setMailLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to load mail diagnostics:', error);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMailRecipient.trim()) return;
    setIsSendingTestMail(true);
    try {
      const res = await fetch('/api/mail/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testMailRecipient.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to dispatch test email');
      toast.success(data.message || `Test email dispatched to ${testMailRecipient}!`);
      setIsTestMailModalOpen(false);
      fetchMailStatusAndLogs();
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch test email');
    } finally {
      setIsSendingTestMail(false);
    }
  };

  const handleClearMailLogs = async () => {
    try {
      await fetch('/api/mail/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_logs' }),
      });
      setMailLogs([]);
      toast.success('Mailing audit log cleared');
    } catch {}
  };

  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingBatch(true);
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          count: Number(batchCount) || 10,
          prefix: batchPrefix || 'SERA',
          batch: batchName || 'BATCH-1',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Generated ${data.count} unassigned activation codes!`);
        fetchActivations();
      } else {
        toast.error(data.error || 'Failed to generate batch');
      }
    } catch {
      toast.error('Failed to generate batch');
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  const exportActivationsCsv = () => {
    if (activations.length === 0) {
      toast.error('No activation codes to export');
      return;
    }
    const headers = ['Code', 'Batch', 'Status', 'Claimed By', 'Assigned Slug', 'Activation Link', 'Created At'];
    const rows = activations.map((a) => [
      `"${a.code}"`,
      `"${a.batch}"`,
      `"${a.status}"`,
      `"${a.claimedBy || ''}"`,
      `"${a.assignedSlug || ''}"`,
      `"https://card.${rootDomain}/activate?code=${a.code}"`,
      `"${new Date(a.createdAt).toLocaleDateString()}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sera-activation-codes-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Activation codes CSV exported!');
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
    } catch {
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
    } catch {
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
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(leadId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Lead deleted');
        fetchLeads();
      } else {
        toast.error('Failed to delete lead');
      }
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const exportLeadsToCsv = () => {
    if (leads.length === 0) {
      toast.error('No leads to export');
      return;
    }
    const headers = ['Name', 'Phone', 'Profile Slug', 'Notes', 'Date'];
    const rows = leads.map((l) => [
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.clientSlug || ''}"`,
      `"${l.notes || ''}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sera-leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads CSV exported!');
  };

  const exportOrdersToCsv = () => {
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }
    const headers = [
      'Order Number',
      'Client Name',
      'Phone',
      'Slug',
      'Finish',
      'Amount',
      'Payment Status',
      'Fulfillment',
      'Date',
    ];
    const rows = orders.map((o) => [
      `"${o.orderNumber || ''}"`,
      `"${o.customerName || ''}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.slug || ''}"`,
      `"${o.finish || ''}"`,
      `"${o.totalAmount || o.unitPrice || 3500}"`,
      `"${o.paymentStatus || 'PENDING'}"`,
      `"${o.fulfillmentStatus || 'ORDER_RECEIVED'}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sera-orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders CSV exported!');
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
    } catch {
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
    } catch {
      toast.error('Failed to log out');
    }
  };

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
      const metadata = editorMode === 'visual' ? { ...templateForm, slug: targetSlug, preset: selectedPreset } : undefined;
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: targetSlug, html_content: finalHtml, metadata }),
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

  const handleEditCard = async (targetSlug: string) => {
    try {
      toast.loading(`Loading profile details for /c/${targetSlug}...`, { id: 'edit-card' });
      const res = await fetch(`/api/cards?slug=${encodeURIComponent(targetSlug)}`);
      if (!res.ok) throw new Error('Card not found');
      const data = await res.json();

      setSlug(data.slug || targetSlug);
      if (data.htmlContent) {
        setRawHtmlContent(data.htmlContent);
      }

      const meta = data.metadata;
      if (meta) {
        setTemplateForm({
          slug: data.slug || targetSlug,
          name: meta.name || '',
          title: meta.title || '',
          company: meta.company || '',
          phone: meta.phone || '',
          whatsapp: meta.whatsapp || '',
          email: meta.email || '',
          avatarUrl: meta.avatarUrl || '',
          coverUrl: meta.coverUrl || '',
          bio: meta.bio || '',
          location: meta.location || '',
          website: meta.website || '',
          googleReviewUrl: meta.googleReviewUrl || '',
          lankaQrText: meta.lankaQrText || '',
          facebook: meta.facebook || '',
          instagram: meta.instagram || '',
          linkedin: meta.linkedin || '',
          tiktok: meta.tiktok || '',
          snapchat: meta.snapchat || '',
          catalogPdfUrl: meta.catalogPdfUrl || '',
          catalogPdfTitle: meta.catalogPdfTitle || '',
        });
        if (meta.preset) {
          setSelectedPreset(meta.preset);
        }
      } else {
        const matchingOrder = orders.find((o) => o.slug === targetSlug);
        if (matchingOrder) {
          setTemplateForm((prev) => ({
            ...prev,
            slug: targetSlug,
            name: matchingOrder.nameOnCard || prev.name,
            title: matchingOrder.designation || prev.title,
            company: matchingOrder.brandName || prev.company,
            phone: matchingOrder.customerPhone || prev.phone,
            whatsapp: (matchingOrder.customerPhone || '').replace(/[^0-9]/g, '') || prev.whatsapp,
            email: matchingOrder.customerEmail || prev.email,
            avatarUrl: matchingOrder.logoUrl || prev.avatarUrl,
            location: matchingOrder.city || prev.location,
            bio: matchingOrder.bio || prev.bio,
            instagram: matchingOrder.instagram || prev.instagram,
            linkedin: matchingOrder.linkedin || prev.linkedin,
            facebook: matchingOrder.facebook || prev.facebook,
            tiktok: matchingOrder.tiktok || prev.tiktok,
          }));
        }
      }

      setActiveTab('studio');
      toast.success(`Profile /c/${targetSlug} loaded in Studio!`, { id: 'edit-card' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to load card for editing', { id: 'edit-card' });
    }
  };

  const handleOpenCreateLogin = (cardSlug: string) => {
    const relatedOrder = orders.find((o) => o.slug === cardSlug);
    const defaultName = relatedOrder?.nameOnCard || cardSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const defaultEmail = relatedOrder?.customerEmail || '';
    const defaultPhone = relatedOrder?.customerPhone || '';
    const defaultPassword = `${cardSlug.split('-')[0]}1234`;

    setProvisionForm({
      name: defaultName,
      email: defaultEmail,
      password: defaultPassword,
      phone: defaultPhone,
      cardSlug: cardSlug,
      role: 'USER',
      plan: 'PRO',
    });
    setIsProvisionModalOpen(true);
  };

  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provisionForm.name || !provisionForm.email || !provisionForm.password) {
      toast.error('Name, email, and password are required');
      return;
    }
    setIsProvisioning(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(provisionForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create account');

      toast.success(data.message || 'Account provisioned successfully!');
      fetchUsers();
      setIsProvisionModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user account');
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete access for ${email}?`)) return;
    try {
      const res = await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      toast.success('User account deleted');
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetUser || !newPassword) return;
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: passwordResetUser.id, password: newPassword }),
      });
      if (!res.ok) throw new Error('Failed to reset password');
      toast.success(`Password updated for ${passwordResetUser.email}!`);
      setPasswordResetUser(null);
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    }
  };

  const shareCredentialsWhatsApp = (user: any, rawPass?: string) => {
    const phone = (user.phone || '').replace(/[^0-9]/g, '');
    const passText = rawPass ? `\n*Temporary Password:* ${rawPass}` : '';
    const msg = `🎉 *Your Sera Cards Portal Access is Ready!*\n\n*Name:* ${user.name}\n*Login Portal:* https://${rootDomain}/dashboard\n*Email / Username:* ${user.email}${passText}\n*Your Card URL:* https://${rootDomain}/c/${user.cardSlug}\n\nYou can now log in, track your live NFC taps, capture leads, and update your profile anytime!`;
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
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
    } catch {
      toast.error('Failed to delete');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}!`);
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    if (!leadSearch.trim()) return leads;
    const q = leadSearch.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.clientSlug.toLowerCase().includes(q) ||
        (l.notes && l.notes.toLowerCase().includes(q))
    );
  }, [leads, leadSearch]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-purple-600 selection:text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a', borderRadius: '12px' },
        }}
      />

      {/* ── Top Header ── */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Sera Cards Studio
              </h1>
              <Badge variant="purple" className="font-mono text-[10px] tracking-wide">
                PRO ENGINE v2.6
              </Badge>
            </div>
            <p className="text-zinc-400 text-xs mt-0.5">
              Turnkey Card Management &middot; Direct Subdomain Serving &middot; Leads CRM &middot; Settlement Ledger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Main Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="orders" className="flex items-center gap-1.5">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Orders</span>
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                  {orders.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="studio" className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Studio</span>
              </TabsTrigger>
              <TabsTrigger value="cards" className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Profiles</span>
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                  {cards.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>Leads</span>
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                  {leads.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="settlements" className="flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5" />
                <span>Ledger</span>
              </TabsTrigger>
              <TabsTrigger value="activations" className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Codes</span>
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                  {activations.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-emerald-400" />
                <span>Accounts</span>
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                  {users.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/teams/portal', '_blank')}
              className="text-sky-300 hover:text-white border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-xs font-bold"
            >
              🏢 Enterprise Teams Hub &rarr;
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-zinc-400 hover:text-white border-zinc-800 hover:bg-zinc-900"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* ── Operational Metric Cards (Shadcn Cards) ── */}
      <section className="max-w-7xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Uncollected Cash */}
        <Card className="border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700/80 transition-all">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Uncollected Cash</span>
              <Badge variant="amber" className="text-[10px] font-bold">Pending</Badge>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-amber-400 mt-2">
              LKR {liveMetrics.uncollectedCash.toLocaleString()}
            </CardTitle>
            <CardDescription className="text-[11px] text-zinc-500 mt-1">
              Unpaid client balances
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Card 2: Material Buffer */}
        <Card className="border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700/80 transition-all">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Material Buffer Fund</span>
              <Badge variant="blue" className="text-[10px] font-bold">Restock</Badge>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-blue-400 mt-2">
              LKR {liveMetrics.totalMaterialBuffer.toLocaleString()}
            </CardTitle>
            <CardDescription className="text-[11px] text-zinc-500 mt-1">
              LKR 1,500/card reserve for PVC & chips
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Card 3: Friend's Commission */}
        <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-zinc-900/80 hover:border-purple-500/50 transition-all">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-purple-300">Friend's Commission</span>
              <Badge variant="purple" className="text-[10px] font-bold">50% Split</Badge>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-purple-400 mt-2">
              LKR {liveMetrics.friendCommission.toLocaleString()}
            </CardTitle>
            <CardDescription className="text-[11px] text-zinc-400 mt-1">
              Accumulated operator payout
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Card 4: Owner's Profit Share */}
        <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-zinc-900/80 hover:border-purple-500/50 transition-all">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-purple-300">Owner's Profit</span>
              <Badge variant="purple" className="text-[10px] font-bold">50% Split</Badge>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-purple-400 mt-2">
              LKR {liveMetrics.ownerShare.toLocaleString()}
            </CardTitle>
            <CardDescription className="text-[11px] text-zinc-400 mt-1">
              Net profit ready for transfer
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* ── Main Workspaces ── */}
      <main className="max-w-7xl mx-auto">
        {/* ══════════════════════════════════════════════════════════════
            TAB 1: CUSTOMER ORDERS (Default Tab)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <Card className="border-zinc-800 bg-zinc-900/90 shadow-2xl">
            <CardHeader className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-purple-400" />
                  <span>Customer Orders & Production Tracker</span>
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400 mt-1">
                  Manage physical card orders, update production stages, and deploy digital profiles in 1 click
                </CardDescription>
              </div>

              <div className="flex items-center gap-2.5">
                <Button variant="outline" size="sm" onClick={exportOrdersToCsv}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Export CSV
                </Button>
                <Button variant="purple" size="sm" onClick={() => setIsQuickOrderOpen(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Order
                </Button>
                <Button variant="outline" size="icon" onClick={fetchOrders} title="Refresh">
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {orders.length === 0 ? (
                <div className="py-20 text-center text-zinc-500">
                  <ShoppingCart className="h-10 w-10 mx-auto text-zinc-600 mb-2" />
                  <p className="font-medium text-sm">No customer orders recorded yet.</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Click "Add Order" above or orders submitted on your landing page will appear here.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Client & Delivery</TableHead>
                      <TableHead>Card Details</TableHead>
                      <TableHead>Amount & Paid</TableHead>
                      <TableHead>Fulfillment Stage</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const currentFulfillment = order.fulfillmentStatus || 'ORDER_RECEIVED';
                      const isPaid = order.paymentStatus === 'PAID';

                      return (
                        <TableRow key={order.id}>
                          {/* Order # */}
                          <TableCell className="align-top font-mono">
                            <span className="font-bold text-purple-400 text-xs">{order.orderNumber}</span>
                            <p className="text-[11px] text-zinc-500 mt-1">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </TableCell>

                          {/* Client */}
                          <TableCell className="align-top">
                            <p className="font-semibold text-zinc-100">{order.customerName}</p>
                            <p className="font-mono text-xs text-zinc-400">{order.customerPhone}</p>
                            <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                              📍 {order.deliveryAddress}{order.city ? `, ${order.city}` : ''}
                            </p>
                          </TableCell>

                          {/* Card Details */}
                          <TableCell className="align-top">
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
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="font-mono text-[10px] text-purple-300">
                                    {order.slug}
                                  </Badge>
                                  <span className="text-[10px] text-zinc-500">{order.finish}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Amount & Paid */}
                          <TableCell className="align-top">
                            <p className="font-bold text-white font-mono text-sm">
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
                                className="cursor-pointer"
                              >
                                <Badge variant={isPaid ? 'success' : 'amber'} className="text-[10px]">
                                  {isPaid ? '✓ Paid' : '⏳ Pending'}
                                </Badge>
                              </button>
                              <span className="text-[10px] text-zinc-500">via {order.paymentMethod}</span>
                            </div>
                          </TableCell>

                          {/* Fulfillment */}
                          <TableCell className="align-top">
                            <select
                              value={currentFulfillment}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.id, {
                                  fulfillmentStatus: e.target.value,
                                })
                              }
                              className={`text-xs rounded-xl px-2.5 py-1.5 font-medium border bg-zinc-950 focus:outline-none cursor-pointer ${
                                currentFulfillment === 'DELIVERED'
                                  ? 'text-emerald-400 border-emerald-500/30'
                                  : currentFulfillment === 'DISPATCHED'
                                  ? 'text-blue-400 border-blue-500/30'
                                  : currentFulfillment === 'PRINTING'
                                  ? 'text-purple-400 border-purple-500/30'
                                  : currentFulfillment === 'ENCODING_CHIP'
                                  ? 'text-amber-400 border-amber-500/30'
                                  : 'text-zinc-300 border-zinc-800'
                              }`}
                            >
                              <option value="ORDER_RECEIVED">1. Order Received</option>
                              <option value="ENCODING_CHIP">2. Encoding Chip</option>
                              <option value="PRINTING">3. Printing Card</option>
                              <option value="DISPATCHED">4. Dispatched</option>
                              <option value="DELIVERED">5. Delivered</option>
                            </select>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="align-top text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="amber"
                                size="xs"
                                onClick={() => handleGenerateProfileFromOrder(order)}
                                title="Deploy live microsite and flash NFC"
                              >
                                <Sparkles className="h-3 w-3 mr-1" />
                                Deploy
                              </Button>
                              <a
                                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(order.customerName)},%20this%20is%20Sera%20Cards%20regarding%20order%20${order.orderNumber}!`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button variant="outline" size="xs">
                                  <MessageCircle className="h-3 w-3 mr-1 text-emerald-400" />
                                  Chat
                                </Button>
                              </a>
                              <Button
                                variant="destructive"
                                size="xs"
                                onClick={() => handleDeleteOrder(order.id)}
                                title="Delete Order"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: STUDIO & BUILDER (Interactive Configurator + Simulator)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Top Bar: Preset Selector & Mode Switcher */}
            <Card className="border-zinc-800 bg-zinc-900/90 p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  <span className="text-xs uppercase font-bold text-zinc-500 whitespace-nowrap mr-1">
                    Preset:
                  </span>
                  {TEMPLATE_PRESETS.map((p) => {
                    const active = selectedPreset === p.id;
                    return (
                      <Button
                        key={p.id}
                        type="button"
                        size="sm"
                        variant={active ? 'amber' : 'outline'}
                        onClick={() => handlePresetSwitch(p.id)}
                        className="rounded-xl"
                      >
                        {p.name}
                      </Button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <span className="text-xs text-zinc-500 uppercase font-medium">Mode:</span>
                  <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setEditorMode('visual')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        editorMode === 'visual' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      🎨 Visual Studio
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!rawHtmlContent) setRawHtmlContent(liveHtml);
                        setEditorMode('raw');
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        editorMode === 'raw' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      💻 Raw HTML
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Split Screen Studio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (7 Cols): Form */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
                  <CardHeader className="p-6 border-b border-zinc-800/80">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-bold">
                          {selectedPreset === 'company_profile' ? 'Company Profile Studio' : 'Personal Profile Studio'}
                        </CardTitle>
                        <CardDescription className="text-xs text-zinc-400">
                          All fields update the interactive phone simulator in real-time
                        </CardDescription>
                      </div>

                      {/* Direct Live Card Link badge */}
                      <a
                        href={`/c/${slug || 'kosala'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-mono font-semibold transition-colors"
                        title="Open live card directly (no DNS wait)"
                      >
                        <span>/c/{slug || 'preview'}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {editorMode === 'visual' ? (
                      <form onSubmit={handleDeploy} className="space-y-4">
                        {/* Slug */}
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wider text-zinc-400">
                            Profile Slug (Subdomain Handle)
                          </Label>
                          <div className="flex rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 focus-within:border-purple-500">
                            <input
                              type="text"
                              value={slug}
                              onChange={(e) => {
                                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                setSlug(val);
                                setTemplateForm((prev) => ({ ...prev, slug: val }));
                              }}
                              placeholder="e.g. kosala"
                              className="w-full px-4 py-2.5 bg-transparent text-white font-mono text-sm outline-none"
                              required
                            />
                            <span className="px-3.5 flex items-center text-xs font-mono text-purple-400 bg-zinc-900 border-l border-zinc-800 select-none">
                              .{rootDomain}
                            </span>
                          </div>
                        </div>

                        {/* Identity */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-wider text-zinc-400">
                              {selectedPreset === 'company_profile' ? 'Company Name' : 'Full Name'}
                            </Label>
                            <Input
                              type="text"
                              value={selectedPreset === 'company_profile' ? templateForm.company : templateForm.name}
                              onChange={(e) => {
                                if (selectedPreset === 'company_profile') {
                                  setTemplateForm({ ...templateForm, company: e.target.value });
                                } else {
                                  setTemplateForm({ ...templateForm, name: e.target.value });
                                }
                              }}
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-wider text-zinc-400">
                              {selectedPreset === 'company_profile' ? 'Business Category' : 'Designation / Title'}
                            </Label>
                            <Input
                              type="text"
                              value={templateForm.title}
                              onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-wider text-zinc-400">
                              Company / Organization
                            </Label>
                            <Input
                              type="text"
                              value={templateForm.company}
                              onChange={(e) => setTemplateForm({ ...templateForm, company: e.target.value })}
                              placeholder="e.g. CODEAERON"
                            />
                          </div>
                        </div>

                        {/* Owner WhatsApp */}
                        <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                              📲 Card Owner WhatsApp (Instant Lead Alerts)
                            </Label>
                            <Badge variant="purple" className="text-[10px]">Auto Alert</Badge>
                          </div>
                          <Input
                            type="tel"
                            value={templateForm.whatsapp}
                            onChange={(e) => setTemplateForm({ ...templateForm, whatsapp: e.target.value })}
                            placeholder="e.g. 947711691008"
                            className="bg-zinc-950 border-purple-500/40 text-purple-200 font-mono"
                            required
                          />
                          <p className="text-[11px] text-zinc-400">
                            When someone connects on this card, instant alerts and WhatsApp chat route here.
                          </p>
                        </div>

                        {/* Contact Rows */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-400">Phone / Hotline</Label>
                            <Input
                              type="text"
                              value={templateForm.phone}
                              onChange={(e) => setTemplateForm({ ...templateForm, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-400">Official Email</Label>
                            <Input
                              type="email"
                              value={templateForm.email}
                              onChange={(e) => setTemplateForm({ ...templateForm, email: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-400">Website URL</Label>
                            <Input
                              type="url"
                              value={templateForm.website}
                              onChange={(e) => setTemplateForm({ ...templateForm, website: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-400">Location / City</Label>
                            <Input
                              type="text"
                              value={templateForm.location}
                              onChange={(e) => setTemplateForm({ ...templateForm, location: e.target.value })}
                              placeholder="Colombo, Sri Lanka"
                            />
                          </div>
                        </div>

                        {/* Media */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-400">
                              {selectedPreset === 'company_profile' ? 'Company Logo' : 'Profile Photo'}
                            </Label>
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
                              className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-purple-950 file:text-purple-400 hover:file:bg-purple-900 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={templateForm.avatarUrl}
                              onChange={(e) => setTemplateForm({ ...templateForm, avatarUrl: e.target.value })}
                              placeholder="Or paste URL..."
                              className="text-[11px] font-mono text-zinc-400"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-400">Cover Banner</Label>
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
                              className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-purple-950 file:text-purple-400 hover:file:bg-purple-900 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={templateForm.coverUrl}
                              onChange={(e) => setTemplateForm({ ...templateForm, coverUrl: e.target.value })}
                              placeholder="Or paste URL..."
                              className="text-[11px] font-mono text-zinc-400"
                            />
                          </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-1.5">
                          <Label className="text-xs text-zinc-400">About / Bio</Label>
                          <textarea
                            rows={3}
                            value={templateForm.bio}
                            onChange={(e) => setTemplateForm({ ...templateForm, bio: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* Payment & Review block */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-400">LankaQR & Bank Details</Label>
                            <Input
                              type="text"
                              value={templateForm.lankaQrText}
                              onChange={(e) => setTemplateForm({ ...templateForm, lankaQrText: e.target.value })}
                              placeholder="Bank: 0008392810 / LankaQR: SERA-PAY"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-zinc-400">Google Review Boost URL</Label>
                              <Badge variant="amber" className="text-[9px]">Smart 5★ Filter</Badge>
                            </div>
                            <Input
                              type="url"
                              value={templateForm.googleReviewUrl}
                              onChange={(e) => setTemplateForm({ ...templateForm, googleReviewUrl: e.target.value })}
                              placeholder="https://g.page/r/..."
                            />
                            <p className="text-[10px] text-zinc-500">
                              4-5★ ratings route to Google Maps; 1-3★ collect private WhatsApp feedback.
                            </p>
                          </div>
                        </div>

                        {/* Catalog / Brochure PDF Upload */}
                        <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                              📄 Company Catalog / Price List (PDF)
                            </Label>
                            {templateForm.catalogPdfUrl && (
                              <Badge variant="purple" className="text-[10px]">✓ PDF Attached</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] text-zinc-400 block mb-1">Upload PDF Document</label>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setTemplateForm((prev) => ({
                                        ...prev,
                                        catalogPdfUrl: ev.target?.result as string,
                                        catalogPdfTitle: prev.catalogPdfTitle || file.name.replace(/\.pdf$/i, ''),
                                      }));
                                      toast.success('Catalog PDF loaded!');
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-purple-950 file:text-purple-400 hover:file:bg-purple-900 cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-zinc-400 block mb-1">Catalog Display Title</label>
                              <Input
                                placeholder="e.g. Aura Living 2026 Collection"
                                value={templateForm.catalogPdfTitle || ''}
                                onChange={(e) => setTemplateForm({ ...templateForm, catalogPdfTitle: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                          <Label className="text-xs uppercase font-bold text-zinc-500">Social Accounts</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Instagram URL"
                              value={templateForm.instagram}
                              onChange={(e) => setTemplateForm({ ...templateForm, instagram: e.target.value })}
                            />
                            <Input
                              placeholder="LinkedIn URL"
                              value={templateForm.linkedin}
                              onChange={(e) => setTemplateForm({ ...templateForm, linkedin: e.target.value })}
                            />
                            <Input
                              placeholder="Facebook URL"
                              value={templateForm.facebook}
                              onChange={(e) => setTemplateForm({ ...templateForm, facebook: e.target.value })}
                            />
                            <Input
                              placeholder="TikTok URL"
                              value={templateForm.tiktok}
                              onChange={(e) => setTemplateForm({ ...templateForm, tiktok: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Deploy Button */}
                        <div className="pt-4">
                          <Button
                            type="submit"
                            variant="purple"
                            size="lg"
                            disabled={isSubmitting}
                            className="w-full text-sm font-bold shadow-lg"
                          >
                            {isSubmitting ? 'Publishing Profile...' : `🚀 Publish Live Card (${slug}.${rootDomain})`}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      /* Raw HTML mode */
                      <form onSubmit={handleDeploy} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wider text-zinc-400">Profile Slug</Label>
                          <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wider text-zinc-400">Custom Raw HTML Code</Label>
                          <textarea
                            rows={18}
                            value={rawHtmlContent}
                            onChange={(e) => setRawHtmlContent(e.target.value)}
                            className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-200 focus:outline-none focus:border-purple-500 leading-relaxed"
                            required
                          />
                        </div>

                        <Button type="submit" variant="purple" size="lg" disabled={isSubmitting} className="w-full">
                          {isSubmitting ? 'Deploying HTML...' : 'Deploy Raw HTML Profile'}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column (5 Cols): Live Simulator */}
              <div className="lg:col-span-5 sticky top-6">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Live Mobile Simulator
                    </span>
                  </div>
                  <Badge variant="purple" className="text-[10px]">0.2s NFC Mirror</Badge>
                </div>

                {/* iPhone Chassis */}
                <div className="mx-auto w-[330px] sm:w-[360px] h-[700px] bg-zinc-950 border-[9px] border-zinc-800 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden relative ring-1 ring-zinc-700/50">
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 mr-2" />
                    <div className="w-2 h-2 rounded-full bg-blue-950/80" />
                  </div>

                  {/* Simulator Screen */}
                  <iframe
                    title="Profile Simulator"
                    srcDoc={liveHtml}
                    className="w-full h-full border-none select-none"
                  />
                </div>

                {/* Quick Actions Below Simulator */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/c/${slug}`, '_blank')}
                    title="Universal link (instant, zero DNS wait)"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1 text-amber-400" />
                    Open Live Card
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const directUrl = `${window.location.origin}/c/${slug}`;
                      copyToClipboard(directUrl, 'Universal Direct Link');
                    }}
                    title="Universal direct link (bypasses any subdomain SSL issue)"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1 text-purple-400" />
                    Copy Universal Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`https://${slug}.${rootDomain}`, 'Subdomain Link')}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy Subdomain
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: ACTIVE PROFILES (Cards List + NFC Flashing)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'cards' && (
          <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
            <CardHeader className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                  <span>Active Digital Profiles</span>
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400 mt-1">
                  Profiles live on wildcard subdomains and direct URLs, serving instant dynamic HTML
                </CardDescription>
              </div>

              <div className="flex items-center gap-2.5">
                <Button variant="purple" size="sm" onClick={() => setActiveTab('studio')}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Create Profile
                </Button>
                <Button variant="outline" size="icon" onClick={fetchCards} title="Refresh">
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading && cards.length === 0 ? (
                <div className="py-20 text-center text-zinc-500">Loading cards...</div>
              ) : cards.length === 0 ? (
                <div className="py-20 text-center text-zinc-500">
                  <CreditCard className="h-10 w-10 mx-auto text-zinc-600 mb-2" />
                  <p className="font-medium text-sm">No profiles deployed yet.</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Go to <strong>Studio & Builder</strong> to create and publish your first card!
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subdomain & Direct URL</TableHead>
                      <TableHead>Captured Leads</TableHead>
                      <TableHead>NFC Chip Flashing</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cards.map((card) => {
                      const cardLeads = leads.filter((l) => l.clientSlug === card.slug);
                      return (
                        <TableRow key={card.id}>
                          <TableCell>
                            <span className="font-mono font-bold text-purple-400 text-sm">{card.slug}</span>
                            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
                              <a
                                href={`/c/${card.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                title="Universal Direct Link (Always works)"
                              >
                                /c/{card.slug} <ArrowUpRight className="h-3 w-3" />
                              </a>
                              <span className="text-zinc-600">&bull;</span>
                              <a
                                href={`https://${card.slug}.${rootDomain}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                              >
                                {card.slug}.{rootDomain}
                              </a>
                            </div>
                          </TableCell>

                          <TableCell>
                            {cardLeads.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => setViewLeadsSlug(card.slug)}
                                className="cursor-pointer"
                              >
                                <Badge variant="purple" className="hover:bg-purple-500/20">
                                  {cardLeads.length} Lead{cardLeads.length > 1 ? 's' : ''}
                                </Badge>
                              </button>
                            ) : (
                              <span className="text-xs text-zinc-500">0 leads</span>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="amber"
                                size="xs"
                                onClick={() => setNfcModalCard(card)}
                              >
                                <QrCode className="h-3 w-3 mr-1" />
                                Flash NFC
                              </Button>
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() => {
                                  const url = `${window.location.origin}/c/${card.slug}`;
                                  copyToClipboard(url, 'Universal Link');
                                }}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() => handleEditCard(card.slug)}
                                className="text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 border-purple-500/30"
                                title="Edit Profile Details in Studio"
                              >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() => handleOpenCreateLogin(card.slug)}
                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border-emerald-500/30"
                                title="Create / Provision Dashboard Login"
                              >
                                <Key className="h-3 w-3 mr-1" />
                                Login
                              </Button>
                              <Button
                                variant="destructive"
                                size="xs"
                                onClick={() => handleDelete(card.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: CAPTURED LEADS (CRM)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'leads' && (
          <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
            <CardHeader className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <span>Captured Leads CRM</span>
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400 mt-1">
                  Prospects and clients who shared their contact info across your digital cards
                </CardDescription>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search leads..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="pl-8 w-44 sm:w-56"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={exportLeadsToCsv}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Export CSV
                </Button>
                <Button variant="outline" size="icon" onClick={fetchLeads} title="Refresh">
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {filteredLeads.length === 0 ? (
                <div className="py-20 text-center text-zinc-500">
                  <Users className="h-10 w-10 mx-auto text-zinc-600 mb-2" />
                  <p className="font-medium text-sm">No leads captured yet.</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    When visitors tap "Connect" on any card, their contact details appear here instantly.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prospect</TableHead>
                      <TableHead>Phone / WhatsApp</TableHead>
                      <TableHead>Card Profile</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <p className="font-semibold text-zinc-100">{lead.name}</p>
                          {lead.notes && <p className="text-xs text-zinc-400 mt-0.5">{lead.notes}</p>}
                        </TableCell>

                        <TableCell className="font-mono text-zinc-300">
                          {lead.phone}
                        </TableCell>

                        <TableCell>
                          <Badge variant="purple" className="font-mono text-[11px]">
                            {lead.clientSlug}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-xs text-zinc-500">
                          {new Date(lead.createdAt).toLocaleString()}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20connecting%20via%20Sera%20Cards!`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Button variant="outline" size="xs">
                                <MessageCircle className="h-3 w-3 mr-1 text-emerald-400" />
                                WhatsApp
                              </Button>
                            </a>
                            <Button
                              variant="destructive"
                              size="xs"
                              onClick={() => handleDeleteLead(lead.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5: SETTLEMENT LEDGER
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'settlements' && (
          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <Badge variant="purple" className="text-[10px] uppercase font-bold tracking-wider mb-2">
                    Transparent Financial Payout
                  </Badge>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Scale className="h-5 w-5 text-purple-400" />
                    <span>Weekly Settlement Ledger</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-1">
                    Current Period: <strong className="text-zinc-200">{settlementData?.currentWeekId || 'Active Week'}</strong> &middot; 50/50 profit split after raw material deduction
                  </CardDescription>
                </div>

                <Button
                  variant="purple"
                  onClick={() => handleSettleWeek(settlementData?.currentWeekId)}
                  className="font-bold shadow-lg"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Settle Week & Lock Ledger
                </Button>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Step 1 */}
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

                  {/* Step 2 */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                      2. Less: Material Buffer
                    </span>
                    <p className="text-2xl font-bold text-blue-400 mt-1 font-mono">
                      - LKR {(settlementData?.currentWeekMetrics?.totalMaterialBuffer || liveMetrics.totalMaterialBuffer).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      LKR 1,500/card reserved for next batch of chips
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-zinc-950 border border-purple-500/30 rounded-xl p-4 bg-purple-950/10">
                    <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                      3. Friend's 50% Share
                    </span>
                    <p className="text-2xl font-bold text-purple-400 mt-1 font-mono">
                      LKR {(settlementData?.currentWeekMetrics?.friendCommission || liveMetrics.friendCommission).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Accumulated commission ready to keep
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-zinc-950 border border-purple-500/30 rounded-xl p-4 bg-purple-950/10">
                    <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                      4. Owner's 50% Profit
                    </span>
                    <p className="text-2xl font-bold text-purple-400 mt-1 font-mono">
                      LKR {(settlementData?.currentWeekMetrics?.ownerShare || liveMetrics.ownerShare).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Accumulated profit to transfer to you
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Ledgers */}
            <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-800/80">
                <CardTitle className="text-base font-bold">Historical Settled Ledgers</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Permanently archived weekly records and payout totals
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {!settlementData?.settlements || settlementData.settlements.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500 text-xs">
                    No historical settlements archived yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week ID</TableHead>
                        <TableHead>Cards Sold</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Material Buffer</TableHead>
                        <TableHead>Friend Payout (50%)</TableHead>
                        <TableHead>Owner Profit (50%)</TableHead>
                        <TableHead>Settled Date</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settlementData.settlements.map((item: any) => (
                        <TableRow key={item.id} className="font-mono text-xs">
                          <TableCell className="font-bold text-white">{item.weekId}</TableCell>
                          <TableCell className="text-zinc-300">{item.totalCardsSold}</TableCell>
                          <TableCell className="text-zinc-200">LKR {item.totalRevenue.toLocaleString()}</TableCell>
                          <TableCell className="text-blue-400">LKR {item.productionCostTotal.toLocaleString()}</TableCell>
                          <TableCell className="text-purple-400 font-bold">LKR {item.friendCommission.toLocaleString()}</TableCell>
                          <TableCell className="text-purple-400 font-bold">LKR {item.ownerProfit.toLocaleString()}</TableCell>
                          <TableCell className="text-zinc-500 font-sans">
                            {item.settledAt ? new Date(item.settledAt).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell className="text-right font-sans">
                            <Badge variant="purple" className="text-[10px]">
                              LOCKED / SETTLED
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            WORKSPACE 6: HARDWARE ACTIVATION CODES (Unassigned Cards)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'activations' && (
          <div className="space-y-6">
            {/* Batch Generator Header */}
            <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <Badge variant="amber" className="text-[10px] uppercase font-bold tracking-wider mb-2">
                    Physical Card Retail Engine
                  </Badge>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    <span>Unassigned Hardware Activation Codes</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-1">
                    Pre-program unassigned chips for retail packaging. Customers tap to activate their card in 60 seconds with zero admin work.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportActivationsCsv}>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="icon" onClick={fetchActivations} title="Refresh">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleGenerateBatch} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Batch Label</Label>
                    <Input
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                      placeholder="e.g. BATCH-MATTE-01"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Code Prefix</Label>
                    <Input
                      value={batchPrefix}
                      onChange={(e) => setBatchPrefix(e.target.value.toUpperCase())}
                      placeholder="SERA"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Number of Cards</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={batchCount}
                      onChange={(e) => setBatchCount(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      variant="purple"
                      disabled={isGeneratingBatch}
                      className="w-full font-bold shadow-md"
                    >
                      {isGeneratingBatch ? 'Generating...' : '+ Generate Batch Codes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Activation Codes Table */}
            <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-800/80">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span>Active Hardware Codes Inventory</span>
                  <Badge variant="purple">{activations.length} Total Codes</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {activations.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500 text-xs">
                    No activation codes generated yet. Use the batch generator above!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial Code</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Claimed Identity</TableHead>
                        <TableHead>Activation URL</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activations.map((item: any) => {
                        const isClaimed = item.status === 'ACTIVATED';
                        const activationUrl = `https://card.${rootDomain}/activate?code=${item.code}`;

                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-bold text-amber-300 text-sm">
                              {item.code}
                            </TableCell>
                            <TableCell className="text-zinc-400 text-xs">{item.batch}</TableCell>
                            <TableCell>
                              <Badge variant={isClaimed ? 'success' : 'amber'} className="text-[10px]">
                                {isClaimed ? '✓ ACTIVATED' : '⚡ READY TO TAP'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {isClaimed ? (
                                <div>
                                  <span className="font-mono text-purple-400 text-xs font-bold">
                                    @{item.assignedSlug}
                                  </span>
                                  {item.claimedBy && (
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.claimedBy}</p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-zinc-600 text-xs">Unclaimed</span>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-[11px] text-zinc-400 truncate max-w-xs">
                              {activationUrl}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="xs"
                                  onClick={() => copyToClipboard(activationUrl, 'Activation Link')}
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="xs"
                                  onClick={() => window.open(activationUrl, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 7: USER & CARDHOLDER ACCOUNTS
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Key className="h-5 w-5 text-emerald-400" />
                    <span>Cardholder Dashboard Logins</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-1">
                    Grant cardholders direct access to manage contact details, toggle remote NFC lock, and view real-time taps
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    variant="purple"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    onClick={() => {
                      setProvisionForm({
                        name: '',
                        email: '',
                        password: 'sera' + Math.floor(1000 + Math.random() * 9000),
                        phone: '',
                        cardSlug: cards[0]?.slug || '',
                        role: 'USER',
                        plan: 'PRO',
                      });
                      setIsProvisionModalOpen(true);
                    }}
                  >
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                    Provision Account
                  </Button>
                  <Button variant="outline" size="icon" onClick={fetchUsers} title="Refresh">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>

              <div className="p-4 border-b border-zinc-800 bg-zinc-950/40 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <Input
                    placeholder="Search by name, email, or slug..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 bg-zinc-900/60 border-zinc-800 text-xs h-9"
                  />
                </div>
                <span className="text-xs text-zinc-500">
                  {users.length} active account{users.length === 1 ? '' : 's'}
                </span>
              </div>

              <CardContent className="p-0">
                {users.length === 0 ? (
                  <div className="py-20 text-center text-zinc-500">
                    <Key className="h-10 w-10 mx-auto text-zinc-600 mb-2" />
                    <p className="font-medium text-sm">No cardholder accounts provisioned yet.</p>
                    <p className="text-xs text-zinc-600 mt-1">
                      Click <strong>Provision Account</strong> or click <strong>Login</strong> next to any profile to create their credentials.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User & Credentials</TableHead>
                        <TableHead>Linked Digital Card</TableHead>
                        <TableHead>Plan & Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Portal Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users
                        .filter((u) => {
                          if (!userSearch.trim()) return true;
                          const q = userSearch.toLowerCase();
                          return (
                            u.name?.toLowerCase().includes(q) ||
                            u.email?.toLowerCase().includes(q) ||
                            u.cardSlug?.toLowerCase().includes(q)
                          );
                        })
                        .map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                                {u.name}
                                {u.role === 'ADMIN' && (
                                  <Badge variant="purple" className="text-[9px] px-1.5 py-0 h-4">ADMIN</Badge>
                                )}
                              </div>
                              <p className="text-xs text-zinc-400 font-mono mt-0.5">{u.email}</p>
                              {u.phone && <p className="text-[11px] text-zinc-500 mt-0.5">{u.phone}</p>}
                            </TableCell>

                            <TableCell>
                              {u.cardSlug ? (
                                <div>
                                  <a
                                    href={`/c/${u.cardSlug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-mono text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                                  >
                                    /c/{u.cardSlug} <ArrowUpRight className="h-3 w-3" />
                                  </a>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    {u.cardSlug}.{rootDomain}
                                  </span>
                                </div>
                              ) : (
                                <Badge variant="secondary" className="text-xs text-zinc-500">Unassigned</Badge>
                              )}
                            </TableCell>

                            <TableCell>
                              <div className="flex flex-col gap-1 items-start">
                                <Badge variant={u.plan === 'ENTERPRISE' ? 'blue' : u.plan === 'PRO' ? 'purple' : 'secondary'} className="text-[10px]">
                                  {u.plan || 'PRO'}
                                </Badge>
                              </div>
                            </TableCell>

                            <TableCell className="text-xs text-zinc-500">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="xs"
                                  onClick={() => shareCredentialsWhatsApp(u)}
                                  className="text-emerald-400 hover:text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/40"
                                  title="Share Login Details via WhatsApp"
                                >
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  WhatsApp
                                </Button>
                                <Button
                                  variant="outline"
                                  size="xs"
                                  onClick={() => {
                                    setPasswordResetUser(u);
                                    setNewPassword(`${u.cardSlug?.split('-')[0] || 'sera'}2025`);
                                  }}
                                  title="Reset Password"
                                >
                                  <Key className="h-3 w-3 mr-1" />
                                  Reset
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="xs"
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  title="Revoke Access"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Email System Status & Dispatch Logs */}
            <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <span>Mailing Pipeline & Notification Engine</span>
                      <Badge
                        variant={mailStatus?.status === 'CONNECTED' ? 'success' : 'purple'}
                        className="text-[10px]"
                      >
                        {mailStatus?.status === 'CONNECTED' ? '● Resend API Live' : '● Simulation / Audit Mode'}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-400 mt-1">
                      Automated transactional emails dispatched for physical activations, account logins, orders, and leads
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTestMailModalOpen(true)}
                    className="text-xs font-semibold text-purple-400 border-purple-500/30 hover:bg-purple-950/40"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Send Test Email
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchMailStatusAndLogs}
                    title="Refresh Email Logs"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  {mailLogs.length > 0 && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={handleClearMailLogs}
                      className="text-zinc-500 hover:text-red-400 text-xs"
                      title="Clear logs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {mailLogs.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500">
                    <Mail className="h-8 w-8 mx-auto text-zinc-600 mb-2 opacity-60" />
                    <p className="text-xs text-zinc-400 font-medium">No transactional emails logged in this session.</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      When users activate cards on /activate or you provision accounts, real delivery logs appear here.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Email Subject & Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mailLogs.slice(0, 10).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs text-zinc-300">
                            {log.to}
                          </TableCell>
                          <TableCell>
                            <p className="text-xs font-semibold text-white">{log.subject}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                                {log.type}
                              </Badge>
                              <span className="text-[11px] text-zinc-500 truncate max-w-xs">{log.preview}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={log.status === 'SENT' ? 'success' : log.status === 'FAILED' ? 'destructive' : 'purple'}
                              className="text-[10px]"
                            >
                              {log.status === 'SENT' ? '✓ Delivered' : log.status === 'SIMULATED' ? '✓ Captured' : '⚠ Failed'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-[11px] text-zinc-500 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* ── Dialog 1: Programmer QR (NFC Flashing Automation) ── */}
      <Dialog open={!!nfcModalCard} onOpenChange={(open) => !open && setNfcModalCard(null)}>
        <DialogContent onClose={() => setNfcModalCard(null)} className="max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
              <QrCode className="h-3.5 w-3.5" />
              NFC Production Programmer
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              Flash Card: <span className="text-amber-400 font-mono">{nfcModalCard?.slug}</span>
            </DialogTitle>
            <DialogDescription className="text-center text-xs">
              Scan this QR with your NFC writer app to encode the NTAG215 chip in 15 seconds
            </DialogDescription>
          </DialogHeader>

          {nfcModalCard && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(`https://${nfcModalCard.slug}.${rootDomain}`)}`}
                  alt={`NFC Programmer QR for ${nfcModalCard.slug}`}
                  className="w-48 h-48 mx-auto block"
                />
              </div>

              {/* Universal direct link notice */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-2 text-left">
                <span className="font-mono text-xs text-amber-300 truncate">
                  /c/{nfcModalCard.slug}
                </span>
                <Button
                  variant="amber"
                  size="xs"
                  onClick={() => {
                    const directUrl = `${window.location.origin}/c/${nfcModalCard.slug}`;
                    copyToClipboard(directUrl, 'Universal Direct URL');
                  }}
                >
                  Copy URL
                </Button>
              </div>

              <div className="text-left bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 text-xs text-zinc-400 space-y-1.5">
                <p className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                  NTAG215 15-Sec Flashing Workflow:
                </p>
                <p>1. Open <strong>NFC Tools</strong> on your smartphone &rarr; Tap <strong>Write</strong></p>
                <p>2. Add Record &rarr; <strong>URL / URI</strong> &rarr; Scan QR or paste copied link</p>
                <p>3. Tap <strong>Write</strong> and hold card to the top of the handset</p>
                <p>4. Verify card opens instantly in native browser &rarr; Pack & Ship</p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" className="w-full" onClick={() => setNfcModalCard(null)}>
              Done / Close Programmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 2: View Card Leads ── */}
      <Dialog open={!!viewLeadsSlug} onOpenChange={(open) => !open && setViewLeadsSlug(null)}>
        <DialogContent onClose={() => setViewLeadsSlug(null)} className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Leads for <span className="text-purple-400 font-mono">{viewLeadsSlug}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {leads.filter((l) => l.clientSlug === viewLeadsSlug).length === 0 ? (
              <p className="text-zinc-500 text-xs py-6 text-center">No leads recorded for this card yet.</p>
            ) : (
              leads
                .filter((l) => l.clientSlug === viewLeadsSlug)
                .map((lead) => (
                  <div key={lead.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-zinc-100">{lead.name}</p>
                      <p className="font-mono text-xs text-zinc-400">{lead.phone}</p>
                      {lead.notes && <p className="text-[11px] text-zinc-500 mt-1">{lead.notes}</p>}
                    </div>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20connecting!`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="outline" size="xs">
                        <MessageCircle className="h-3 w-3 mr-1 text-emerald-400" />
                        Chat
                      </Button>
                    </a>
                  </div>
                ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setViewLeadsSlug(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 3: Operator Quick Order Form ── */}
      <Dialog open={isQuickOrderOpen} onOpenChange={setIsQuickOrderOpen}>
        <DialogContent onClose={() => setIsQuickOrderOpen(false)} className="max-w-lg">
          <DialogHeader>
            <Badge variant="purple" className="w-fit text-[10px] mb-1">
              ⚡ Operator Quick Order
            </Badge>
            <DialogTitle className="text-lg font-bold">Add New Client Order</DialogTitle>
            <DialogDescription className="text-xs">
              Quickly record phone, WhatsApp, or in-person orders with custom pricing and production tracking
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleQuickCreateOrder} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Client Name *</Label>
              <Input
                required
                value={quickOrderForm.clientName}
                onChange={(e) => setQuickOrderForm({ ...quickOrderForm, clientName: e.target.value })}
                placeholder="e.g. Kosala Fernando"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">WhatsApp Phone Number *</Label>
              <Input
                type="tel"
                required
                value={quickOrderForm.whatsappNumber}
                onChange={(e) => setQuickOrderForm({ ...quickOrderForm, whatsappNumber: e.target.value })}
                placeholder="e.g. 0771169108"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Card Variant</Label>
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
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Sera Signature PVC">Sera Signature PVC (LKR 3,500)</option>
                  <option value="Full Custom Print PVC">Full Custom Print PVC (LKR 5,000)</option>
                  <option value="Special Enterprise Request">Special Enterprise Request (Custom)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Custom Amount (LKR) *</Label>
                <Input
                  type="number"
                  required
                  value={quickOrderForm.customAmount}
                  onChange={(e) => setQuickOrderForm({ ...quickOrderForm, customAmount: e.target.value })}
                  placeholder="3500"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Payment Status</Label>
                <div className="flex rounded-xl border border-zinc-800 bg-zinc-950 p-1">
                  <button
                    type="button"
                    onClick={() => setQuickOrderForm({ ...quickOrderForm, paymentStatus: 'PAID' })}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      quickOrderForm.paymentStatus === 'PAID'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    ✓ Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickOrderForm({ ...quickOrderForm, paymentStatus: 'PENDING' })}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      quickOrderForm.paymentStatus === 'PENDING'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    ⏳ Pending
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Fulfillment Stage</Label>
                <select
                  value={quickOrderForm.fulfillmentStatus}
                  onChange={(e) => setQuickOrderForm({ ...quickOrderForm, fulfillmentStatus: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="ORDER_RECEIVED">1. Order Received</option>
                  <option value="ENCODING_CHIP">2. Encoding Chip</option>
                  <option value="PRINTING">3. Printing</option>
                  <option value="DISPATCHED">4. Dispatched</option>
                  <option value="DELIVERED">5. Delivered</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsQuickOrderOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="purple">
                Create Order &rarr;
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 4: Provision Cardholder Login ── */}
      <Dialog open={isProvisionModalOpen} onOpenChange={(open) => !open && setIsProvisionModalOpen(false)}>
        <DialogContent onClose={() => setIsProvisionModalOpen(false)} className="max-w-md">
          <DialogHeader>
            <div className="mx-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
              <Key className="h-3.5 w-3.5" />
              Portal Access Provisioning
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              Provision Cardholder Login
            </DialogTitle>
            <DialogDescription className="text-center text-xs">
              Create credentials for your client to access their private Sera Cards portal
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProvisionUser} className="space-y-3.5 mt-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-300">Client / Cardholder Full Name</Label>
              <Input
                type="text"
                value={provisionForm.name}
                onChange={(e) => setProvisionForm({ ...provisionForm, name: e.target.value })}
                placeholder="e.g. Kasun Jayawardena"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Login Email</Label>
                <Input
                  type="email"
                  value={provisionForm.email}
                  onChange={(e) => setProvisionForm({ ...provisionForm, email: e.target.value })}
                  placeholder="client@company.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Temporary Password</Label>
                <Input
                  type="text"
                  value={provisionForm.password}
                  onChange={(e) => setProvisionForm({ ...provisionForm, password: e.target.value })}
                  placeholder="e.g. kasun1234"
                  className="font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">WhatsApp / Phone</Label>
                <Input
                  type="tel"
                  value={provisionForm.phone}
                  onChange={(e) => setProvisionForm({ ...provisionForm, phone: e.target.value })}
                  placeholder="e.g. +94771234567"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Assigned Card Slug</Label>
                <Input
                  type="text"
                  value={provisionForm.cardSlug}
                  onChange={(e) => setProvisionForm({ ...provisionForm, cardSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="e.g. kasun"
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-zinc-300">Software Plan</Label>
              <select
                value={provisionForm.plan}
                onChange={(e) => setProvisionForm({ ...provisionForm, plan: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="PRO">GoSera Pro (Full Features & Analytics)</option>
                <option value="ENTERPRISE">GoSera Enterprise (Corporate Fleet)</option>
                <option value="BASIC">GoSera Basic (Standard)</option>
              </select>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsProvisionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="purple" className="bg-emerald-600 hover:bg-emerald-500 text-white" disabled={isProvisioning}>
                {isProvisioning ? 'Creating Access...' : 'Create Login &rarr;'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 5: Password Reset Modal ── */}
      <Dialog open={!!passwordResetUser} onOpenChange={(open) => !open && setPasswordResetUser(null)}>
        <DialogContent onClose={() => setPasswordResetUser(null)} className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Reset Password</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Set a new password for <span className="text-white font-mono">{passwordResetUser?.email}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-3.5 mt-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-300">New Password (min 6 characters)</Label>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="e.g. NewPass1234"
                className="font-mono text-sm"
                required
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setPasswordResetUser(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="purple">
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 6: Send Test Diagnostic Email ── */}
      <Dialog open={isTestMailModalOpen} onOpenChange={(open) => !open && setIsTestMailModalOpen(false)}>
        <DialogContent onClose={() => setIsTestMailModalOpen(false)} className="max-w-sm">
          <DialogHeader>
            <div className="mx-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-2">
              <Mail className="h-3.5 w-3.5" />
              Email System Diagnostics
            </div>
            <DialogTitle className="text-center text-lg font-bold">
              Dispatch Test Email
            </DialogTitle>
            <DialogDescription className="text-center text-xs">
              Verify your transactional email pipeline and template rendering
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendTestEmail} className="space-y-3.5 mt-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-300">Destination Email</Label>
              <Input
                type="email"
                value={testMailRecipient}
                onChange={(e) => setTestMailRecipient(e.target.value)}
                placeholder="chithilamanul1@gmail.com"
                required
              />
            </div>

            <div className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
              <p>⚡ Status: <strong className="text-purple-400">{mailStatus?.status === 'CONNECTED' ? 'Resend Live API' : 'Simulation Mode'}</strong></p>
              <p>From: <span className="font-mono text-zinc-300">{mailStatus?.sender || 'info@seranex.lk'}</span></p>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsTestMailModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="purple" disabled={isSendingTestMail}>
                {isSendingTestMail ? 'Sending...' : 'Send Test Email &rarr;'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

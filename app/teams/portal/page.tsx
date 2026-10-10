'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Building2,
  Users,
  ShieldCheck,
  Lock,
  Unlock,
  Plus,
  Download,
  UploadCloud,
  ExternalLink,
  Copy,
  Trash2,
  RefreshCw,
  Search,
  Sparkles,
  Phone,
  Mail,
  FileText,
  Palette,
  CreditCard,
  UserX,
  UserCheck,
  Award,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TEMPLATE_PRESETS } from '@/lib/templates';

const COLOR_SWATCHES = [
  { name: 'Corporate Sky', hex: '#0ea5e9' },
  { name: 'Emerald Growth', hex: '#10b981' },
  { name: 'Obsidian Gold', hex: '#f59e0b' },
  { name: 'Royal Purple', hex: '#8b5cf6' },
  { name: 'Crimson Executive', hex: '#e11d48' },
  { name: 'Slate Minimal', hex: '#475569' },
];

export default function EnterpriseTeamsPortal() {
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'fleet' | 'brand' | 'leads' | 'hardware'>('fleet');

  // Search & Filters
  const [memberSearch, setMemberSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [selectedRepFilter, setSelectedRepFilter] = useState('ALL');

  // Brand Settings Form
  const [brandForm, setBrandForm] = useState<any>({
    companyName: '',
    tagline: '',
    primaryColor: '#0ea5e9',
    logoUrl: '',
    coverUrl: '',
    website: '',
    companyAddress: '',
    disclaimer: '',
    catalogPdfUrl: '',
    catalogPdfTitle: '',
    googleReviewUrl: '',
    templatePreset: 'company_profile',
    isLocked: true,
  });
  const [isSavingBrand, setIsSavingBrand] = useState(false);

  // Single Add Employee Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    slug: '',
    avatarUrl: '',
    bio: '',
    linkedin: '',
    activationCode: '',
  });
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Bulk CSV Import Modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  // Member Edit Modal
  const [editingMember, setEditingMember] = useState<any>(null);

  // Multi-Company / Multi-Tenant State
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanySlug, setSelectedCompanySlug] = useState<string>('apex');
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    slug: '',
    adminEmail: '',
    seatLimit: 25,
    tagline: 'Premier Corporate & Wealth Advisory',
    primaryColor: '#0ea5e9',
  });
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

  // Fetch Team Data
  const fetchTeamData = async (targetSlug?: string) => {
    try {
      setLoading(true);
      const activeSlug = targetSlug || selectedCompanySlug || 'apex';

      // 1. Fetch all companies for the multi-company switcher
      try {
        const allRes = await fetch('/api/teams?all=true');
        const allData = await allRes.json();
        if (allData.success && Array.isArray(allData.teams)) {
          setCompanies(allData.teams);
        }
      } catch (err) {
        console.warn('Could not list all companies:', err);
      }

      // 2. Fetch specific company fleet data
      const res = await fetch(`/api/teams?slug=${encodeURIComponent(activeSlug)}`);
      const data = await res.json();

      if (data.success && data.team) {
        setTeam(data.team);
        setSelectedCompanySlug(data.team.slug);
        setStats(data.stats);
        setBrandForm({
          ...data.team.brandSettings,
        });

        // Fetch members
        const memRes = await fetch(`/api/teams/members?teamId=${data.team.id}`);
        const memData = await memRes.json();
        if (memData.success) {
          setMembers(memData.members || []);
        }

        // Fetch pooled leads
        const leadRes = await fetch(`/api/teams/leads?teamId=${data.team.id}`);
        const leadData = await leadRes.json();
        if (leadData.success) {
          setLeads(leadData.leads || []);
        }
      }
    } catch (err) {
      console.error('Failed to load team data:', err);
      toast.error('Could not load enterprise data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  // Create New Company Handler
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name.trim() || !companyForm.slug.trim() || !companyForm.adminEmail.trim()) {
      toast.error('Please enter Company Name, Subdomain Slug, and Admin Email.');
      return;
    }

    setIsCreatingCompany(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_TEAM',
          name: companyForm.name.trim(),
          slug: companyForm.slug.trim().toLowerCase(),
          adminEmail: companyForm.adminEmail.trim().toLowerCase(),
          seatLimit: Number(companyForm.seatLimit) || 25,
          plan: 'ENTERPRISE',
          brandSettings: {
            companyName: companyForm.name.trim(),
            tagline: companyForm.tagline.trim(),
            primaryColor: companyForm.primaryColor,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create company');

      toast.success(`Company "${data.team.name}" registered successfully!`);
      setIsAddCompanyModalOpen(false);
      setCompanyForm({
        name: '',
        slug: '',
        adminEmail: '',
        seatLimit: 25,
        tagline: 'Premier Corporate & Wealth Advisory',
        primaryColor: '#0ea5e9',
      });
      setSelectedCompanySlug(data.team.slug);
      fetchTeamData(data.team.slug);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create company');
    } finally {
      setIsCreatingCompany(false);
    }
  };

  // Filtered Members
  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return members;
    const q = memberSearch.toLowerCase().trim();
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.designation?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.slug?.toLowerCase().includes(q)
    );
  }, [members, memberSearch]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesRep = selectedRepFilter === 'ALL' || l.clientSlug === selectedRepFilter;
      const matchesSearch =
        !leadSearch.trim() ||
        l.name?.toLowerCase().includes(leadSearch.toLowerCase().trim()) ||
        l.phone?.includes(leadSearch.trim()) ||
        l.notes?.toLowerCase().includes(leadSearch.toLowerCase().trim());
      return matchesRep && matchesSearch;
    });
  }, [leads, selectedRepFilter, leadSearch]);

  // Rep Leaderboard
  const repLeaderboard = useMemo(() => {
    const counts: Record<string, { name: string; designation: string; count: number; slug: string }> = {};
    for (const lead of leads) {
      const slug = lead.clientSlug || 'other';
      if (!counts[slug]) {
        counts[slug] = {
          name: lead.repName || slug,
          designation: lead.repDesignation || 'Advisor',
          count: 0,
          slug,
        };
      }
      counts[slug].count++;
    }
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 3);
  }, [leads]);

  // Copy Helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}!`);
  };

  // Save Brand Lock Settings
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setIsSavingBrand(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          brandSettings: brandForm,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save brand');

      setTeam(data.team);
      toast.success('🔒 Master Brand updated and pushed to all active employee cards!', { duration: 4000 });
      fetchTeamData();
    } catch (err: any) {
      toast.error(err.message || 'Error updating brand lock');
    } finally {
      setIsSavingBrand(false);
    }
  };

  // Add Single Employee
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setIsAddingMember(true);
    try {
      const res = await fetch('/api/teams/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          ...addForm,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add employee');

      toast.success(data.message || 'Employee added successfully!');
      setIsAddModalOpen(false);
      setAddForm({
        name: '',
        email: '',
        phone: '',
        designation: '',
        slug: '',
        avatarUrl: '',
        bio: '',
        linkedin: '',
        activationCode: '',
      });
      fetchTeamData();
    } catch (err: any) {
      toast.error(err.message || 'Error adding employee');
    } finally {
      setIsAddingMember(false);
    }
  };

  // Bulk CSV Import
  const handleBulkImport = async () => {
    if (!team || !csvText.trim()) {
      toast.error('Please enter CSV data');
      return;
    }
    setIsBulkImporting(true);
    try {
      const lines = csvText.trim().split('\n');
      const parsedMembers: any[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || (i === 0 && line.toLowerCase().includes('name'))) continue; // skip header
        const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 2) {
          parsedMembers.push({
            name: parts[0],
            email: parts[1],
            phone: parts[2] || '+94 77 000 0000',
            designation: parts[3] || 'Executive',
            activationCode: parts[4] || undefined,
          });
        }
      }

      if (parsedMembers.length === 0) {
        toast.error('Could not parse any valid employee rows from CSV');
        return;
      }

      const res = await fetch('/api/teams/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          bulk: true,
          members: parsedMembers,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Bulk import failed');

      toast.success(`Imported ${data.createdCount} corporate cards!`, { duration: 4000 });
      setIsBulkModalOpen(false);
      setCsvText('');
      fetchTeamData();
    } catch (err: any) {
      toast.error(err.message || 'Bulk import error');
    } finally {
      setIsBulkImporting(false);
    }
  };

  // Toggle Member Status (Active vs Deactivated)
  const handleToggleStatus = async (member: any) => {
    if (!team) return;
    const newStatus = member.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    try {
      const res = await fetch('/api/teams/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          memberId: member.id,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      toast.success(
        newStatus === 'DEACTIVATED'
          ? `🔒 Card for ${member.name} deactivated`
          : `✓ Card for ${member.name} reactivated`
      );
      fetchTeamData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Offboard / Delete Member
  const handleDeleteMember = async (member: any) => {
    if (!window.confirm(`Are you sure you want to offboard ${member.name}? Their card will be permanently removed and license seat released.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/teams/members?teamId=${team.id}&memberId=${member.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to offboard');

      toast.success(`${member.name} offboarded successfully`);
      fetchTeamData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Export Centralized Leads to CSV
  const handleExportLeadsCsv = () => {
    if (!team) return;
    window.location.href = `/api/teams/leads?teamId=${team.id}&format=csv`;
    toast.success('Downloading Unified CRM Leads CSV...');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-sky-600 selection:text-white">
      <Toaster position="top-right" />
      <Nav />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Enterprise Cockpit Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-800/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center p-2.5 overflow-hidden shadow-lg">
              {team?.brandSettings?.logoUrl ? (
                <img
                  src={team.brandSettings.logoUrl}
                  alt={team.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-8 h-8 text-sky-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="purple" className="text-[10px] uppercase font-bold tracking-wider">
                  Enterprise B2B Fleet
                </Badge>
                <Badge
                  variant={team?.brandSettings?.isLocked ? 'success' : 'amber'}
                  className="text-[10px] font-bold"
                >
                  {team?.brandSettings?.isLocked ? '🔒 Brand Lock Active' : '🔓 Unlocked'}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                {team?.name || 'Enterprise Fleet Hub'}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {team?.brandSettings?.tagline || 'Centralized corporate multi-card administration & CRM lead pool'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Multi-Company Selector Dropdown */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs">
              <Building2 className="h-4 w-4 text-sky-400 shrink-0" />
              <select
                value={selectedCompanySlug}
                onChange={(e) => {
                  const newSlug = e.target.value;
                  setSelectedCompanySlug(newSlug);
                  fetchTeamData(newSlug);
                }}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
                title="Select active company"
              >
                {companies.length > 0 ? (
                  companies.map((c) => (
                    <option key={c.id || c.slug} value={c.slug} className="bg-zinc-900 text-white">
                      {c.name} ({c.slug})
                    </option>
                  ))
                ) : (
                  <option value={team?.slug || 'apex'} className="bg-zinc-900 text-white">
                    {team?.name || 'Apex Capital Partners'}
                  </option>
                )}
              </select>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setIsAddCompanyModalOpen(true)}
                className="border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-[11px] h-7 font-semibold"
              >
                + New Company
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTeamData(selectedCompanySlug)}
              disabled={loading}
              className="border-zinc-800 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkModalOpen(true)}
              className="border-zinc-800 text-xs"
            >
              <UploadCloud className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
              Bulk CSV Import
            </Button>
            <Button
              variant="purple"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold shadow-md"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              + Add Employee
            </Button>
          </div>
        </div>

        {/* Real-Time Fleet KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Seat Meter */}
          <Card className="border-zinc-800 bg-zinc-900/80 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold uppercase tracking-wider">Active License Seats</span>
                <Briefcase className="h-4 w-4 text-sky-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {stats?.activeMembers ?? members.length}
                </span>
                <span className="text-sm font-semibold text-zinc-500">
                  / {stats?.totalSeats ?? team?.seatLimit ?? 25} Seats
                </span>
              </div>
              {/* Progress Bar */}
              <div className="mt-3 w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      ((stats?.activeMembers ?? members.length) /
                        (stats?.totalSeats ?? team?.seatLimit ?? 25)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Aggregated Leads */}
          <Card className="border-zinc-800 bg-zinc-900/80 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold uppercase tracking-wider">Centralized Leads</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{leads.length}</span>
                <span className="text-xs text-emerald-400 font-medium">Pooled Fleet Total</span>
              </div>
              <p className="mt-3 text-[11px] text-zinc-400">
                Aggregated from all exhibition taps & QR scans
              </p>
            </CardContent>
          </Card>

          {/* Active Cards */}
          <Card className="border-zinc-800 bg-zinc-900/80 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold uppercase tracking-wider">Active Cards In Field</span>
                <CreditCard className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {members.filter((m) => m.status === 'ACTIVE').length}
                </span>
                <span className="text-xs text-zinc-400">100% Live</span>
              </div>
              <p className="mt-3 text-[11px] text-zinc-400">
                {members.filter((m) => m.status === 'DEACTIVATED').length} deactivated / offboarded
              </p>
            </CardContent>
          </Card>

          {/* Brand Lock Policy */}
          <Card className="border-zinc-800 bg-zinc-900/80 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold uppercase tracking-wider">Brand Lock Policy</span>
                <ShieldCheck className="h-4 w-4 text-purple-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">
                  {team?.brandSettings?.isLocked ? 'Enforced' : 'Self-Serve'}
                </span>
              </div>
              <p className="mt-3 text-[11px] text-zinc-400">
                {team?.brandSettings?.isLocked
                  ? 'Employees cannot modify logo, banner, or colors'
                  : 'Open self-serve editing permitted'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabbed Navigation */}
        <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="space-y-6">
          <TabsList className="bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl">
            <TabsTrigger value="fleet" className="text-xs data-[state=active]:bg-zinc-800">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Employee Fleet ({members.length})
            </TabsTrigger>
            <TabsTrigger value="brand" className="text-xs data-[state=active]:bg-zinc-800">
              <Lock className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
              Master Brand & Template Lock
            </TabsTrigger>
            <TabsTrigger value="leads" className="text-xs data-[state=active]:bg-zinc-800">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
              Centralized CRM Leads ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="hardware" className="text-xs data-[state=active]:bg-zinc-800">
              <CreditCard className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
              Hardware NFC Provisioning
            </TabsTrigger>
          </TabsList>

          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: EMPLOYEE FLEET DIRECTORY
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="fleet" className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-sky-400" />
                    <span>Company Employee Roster</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-1">
                    Manage digital identity cards, direct links, and employee status for your entire company fleet.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <Input
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Search employee, title..."
                      className="pl-8 text-xs h-9 bg-zinc-950 border-zinc-800"
                    />
                  </div>
                  <Button
                    variant="purple"
                    size="sm"
                    onClick={() => setIsAddModalOpen(true)}
                    className="shrink-0 text-xs font-bold"
                  >
                    + Add Employee
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {filteredMembers.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500 text-xs">
                    No employees matched your search. Click "+ Add Employee" above to provision a new card!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Direct Contact</TableHead>
                        <TableHead>Digital Card URL</TableHead>
                        <TableHead>NFC Serial</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((m) => {
                        const directUrl = `https://card.${rootDomain}/c/${m.slug}`;
                        const isDeactivated = m.status === 'DEACTIVATED';

                        return (
                          <TableRow key={m.id} className={isDeactivated ? 'opacity-60 bg-red-950/10' : ''}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                                  alt={m.name}
                                  className="w-9 h-9 rounded-full object-cover border border-zinc-700 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-white text-xs leading-snug">{m.name}</p>
                                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">@{m.slug}</p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-xs text-zinc-300 font-medium">
                              {m.designation}
                            </TableCell>

                            <TableCell>
                              <div className="space-y-0.5 text-[11px] text-zinc-400">
                                <p className="flex items-center gap-1.5">
                                  <Phone className="h-3 w-3 text-emerald-400 shrink-0" />
                                  <span>{m.phone}</span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <Mail className="h-3 w-3 text-sky-400 shrink-0" />
                                  <span className="truncate max-w-[130px]">{m.email}</span>
                                </p>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] text-purple-300 truncate max-w-[140px]">
                                  /c/{m.slug}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-zinc-400 hover:text-white"
                                  onClick={() => copyToClipboard(directUrl, 'Card URL')}
                                  title="Copy URL"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-zinc-400 hover:text-white"
                                  onClick={() => window.open(directUrl, '_blank')}
                                  title="Open live card"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>

                            <TableCell>
                              {m.activationCode ? (
                                <span className="font-mono text-xs text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                  {m.activationCode}
                                </span>
                              ) : (
                                <span className="text-[11px] text-zinc-600 italic">Unassigned</span>
                              )}
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant={isDeactivated ? 'destructive' : 'success'}
                                className="text-[10px] font-bold"
                              >
                                {isDeactivated ? 'DEACTIVATED' : 'ACTIVE'}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="xs"
                                  onClick={() => handleToggleStatus(m)}
                                  className={`text-[11px] ${
                                    isDeactivated
                                      ? 'text-emerald-400 hover:bg-emerald-500/10'
                                      : 'text-amber-400 hover:bg-amber-500/10'
                                  }`}
                                  title={isDeactivated ? 'Reactivate card' : 'Deactivate card'}
                                >
                                  {isDeactivated ? (
                                    <>
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      Reactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="h-3 w-3 mr-1" />
                                      Deactivate
                                    </>
                                  )}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handleDeleteMember(m)}
                                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                  title="Offboard employee permanently"
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
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: MASTER BRAND & TEMPLATE LOCKING CENTER
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="brand" className="space-y-6">
            <form onSubmit={handleSaveBrand} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Master Styling Controls */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
                  <CardHeader className="p-6 border-b border-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <Lock className="h-5 w-5 text-amber-400" />
                          <span>Corporate Master Brand Lock</span>
                        </CardTitle>
                        <CardDescription className="text-xs text-zinc-400 mt-1">
                          Define approved company brand identity. All cards in your company fleet inherit these assets automatically.
                        </CardDescription>
                      </div>

                      {/* Lock Toggle */}
                      <div className="flex items-center gap-2 p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                        <span className="text-xs font-semibold text-zinc-300">
                          {brandForm.isLocked ? '🔒 Enforced' : '🔓 Unlocked'}
                        </span>
                        <input
                          type="checkbox"
                          checked={brandForm.isLocked}
                          onChange={(e) => setBrandForm({ ...brandForm, isLocked: e.target.checked })}
                          className="toggle h-5 w-5 accent-purple-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-5">
                    {/* Company Name & Tagline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Company Legal Name *</Label>
                        <Input
                          value={brandForm.companyName}
                          onChange={(e) => setBrandForm({ ...brandForm, companyName: e.target.value })}
                          required
                          placeholder="e.g. Apex Capital Partners"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Corporate Tagline / Slogan</Label>
                        <Input
                          value={brandForm.tagline}
                          onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                          placeholder="e.g. Wealth & Corporate Advisory"
                        />
                      </div>
                    </div>

                    {/* Primary Color Swatches */}
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-300 flex items-center justify-between">
                        <span>Corporate Accent Color</span>
                        <span className="font-mono text-[11px] text-zinc-400">{brandForm.primaryColor}</span>
                      </Label>
                      <div className="flex flex-wrap items-center gap-3">
                        {COLOR_SWATCHES.map((s) => (
                          <button
                            key={s.hex}
                            type="button"
                            onClick={() => setBrandForm({ ...brandForm, primaryColor: s.hex })}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                              brandForm.primaryColor === s.hex
                                ? 'border-white bg-white/10 text-white ring-2 ring-purple-500'
                                : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: s.hex }}
                            />
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Logo & Cover Banner URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Company Logo URL</Label>
                        <Input
                          value={brandForm.logoUrl}
                          onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                          placeholder="https://.../logo.png"
                        />
                        {brandForm.logoUrl && (
                          <div className="mt-2 h-12 w-28 bg-zinc-950 rounded-lg border border-zinc-800 p-1 flex items-center justify-center">
                            <img src={brandForm.logoUrl} alt="Logo" className="max-h-full object-contain" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Corporate Cover Banner URL</Label>
                        <Input
                          value={brandForm.coverUrl}
                          onChange={(e) => setBrandForm({ ...brandForm, coverUrl: e.target.value })}
                          placeholder="https://.../banner.jpg"
                        />
                        {brandForm.coverUrl && (
                          <div className="mt-2 h-12 w-full bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
                            <img src={brandForm.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Official Website & Headquarters Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Corporate Website URL</Label>
                        <Input
                          value={brandForm.website}
                          onChange={(e) => setBrandForm({ ...brandForm, website: e.target.value })}
                          placeholder="https://company.lk"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Headquarters Address</Label>
                        <Input
                          value={brandForm.companyAddress}
                          onChange={(e) => setBrandForm({ ...brandForm, companyAddress: e.target.value })}
                          placeholder="Level 28, WTC, Colombo 01"
                        />
                      </div>
                    </div>

                    {/* Catalog / Brochure PDF Upload */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                          📄 Company Catalog / Portfolio / Brochure (PDF)
                        </span>
                        {brandForm.catalogPdfUrl && (
                          <Badge variant="success" className="text-[10px]">
                            ✓ Brochure Linked
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-[11px] text-zinc-400">Brochure Display Title</Label>
                          <Input
                            value={brandForm.catalogPdfTitle || ''}
                            onChange={(e) => setBrandForm({ ...brandForm, catalogPdfTitle: e.target.value })}
                            placeholder="e.g. 2026 Institutional Investment Outlook"
                            className="mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] text-zinc-400">PDF Document File</Label>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setBrandForm((prev: any) => ({
                                    ...prev,
                                    catalogPdfUrl: ev.target?.result as string,
                                    catalogPdfTitle: prev.catalogPdfTitle || file.name.replace(/\.pdf$/i, ''),
                                  }));
                                  toast.success('Corporate brochure PDF attached!');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="mt-1 w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-zinc-800 file:text-white file:text-xs hover:file:bg-zinc-700 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Regulatory Disclaimer & Google Review */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Google Review Booster Link</Label>
                        <Input
                          value={brandForm.googleReviewUrl || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, googleReviewUrl: e.target.value })}
                          placeholder="https://maps.google.com/..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Template Style Preset</Label>
                        <select
                          value={brandForm.templatePreset}
                          onChange={(e) => setBrandForm({ ...brandForm, templatePreset: e.target.value })}
                          className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          {TEMPLATE_PRESETS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-300">Mandatory Corporate Legal Disclaimer</Label>
                      <textarea
                        rows={2}
                        value={brandForm.disclaimer}
                        onChange={(e) => setBrandForm({ ...brandForm, disclaimer: e.target.value })}
                        placeholder="Regulated by SEC Sri Lanka. Confidential & proprietary."
                        className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 border-t border-zinc-800/80 flex justify-between items-center">
                    <p className="text-xs text-zinc-500">
                      Saving applies these settings to all {members.length} employee cards immediately.
                    </p>
                    <Button
                      type="submit"
                      variant="purple"
                      disabled={isSavingBrand}
                      className="font-bold text-xs shadow-lg"
                    >
                      {isSavingBrand ? 'Propagating Brand...' : '⚡ Save & Push to All Cards'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Right Col: Live Brand Summary & Rule Card */}
              <div className="space-y-6">
                <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
                  <CardHeader className="p-6 border-b border-zinc-800/80">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Employee Self-Serve Rules</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 text-xs text-zinc-400">
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <p className="font-semibold text-white mb-1.5">🔒 What HR Locks Centrally:</p>
                      <ul className="space-y-1 list-disc list-inside text-zinc-400">
                        <li>Company Logo & Wordmark</li>
                        <li>Cover Banner Graphic</li>
                        <li>Corporate Primary Colors</li>
                        <li>Company Website & Office Address</li>
                        <li>Catalog / Brochure PDF (10MB)</li>
                        <li>Legal Disclaimers & Regulatory Notices</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <p className="font-semibold text-white mb-1.5">👤 What Employees Can Edit:</p>
                      <ul className="space-y-1 list-disc list-inside text-zinc-400">
                        <li>Their Full Name & Designation</li>
                        <li>Direct WhatsApp & Mobile Phone</li>
                        <li>Personal Corporate Email</li>
                        <li>Headshot Profile Photo</li>
                        <li>Personal Professional Bio</li>
                        <li>Direct LinkedIn Profile</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: CENTRALIZED CRM LEAD POOLING
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="leads" className="space-y-6">
            {/* Top 3 Leaderboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {repLeaderboard.map((item, idx) => (
                <Card key={item.slug} className="border-zinc-800 bg-zinc-900/90 shadow-md">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                        <Award className="h-3.5 w-3.5" />
                        <span>#{idx + 1} Networking Star</span>
                      </div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-[11px] text-zinc-400">{item.designation}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">{item.count}</span>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Leads</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <Badge variant="purple" className="text-[10px] uppercase font-bold tracking-wider mb-2">
                    Unified Exhibition & Conference Inbox
                  </Badge>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <span>Company-Wide Captured Leads ({filteredLeads.length})</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-1">
                    All client contacts exchanged across all {members.length} company sales cards feed into this unified CRM ledger.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Filter by Rep */}
                  <select
                    value={selectedRepFilter}
                    onChange={(e) => setSelectedRepFilter(e.target.value)}
                    className="h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="ALL">All Sales Reps</option>
                    {members.map((m) => (
                      <option key={m.slug} value={m.slug}>
                        {m.name} (@{m.slug})
                      </option>
                    ))}
                  </select>

                  {/* Search */}
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <Input
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder="Search prospect, phone..."
                      className="pl-8 text-xs h-9 bg-zinc-950 border-zinc-800 w-44"
                    />
                  </div>

                  {/* 1-Click CSV Export */}
                  <Button
                    variant="purple"
                    size="sm"
                    onClick={handleExportLeadsCsv}
                    className="text-xs font-bold shadow-md"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    📥 Export to CRM (CSV)
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {filteredLeads.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500 text-xs">
                    No captured leads found for this filter. When clients tap any employee's card and exchange details, they show up here instantly!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Prospect Name</TableHead>
                        <TableHead>Phone / WhatsApp</TableHead>
                        <TableHead>Captured By (Sales Rep)</TableHead>
                        <TableHead>Meeting Notes / Context</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => {
                        const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                        const waUrl = `https://wa.me/${cleanPhone}`;

                        return (
                          <TableRow key={lead.id}>
                            <TableCell className="text-xs font-mono text-zinc-400">
                              {new Date(lead.createdAt).toLocaleDateString()}{' '}
                              <span className="text-[10px] text-zinc-500">
                                {new Date(lead.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </TableCell>

                            <TableCell className="font-bold text-white text-xs">
                              {lead.name}
                            </TableCell>

                            <TableCell className="font-mono text-xs text-sky-400">
                              {lead.phone}
                            </TableCell>

                            <TableCell>
                              <div>
                                <p className="font-bold text-xs text-purple-300">{lead.repName}</p>
                                <p className="text-[10px] text-zinc-500 font-medium">{lead.repDesignation}</p>
                              </div>
                            </TableCell>

                            <TableCell className="text-xs text-zinc-300 max-w-xs truncate">
                              {lead.notes || <span className="text-zinc-600 italic">No notes</span>}
                            </TableCell>

                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() => window.open(waUrl, '_blank')}
                                className="text-emerald-400 hover:bg-emerald-500/10 text-[11px]"
                              >
                                Message ↗
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: HARDWARE NFC PROVISIONING
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="hardware" className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-800/80">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                  <span>Physical NFC Card Linking & Encoding</span>
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400 mt-1">
                  Connect unassigned Sera NFC cards to your company employees in seconds.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <span className="text-2xl font-bold text-purple-400">1</span>
                    <h3 className="font-bold text-white text-sm mt-2">Write Card URL</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Using any free NFC app (e.g. NFC Tools), write the direct URL:{' '}
                      <code className="text-purple-300">https://card.{rootDomain}/c/[slug]</code>
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <span className="text-2xl font-bold text-sky-400">2</span>
                    <h3 className="font-bold text-white text-sm mt-2">Assign Hardware Code</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Enter the laser-etched serial code (e.g. <code className="text-amber-300">SERA-7001</code>) on the employee's profile.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <span className="text-2xl font-bold text-emerald-400">3</span>
                    <h3 className="font-bold text-white text-sm mt-2">Tap to Network</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Hand the card to your employee. Every client tap loads their branded profile and captures leads back to this portal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Dialog: + Add Employee Modal ── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add New Fleet Employee</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Provision a digital NFC business card for an employee. Inherits your master brand automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Full Name *</Label>
              <Input
                required
                value={addForm.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const first = val.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                  setAddForm((prev) => ({
                    ...prev,
                    name: val,
                    slug: prev.slug ? prev.slug : `${team?.slug || 'team'}-${first}`,
                  }));
                }}
                placeholder="Kasun Jayawardena"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Designation / Role *</Label>
              <Input
                required
                value={addForm.designation}
                onChange={(e) => setAddForm({ ...addForm, designation: e.target.value })}
                placeholder="Managing Director & Head of M&A"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Direct Phone / WhatsApp *</Label>
                <Input
                  required
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Corporate Email *</Label>
                <Input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="kasun@company.lk"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Card Handle (Slug) *</Label>
              <div className="flex rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                <span className="px-3 flex items-center text-xs font-mono text-zinc-500 bg-zinc-900 select-none">
                  /c/
                </span>
                <input
                  type="text"
                  required
                  value={addForm.slug}
                  onChange={(e) => setAddForm({ ...addForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-3 py-2 bg-transparent text-white font-mono text-xs outline-none"
                  placeholder="apex-kasun"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">NFC Serial Code (Optional)</Label>
                <Input
                  value={addForm.activationCode}
                  onChange={(e) => setAddForm({ ...addForm, activationCode: e.target.value.toUpperCase() })}
                  placeholder="SERA-7001"
                  className="font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Profile Photo URL (Optional)</Label>
                <Input
                  value={addForm.avatarUrl}
                  onChange={(e) => setAddForm({ ...addForm, avatarUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="purple" disabled={isAddingMember} className="font-bold">
                {isAddingMember ? 'Provisioning...' : 'Provision Card'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: 📥 Bulk CSV Import Modal ── */}
      <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
        <DialogContent className="max-w-lg bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Bulk CSV Employee Import</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Provision 10 to 100 employee cards at once. Paste CSV text with columns:{' '}
              <code className="text-purple-300">Name, Email, Phone, Designation, NFC_Code</code>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-zinc-300">CSV Data (Comma-separated)</Label>
              <Button
                variant="ghost"
                size="xs"
                className="text-[11px] text-sky-400 hover:text-sky-300"
                onClick={() =>
                  setCsvText(
                    `Name, Email, Phone, Designation, NFC_Code\n` +
                      `Rohan Silva, rohan@company.lk, +94 77 123 4567, Senior Advisor, SERA-7010\n` +
                      `Kamani Perera, kamani@company.lk, +94 71 234 5678, Investment Analyst, SERA-7011\n` +
                      `Dilan Fernando, dilan@company.lk, +94 76 345 6789, Associate Director, SERA-7012`
                  )
                }
              >
                Insert Sample Template
              </Button>
            </div>

            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Name, Email, Phone, Designation, NFC_Code&#10;Kasun Jayawardena, kasun@company.lk, +94 77 112 3456, Managing Director, SERA-7001"
              className="w-full p-3 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBulkModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="purple"
                disabled={isBulkImporting}
                onClick={handleBulkImport}
                className="font-bold"
              >
                {isBulkImporting ? 'Importing Fleet...' : 'Import & Provision Cards'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════
          MODAL 4: CREATE NEW COMPANY / ORGANIZATION
         ══════════════════════════════════════════════════════════════ */}
      <Dialog open={isAddCompanyModalOpen} onOpenChange={setIsAddCompanyModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-sky-400" />
              <span>Register New Company</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Create a distinct corporate organization. Each company has its own isolated employee cards, master brand lock, and pooled CRM leads.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCompany} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs text-zinc-300">Company Legal Name *</Label>
              <Input
                required
                placeholder="e.g. Ceylon Luxury Holdings"
                value={companyForm.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = val.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
                  setCompanyForm((prev) => ({
                    ...prev,
                    name: val,
                    slug: prev.slug ? prev.slug : autoSlug,
                  }));
                }}
                className="bg-zinc-950 border-zinc-800 text-white mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-zinc-300">Subdomain Slug *</Label>
                <div className="flex items-center rounded-md border border-zinc-800 bg-zinc-950 mt-1 px-3 py-2 text-xs">
                  <Input
                    required
                    placeholder="ceylon"
                    value={companyForm.slug}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })
                    }
                    className="border-0 bg-transparent p-0 text-sky-400 font-mono focus-visible:ring-0"
                  />
                  <span className="text-zinc-500 font-mono">.{rootDomain}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-zinc-300">License Seats</Label>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={companyForm.seatLimit}
                  onChange={(e) => setCompanyForm({ ...companyForm, seatLimit: Number(e.target.value) || 25 })}
                  className="bg-zinc-950 border-zinc-800 text-white mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-zinc-300">HR / Fleet Admin Email *</Label>
              <Input
                type="email"
                required
                placeholder="hr@company.lk"
                value={companyForm.adminEmail}
                onChange={(e) => setCompanyForm({ ...companyForm, adminEmail: e.target.value })}
                className="bg-zinc-950 border-zinc-800 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Corporate Tagline</Label>
              <Input
                placeholder="e.g. Innovating Enterprise Logistics & Supply"
                value={companyForm.tagline}
                onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                className="bg-zinc-950 border-zinc-800 text-white mt-1"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddCompanyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="purple" disabled={isCreatingCompany} className="font-bold">
                {isCreatingCompany ? 'Registering Company...' : 'Create Company Fleet'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

import prisma from '@/lib/prisma';
import { generateTemplateHtml, TemplateData } from '@/lib/templates';
import { saveCardToMemory } from '@/lib/cardStore';

export interface TeamBrandSettings {
  logoUrl: string;
  coverUrl: string;
  primaryColor: string;
  companyName: string;
  tagline: string;
  website: string;
  companyAddress: string;
  disclaimer: string;
  catalogPdfUrl?: string;
  catalogPdfTitle?: string;
  googleReviewUrl?: string;
  templatePreset: string;
  isLocked: boolean;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  designation: string;
  slug: string;
  avatarUrl?: string;
  bio?: string;
  linkedin?: string;
  activationCode?: string | null;
  status: 'ACTIVE' | 'DEACTIVATED';
  leadsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  adminEmail: string;
  adminUserId?: string | null;
  plan: 'TEAMS' | 'ENTERPRISE';
  seatLimit: number;
  brandSettings: TeamBrandSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TeamLead {
  id: string;
  teamId: string;
  clientSlug: string;
  repName: string;
  repDesignation: string;
  name: string;
  phone: string;
  notes?: string | null;
  createdAt: string;
}

// ─── Global Resilient In-Memory State ─────────────────────────────────────────

declare const globalThis: {
  __gosera_teams?: Map<string, Team>;
  __gosera_team_members?: Map<string, TeamMember>;
  __gosera_team_leads?: TeamLead[];
} & typeof global;

if (!globalThis.__gosera_teams) {
  globalThis.__gosera_teams = new Map();
  globalThis.__gosera_team_members = new Map();
  globalThis.__gosera_team_leads = [];

  // Seed showcase enterprise client: Apex Capital Partners (Sri Lanka)
  const demoTeamId = 'team_apex_01';
  const demoBrand: TeamBrandSettings = {
    companyName: 'Apex Capital Partners',
    tagline: 'Premier Wealth Management & Corporate Advisory',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    primaryColor: '#0ea5e9',
    website: 'https://apexcapital.lk',
    companyAddress: 'Level 28, World Trade Center, Echelon Square, Colombo 01',
    disclaimer: 'Regulated by the Securities & Exchange Commission of Sri Lanka. Confidential & proprietary.',
    catalogPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    catalogPdfTitle: 'Apex 2026 Institutional Investment Outlook (PDF)',
    googleReviewUrl: 'https://maps.google.com',
    templatePreset: 'company_profile',
    isLocked: true,
  };

  const demoTeam: Team = {
    id: demoTeamId,
    name: 'Apex Capital Partners',
    slug: 'apex',
    adminEmail: 'hr@apexcapital.lk',
    adminUserId: 'admin_apex',
    plan: 'ENTERPRISE',
    seatLimit: 25,
    brandSettings: demoBrand,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  globalThis.__gosera_teams.set(demoTeamId, demoTeam);
  globalThis.__gosera_teams.set(demoTeam.slug, demoTeam);

  // Pre-seed 4 active employee advisors
  const initialMembers: Omit<TeamMember, 'teamId' | 'createdAt' | 'updatedAt'>[] = [
    {
      id: 'mem_apex_1',
      name: 'Kasun Jayawardena',
      email: 'kasun.j@apexcapital.lk',
      phone: '+94 77 112 3456',
      designation: 'Managing Director & Head of M&A',
      slug: 'apex-kasun',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
      bio: 'Leading strategic mergers, acquisitions, and cross-border restructuring across South Asia.',
      linkedin: 'https://linkedin.com',
      activationCode: 'SERA-7001',
      status: 'ACTIVE',
      leadsCount: 14,
    },
    {
      id: 'mem_apex_2',
      name: 'Sarah Mendis',
      email: 'sarah.m@apexcapital.lk',
      phone: '+94 77 445 6789',
      designation: 'VP of Wealth & Private Banking',
      slug: 'apex-sarah',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
      bio: 'Advising family offices and high-net-worth clients on global portfolio allocations and ESG investments.',
      linkedin: 'https://linkedin.com',
      activationCode: 'SERA-7002',
      status: 'ACTIVE',
      leadsCount: 9,
    },
    {
      id: 'mem_apex_3',
      name: 'Dilshan Silva',
      email: 'dilshan.s@apexcapital.lk',
      phone: '+94 71 889 2233',
      designation: 'Senior Portfolio Manager',
      slug: 'apex-dilshan',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
      bio: 'Specialized in Sri Lankan fixed income, sovereign debt advisory, and private equity investments.',
      linkedin: 'https://linkedin.com',
      activationCode: 'SERA-7003',
      status: 'ACTIVE',
      leadsCount: 6,
    },
    {
      id: 'mem_apex_4',
      name: 'Priya Ratnayake',
      email: 'priya.r@apexcapital.lk',
      phone: '+94 76 331 4455',
      designation: 'Client Relationship Director',
      slug: 'apex-priya',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80',
      bio: 'Dedicated institutional liaison for commercial banks and corporate treasury departments.',
      linkedin: 'https://linkedin.com',
      activationCode: 'SERA-VIP-01',
      status: 'ACTIVE',
      leadsCount: 4,
    },
  ];

  const now = new Date().toISOString();
  for (const m of initialMembers) {
    const fullMember: TeamMember = {
      ...m,
      teamId: demoTeamId,
      createdAt: now,
      updatedAt: now,
    };
    globalThis.__gosera_team_members.set(fullMember.id, fullMember);
    globalThis.__gosera_team_members.set(fullMember.slug, fullMember);
    compileMemberCard(demoTeam, fullMember);
  }

  // Pre-seed sample pooled leads captured by reps at recent corporate summit
  globalThis.__gosera_team_leads = [
    {
      id: 'lead_apex_1',
      teamId: demoTeamId,
      clientSlug: 'apex-kasun',
      repName: 'Kasun Jayawardena',
      repDesignation: 'Managing Director & Head of M&A',
      name: 'Rohan Wickremasinghe',
      phone: '+94 77 981 2233',
      notes: 'Met at Colombo Investment Summit. Interested in $2M Series B syndication.',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'lead_apex_2',
      teamId: demoTeamId,
      clientSlug: 'apex-sarah',
      repName: 'Sarah Mendis',
      repDesignation: 'VP of Wealth & Private Banking',
      name: 'Dr. Anura Perera',
      phone: '+94 71 556 7788',
      notes: 'Family office restructuring. Wants brochure sent via WhatsApp.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'lead_apex_3',
      teamId: demoTeamId,
      clientSlug: 'apex-kasun',
      repName: 'Kasun Jayawardena',
      repDesignation: 'Managing Director & Head of M&A',
      name: 'Dinesh Gunawardena',
      phone: '+94 77 334 9900',
      notes: 'CFO at Hayleys subsidiary. Requested meeting for commercial paper issuance.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 'lead_apex_4',
      teamId: demoTeamId,
      clientSlug: 'apex-dilshan',
      repName: 'Dilshan Silva',
      repDesignation: 'Senior Portfolio Manager',
      name: 'Nalinda Karunaratne',
      phone: '+94 76 112 8844',
      notes: 'Discussed bond yields for retirement fund placement.',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
  ];
}

// ─── Team Core Operations ─────────────────────────────────────────────────────

export async function getTeam(identifier: string): Promise<Team | null> {
  const clean = identifier.trim().toLowerCase();
  if (globalThis.__gosera_teams?.has(clean)) {
    return globalThis.__gosera_teams.get(clean)!;
  }
  if (globalThis.__gosera_teams?.has(identifier)) {
    return globalThis.__gosera_teams.get(identifier)!;
  }

  // Try DB
  try {
    const dbTeam = await Promise.race([
      (prisma as any).team?.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: clean }, { adminEmail: clean }],
        },
      }),
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000)),
    ]);
    if (dbTeam) {
      const parsed: Team = {
        id: dbTeam.id,
        name: dbTeam.name,
        slug: dbTeam.slug,
        adminEmail: dbTeam.adminEmail,
        adminUserId: dbTeam.adminUserId,
        plan: dbTeam.plan || 'TEAMS',
        seatLimit: dbTeam.seatLimit || 25,
        brandSettings: dbTeam.brandSettings || ({} as any),
        createdAt: dbTeam.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: dbTeam.updatedAt?.toISOString() || new Date().toISOString(),
      };
      globalThis.__gosera_teams?.set(parsed.id, parsed);
      globalThis.__gosera_teams?.set(parsed.slug, parsed);
      return parsed;
    }
  } catch {}

  // Fallback to first team (showcase demo)
  const defaultTeam = Array.from(globalThis.__gosera_teams?.values() || [])[0];
  return defaultTeam || null;
}

/**
 * Returns all registered companies / teams in the system
 */
export async function getAllTeams(): Promise<Team[]> {
  const store = globalThis.__gosera_teams;
  if (!store) return [];
  const teams = Array.from(store.values()).reduce<Team[]>((acc, cur) => {
    if (!acc.some((x) => x.id === cur.id)) acc.push(cur);
    return acc;
  }, []);
  return teams;
}

/**
 * Creates a brand new corporate team / company
 */
export async function createTeam(data: {
  name: string;
  slug: string;
  adminEmail: string;
  plan?: 'TEAMS' | 'ENTERPRISE';
  seatLimit?: number;
  brandSettings?: Partial<TeamBrandSettings>;
}): Promise<Team> {
  const cleanSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const id = `team_${cleanSlug}_${Date.now().toString(36)}`;

  const brandSettings: TeamBrandSettings = {
    companyName: data.name.trim(),
    tagline: data.brandSettings?.tagline || 'Excellence in Enterprise Solutions',
    logoUrl: data.brandSettings?.logoUrl || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
    coverUrl: data.brandSettings?.coverUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    primaryColor: data.brandSettings?.primaryColor || '#0ea5e9',
    website: data.brandSettings?.website || `https://${cleanSlug}.seranex.lk`,
    companyAddress: data.brandSettings?.companyAddress || 'Colombo, Sri Lanka',
    disclaimer: data.brandSettings?.disclaimer || 'Official corporate card fleet. All rights reserved.',
    catalogPdfUrl: data.brandSettings?.catalogPdfUrl || '',
    catalogPdfTitle: data.brandSettings?.catalogPdfTitle || `${data.name} Corporate Profile (PDF)`,
    googleReviewUrl: data.brandSettings?.googleReviewUrl || '',
    templatePreset: data.brandSettings?.templatePreset || 'company_profile',
    isLocked: data.brandSettings?.isLocked ?? true,
  };

  const newTeam: Team = {
    id,
    name: data.name.trim(),
    slug: cleanSlug,
    adminEmail: data.adminEmail.trim().toLowerCase(),
    plan: data.plan || 'ENTERPRISE',
    seatLimit: data.seatLimit || 25,
    brandSettings,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  globalThis.__gosera_teams?.set(newTeam.id, newTeam);
  globalThis.__gosera_teams?.set(newTeam.slug, newTeam);

  return newTeam;
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const store = globalThis.__gosera_team_members;
  if (!store) return [];
  const members = Array.from(store.values())
    .filter((m) => m.teamId === teamId)
    // deduplicate by id
    .reduce<TeamMember[]>((acc, cur) => {
      if (!acc.some((x) => x.id === cur.id)) acc.push(cur);
      return acc;
    }, []);

  return members.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const clean = slug.trim().toLowerCase();
  const store = globalThis.__gosera_team_members;
  if (store && store.has(clean)) {
    return store.get(clean)!;
  }
  return null;
}

/**
 * Compiles a team member's digital business card by merging the company's
 * locked brand assets with the employee's direct contact details.
 */
export function compileMemberCard(team: Team, member: TeamMember): string {
  const brand = team.brandSettings;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

  const templateData: TemplateData = {
    slug: member.slug,
    name: member.name,
    title: member.designation,
    company: brand.companyName || team.name,
    phone: member.phone,
    whatsapp: member.phone.replace(/[^0-9]/g, ''),
    email: member.email,
    avatarUrl: member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    coverUrl: brand.coverUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    bio: member.bio || `${member.name} is ${member.designation} at ${brand.companyName}.`,
    location: brand.companyAddress || 'Colombo, Sri Lanka',
    website: brand.website || `https://${team.slug}.${rootDomain}`,
    googleReviewUrl: brand.googleReviewUrl,
    catalogPdfUrl: brand.catalogPdfUrl,
    catalogPdfTitle: brand.catalogPdfTitle || `${brand.companyName} Corporate Brochure (PDF)`,
    linkedin: member.linkedin,
  };

  const preset = brand.templatePreset || 'company_profile';
  const html = generateTemplateHtml(preset, templateData);

  // Save compiled card into resilient card store
  saveCardToMemory(member.slug, html, {
    ...templateData,
    teamId: team.id,
    teamMemberId: member.id,
    isTeamCard: true,
  });

  return html;
}

/**
 * Propagate brand updates: compiles and updates all cards in the team
 */
export async function propagateBrandUpdate(teamId: string): Promise<number> {
  const team = await getTeam(teamId);
  if (!team) return 0;
  const members = await getTeamMembers(teamId);

  let updatedCount = 0;
  for (const member of members) {
    if (member.status === 'ACTIVE') {
      compileMemberCard(team, member);
      updatedCount++;
    }
  }

  return updatedCount;
}

/**
 * Update Team Brand Lock Settings
 */
export async function updateTeamBrandSettings(
  teamId: string,
  newSettings: Partial<TeamBrandSettings>
): Promise<Team> {
  const team = await getTeam(teamId);
  if (!team) throw new Error('Team not found');

  team.brandSettings = {
    ...team.brandSettings,
    ...newSettings,
  };
  team.updatedAt = new Date().toISOString();

  globalThis.__gosera_teams?.set(team.id, team);
  globalThis.__gosera_teams?.set(team.slug, team);

  // Automatically propagate update to all active cards
  await propagateBrandUpdate(teamId);

  return team;
}

/**
 * Add a new employee to the team fleet
 */
export async function addTeamMember(
  teamId: string,
  data: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    slug?: string;
    avatarUrl?: string;
    bio?: string;
    linkedin?: string;
    activationCode?: string;
  }
): Promise<TeamMember> {
  const team = await getTeam(teamId);
  if (!team) throw new Error('Team not found');

  const currentMembers = await getTeamMembers(teamId);
  if (currentMembers.length >= team.seatLimit) {
    throw new Error(
      `Seat limit reached (${currentMembers.length}/${team.seatLimit}). Please upgrade your corporate plan to add more cards.`
    );
  }

  // Generate clean slug: [company-slug]-[firstname-clean]
  const cleanFirstName = data.name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const candidateSlug = data.slug
    ? data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    : `${team.slug}-${cleanFirstName}-${Math.floor(100 + Math.random() * 900)}`;

  const now = new Date().toISOString();
  const newMember: TeamMember = {
    id: `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    teamId,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    designation: data.designation.trim(),
    slug: candidateSlug,
    avatarUrl:
      data.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: data.bio || '',
    linkedin: data.linkedin || '',
    activationCode: data.activationCode ? data.activationCode.toUpperCase().trim() : null,
    status: 'ACTIVE',
    leadsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  globalThis.__gosera_team_members?.set(newMember.id, newMember);
  globalThis.__gosera_team_members?.set(newMember.slug, newMember);

  // Compile initial digital business card
  compileMemberCard(team, newMember);

  return newMember;
}

/**
 * Update an existing employee
 */
export async function updateTeamMember(
  teamId: string,
  memberId: string,
  updates: Partial<TeamMember>
): Promise<TeamMember> {
  const team = await getTeam(teamId);
  if (!team) throw new Error('Team not found');

  const existing = globalThis.__gosera_team_members?.get(memberId);
  if (!existing || existing.teamId !== teamId) {
    throw new Error('Employee record not found');
  }

  const updated: TeamMember = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  globalThis.__gosera_team_members?.set(updated.id, updated);
  globalThis.__gosera_team_members?.set(updated.slug, updated);

  if (updated.status === 'ACTIVE') {
    compileMemberCard(team, updated);
  } else {
    // When deactivated, replace card with suspended notice
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
    const suspendedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${updated.name} - Profile Deactivated</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 text-center font-sans">
        <div class="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold mb-4">
            🔒
          </div>
          <h1 class="text-xl font-bold">${team.name}</h1>
          <p class="text-sm text-slate-400 mt-2">This digital card profile has been retired or deactivated by the company administrator.</p>
          <a href="${team.brandSettings.website || `https://${team.slug}.${rootDomain}`}" class="mt-6 inline-block px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition">
            Visit Official Website &rarr;
          </a>
        </div>
      </body>
      </html>
    `;
    saveCardToMemory(updated.slug, suspendedHtml);
  }

  return updated;
}

/**
 * Delete / Offboard an employee
 */
export async function deleteTeamMember(teamId: string, memberId: string): Promise<boolean> {
  const existing = globalThis.__gosera_team_members?.get(memberId);
  if (!existing || existing.teamId !== teamId) return false;

  globalThis.__gosera_team_members?.delete(memberId);
  globalThis.__gosera_team_members?.delete(existing.slug);

  return true;
}

// ─── Centralized Team Leads Operations ───────────────────────────────────────

export function getTeamLeads(teamId: string): TeamLead[] {
  const leads = globalThis.__gosera_team_leads;
  if (!leads) return [];
  return leads
    .filter((l) => l.teamId === teamId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function recordTeamLead(data: {
  teamId: string;
  clientSlug: string;
  repName: string;
  repDesignation: string;
  name: string;
  phone: string;
  notes?: string | null;
}): TeamLead {
  if (!globalThis.__gosera_team_leads) globalThis.__gosera_team_leads = [];
  const leads = globalThis.__gosera_team_leads;

  const newLead: TeamLead = {
    id: `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    ...data,
    createdAt: new Date().toISOString(),
  };

  leads.unshift(newLead);

  // Increment rep lead counter
  const membersStore = globalThis.__gosera_team_members;
  const rep = membersStore?.get(data.clientSlug);
  if (rep && membersStore) {
    rep.leadsCount = (rep.leadsCount || 0) + 1;
    membersStore.set(rep.id, rep);
    membersStore.set(rep.slug, rep);
  }

  return newLead;
}

/**
 * Formats all team leads into a clean CSV string ready for 1-click CRM export
 */
export function exportTeamLeadsToCsv(teamId: string): string {
  const leads = getTeamLeads(teamId);
  const headers = ['Date', 'Prospect Name', 'Phone / WhatsApp', 'Captured By', 'Rep Designation', 'Rep Card Handle', 'Notes'];

  const rows = leads.map((l) => [
    `"${new Date(l.createdAt).toLocaleDateString()} ${new Date(l.createdAt).toLocaleTimeString()}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.repName || '').replace(/"/g, '""')}"`,
    `"${(l.repDesignation || '').replace(/"/g, '""')}"`,
    `"${(l.clientSlug || '').replace(/"/g, '""')}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

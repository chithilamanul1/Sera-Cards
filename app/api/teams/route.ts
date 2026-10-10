import { NextResponse } from 'next/server';
import {
  getTeam,
  getAllTeams,
  createTeam,
  updateTeamBrandSettings,
  getTeamMembers,
  getTeamLeads,
} from '@/lib/teamStore';

export const dynamic = 'force-dynamic';

/**
 * GET /api/teams
 * ?all=true -> returns all registered companies / organizations
 * ?id=... or ?slug=... -> returns specific company info, seats, brand lock settings, and stats
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listAll = searchParams.get('all') === 'true' || searchParams.get('listAll') === 'true';

    if (listAll) {
      const teams = await getAllTeams();
      return NextResponse.json({ success: true, teams });
    }

    const identifier = searchParams.get('id') || searchParams.get('slug') || 'apex';
    const team = await getTeam(identifier);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const members = await getTeamMembers(team.id);
    const leads = getTeamLeads(team.id);

    return NextResponse.json({
      success: true,
      team,
      stats: {
        totalSeats: team.seatLimit,
        activeMembers: members.filter((m) => m.status === 'ACTIVE').length,
        deactivatedMembers: members.filter((m) => m.status === 'DEACTIVATED').length,
        totalLeads: leads.length,
        brandLocked: team.brandSettings.isLocked,
      },
    });
  } catch (error: any) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch team' }, { status: 500 });
  }
}

/**
 * POST /api/teams
 * action: 'CREATE_TEAM' -> creates a new company / team under the multi-company architecture
 * action: 'UPDATE_BRAND' (or default with teamId + brandSettings) -> updates company master brand lock
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, teamId, brandSettings, name, slug, adminEmail, seatLimit, plan } = body;

    // 1. Create a brand new company
    if (action === 'CREATE_TEAM' || (!teamId && name && slug)) {
      if (!name || !slug || !adminEmail) {
        return NextResponse.json(
          { error: 'Company Name, domain slug, and HR Admin Email are required.' },
          { status: 400 }
        );
      }

      const newTeam = await createTeam({
        name,
        slug,
        adminEmail,
        seatLimit: Number(seatLimit) || 25,
        plan: plan || 'ENTERPRISE',
        brandSettings,
      });

      return NextResponse.json({
        success: true,
        message: `Company "${newTeam.name}" registered successfully!`,
        team: newTeam,
      });
    }

    // 2. Update existing company brand settings
    if (!teamId || !brandSettings) {
      return NextResponse.json(
        { error: 'Missing teamId or brandSettings in request body' },
        { status: 400 }
      );
    }

    const updatedTeam = await updateTeamBrandSettings(teamId, brandSettings);

    return NextResponse.json({
      success: true,
      message: 'Master Brand Lock updated and applied to all employee cards!',
      team: updatedTeam,
    });
  } catch (error: any) {
    console.error('Error in teams POST:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update team' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTeam, updateTeamBrandSettings, getTeamMembers, getTeamLeads } from '@/lib/teamStore';

export const dynamic = 'force-dynamic';

/**
 * GET /api/teams?id=... or ?slug=...
 * Returns team info, seat utilization, brand lock settings, and summary stats
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
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
 * Updates Team Master Brand Settings (HR/Marketing Brand Lock)
 * Automatically recompiles and updates all active employee cards
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, brandSettings } = body;

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
    console.error('Error updating team brand:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update team brand settings' },
      { status: 500 }
    );
  }
}

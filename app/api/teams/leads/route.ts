import { NextResponse } from 'next/server';
import { getTeamLeads, exportTeamLeadsToCsv } from '@/lib/teamStore';

export const dynamic = 'force-dynamic';

/**
 * GET /api/teams/leads?teamId=...&format=json|csv
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId') || 'team_apex_01';
    const format = searchParams.get('format') || 'json';

    if (format === 'csv') {
      const csv = exportTeamLeadsToCsv(teamId);
      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="gosera-team-leads-${teamId}.csv"`,
        },
      });
    }

    const leads = getTeamLeads(teamId);
    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

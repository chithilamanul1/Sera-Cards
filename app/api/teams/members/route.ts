import { NextResponse } from 'next/server';
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeam,
} from '@/lib/teamStore';

export const dynamic = 'force-dynamic';

/**
 * GET /api/teams/members?teamId=...
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId') || 'team_apex_01';

    const members = await getTeamMembers(teamId);
    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/teams/members
 * Supports single employee creation OR bulk import array
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId = 'team_apex_01', bulk, members: bulkMembers, ...singleData } = body;

    // Handle Bulk CSV Import
    if (bulk && Array.isArray(bulkMembers)) {
      const createdList = [];
      const errors = [];

      for (const item of bulkMembers) {
        try {
          if (!item.name || !item.email) continue;
          const created = await addTeamMember(teamId, {
            name: item.name,
            email: item.email,
            phone: item.phone || '+94 77 000 0000',
            designation: item.designation || 'Team Member',
            slug: item.slug,
            activationCode: item.activationCode || item.code,
            bio: item.bio,
            linkedin: item.linkedin,
          });
          createdList.push(created);
        } catch (err: any) {
          errors.push({ name: item.name, error: err.message });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${createdList.length} employees.`,
        createdCount: createdList.length,
        errors,
      });
    }

    // Handle Single Employee Addition
    if (!singleData.name || !singleData.email || !singleData.phone || !singleData.designation) {
      return NextResponse.json(
        { error: 'Name, email, phone, and designation are required.' },
        { status: 400 }
      );
    }

    const created = await addTeamMember(teamId, singleData);

    return NextResponse.json({
      success: true,
      message: `Employee card provisioned for ${created.name}!`,
      member: created,
    });
  } catch (error: any) {
    console.error('Error adding team member:', error);
    return NextResponse.json({ error: error.message || 'Failed to add employee' }, { status: 400 });
  }
}

/**
 * PUT /api/teams/members
 * Updates employee details or toggles status (ACTIVE / DEACTIVATED)
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { teamId = 'team_apex_01', memberId, ...updates } = body;

    if (!memberId) {
      return NextResponse.json({ error: 'memberId is required' }, { status: 400 });
    }

    const updated = await updateTeamMember(teamId, memberId, updates);

    return NextResponse.json({
      success: true,
      message: `Updated profile for ${updated.name}`,
      member: updated,
    });
  } catch (error: any) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * DELETE /api/teams/members?teamId=...&memberId=...
 * Offboards an employee
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId') || 'team_apex_01';
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ error: 'memberId is required' }, { status: 400 });
    }

    const deleted = await deleteTeamMember(teamId, memberId);
    if (!deleted) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Employee offboarded and license seat released.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

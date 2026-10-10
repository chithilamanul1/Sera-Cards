import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendTestEmail } from '@/lib/mail';
import { getAllEmailLogs, clearEmailLogs } from '@/lib/mailStore';

export const dynamic = 'force-dynamic';

function getIsAdmin(): boolean {
  const cookieStore = cookies();
  return cookieStore.get('admin_session')?.value === 'authenticated';
}

// GET /api/mail/test — Get mail service status and recent audit logs
export async function GET() {
  const isAdmin = getIsAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const isResendConfigured = !!apiKey && apiKey.startsWith('re_') && !apiKey.includes('your_api_key');
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Sera Cards <info@seranex.lk>';

  const logs = getAllEmailLogs();

  return NextResponse.json({
    status: isResendConfigured ? 'CONNECTED' : 'SIMULATED',
    provider: isResendConfigured ? 'Resend REST API' : 'In-Memory / Logged Simulation',
    sender: fromEmail,
    logs,
  });
}

// POST /api/mail/test — Send diagnostic test email or clear logs
export async function POST(request: Request) {
  const isAdmin = getIsAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, to } = body;

    if (action === 'clear_logs') {
      clearEmailLogs();
      return NextResponse.json({ success: true, message: 'Email logs cleared' });
    }

    const targetEmail = to ? to.trim().toLowerCase() : process.env.ADMIN_EMAIL || 'chithilamanul1@gmail.com';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      return NextResponse.json({ error: 'Valid destination email is required' }, { status: 400 });
    }

    const result = await sendTestEmail({ to: targetEmail });

    return NextResponse.json({
      success: result.success,
      deliveredTo: targetEmail,
      simulated: result.simulated || false,
      message: result.simulated
        ? `Diagnostic email logged for ${targetEmail} (Simulation Mode). To deliver via real inbox, provide RESEND_API_KEY.`
        : `Diagnostic email dispatched successfully to ${targetEmail} via Resend API!`,
      error: result.error,
    });
  } catch (error: any) {
    console.error('[Mail Test Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch test email' }, { status: 500 });
  }
}

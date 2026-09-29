import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();

  // Clear admin session
  cookieStore.set({
    name: 'admin_session',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  // Clear user session
  cookieStore.set({
    name: 'user_session',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}

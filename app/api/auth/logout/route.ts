import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  cookies().set({
    name: 'admin_session',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0), // expire immediately
  });

  return NextResponse.json({ success: true });
}

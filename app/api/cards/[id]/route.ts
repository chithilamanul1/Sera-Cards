import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to check auth
function isAuthorized(request: Request) {
  const authHeader = request.headers.get('x-admin-secret');
  return authHeader === process.env.ADMIN_SECRET;
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.client.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}

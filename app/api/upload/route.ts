import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/upload
 * Validates and accepts image uploads (logos, profile photos)
 * Accepts JSON with { image: string (base64 data URL), fileName?: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, fileName = 'card-logo.png' } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // Verify it is a valid data URL
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Expected a base64 image data URL (PNG, JPEG, WebP, SVG).' },
        { status: 400 }
      );
    }

    // Check size limit: max 5MB base64 (~7MB string)
    const approximateByteLength = (image.length * 3) / 4;
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (approximateByteLength > maxBytes) {
      return NextResponse.json(
        { error: 'Image file too large. Maximum allowed size is 5MB.' },
        { status: 400 }
      );
    }

    // Return the base64 URL directly (compatible with MongoDB storage and direct preview)
    return NextResponse.json({
      success: true,
      url: image,
      fileName,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

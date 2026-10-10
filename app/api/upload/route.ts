import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/upload
 * Validates and accepts image uploads (logos, profile photos)
 * and PDF documents (company catalogs, menus, price sheets, brochures)
 * Accepts JSON with { image?: string, file?: string, fileName?: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fileData = body.file || body.image;
    const fileName = body.fileName || 'document';

    if (!fileData || typeof fileData !== 'string') {
      return NextResponse.json({ error: 'No file or image data provided' }, { status: 400 });
    }

    const isImage = fileData.startsWith('data:image/');
    const isPdf = fileData.startsWith('data:application/pdf');

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload an image (PNG, JPG, WebP) or a PDF document.' },
        { status: 400 }
      );
    }

    // Check size limit: max 10MB for PDFs, 5MB for images
    const approximateByteLength = (fileData.length * 3) / 4;
    const maxBytes = isPdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024;

    if (approximateByteLength > maxBytes) {
      return NextResponse.json(
        { error: `File too large. Maximum allowed size is ${isPdf ? '10MB for PDFs' : '5MB for images'}.` },
        { status: 400 }
      );
    }

    const fileType = isPdf ? 'pdf' : 'image';

    return NextResponse.json({
      success: true,
      url: fileData,
      fileName,
      fileType,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file', details: error.message }, { status: 500 });
  }
}

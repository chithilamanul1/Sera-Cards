import prisma from '@/lib/prisma';
import { getCardFromMemory } from '@/lib/cardStore';
import { getTeamMemberBySlug, getTeam } from '@/lib/teamStore';

export const dynamic = 'force-dynamic';

function extractMetadata(html?: string): any {
  if (!html) return null;
  const match = html.match(/<!--\s*GOSERA_METADATA:\s*({[\s\S]*?})\s*-->/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const cleanSlug = slug ? slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '') : '';

    let name = searchParams.get('name') || '';
    let title = searchParams.get('title') || '';
    let company = searchParams.get('company') || '';
    let phone = searchParams.get('phone') || '';
    let email = searchParams.get('email') || '';
    let website = searchParams.get('website') || '';
    let location = searchParams.get('location') || '';

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

    // 1. Try resolving card details from slug
    if (cleanSlug) {
      // Check MongoDB Client table
      try {
        const client = await Promise.race([
          prisma.client.findUnique({ where: { slug: cleanSlug } }),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2500)),
        ]);
        if (client?.htmlContent) {
          const meta = extractMetadata(client.htmlContent);
          if (meta) {
            name = meta.name || name;
            title = meta.title || title;
            company = meta.company || company;
            phone = meta.phone || phone;
            email = meta.email || email;
            website = meta.website || website;
            location = meta.location || location;
          }
        }
      } catch {}

      // Check In-Memory Card Store
      if (!name) {
        const memCard = getCardFromMemory(cleanSlug);
        if (memCard) {
          const meta = memCard.metadata || extractMetadata(memCard.htmlContent);
          if (meta) {
            name = meta.name || name;
            title = meta.title || title;
            company = meta.company || company;
            phone = meta.phone || phone;
            email = meta.email || email;
            website = meta.website || website;
            location = meta.location || location;
          }
        }
      }

      // Check Team Store (corporate fleet members)
      if (!name) {
        try {
          const teamMember = await getTeamMemberBySlug(cleanSlug);
          if (teamMember) {
            name = teamMember.name || name;
            title = teamMember.designation || title;
            phone = teamMember.phone || phone;
            email = teamMember.email || email;
            const team = await getTeam(teamMember.teamId);
            if (team) {
              company = team.brandSettings?.companyName || team.name || company;
              website = team.brandSettings?.website || website;
              location = team.brandSettings?.companyAddress || location;
            }
          }
        } catch {}
      }
    }

    // Fallbacks
    const resolvedName = (name || company || cleanSlug || 'Sera Contact').trim();
    const parts = resolvedName.split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    const resolvedUrl = website || (cleanSlug ? `https://${cleanSlug}.${rootDomain}` : `https://${rootDomain}`);

    // Build RFC-compliant vCard (VERSION: 3.0)
    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${lastName};${firstName};;;`,
      `FN:${resolvedName}`,
      company ? `ORG:${company}` : '',
      title ? `TITLE:${title}` : '',
      phone ? `TEL;TYPE=CELL,VOICE,PREF:${phone}` : '',
      phone ? `TEL;TYPE=WORK,VOICE:${phone}` : '',
      email ? `EMAIL;TYPE=INTERNET,PREF:${email}` : '',
      `URL:${resolvedUrl}`,
      location ? `ADR;TYPE=WORK:;;${location};;;;` : '',
      'NOTE:GoSera Smart NFC Business Card',
      'END:VCARD',
    ].filter(Boolean);

    const vcardString = vcardLines.join('\r\n') + '\r\n';
    const filename = `${cleanSlug || 'contact'}.vcf`;

    return new Response(vcardString, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('[vCard Error]', error);
    return new Response('Error generating vCard', { status: 500 });
  }
}

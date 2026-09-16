export interface TemplateData {
  slug: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  avatarUrl: string;
  coverUrl?: string;
  bio: string;
  location: string;
  website: string;
  googleReviewUrl?: string;
  lankaQrText?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  snapchat?: string;
}

export const TEMPLATE_PRESETS = [
  {
    id: 'personal_hero',
    name: 'Personal VIP (Kosala Profile)',
    badge: 'Full-View Hero & Socials',
    description: 'Immersive full-bleed profile hero with vertical floating social dock, 3-action bar with animated vCard save, and contact details list.',
  },
  {
    id: 'company_profile',
    name: 'Company Profile (Aura Living)',
    badge: 'Corporate & Portfolio',
    description: 'Cinematic cover, verified badges, interactive portfolio carousel, core services, business hours, and LankaQR scan & pay.',
  },
  {
    id: 'professional_portfolio',
    name: 'Professional Portfolio',
    badge: 'Clean & Modern',
    description: 'Minimal white portfolio page with tabbed navigation (Home, Projects, Experience, About, Contact), service cards, and trusted-by section.',
  },
  {
    id: 'executive',
    name: 'Executive Lux',
    badge: 'Luxury & Corporate',
    description: 'Ultra dark luxury aesthetic with gold accents, quick-action bar, Google review boost, vCard, and slide-up lead capture.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist Pro',
    badge: 'Direct Action & Payments',
    description: 'Clean grid with Call, WhatsApp, Email, vCard download, LankaQR payment block, and Google review button.',
  },
];

// ─── Pure String Helpers ─────────────────────────────────────────────────────

function cleanUrl(url?: string): string {
  if (!url) return '';
  return url.replace('https://', '').replace('http://', '').replace(/\/$/, '');
}

function safeVcfName(name?: string): string {
  if (!name) return 'contact';
  return name.trim().split(' ').join('_').replace(/[^a-zA-Z0-9_-]/g, '');
}

function escapeSingleQuote(str?: string): string {
  if (!str) return '';
  return str.split("'").join("\\'");
}

function getVCardPayload(data: TemplateData, fullUrl: string): string {
  const nameToUse = data.name || data.company || 'Contact';
  const parts = nameToUse.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeSingleQuote(lastName)};${escapeSingleQuote(firstName)};;;`,
    `FN:${escapeSingleQuote(nameToUse)}`,
    `ORG:${escapeSingleQuote(data.company || '')}`,
    `TITLE:${escapeSingleQuote(data.title || '')}`,
    `TEL;TYPE=CELL,VOICE:${data.phone || ''}`,
    `EMAIL;TYPE=INTERNET:${data.email || ''}`,
    `URL:${fullUrl}`,
    data.location ? `ADR;TYPE=WORK:;;${escapeSingleQuote(data.location)};;;;` : '',
    'NOTE:SERA Smart Card Digital Profile',
    'END:VCARD',
  ].filter(Boolean);
  return lines.join('\\n');
}

// ─── Shared Lead Capture Script & Modal ──────────────────────────────────────

function buildLeadCaptureScript(slug: string, name: string, waNumber: string): string {
  const firstName = (name || 'Friend').trim().split(/\s+/)[0] || 'Friend';
  return `
async function submitLead(e) {
  e.preventDefault();
  var btn = document.getElementById('leadSubmitBtn');
  var name = document.getElementById('leadName').value.trim();
  var phone = document.getElementById('leadPhone').value.trim();
  var notes = document.getElementById('leadNotes') ? document.getElementById('leadNotes').value.trim() : '';
  if (!name || !phone) return;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    var res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: '${slug}', ownerWhatsapp: '${waNumber}', name: name, phone: phone, notes: notes })
    });
    var data = await res.json();
    if (res.ok && data.success) {
      document.getElementById('leadForm').innerHTML =
        '<div style="text-align:center;padding:2rem 0;">' +
        '<p style="font-size:2rem;margin:0 0 0.5rem 0;">✓</p>' +
        '<p style="font-weight:700;color:#10b981;font-size:1.05rem;">Contact Shared!</p>' +
        '<p style="font-size:0.8rem;color:#94a3b8;margin-top:0.4rem;">${firstName} will be in touch soon.</p>' +
        (data.ownerNotifyUrl ? '<a href="' + data.ownerNotifyUrl + '" target="_blank" style="display:inline-block;margin-top:1.25rem;padding:0.75rem 1.4rem;background:#25d366;color:#fff;border-radius:999px;font-size:0.85rem;font-weight:700;text-decoration:none;box-shadow:0 4px 14px rgba(37,211,102,0.4);">📲 Chat with ${firstName} on WhatsApp</a>' : '') +
        '</div>';
    } else {
      btn.textContent = 'Try Again';
      btn.disabled = false;
      alert(data.error || 'Failed. Please try again.');
    }
  } catch (err) {
    btn.textContent = 'Try Again';
    btn.disabled = false;
  }
}
function toggleLeadModal(show) {
  var m = document.getElementById('leadModal');
  if (m) {
    m.style.display = show ? 'flex' : 'none';
    if (show) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }
}`.trim();
}

function buildLeadModal(data: TemplateData): string {
  const firstName = (data.name || data.company || 'Us').trim().split(/\s+/)[0] || 'Us';
  return `
<div id="leadModal" style="position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:flex-end;justify-content:center;z-index:9999;backdrop-filter:blur(4px);" onclick="if(event.target===this)toggleLeadModal(false)">
  <div style="width:100%;max-width:448px;background:#111116;border-top-left-radius:24px;border-top-right-radius:24px;border:1px solid rgba(255,255,255,0.1);padding:1.75rem;text-align:left;color:#fff;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
      <h3 style="margin:0;font-size:1.1rem;font-weight:700;color:#fff;">Connect with ${firstName}</h3>
      <button onclick="toggleLeadModal(false)" style="background:none;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;line-height:1;">&times;</button>
    </div>
    <form id="leadForm" onsubmit="submitLead(event)">
      <input type="text" id="leadName" placeholder="Your Full Name" required style="width:100%;padding:0.85rem;border-radius:12px;background:#050506;border:1px solid rgba(255,255,255,0.12);color:#fff;margin-bottom:0.75rem;font-size:0.9rem;box-sizing:border-box;" />
      <input type="tel" id="leadPhone" placeholder="Your Phone / WhatsApp Number" required style="width:100%;padding:0.85rem;border-radius:12px;background:#050506;border:1px solid rgba(255,255,255,0.12);color:#fff;margin-bottom:0.75rem;font-size:0.9rem;box-sizing:border-box;" />
      <input type="text" id="leadNotes" placeholder="Company / Short Note (optional)" style="width:100%;padding:0.85rem;border-radius:12px;background:#050506;border:1px solid rgba(255,255,255,0.12);color:#fff;margin-bottom:1rem;font-size:0.9rem;box-sizing:border-box;" />
      <button type="submit" id="leadSubmitBtn" style="width:100%;padding:0.9rem;background:#f97316;color:#fff;border:none;border-radius:14px;font-size:0.95rem;font-weight:700;cursor:pointer;">Send Contact Details</button>
    </form>
  </div>
</div>`.trim();
}

// ─── Template Generators ─────────────────────────────────────────────────────

export function generateTemplateHtml(presetId: string, data: TemplateData): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'serenex.lk';
  const fullUrl = `https://${data.slug || 'yourname'}.${rootDomain}`;
  const waNumber = data.whatsapp.replace(/[^0-9]/g, '');
  const leadScript = buildLeadCaptureScript(data.slug, data.name || data.company, waNumber);
  const leadModal = buildLeadModal(data);
  const vcardPayload = getVCardPayload(data, fullUrl);

  // ════════════════════════════════════════════════════════════════
  // 1. PERSONAL VIP (Kosala Fernando Profile Layout)
  // ════════════════════════════════════════════════════════════════
  if (presetId === 'personal_hero') {
    const initials = data.company ? data.company.slice(0, 2).toUpperCase() : 'CA';
    const avatarUrl = data.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${data.name} | SERA Card</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 flex justify-center min-h-screen">

  <div class="w-full max-w-md bg-white text-slate-900 min-h-screen relative flex flex-col justify-between overflow-x-hidden shadow-2xl">

    <!-- Top Navigation -->
    <header class="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-5 py-4 bg-gradient-to-b from-black/60 to-transparent">
      <div class="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md font-bold text-slate-900 text-sm tracking-wider">
        ${initials}
      </div>
      <a href="https://${rootDomain}" target="_blank" class="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/30 transition">
        GET YOUR CARD
      </a>
    </header>

    <!-- Hero Section (Full Viewport Profile) -->
    <div class="relative h-[65vh] w-full bg-slate-800 flex items-end">
      <img src="${avatarUrl}" 
           alt="${data.name}" 
           class="absolute inset-0 w-full h-full object-cover object-top"
           onerror="this.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'">
      
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

      <!-- Floating Vertical Social Icons -->
      <div class="absolute right-4 bottom-24 z-20 flex flex-col gap-2.5 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 text-white shadow-xl">
        ${data.facebook ? `<a href="${data.facebook}" target="_blank" class="w-8 h-8 flex items-center justify-center rounded-full hover:text-cyan-400 transition"><i class="fab fa-facebook-f text-sm"></i></a>` : ''}
        <a href="https://wa.me/${waNumber}" target="_blank" class="w-8 h-8 flex items-center justify-center rounded-full hover:text-green-400 transition"><i class="fab fa-whatsapp text-sm"></i></a>
        ${data.tiktok ? `<a href="${data.tiktok}" target="_blank" class="w-8 h-8 flex items-center justify-center rounded-full hover:text-pink-400 transition"><i class="fab fa-tiktok text-sm"></i></a>` : ''}
        ${data.snapchat ? `<a href="${data.snapchat}" target="_blank" class="w-8 h-8 flex items-center justify-center rounded-full hover:text-yellow-400 transition"><i class="fab fa-snapchat-ghost text-sm"></i></a>` : ''}
        ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="w-8 h-8 flex items-center justify-center rounded-full hover:text-blue-400 transition"><i class="fab fa-linkedin-in text-sm"></i></a>` : ''}
        ${data.instagram ? `<a href="${data.instagram}" target="_blank" class="w-8 h-8 flex items-center justify-center rounded-full hover:text-rose-400 transition"><i class="fab fa-instagram text-sm"></i></a>` : ''}
      </div>

      <!-- Profile Bio Details -->
      <div class="relative z-20 p-5 text-white w-full pr-16 pb-6">
        <h1 class="text-2xl font-bold tracking-tight">${data.name}</h1>
        <p class="text-xs font-semibold text-slate-300 mt-0.5">${data.title} &middot; ${data.company}</p>
        ${data.bio ? `<p class="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">${data.bio}</p>` : ''}
        <div class="flex justify-center mt-3 text-slate-400 animate-bounce">
          <i class="fas fa-chevron-up text-xs"></i>
        </div>
      </div>
    </div>

    <!-- Bottom Action & Details Card -->
    <div class="bg-white rounded-t-3xl -mt-5 relative z-20 px-5 pt-6 pb-20 shadow-2xl flex-1 flex flex-col justify-between">
      
      <!-- 3 Primary Action Buttons -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <button id="saveBtn" onclick="triggerSaveContact()" class="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition active:scale-95 shadow-sm">
          <div id="saveIcon">
            <i class="fas fa-arrow-down-to-bracket text-orange-500 text-lg mb-1"></i>
          </div>
          <span id="saveText" class="text-xs font-semibold text-slate-700">Save</span>
        </button>

        <button onclick="toggleLeadModal(true)" class="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition active:scale-95 shadow-sm">
          <i class="fas fa-handshake text-orange-500 text-lg mb-1"></i>
          <span class="text-xs font-semibold text-slate-700">Connect</span>
        </button>

        <button onclick="shareProfile()" class="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition active:scale-95 shadow-sm">
          <i class="fas fa-share-nodes text-orange-500 text-lg mb-1"></i>
          <span class="text-xs font-semibold text-slate-700">Share</span>
        </button>
      </div>

      <!-- Contact Info Rows -->
      <div class="space-y-3">
        <a href="tel:${data.phone}" class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Mobile Number</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.phone}</p>
          </div>
          <i class="fas fa-phone text-slate-400 text-sm"></i>
        </a>

        <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(data.name)},%20I%20just%20tapped%20your%20SERA%20Card!" target="_blank" class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">WhatsApp</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.whatsapp}</p>
          </div>
          <i class="fab fa-whatsapp text-emerald-500 text-base"></i>
        </a>

        <a href="mailto:${data.email}" class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Email</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.email}</p>
          </div>
          <i class="fas fa-envelope text-slate-400 text-sm"></i>
        </a>

        ${data.website ? `
        <a href="${data.website}" target="_blank" class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Website</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${cleanUrl(data.website)}</p>
          </div>
          <i class="fas fa-globe text-slate-400 text-sm"></i>
        </a>` : ''}

        ${data.location ? `
        <div class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Address</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.location}</p>
          </div>
          <i class="fas fa-location-dot text-slate-400 text-sm"></i>
        </div>` : ''}

        <div class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Company</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.company}</p>
          </div>
          <i class="fas fa-building text-slate-400 text-sm"></i>
        </div>
      </div>

      ${data.lankaQrText ? `
      <div class="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
        <p class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">💳 LankaQR & Bank Details</p>
        <p class="text-xs font-mono text-slate-700 mt-1">${data.lankaQrText}</p>
      </div>` : ''}

      <div class="mt-8 text-center text-[10px] text-slate-400">
        Verified Digital Identity &middot; Powered by <a href="https://${rootDomain}" target="_blank" class="font-bold text-slate-700">Sera Cards</a>
      </div>

    </div>

  </div>

  ${leadModal}

  <script>
    ${leadScript}

    function triggerSaveContact() {
      var icon = document.getElementById('saveIcon');
      var text = document.getElementById('saveText');

      icon.innerHTML = '<i class="fas fa-circle-notch fa-spin text-orange-500 text-lg mb-1"></i>';
      text.innerText = 'Loading...';

      setTimeout(function() {
        var vcardData = "${vcardPayload}";
        var blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        
        var downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', '${safeVcfName(data.slug || data.name)}.vcf');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        setTimeout(function() {
          icon.innerHTML = '<i class="fas fa-arrow-down-to-bracket text-orange-500 text-lg mb-1"></i>';
          text.innerText = 'Save';
        }, 1000);
      }, 600);
    }

    function shareProfile() {
      if (navigator.share) {
        navigator.share({
          title: '${escapeSingleQuote(data.name)} - SERA Card',
          text: 'Connect with ${escapeSingleQuote(data.name)} (${escapeSingleQuote(data.title)} at ${escapeSingleQuote(data.company)})',
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
      }
    }
  </script>
</body>
</html>`;
  }

  // ════════════════════════════════════════════════════════════════
  // 2. COMPANY / BUSINESS PROFILE (Aura Living Interiors Layout)
  // ════════════════════════════════════════════════════════════════
  if (presetId === 'company_profile') {
    const coverUrl = data.coverUrl || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80';
    const logoUrl = data.avatarUrl || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${data.company} | SERA Business</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; }
    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    .tab-content { display: none; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .tab-content.active { display: block; }
    @keyframes slideUp { 
      from { opacity: 0; transform: translateY(10px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
  </style>
</head>
<body class="text-slate-900 flex justify-center min-h-screen">

  <div class="w-full max-w-md bg-[#f8fafc] relative flex flex-col overflow-x-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] min-h-screen">

    <!-- Sticky Glass Header -->
    <header class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 flex justify-between items-center px-5 py-4 transition-all" id="header">
      <div class="bg-white/70 backdrop-blur-lg px-3 py-1.5 rounded-full shadow-sm border border-white/50 flex items-center gap-2">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Available Now</span>
      </div>
      <button onclick="shareCompany()" class="w-9 h-9 rounded-full bg-white/70 backdrop-blur-lg border border-white/50 text-slate-700 flex items-center justify-center hover:bg-white transition shadow-sm">
        <i class="fas fa-share-nodes text-sm"></i>
      </button>
    </header>

    <!-- Cinematic Cover Section -->
    <div class="relative w-full h-[35vh] bg-slate-900">
      <img src="${coverUrl}" alt="Office Cover" class="absolute inset-0 w-full h-full object-cover opacity-90">
      <div class="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-black/40"></div>
    </div>

    <!-- Main Identity Card -->
    <div class="px-5 relative z-20 -mt-16">
      <div class="bg-white p-5 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100">
        <div class="flex justify-between items-start">
          <div class="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-100 -mt-12 relative z-30">
            <img src="${logoUrl}" alt="Logo" class="w-full h-full object-cover rounded-xl" onerror="this.src='https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80'">
          </div>
          <div class="flex gap-2">
            <span class="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-100 flex items-center gap-1">
              <i class="fas fa-star text-amber-400"></i> 4.9
            </span>
            <span class="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-blue-100">
              <i class="fas fa-circle-check"></i> Verified
            </span>
          </div>
        </div>

        <div class="mt-4">
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">${data.company}</h1>
          <p class="text-xs font-semibold text-cyan-600 mt-1 uppercase tracking-wider">${data.title || 'Premium Architecture Studio'}</p>
          <p class="text-xs text-slate-500 mt-3 leading-relaxed">
            ${data.bio || 'Award-winning architectural and interior design studio based in Colombo. We transform luxury residential and commercial spaces with sustainable materials and modern aesthetics.'}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-5">
          <a href="https://wa.me/${waNumber}" target="_blank" class="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition active:scale-95 shadow-md">
            <i class="fab fa-whatsapp text-sm text-emerald-400"></i> Chat on WhatsApp
          </a>
          <a href="mailto:${data.email}" class="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-100 transition active:scale-95">
            <i class="fas fa-envelope text-sm"></i> Email Us
          </a>
        </div>
      </div>
    </div>

    <!-- Segmented Navigation -->
    <div class="px-5 mt-6 sticky top-20 z-40">
      <div class="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200/60 shadow-sm">
        <button onclick="switchTab('portfolio', this)" class="tab-btn flex-1 py-2 text-xs font-bold text-slate-900 bg-slate-100 rounded-xl shadow-sm transition-all">Portfolio</button>
        <button onclick="switchTab('details', this)" class="tab-btn flex-1 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-xl transition-all">Details</button>
        <button onclick="switchTab('payment', this)" class="tab-btn flex-1 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-xl transition-all">Payment</button>
      </div>
    </div>

    <!-- TABS CONTAINER -->
    <div class="mt-2 pb-32">
      
      <!-- 1. PORTFOLIO & SERVICES TAB -->
      <div id="tab-portfolio" class="tab-content active">
        <div class="mt-4">
          <div class="px-5 flex justify-between items-end mb-3">
            <h3 class="text-sm font-extrabold text-slate-900">Featured Projects</h3>
            <span class="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">Showcase</span>
          </div>
          <div class="flex overflow-x-auto gap-4 px-5 pb-4 hide-scroll snap-x">
            <div class="relative w-64 h-40 rounded-2xl shrink-0 snap-center overflow-hidden shadow-md group">
              <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=600&q=80" alt="Project 1" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <p class="text-white font-bold text-sm">Havelock City Penthouse</p>
                <p class="text-slate-300 text-[10px]">Residential Fit-out</p>
              </div>
            </div>
            <div class="relative w-64 h-40 rounded-2xl shrink-0 snap-center overflow-hidden shadow-md group">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" alt="Project 2" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <p class="text-white font-bold text-sm">TechCorp Headquarters</p>
                <p class="text-slate-300 text-[10px]">Commercial Design</p>
              </div>
            </div>
            <div class="relative w-64 h-40 rounded-2xl shrink-0 snap-center overflow-hidden shadow-md group">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" alt="Project 3" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <p class="text-white font-bold text-sm">Galle Fort Villa</p>
                <p class="text-slate-300 text-[10px]">Restoration</p>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 mt-4">
          <h3 class="text-sm font-extrabold text-slate-900 mb-3">Our Core Services</h3>
          <div class="space-y-3">
            <div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
              <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=150&q=80" class="w-16 h-16 rounded-xl object-cover">
              <div class="flex-1">
                <h4 class="text-xs font-bold text-slate-900">3D Architectural Rendering</h4>
                <p class="text-[10px] text-slate-500 mt-1 line-clamp-2">High-fidelity CGI representations of your future space before construction begins.</p>
              </div>
            </div>
            <div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
              <img src="https://images.unsplash.com/photo-1581858726788-75bc5f6a952d?auto=format&fit=crop&w=150&q=80" class="w-16 h-16 rounded-xl object-cover">
              <div class="flex-1">
                <h4 class="text-xs font-bold text-slate-900">Turnkey Furniture Sourcing</h4>
                <p class="text-[10px] text-slate-500 mt-1 line-clamp-2">Importing and manufacturing custom luxury furniture tailored to your blueprint.</p>
              </div>
            </div>
          </div>
        </div>

        ${data.googleReviewUrl ? `
        <div class="px-5 mt-4">
          <a href="${data.googleReviewUrl}" target="_blank" class="block p-3.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 rounded-2xl transition hover:border-amber-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fab fa-google text-amber-500 text-lg"></i>
                <span class="text-xs font-bold text-slate-800">Rate Our Business</span>
              </div>
              <span class="text-xs text-amber-600 font-extrabold">★★★★★</span>
            </div>
          </a>
        </div>` : ''}
      </div>

      <!-- 2. DETAILS & CONTACT TAB -->
      <div id="tab-details" class="tab-content px-5 pt-4">
        <h3 class="text-sm font-extrabold text-slate-900 mb-3">Key Contact</h3>
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center mb-6">
          <div class="flex items-center gap-3">
            <img src="${data.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}" class="w-12 h-12 rounded-full object-cover border-2 border-slate-50">
            <div>
              <p class="text-sm font-bold text-slate-900">${data.name || data.company}</p>
              <p class="text-[10px] font-semibold text-slate-500">${data.title || 'Principal Architect'}</p>
            </div>
          </div>
          <a href="tel:${data.phone}" class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"><i class="fas fa-phone text-xs"></i></a>
        </div>

        <h3 class="text-sm font-extrabold text-slate-900 mb-3">Company Details</h3>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          <a href="https://maps.google.com" target="_blank" class="flex items-center gap-4 p-4 hover:bg-slate-50 transition">
            <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><i class="fas fa-location-dot"></i></div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Studio Location</p>
              <p class="text-sm font-bold text-slate-900">${data.location || '45/2 Ward Place, Colombo 07'}</p>
            </div>
          </a>
          <div class="flex items-center gap-4 p-4">
            <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><i class="fas fa-clock"></i></div>
            <div class="w-full">
              <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Business Hours</p>
              <div class="flex justify-between mt-1 text-sm text-slate-700">
                <span>Mon - Fri:</span> <span class="font-bold">09:00 AM - 06:00 PM</span>
              </div>
              <div class="flex justify-between mt-1 text-sm text-slate-700">
                <span>Saturday:</span> <span class="font-bold">10:00 AM - 02:00 PM</span>
              </div>
            </div>
          </div>
          ${data.website ? `
          <a href="${data.website}" target="_blank" class="flex items-center gap-4 p-4 hover:bg-slate-50 transition">
            <div class="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><i class="fas fa-globe"></i></div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Website</p>
              <p class="text-sm font-bold text-slate-900">${cleanUrl(data.website)}</p>
            </div>
          </a>` : ''}
        </div>
      </div>

      <!-- 3. PAYMENT & LANKAQR TAB -->
      <div id="tab-payment" class="tab-content px-5 pt-4">
        <div class="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100 text-center">
          <div class="inline-block bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-slate-200">
            Official Merchant
          </div>
          <h3 class="text-lg font-extrabold text-slate-900 mb-4">Scan & Pay (LankaQR)</h3>
          
          <div class="w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-sm mb-6">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.lankaQrText || data.company)}" alt="LankaQR" class="w-full h-full">
          </div>
          
          <div class="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
            <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Bank Transfer</p>
            <p class="font-bold text-slate-900 text-sm mt-1">${data.company}</p>
            <div class="flex justify-between items-center mt-1">
              <p class="font-mono text-slate-600 text-xs">${data.lankaQrText || 'Commercial Bank: 1000 8492 1198'}</p>
              <button onclick="navigator.clipboard.writeText('${escapeSingleQuote(data.lankaQrText || '100084921198')}'); alert('Account Number Copied!');" class="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-700 hover:bg-slate-100 shadow-sm">
                COPY
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Floating Bottom Action Bar -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[380px] z-50">
      <button onclick="downloadCompanyVCF()" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-[0_15px_30px_rgba(15,23,42,0.3)] hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2 border border-slate-800">
        <i class="fas fa-address-book text-cyan-400"></i> Save to Contacts
      </button>
    </div>

  </div>

  ${leadModal}

  <script>
    ${leadScript}

    function switchTab(tabId, element) {
      document.querySelectorAll('.tab-content').forEach(function(el) { el.classList.remove('active'); });
      document.querySelectorAll('.tab-btn').forEach(function(el) {
        el.classList.remove('bg-slate-100', 'text-slate-900', 'shadow-sm');
        el.classList.add('text-slate-500');
      });
      var target = document.getElementById('tab-' + tabId);
      if (target) target.classList.add('active');
      if (element) {
        element.classList.add('bg-slate-100', 'text-slate-900', 'shadow-sm');
        element.classList.remove('text-slate-500');
      }
    }

    function downloadCompanyVCF() {
      var vcard = "${vcardPayload}";
      var blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '${safeVcfName(data.slug || data.company)}.vcf';
      document.body.appendChild(a);
      a.click();
      setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    }

    function shareCompany() {
      if (navigator.share) {
        navigator.share({ title: '${escapeSingleQuote(data.company)}', url: window.location.href });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    }
  </script>
</body>
</html>`;
  }

  // ════════════════════════════════════════════════════════════════
  // 3. PROFESSIONAL PORTFOLIO (Clean White Minimal Portfolio)
  // ════════════════════════════════════════════════════════════════
  if (presetId === 'professional_portfolio') {
    const avatarUrl = data.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} | Portfolio</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #fafaf9; color: #1c1917; min-height: 100vh; }
    .container { max-width: 720px; margin: 0 auto; padding: 0 1.5rem; }

    /* Header */
    .profile-header { text-align: center; padding: 3.5rem 0 2rem; }
    .avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 1.25rem; display: block; border: 3px solid #e7e5e4; }
    .profile-name { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; color: #1c1917; margin-bottom: 0.35rem; }
    .profile-tagline { font-size: 0.9rem; color: #78716c; }

    /* Tabs */
    .tabs { display: flex; justify-content: center; gap: 0.25rem; margin: 1.5rem 0 2.5rem; background: #f5f5f4; border-radius: 999px; padding: 0.3rem; max-width: 480px; margin-left: auto; margin-right: auto; }
    .tab { padding: 0.55rem 1.2rem; border-radius: 999px; font-size: 0.8rem; font-weight: 500; color: #78716c; cursor: pointer; border: none; background: transparent; transition: all 0.2s; }
    .tab.active { background: #fff; color: #1c1917; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .tab-contact { border: 1.5px solid #d6d3d1 !important; color: #1c1917 !important; font-weight: 600 !important; }

    /* Tab content */
    .tab-panel { display: none; animation: fadeIn 0.3s ease; }
    .tab-panel.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    /* Section */
    .section-title { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 0.75rem; }
    .section-subtitle { font-size: 0.9rem; color: #78716c; line-height: 1.6; max-width: 480px; margin-bottom: 1.5rem; }

    /* Service Cards */
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 2.5rem; }
    .service-card { background: #f5f5f4; border-radius: 16px; padding: 1.25rem; border: 1px solid #e7e5e4; }
    .service-card p { font-size: 0.82rem; color: #57534e; line-height: 1.5; }

    /* Contact section */
    .contact-grid { display: grid; gap: 0.75rem; }
    .contact-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background: #fff; border: 1px solid #e7e5e4; border-radius: 16px; text-decoration: none; color: #1c1917; transition: all 0.15s; }
    .contact-item:hover { border-color: #a8a29e; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .contact-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
    .contact-label { font-size: 0.7rem; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
    .contact-value { font-size: 0.88rem; font-weight: 600; color: #1c1917; margin-top: 0.1rem; }

    /* Buttons */
    .btn-row { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
    .btn { flex: 1; padding: 0.85rem; border-radius: 14px; font-size: 0.85rem; font-weight: 600; text-align: center; text-decoration: none; cursor: pointer; border: none; transition: all 0.15s; }
    .btn-dark { background: #1c1917; color: #fff; }
    .btn-dark:hover { background: #292524; }
    .btn-outline { background: #fff; color: #1c1917; border: 1.5px solid #d6d3d1; }
    .btn-outline:hover { border-color: #a8a29e; }

    /* Footer */
    .page-footer { text-align: center; padding: 3rem 0 2rem; font-size: 0.72rem; color: #a8a29e; }
    .page-footer a { color: #78716c; text-decoration: none; font-weight: 600; }

    /* Social Icons */
    .social-row { display: flex; justify-content: center; gap: 0.75rem; margin-top: 1.25rem; }
    .social-link { width: 36px; height: 36px; border-radius: 10px; background: #f5f5f4; border: 1px solid #e7e5e4; display: flex; align-items: center; justify-content: center; color: #57534e; text-decoration: none; font-size: 0.9rem; transition: all 0.15s; }
    .social-link:hover { background: #e7e5e4; color: #1c1917; }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

  <div class="container">
    <!-- Profile Header -->
    <div class="profile-header">
      <img src="${avatarUrl}" alt="${data.name}" class="avatar" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'">
      <h1 class="profile-name">${data.name}</h1>
      <p class="profile-tagline">${data.title}. ${data.company}. ✨</p>

      <div class="social-row">
        ${data.linkedin ? '<a href="' + data.linkedin + '" target="_blank" class="social-link"><i class="fab fa-linkedin-in"></i></a>' : ''}
        ${data.instagram ? '<a href="' + data.instagram + '" target="_blank" class="social-link"><i class="fab fa-instagram"></i></a>' : ''}
        ${data.facebook ? '<a href="' + data.facebook + '" target="_blank" class="social-link"><i class="fab fa-facebook-f"></i></a>' : ''}
        <a href="https://wa.me/${waNumber}" target="_blank" class="social-link"><i class="fab fa-whatsapp"></i></a>
        <a href="mailto:${data.email}" class="social-link"><i class="fas fa-envelope"></i></a>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab active" onclick="switchTab('home', this)">Home</button>
      <button class="tab" onclick="switchTab('experience', this)">Experience</button>
      <button class="tab" onclick="switchTab('about', this)">About</button>
      <button class="tab tab-contact" onclick="switchTab('contact', this)">Contact</button>
    </div>

    <!-- HOME TAB -->
    <div id="panel-home" class="tab-panel active">
      <h2 class="section-title">${data.bio || 'Turnkey software development, support, and maintenance'}</h2>
      <p class="section-subtitle">Professional services powered by experience and dedication to delivering results that matter.</p>

      <div class="services-grid">
        <div class="service-card">
          <p>Full cycle, from concept to launch and beyond.</p>
        </div>
        <div class="service-card">
          <p>Support, iteration, and maintenance after release.</p>
        </div>
        <div class="service-card">
          <p>Solutions, integrations, and reliable operation.</p>
        </div>
      </div>

      ${data.website ? '<div style="margin-bottom:2.5rem"><a href="' + data.website + '" target="_blank" class="btn btn-dark" style="display:inline-block;padding:0.75rem 1.75rem;">Visit Website &rarr;</a></div>' : ''}
    </div>

    <!-- EXPERIENCE TAB -->
    <div id="panel-experience" class="tab-panel">
      <h2 class="section-title">Professional Experience</h2>
      <p class="section-subtitle">Career highlights and milestones.</p>

      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <div class="service-card">
          <p style="font-weight:600;color:#1c1917;margin-bottom:0.25rem;">${data.title}</p>
          <p style="font-size:0.78rem;">${data.company}</p>
        </div>
        <div class="service-card">
          <p style="font-weight:600;color:#1c1917;margin-bottom:0.25rem;">Industry Professional</p>
          <p style="font-size:0.78rem;">Delivering excellence across multiple domains</p>
        </div>
      </div>
    </div>

    <!-- ABOUT TAB -->
    <div id="panel-about" class="tab-panel">
      <h2 class="section-title">About ${data.name.split(' ')[0]}</h2>
      <p class="section-subtitle">${data.bio || 'A passionate professional committed to delivering exceptional results.'}</p>

      <div class="services-grid">
        ${data.location ? '<div class="service-card"><p>📍 Based in ' + data.location + '</p></div>' : ''}
        ${data.company ? '<div class="service-card"><p>🏢 ' + data.company + '</p></div>' : ''}
        ${data.website ? '<div class="service-card"><p>🌐 ' + cleanUrl(data.website) + '</p></div>' : ''}
      </div>
    </div>

    <!-- CONTACT TAB -->
    <div id="panel-contact" class="tab-panel">
      <h2 class="section-title">Get in Touch</h2>
      <p class="section-subtitle">Let us connect and explore how we can work together.</p>

      <div class="contact-grid">
        <a href="tel:${data.phone}" class="contact-item">
          <div class="contact-icon" style="background:#ecfdf5;color:#059669;">📞</div>
          <div>
            <p class="contact-label">Phone</p>
            <p class="contact-value">${data.phone}</p>
          </div>
        </a>
        <a href="https://wa.me/${waNumber}" target="_blank" class="contact-item">
          <div class="contact-icon" style="background:#f0fdf4;color:#16a34a;">💬</div>
          <div>
            <p class="contact-label">WhatsApp</p>
            <p class="contact-value">Chat Now</p>
          </div>
        </a>
        <a href="mailto:${data.email}" class="contact-item">
          <div class="contact-icon" style="background:#eff6ff;color:#2563eb;">✉️</div>
          <div>
            <p class="contact-label">Email</p>
            <p class="contact-value">${data.email}</p>
          </div>
        </a>
        ${data.website ? '<a href="' + data.website + '" target="_blank" class="contact-item"><div class="contact-icon" style="background:#faf5ff;color:#9333ea;">🌐</div><div><p class="contact-label">Website</p><p class="contact-value">' + cleanUrl(data.website) + '</p></div></a>' : ''}
        ${data.location ? '<div class="contact-item"><div class="contact-icon" style="background:#fefce8;color:#ca8a04;">📍</div><div><p class="contact-label">Location</p><p class="contact-value">' + data.location + '</p></div></div>' : ''}
      </div>

      <div class="btn-row">
        <button onclick="downloadVCard()" class="btn btn-dark">💾 Save Contact</button>
        <button onclick="toggleLeadModal(true)" class="btn btn-outline">🤝 Connect</button>
      </div>
    </div>

    <div class="page-footer">
      Verified Digital Identity &middot; Powered by <a href="https://${rootDomain}" target="_blank">Sera Cards</a>
    </div>
  </div>

  ${leadModal}

  <script>
    ${leadScript}

    function switchTab(tabId, element) {
      document.querySelectorAll('.tab-panel').forEach(function(el) { el.classList.remove('active'); });
      document.querySelectorAll('.tab').forEach(function(el) { el.classList.remove('active'); });
      var target = document.getElementById('panel-' + tabId);
      if (target) target.classList.add('active');
      if (element) element.classList.add('active');
    }

    function downloadVCard() {
      var vcard = "${vcardPayload}";
      var blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '${safeVcfName(data.slug || data.name)}.vcf';
      document.body.appendChild(a);
      a.click();
      setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    }
  </script>
</body>
</html>`;
  }

  // ════════════════════════════════════════════════════════════════
  // 4. EXECUTIVE LUX (Dark & Gold Card)
  // ════════════════════════════════════════════════════════════════
  if (presetId === 'executive') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${data.name} — ${data.company}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#050506;color:#fff;display:flex;justify-content:center;min-height:100vh;padding:1.5rem 1rem}
    .card{width:100%;max-width:420px;background:#0e0e12;border:1px solid rgba(201,162,74,0.2);border-radius:28px;padding:2.5rem 1.75rem;text-align:center;box-shadow:0 30px 60px rgba(0,0,0,0.8)}
    .gold-ring{width:108px;height:108px;border-radius:50%;padding:3px;background:linear-gradient(135deg,#c9a24a,rgba(201,162,74,0.1),#e0c274);margin:0 auto 1.25rem}
    .avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;background:#16161b}
    .name{font-size:1.75rem;font-weight:700;letter-spacing:-.02em;margin-bottom:.35rem}
    .title{font-size:.85rem;text-transform:uppercase;letter-spacing:.18em;color:#c9a24a;margin-bottom:.35rem;font-weight:600}
    .company{font-size:.9rem;color:rgba(255,255,255,.6);margin-bottom:.5rem}
    .location{font-size:.8rem;color:rgba(255,255,255,.35);margin-bottom:1.5rem}
    .bio{font-size:.875rem;color:rgba(255,255,255,.6);line-height:1.6;margin-bottom:2rem;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);padding:1rem 0}
    .quick-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:.75rem}
    .quick-row a{padding:.75rem .25rem;font-size:.8rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;color:#fff;text-decoration:none;text-align:center;display:block}
    .quick-row a:hover{background:rgba(255,255,255,.08)}
    .actions{display:flex;flex-direction:column;gap:.75rem;width:100%}
    .btn{display:flex;align-items:center;justify-content:center;gap:.65rem;padding:1rem;border-radius:14px;font-size:.9rem;font-weight:600;text-decoration:none;cursor:pointer;transition:all .2s;border:none;width:100%;text-align:center}
    .btn-gold{background:linear-gradient(135deg,#c9a24a,#a8832f);color:#0a0a0c;font-weight:700}
    .btn-outline{background:rgba(255,255,255,.03);color:#fff;border:1px solid rgba(255,255,255,.1)}
    .footer{margin-top:2rem;font-size:.72rem;color:rgba(255,255,255,.3)}
    .footer a{color:#c9a24a;text-decoration:none}
  </style>
</head>
<body>
  <div class="card">
    <div class="gold-ring">
      <img src="${data.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop'}" alt="${data.name}" class="avatar">
    </div>
    <h1 class="name">${data.name}</h1>
    <p class="title">${data.title}</p>
    <p class="company">${data.company}</p>
    ${data.location ? `<p class="location">📍 ${data.location}</p>` : ''}
    ${data.bio ? `<p class="bio">${data.bio}</p>` : ''}

    <div class="quick-row">
      <a href="tel:${data.phone}">📞 Call</a>
      <a href="https://wa.me/${waNumber}" target="_blank">💬 WhatsApp</a>
      <a href="mailto:${data.email}">✉️ Email</a>
    </div>

    <div class="actions">
      <button onclick="downloadVCard()" class="btn btn-gold">💾 Save Contact to Phone</button>
      <button onclick="toggleLeadModal(true)" class="btn btn-outline">🤝 Exchange Details</button>
      ${data.googleReviewUrl ? `<a href="${data.googleReviewUrl}" target="_blank" class="btn btn-outline" style="color:#fbbc05;border-color:rgba(251,188,5,0.3)">⭐ Leave a Google Review</a>` : ''}
    </div>

    <p class="footer">Sera Cards · <a href="https://${rootDomain}" target="_blank">${rootDomain}</a></p>
  </div>

  ${leadModal}

  <script>
    ${leadScript}
    function downloadVCard() {
      var vcard = "${vcardPayload}";
      var blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '${safeVcfName(data.slug || data.name)}.vcf';
      document.body.appendChild(a);
      a.click();
      setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    }
  </script>
</body>
</html>`;
  }

  // ════════════════════════════════════════════════════════════════
  // 4. MINIMALIST PRO (Clean Action Grid)
  // ════════════════════════════════════════════════════════════════
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${data.name} — Digital Card</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#090a0f;color:#f8fafc;display:flex;justify-content:center;min-height:100vh;padding:1.5rem 1rem}
    .card{width:100%;max-width:420px;background:#12141c;border:1px solid rgba(255,255,255,.07);border-radius:28px;padding:2rem 1.5rem;display:flex;flex-direction:column;align-items:center;box-shadow:0 25px 50px rgba(0,0,0,.5)}
    .avatar{width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid #10b981;margin-bottom:1rem}
    .name{font-size:1.45rem;font-weight:700;margin-bottom:.25rem;text-align:center}
    .title{font-size:.8rem;color:#10b981;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.25rem;text-align:center}
    .company{font-size:.875rem;color:rgba(255,255,255,.55);margin-bottom:1.5rem;text-align:center}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;width:100%;margin-bottom:1rem}
    .btn{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.9rem;border-radius:14px;text-decoration:none;font-size:.875rem;font-weight:600;cursor:pointer;border:none}
    .btn-em{background:#10b981;color:#000}
    .btn-ghost{background:rgba(255,255,255,.05);color:#f8fafc;border:1px solid rgba(255,255,255,.1)}
    .btn-full{width:100%;grid-column:1/-1}
    .footer{margin-top:1.5rem;font-size:.7rem;color:rgba(255,255,255,.3);text-align:center}
    .footer a{color:#10b981;text-decoration:none}
  </style>
</head>
<body>
  <div class="card">
    <img src="${data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'}" alt="${data.name}" class="avatar">
    <h1 class="name">${data.name}</h1>
    <p class="title">${data.title}</p>
    <p class="company">${data.company}</p>

    <div class="grid">
      <a href="tel:${data.phone}" class="btn btn-ghost">📞 Call</a>
      <a href="https://wa.me/${waNumber}" target="_blank" class="btn btn-ghost">💬 WhatsApp</a>
      <a href="mailto:${data.email}" class="btn btn-ghost">✉️ Email</a>
      <button onclick="downloadVCard()" class="btn btn-em">💾 Save vCard</button>
      <button onclick="toggleLeadModal(true)" class="btn btn-ghost btn-full">🤝 Exchange Contact Details</button>
    </div>

    <p class="footer">Sera Cards · <a href="https://${rootDomain}" target="_blank">${rootDomain}</a></p>
  </div>

  ${leadModal}

  <script>
    ${leadScript}
    function downloadVCard() {
      var vcard = "${vcardPayload}";
      var blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '${safeVcfName(data.slug || data.name)}.vcf';
      document.body.appendChild(a);
      a.click();
      setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    }
  </script>
</body>
</html>`;
}

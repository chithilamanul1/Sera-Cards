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
    name: 'Company / Business (Aura Living)',
    badge: 'Corporate & Catalog',
    description: 'Verified business header, cover banner, logo card, trust badges, segmented tabs (Services, Contact, LankaQR billing), and review booster.',
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

// ─── Shared Lead Capture Script & Modal ──────────────────────────────────────

function buildLeadCaptureScript(slug: string, name: string, waNumber: string): string {
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
        '<p style="font-size:0.8rem;color:#94a3b8;margin-top:0.4rem;">${name.split(' ')[0]} will be in touch soon.</p>' +
        (data.ownerNotifyUrl ? '<a href="' + data.ownerNotifyUrl + '" target="_blank" style="display:inline-block;margin-top:1.25rem;padding:0.75rem 1.4rem;background:#25d366;color:#fff;border-radius:999px;font-size:0.85rem;font-weight:700;text-decoration:none;box-shadow:0 4px 14px rgba(37,211,102,0.4);">📲 Chat with ${name.split(' ')[0]} on WhatsApp</a>' : '') +
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
  return `
<div id="leadModal" style="position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:flex-end;justify-content:center;z-index:9999;backdrop-filter:blur(4px);" onclick="if(event.target===this)toggleLeadModal(false)">
  <div style="width:100%;max-width:448px;background:#111116;border-top-left-radius:24px;border-top-right-radius:24px;border:1px solid rgba(255,255,255,0.1);padding:1.75rem;text-align:left;color:#fff;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
      <h3 style="margin:0;font-size:1.1rem;font-weight:700;color:#fff;">Connect with ${data.name.split(' ')[0]}</h3>
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
  const waNumber = data.whatsapp.replace(/[^0-9]/g, '');
  const leadScript = buildLeadCaptureScript(data.slug, data.name, waNumber);
  const leadModal = buildLeadModal(data);

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

  <!-- Mobile Container Frame -->
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
      <!-- Background Profile Image -->
      <img src="${avatarUrl}" 
           alt="${data.name}" 
           class="absolute inset-0 w-full h-full object-cover object-top"
           onerror="this.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'">
      
      <!-- Gradient Overlay for Legibility -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

      <!-- Floating Vertical Social Icons (Right) -->
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
        <p class="text-xs font-semibold text-slate-300 mt-0.5">${data.title} · ${data.company}</p>
        ${data.bio ? `<p class="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">${data.bio}</p>` : ''}
        <div class="flex justify-center mt-3 text-slate-400 animate-bounce">
          <i class="fas fa-chevron-up text-xs"></i>
        </div>
      </div>
    </div>

    <!-- Bottom Action & Details Card -->
    <div class="bg-white rounded-t-3xl -mt-5 relative z-20 px-5 pt-6 pb-20 shadow-2xl flex-1 flex flex-col justify-between">
      
      <!-- 3 Primary Action Buttons (Save, Connect, Share) -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <!-- Save Contact Button -->
        <button id="saveBtn" onclick="triggerSaveContact()" class="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition active:scale-95 shadow-sm">
          <div id="saveIcon">
            <i class="fas fa-arrow-down-to-bracket text-orange-500 text-lg mb-1"></i>
          </div>
          <span id="saveText" class="text-xs font-semibold text-slate-700">Save</span>
        </button>

        <!-- Connect Button (Opens Lead Capture or WhatsApp) -->
        <button onclick="toggleLeadModal(true)" class="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition active:scale-95 shadow-sm">
          <i class="fas fa-handshake text-orange-500 text-lg mb-1"></i>
          <span class="text-xs font-semibold text-slate-700">Connect</span>
        </button>

        <!-- Share Button -->
        <button onclick="shareProfile()" class="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition active:scale-95 shadow-sm">
          <i class="fas fa-share-nodes text-orange-500 text-lg mb-1"></i>
          <span class="text-xs font-semibold text-slate-700">Share</span>
        </button>
      </div>

      <!-- Contact Info Rows -->
      <div class="space-y-3">
        <!-- Mobile -->
        <a href="tel:${data.phone}" class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Mobile Number</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.phone}</p>
          </div>
          <i class="fas fa-phone text-slate-400 text-sm"></i>
        </a>

        <!-- WhatsApp -->
        <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(data.name)},%20I%20just%20tapped%20your%20SERA%20Card!" target="_blank" class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">WhatsApp</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.whatsapp}</p>
          </div>
          <i class="fab fa-whatsapp text-emerald-500 text-base"></i>
        </a>

        <!-- Email -->
        <a href="mailto:${data.email}" class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Email</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.email}</p>
          </div>
          <i class="fas fa-envelope text-slate-400 text-sm"></i>
        </a>

        ${data.website ? `
        <!-- Website -->
        <a href="${data.website}" target="_blank" class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Website</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.website.replace(/https?:\\/\\//, '')}</p>
          </div>
          <i class="fas fa-globe text-slate-400 text-sm"></i>
        </a>` : ''}

        ${data.location ? `
        <!-- Address -->
        <div class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Address</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.location}</p>
          </div>
          <i class="fas fa-location-dot text-slate-400 text-sm"></i>
        </div>` : ''}

        <!-- Company -->
        <div class="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
          <div>
            <p class="text-[10px] text-slate-400 uppercase font-semibold">Company</p>
            <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.company}</p>
          </div>
          <i class="fas fa-building text-slate-400 text-sm"></i>
        </div>
      </div>

      <!-- LankaQR Section (if provided) -->
      ${data.lankaQrText ? `
      <div class="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
        <p class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">💳 LankaQR & Bank Details</p>
        <p class="text-xs font-mono text-slate-700 mt-1">${data.lankaQrText}</p>
      </div>` : ''}

      <!-- Footer -->
      <div class="mt-8 text-center text-[10px] text-slate-400">
        Verified Digital Identity &middot; Powered by <a href="https://${rootDomain}" target="_blank" class="font-bold text-slate-700">Sera Cards</a>
      </div>

    </div>

  </div>

  ${leadModal}

  <!-- JavaScript: vCard Generation, Share & Lead Capture -->
  <script>
    ${leadScript}

    function triggerSaveContact() {
      const icon = document.getElementById('saveIcon');
      const text = document.getElementById('saveText');

      icon.innerHTML = '<i class="fas fa-circle-notch fa-spin text-orange-500 text-lg mb-1"></i>';
      text.innerText = 'Loading...';

      setTimeout(() => {
        const vcardData = \`BEGIN:VCARD
VERSION:3.0
N:${data.name.split(' ').slice(1).join(' ')};${data.name.split(' ')[0]};;;
FN:${data.name}
ORG:${data.company}
TITLE:${data.title}
TEL;TYPE=CELL,VOICE:${data.phone}
EMAIL;TYPE=WORK,INTERNET:${data.email}
URL:${fullUrl}
${data.location ? `ADR;TYPE=WORK:;;${data.location};;;;\\n` : ''}NOTE:SERA Smart Card Contact
END:VCARD\`;

        const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', '${(data.slug || data.name.replace(/\\s+/g, '_'))}.vcf');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        setTimeout(() => {
          icon.innerHTML = '<i class="fas fa-arrow-down-to-bracket text-orange-500 text-lg mb-1"></i>';
          text.innerText = 'Save';
        }, 1000);
      }, 600);
    }

    function shareProfile() {
      if (navigator.share) {
        navigator.share({
          title: '${data.name} - SERA Card',
          text: 'Connect with ${data.name} (${data.title} at ${data.company})',
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
    const coverUrl = data.coverUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80';
    const logoUrl = data.avatarUrl || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${data.company} | SERA Business Profile</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 flex justify-center min-h-screen">

  <!-- Mobile Frame Container -->
  <div class="w-full max-w-md bg-white text-slate-900 min-h-screen relative flex flex-col justify-between overflow-x-hidden shadow-2xl">

    <!-- Top Navigation -->
    <header class="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-5 py-4 bg-gradient-to-b from-black/60 to-transparent">
      <div class="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span class="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Open Now</span>
      </div>
      <a href="https://${rootDomain}" target="_blank" class="bg-black/40 backdrop-blur-md text-white border border-white/20 text-xs font-semibold px-3.5 py-1.5 rounded-full hover:bg-black/60 transition">
        GET SERA CARD
      </a>
    </header>

    <div>
      <!-- Company Cover Banner -->
      <div class="relative h-48 w-full bg-slate-800">
        <img src="${coverUrl}" 
             alt="${data.company} Cover" 
             class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>

      <!-- Business Identity Header -->
      <div class="px-5 relative z-20 -mt-12">
        <div class="flex justify-between items-end">
          <!-- Company Logo -->
          <div class="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100">
            <img src="${logoUrl}" 
                 alt="${data.company} Logo" 
                 class="w-full h-full object-cover rounded-xl"
                 onerror="this.src='https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80'">
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex gap-2 mb-1">
            <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(data.company)},%20I'd%20like%20to%20request%20a%20quotation!" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5">
              <i class="fab fa-whatsapp text-sm"></i> Inquire
            </a>
            <button onclick="shareCompany()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 transition">
              <i class="fas fa-share-nodes text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Business Details -->
        <div class="mt-3">
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">${data.company}</h1>
            <i class="fas fa-certificate text-cyan-500 text-sm" title="Verified Business"></i>
          </div>
          <p class="text-xs font-semibold text-cyan-600 mt-0.5">${data.title || 'Official Business Profile'}</p>
          ${data.bio ? `<p class="text-xs text-slate-500 mt-1.5 leading-relaxed">${data.bio}</p>` : ''}
        </div>

        <!-- Rating & Quick Trust Metrics -->
        <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
          <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <p class="text-xs font-bold text-slate-800">4.9 ★</p>
            <p class="text-[10px] text-slate-400">120+ Reviews</p>
          </div>
          <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <p class="text-xs font-bold text-slate-800">8+ Yrs</p>
            <p class="text-[10px] text-slate-400">Experience</p>
          </div>
          <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <p class="text-xs font-bold text-slate-800">${data.location ? data.location.split(',')[0] : 'Colombo'}</p>
            <p class="text-[10px] text-slate-400">Location</p>
          </div>
        </div>

        <!-- Primary Corporate CTAs -->
        <div class="grid grid-cols-3 gap-2.5 mt-4">
          <button id="saveBizBtn" onclick="downloadCompanyVCF()" class="flex flex-col items-center justify-center p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition shadow-sm">
            <i class="fas fa-address-card text-cyan-400 text-base mb-1"></i>
            <span class="text-[11px] font-semibold">Save Contact</span>
          </button>
          <a href="tel:${data.phone}" class="flex flex-col items-center justify-center p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition shadow-sm">
            <i class="fas fa-phone-volume text-emerald-600 text-base mb-1"></i>
            <span class="text-[11px] font-semibold">Call Hotline</span>
          </a>
          <button onclick="toggleLeadModal(true)" class="flex flex-col items-center justify-center p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition shadow-sm">
            <i class="fas fa-handshake text-orange-500 text-base mb-1"></i>
            <span class="text-[11px] font-semibold">Connect</span>
          </button>
        </div>

        <!-- Segmented Tab Navigation -->
        <div class="mt-6 flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button onclick="switchTab('services', this)" class="tab-btn flex-1 py-1.5 text-xs font-bold text-slate-900 bg-white rounded-lg shadow-sm">Services</button>
          <button onclick="switchTab('contact', this)" class="tab-btn flex-1 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900">Contact</button>
          <button onclick="switchTab('pay', this)" class="tab-btn flex-1 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900">Pay / LankaQR</button>
        </div>

        <!-- TAB 1: SERVICES / CATALOG -->
        <div id="tab-services" class="tab-content active mt-4 space-y-2.5 pb-8">
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h4 class="text-xs font-bold text-slate-800">Primary Services & Solutions</h4>
              <p class="text-[10px] text-slate-500 mt-0.5">Professional consultations and turnkey delivery</p>
            </div>
            <a href="https://wa.me/${waNumber}?text=Quote%20Request%20for%20Services" class="text-xs text-cyan-600 font-bold hover:underline">Get Quote &rarr;</a>
          </div>

          <!-- Google Review Booster Card -->
          ${data.googleReviewUrl ? `
          <a href="${data.googleReviewUrl}" target="_blank" class="block p-3.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 rounded-2xl transition hover:border-amber-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fab fa-google text-amber-500 text-lg"></i>
                <span class="text-xs font-bold text-slate-800">Rate Our Business</span>
              </div>
              <span class="text-xs text-amber-600 font-extrabold">★★★★★</span>
            </div>
          </a>` : ''}
        </div>

        <!-- TAB 2: CORPORATE CONTACT -->
        <div id="tab-contact" class="tab-content mt-4 space-y-2.5 pb-8">
          <a href="mailto:${data.email}" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p class="text-[10px] uppercase font-semibold text-slate-400">General Inquiries</p>
              <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.email}</p>
            </div>
            <i class="fas fa-envelope text-slate-400 text-sm"></i>
          </a>

          ${data.website ? `
          <a href="${data.website}" target="_blank" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p class="text-[10px] uppercase font-semibold text-slate-400">Official Website</p>
              <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.website.replace(/https?:\\/\\//, '')}</p>
            </div>
            <i class="fas fa-globe text-slate-400 text-sm"></i>
          </a>` : ''}

          ${data.location ? `
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p class="text-[10px] uppercase font-semibold text-slate-400">Office Address</p>
              <p class="text-xs font-semibold text-slate-800 mt-0.5">${data.location}</p>
            </div>
            <i class="fas fa-building text-slate-400 text-sm"></i>
          </div>` : ''}
        </div>

        <!-- TAB 3: BILLING & LANKAQR -->
        <div id="tab-pay" class="tab-content mt-4 pb-8 space-y-3">
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <p class="text-xs font-bold text-slate-800 mb-2">Scan & Pay via LankaQR</p>
            <div class="w-40 h-40 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.lankaQrText || data.company)}" alt="LankaQR" class="w-full h-full object-contain">
            </div>
            <p class="text-[10px] text-slate-400 mt-2">Compatible with BOC SmartPay, Commercial Bank Q+, Flash, and all CEFT apps.</p>
          </div>

          ${data.lankaQrText ? `
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-[10px] text-slate-400 uppercase font-semibold">Payment / Bank Details</p>
                <p class="font-mono text-slate-800 mt-0.5 text-[11px]">${data.lankaQrText}</p>
              </div>
              <button onclick="navigator.clipboard.writeText('${data.lankaQrText.replace(/'/g, "\\'")}'); alert('Payment info copied!');" class="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700">
                Copy
              </button>
            </div>
          </div>` : ''}
        </div>

      </div>
    </div>

    <!-- Persistent Footer -->
    <footer class="p-4 border-t border-slate-100 text-center bg-white">
      <p class="text-[10px] text-slate-400">Verified Business Identity • Powered by <a href="https://${rootDomain}" target="_blank" class="font-bold text-slate-700">Sera Cards</a></p>
    </footer>

  </div>

  ${leadModal}

  <!-- JavaScript: Tabs, vCard & Share -->
  <script>
    ${leadScript}

    function switchTab(tabId, element) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-white', 'text-slate-900', 'font-bold', 'shadow-sm');
        el.classList.add('text-slate-500', 'font-medium');
      });

      document.getElementById('tab-' + tabId).classList.add('active');
      element.classList.add('bg-white', 'text-slate-900', 'font-bold', 'shadow-sm');
      element.classList.remove('text-slate-500', 'font-medium');
    }

    function downloadCompanyVCF() {
      const vcard = \`BEGIN:VCARD
VERSION:3.0
ORG:${data.company}
FN:${data.company}
TEL;TYPE=WORK,VOICE:${data.phone}
EMAIL;TYPE=WORK:${data.email}
URL:${data.website || fullUrl}
${data.location ? `ADR;TYPE=WORK:;;${data.location};;;;\\n` : ''}NOTE:Official Verified Business Profile
END:VCARD\`;

      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '${(data.slug || data.company.replace(/\\s+/g, '_'))}.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function shareCompany() {
      if (navigator.share) {
        navigator.share({
          title: '${data.company}',
          text: 'Check out ${data.company} on Sera Cards',
          url: window.location.href
        });
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
  // 3. EXECUTIVE LUX (Dark & Gold Card)
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
      var lines = ['BEGIN:VCARD','VERSION:3.0','FN:${data.name}','ORG:${data.company}','TITLE:${data.title}','TEL;TYPE=CELL,VOICE:${data.phone}','EMAIL;TYPE=INTERNET:${data.email}','URL:${fullUrl}','END:VCARD'].join('\\n');
      var blob = new Blob([lines], { type: 'text/vcard;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '${data.slug || 'contact'}.vcf';
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
      var lines = ['BEGIN:VCARD','VERSION:3.0','FN:${data.name}','ORG:${data.company}','TITLE:${data.title}','TEL;TYPE=CELL,VOICE:${data.phone}','EMAIL;TYPE=INTERNET:${data.email}','URL:${fullUrl}','END:VCARD'].join('\\n');
      var blob = new Blob([lines], { type: 'text/vcard;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '${data.slug || 'contact'}.vcf';
      document.body.appendChild(a);
      a.click();
      setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    }
  </script>
</body>
</html>`;
  }
}

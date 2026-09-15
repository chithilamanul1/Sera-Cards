export interface TemplateData {
  slug: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  avatarUrl: string;
  bio: string;
  location: string;
  website: string;
  googleReviewUrl?: string;
  lankaQrText?: string;
  instagram?: string;
  linkedin?: string;
}

export const TEMPLATE_PRESETS = [
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
  {
    id: 'creative',
    name: 'Creative / Agency',
    badge: 'Showcase & Socials',
    description: 'Gradient hero with pill social links, service highlights, portfolio, and contact exchange.',
  },
  {
    id: 'vcardonly',
    name: 'Quick Contact',
    badge: 'Simple vCard-First',
    description: 'Ultra-fast single-screen card. Immediately shows Save Contact button + 3 action buttons. Best for service professionals.',
  },
];

// ─── Shared script blocks injected into every template ───────────────────────

function buildLeadCaptureScript(slug: string, name: string): string {
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
      body: JSON.stringify({ slug: '${slug}', name: name, phone: phone, notes: notes })
    });
    var data = await res.json();
    if (res.ok && data.success) {
      document.getElementById('leadForm').innerHTML =
        '<div style="text-align:center;padding:2rem 0;">' +
        '<p style="font-size:2rem;margin:0 0 0.5rem 0;">✓</p>' +
        '<p style="font-weight:700;color:#10b981;font-size:1.05rem;">Contact Shared!</p>' +
        '<p style="font-size:0.8rem;color:#94a3b8;margin-top:0.4rem;">${name.split(' ')[0]} will be in touch soon.</p>' +
        (data.ownerNotifyUrl ? '<a href="' + data.ownerNotifyUrl + '" target="_blank" style="display:inline-block;margin-top:1.25rem;padding:0.6rem 1.2rem;background:#25d366;color:#fff;border-radius:999px;font-size:0.8rem;font-weight:600;text-decoration:none;">📲 Notify ${name.split(' ')[0]} on WhatsApp</a>' : '') +
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

function buildVcardScript(data: TemplateData, fullUrl: string): string {
  return `
function downloadVCard() {
  var lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:${data.name}',
    'N:${data.name.split(' ').slice(1).join(' ')};${data.name.split(' ')[0]};;;',
    'ORG:${data.company}',
    'TITLE:${data.title}',
    'TEL;TYPE=CELL,VOICE:${data.phone}',
    'EMAIL;TYPE=INTERNET:${data.email}',
    'URL:${fullUrl}',
    ${data.location ? `'ADR;TYPE=WORK:;;${data.location};;;;',` : ''}
    'END:VCARD'
  ].join('\\n');
  var blob = new Blob([lines], { type: 'text/vcard;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = '${data.slug || 'contact'}.vcf';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
}`.trim();
}

// ─── Template Generators ─────────────────────────────────────────────────────

export function generateTemplateHtml(presetId: string, data: TemplateData): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'serenex.lk';
  const fullUrl = `https://${data.slug || 'yourname'}.${rootDomain}`;
  const leadScript  = buildLeadCaptureScript(data.slug, data.name);
  const vcardScript = buildVcardScript(data, fullUrl);
  const waNumber = data.whatsapp.replace(/[^0-9]/g, '');

  // ── LEAD MODAL (shared across all templates) ────────────────────────────
  const leadModal = `
<div id="leadModal" style="position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:flex-end;justify-content:center;z-index:9999;backdrop-filter:blur(4px);" onclick="if(event.target===this)toggleLeadModal(false)">
  <div style="width:100%;max-width:430px;background:#111116;border-top-left-radius:24px;border-top-right-radius:24px;border:1px solid rgba(255,255,255,0.1);padding:1.75rem;text-align:left;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
      <h3 style="margin:0;font-size:1.1rem;font-weight:700;color:#fff;">Connect with ${data.name.split(' ')[0]}</h3>
      <button onclick="toggleLeadModal(false)" style="background:none;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;line-height:1;">&times;</button>
    </div>
    <form id="leadForm" onsubmit="submitLead(event)">
      <input type="text" id="leadName" placeholder="Your Full Name" required style="width:100%;padding:0.85rem;border-radius:12px;background:#050506;border:1px solid rgba(255,255,255,0.12);color:#fff;margin-bottom:0.75rem;font-size:0.9rem;box-sizing:border-box;" />
      <input type="tel" id="leadPhone" placeholder="Your Phone / WhatsApp Number" required style="width:100%;padding:0.85rem;border-radius:12px;background:#050506;border:1px solid rgba(255,255,255,0.12);color:#fff;margin-bottom:0.75rem;font-size:0.9rem;box-sizing:border-box;" />
      <input type="text" id="leadNotes" placeholder="Company / Short Note (optional)" style="width:100%;padding:0.85rem;border-radius:12px;background:#050506;border:1px solid rgba(255,255,255,0.12);color:#fff;margin-bottom:1rem;font-size:0.9rem;box-sizing:border-box;" />
      <button type="submit" id="leadSubmitBtn" style="width:100%;padding:0.9rem;background:#c9a24a;color:#0a0a0c;border:none;border-radius:14px;font-size:0.95rem;font-weight:700;cursor:pointer;">Share My Contact</button>
    </form>
  </div>
</div>`.trim();

  // ════════════════════════════════════════════════════════════════
  // PRESET 1 — Executive Lux
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
    .btn-gold:hover{opacity:.9;transform:scale(.99)}
    .btn-outline{background:rgba(255,255,255,.03);color:#fff;border:1px solid rgba(255,255,255,.1)}
    .btn-outline:hover{background:rgba(255,255,255,.07)}
    .btn-green{background:#128c7e;color:#fff}
    .btn-green:hover{background:#0d7a6e}
    .btn-review{background:rgba(251,188,5,.12);color:#fbbc05;border:1px solid rgba(251,188,5,.3)}
    .btn-review:hover{background:rgba(251,188,5,.2)}
    .footer{margin-top:2rem;font-size:.72rem;color:rgba(255,255,255,.3)}
    .footer a{color:#c9a24a;text-decoration:none}
  </style>
</head>
<body>
  <div class="card">
    <div class="gold-ring">
      <img src="${data.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop'}" alt="${data.name}" class="avatar" onerror="this.style.background='#1a1a1f';this.style.borderRadius='50%'">
    </div>
    <h1 class="name">${data.name}</h1>
    <p class="title">${data.title}</p>
    <p class="company">${data.company}</p>
    ${data.location ? `<p class="location">📍 ${data.location}</p>` : ''}
    ${data.bio ? `<p class="bio">${data.bio}</p>` : ''}

    <div class="quick-row">
      <a href="tel:${data.phone}">📞 Call</a>
      <a href="https://wa.me/${waNumber}" target="_blank" rel="noreferrer">💬 WhatsApp</a>
      <a href="mailto:${data.email}">✉️ Email</a>
    </div>

    <div class="actions">
      <button onclick="downloadVCard()" class="btn btn-gold">💾 Save Contact to Phone</button>
      <button onclick="toggleLeadModal(true)" class="btn btn-outline">🤝 Exchange Details</button>
      ${data.googleReviewUrl ? `<a href="${data.googleReviewUrl}" target="_blank" rel="noreferrer" class="btn btn-review">⭐ Leave a Google Review</a>` : ''}
      ${data.website ? `<a href="${data.website}" target="_blank" rel="noreferrer" class="btn btn-outline">🌐 Visit Website</a>` : ''}
    </div>

    ${data.lankaQrText ? `
    <div style="margin-top:1.5rem;background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.1);border-radius:16px;padding:1rem;text-align:center;">
      <p style="font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:#c9a24a;font-weight:700;margin-bottom:.5rem;">💳 Payment Details</p>
      <p style="font-size:.82rem;color:rgba(255,255,255,.6);line-height:1.5;word-break:break-word;">${data.lankaQrText}</p>
    </div>` : ''}

    <p class="footer">Sera Cards · <a href="https://${rootDomain}" target="_blank">${rootDomain}</a></p>
  </div>

  ${leadModal}

  <script>
    ${leadScript}
    ${vcardScript}
  </script>
</body>
</html>`;
  }

  // ════════════════════════════════════════════════════════════════
  // PRESET 2 — Minimalist Pro
  // ════════════════════════════════════════════════════════════════
  if (presetId === 'minimalist') {
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
    .name{font-size:1.45rem;font-weight:700;letter-spacing:-.02em;margin-bottom:.25rem;text-align:center}
    .title{font-size:.8rem;color:#10b981;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.25rem;text-align:center}
    .company{font-size:.875rem;color:rgba(255,255,255,.55);margin-bottom:1.5rem;text-align:center}
    .bio{font-size:.875rem;color:rgba(255,255,255,.6);line-height:1.5;text-align:center;margin-bottom:1.5rem;padding:0 .5rem}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;width:100%;margin-bottom:1rem}
    .btn{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.9rem;border-radius:14px;text-decoration:none;font-size:.875rem;font-weight:600;cursor:pointer;border:none;transition:all .2s;text-align:center}
    .btn-em{background:#10b981;color:#000}
    .btn-em:hover{background:#0ea572}
    .btn-ghost{background:rgba(255,255,255,.05);color:#f8fafc;border:1px solid rgba(255,255,255,.1)}
    .btn-ghost:hover{background:rgba(255,255,255,.1)}
    .btn-wa{background:#25d366;color:#fff}
    .btn-wa:hover{background:#1ebe5d}
    .btn-review{background:rgba(251,188,5,.12);color:#fbbc05;border:1px solid rgba(251,188,5,.3)}
    .btn-full{width:100%;grid-column:1/-1}
    .payment{width:100%;background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.1);border-radius:16px;padding:1rem;margin-top:.5rem;text-align:center}
    .pay-title{font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:#10b981;font-weight:700;margin-bottom:.5rem}
    .pay-text{font-size:.82rem;color:rgba(255,255,255,.6);line-height:1.4;word-break:break-word}
    .footer{margin-top:1.5rem;font-size:.7rem;color:rgba(255,255,255,.3);text-align:center}
    .footer a{color:#10b981;text-decoration:none}
  </style>
</head>
<body>
  <div class="card">
    <img src="${data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'}" alt="${data.name}" class="avatar" onerror="this.style.background='#1a1f2e'">
    <h1 class="name">${data.name}</h1>
    <p class="title">${data.title}</p>
    <p class="company">${data.company}${data.location ? ` · ${data.location}` : ''}</p>
    ${data.bio ? `<p class="bio">${data.bio}</p>` : ''}

    <div class="grid">
      <a href="tel:${data.phone}" class="btn btn-ghost">📞 Call</a>
      <a href="https://wa.me/${waNumber}" target="_blank" rel="noreferrer" class="btn btn-wa">💬 WhatsApp</a>
      <a href="mailto:${data.email}" class="btn btn-ghost">✉️ Email</a>
      <button onclick="downloadVCard()" class="btn btn-em">💾 Save vCard</button>
      <button onclick="toggleLeadModal(true)" class="btn btn-ghost btn-full">🤝 Exchange Contact Details</button>
      ${data.googleReviewUrl ? `<a href="${data.googleReviewUrl}" target="_blank" rel="noreferrer" class="btn btn-review btn-full">⭐ Leave Us a Google Review</a>` : ''}
      ${data.website ? `<a href="${data.website}" target="_blank" rel="noreferrer" class="btn btn-ghost btn-full">🌐 Visit Website</a>` : ''}
    </div>

    ${data.lankaQrText ? `
    <div class="payment">
      <p class="pay-title">💳 LankaQR & Payment Details</p>
      <p class="pay-text">${data.lankaQrText}</p>
    </div>` : ''}

    <p class="footer">Sera Cards · <a href="https://${rootDomain}" target="_blank">${rootDomain}</a></p>
  </div>

  ${leadModal}

  <script>
    ${leadScript}
    ${vcardScript}
  </script>
</body>
</html>`;
  }

  // ════════════════════════════════════════════════════════════════
  // PRESET 3 — Creative / Agency
  // ════════════════════════════════════════════════════════════════
  if (presetId === 'creative') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${data.name} | Creative Profile</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#07090e;color:#f1f5f9;display:flex;justify-content:center;padding:1.5rem 1rem;min-height:100vh}
    .wrap{width:100%;max-width:430px}
    .hero{position:relative;border-radius:24px;overflow:hidden;background:linear-gradient(135deg,#1e1b4b,#312e81);padding:2.5rem 1.5rem 1.5rem;text-align:center;border:1px solid rgba(255,255,255,.1);margin-bottom:1rem}
    .avatar{width:96px;height:96px;border-radius:20px;object-fit:cover;border:3px solid #818cf8;margin-bottom:1rem;box-shadow:0 10px 25px rgba(0,0,0,.3)}
    .name{font-size:1.6rem;font-weight:800;letter-spacing:-.02em;margin-bottom:.35rem}
    .tag{display:inline-block;padding:.3rem .8rem;background:rgba(129,140,248,.2);color:#c7d2fe;border-radius:999px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:1rem}
    .bio{font-size:.875rem;color:#cbd5e1;line-height:1.5}
    .pills{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;margin:1.25rem 0}
    .pill{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#e2e8f0;padding:.5rem .9rem;border-radius:999px;font-size:.8rem;text-decoration:none;font-weight:500;transition:all .2s}
    .pill:hover{background:rgba(255,255,255,.15)}
    .sec-title{font-size:.7rem;text-transform:uppercase;letter-spacing:.14em;color:#94a3b8;font-weight:700;margin:1.5rem 0 .75rem}
    .action-row{display:flex;flex-direction:column;gap:.65rem;margin-bottom:1rem}
    .btn{display:flex;align-items:center;justify-content:center;gap:.65rem;padding:.9rem 1rem;border-radius:14px;font-size:.875rem;font-weight:600;text-decoration:none;cursor:pointer;border:none;transition:all .2s;text-align:center;width:100%}
    .btn-indigo{background:#6366f1;color:#fff}
    .btn-indigo:hover{background:#4f46e5}
    .btn-ghost{background:#111420;color:#e2e8f0;border:1px solid rgba(255,255,255,.08)}
    .btn-ghost:hover{background:#1a1f35}
    .btn-review{background:rgba(251,188,5,.12);color:#fbbc05;border:1px solid rgba(251,188,5,.3)}
    .footer{text-align:center;margin-top:2rem;font-size:.72rem;color:#475569}
    .footer a{color:#818cf8;text-decoration:none}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <img src="${data.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'}" alt="${data.name}" class="avatar" onerror="this.style.background='#312e81'">
      <h1 class="name">${data.name}</h1>
      <span class="tag">${data.title} · ${data.company}</span>
      ${data.bio ? `<p class="bio">${data.bio}</p>` : ''}
    </div>

    <div class="pills">
      <a href="tel:${data.phone}" class="pill">📞 Call</a>
      <a href="https://wa.me/${waNumber}" target="_blank" rel="noreferrer" class="pill">💬 WhatsApp</a>
      <a href="mailto:${data.email}" class="pill">✉️ Email</a>
      ${data.website ? `<a href="${data.website}" target="_blank" rel="noreferrer" class="pill">🌐 Website</a>` : ''}
      ${data.instagram ? `<a href="${data.instagram}" target="_blank" rel="noreferrer" class="pill">📸 Instagram</a>` : ''}
      ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" rel="noreferrer" class="pill">💼 LinkedIn</a>` : ''}
    </div>

    <p class="sec-title">Quick Actions</p>
    <div class="action-row">
      <button onclick="downloadVCard()" class="btn btn-indigo">💾 Save to Contacts (1-tap)</button>
      <button onclick="toggleLeadModal(true)" class="btn btn-ghost">🤝 Share Your Contact With Me</button>
      ${data.googleReviewUrl ? `<a href="${data.googleReviewUrl}" target="_blank" rel="noreferrer" class="btn btn-review">⭐ Leave Us a Google Review</a>` : ''}
    </div>

    ${data.lankaQrText ? `
    <div style="background:#111420;border:1px dashed rgba(255,255,255,.1);border-radius:16px;padding:1rem;text-align:center;margin-top:.5rem;">
      <p style="font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:#818cf8;font-weight:700;margin-bottom:.5rem;">💳 Payment Details</p>
      <p style="font-size:.82rem;color:#94a3b8;line-height:1.4;word-break:break-word;">${data.lankaQrText}</p>
    </div>` : ''}

    <p class="footer">Sera Cards · <a href="https://${rootDomain}" target="_blank">${rootDomain}</a></p>
  </div>

  ${leadModal}

  <script>
    ${leadScript}
    ${vcardScript}
  </script>
</body>
</html>`;
  }

  // ════════════════════════════════════════════════════════════════
  // PRESET 4 — Quick Contact (vCard-First, ultra-fast)
  // ════════════════════════════════════════════════════════════════
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${data.name}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0a0a0f;color:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
    .card{width:100%;max-width:380px;text-align:center}
    .avatar{width:88px;height:88px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.15);margin:0 auto 1rem;display:block}
    .name{font-size:1.5rem;font-weight:700;margin-bottom:.25rem}
    .meta{font-size:.85rem;color:rgba(255,255,255,.5);margin-bottom:2rem;line-height:1.5}
    .save-btn{display:flex;align-items:center;justify-content:center;gap:.75rem;width:100%;padding:1.1rem;background:#fff;color:#0a0a0f;border:none;border-radius:16px;font-size:1rem;font-weight:700;cursor:pointer;margin-bottom:1rem;transition:all .2s}
    .save-btn:hover{background:#f1f5f9;transform:scale(.99)}
    .actions{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;margin-bottom:.75rem}
    .a-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3rem;padding:.85rem .5rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:14px;color:#fff;text-decoration:none;font-size:.72rem;font-weight:600;transition:background .2s;cursor:pointer;border:none}
    .a-btn:hover{background:rgba(255,255,255,.1)}
    .a-btn span{font-size:1.3rem}
    .exchange-btn{width:100%;padding:.85rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:14px;color:rgba(255,255,255,.7);font-size:.875rem;font-weight:600;cursor:pointer;margin-bottom:.6rem;transition:background .2s}
    .exchange-btn:hover{background:rgba(255,255,255,.1)}
    ${data.googleReviewUrl ? `.review-btn{display:block;width:100%;padding:.85rem;background:rgba(251,188,5,.1);border:1px solid rgba(251,188,5,.25);border-radius:14px;color:#fbbc05;font-size:.875rem;font-weight:600;cursor:pointer;text-decoration:none;text-align:center;margin-bottom:.6rem;transition:background .2s}
    .review-btn:hover{background:rgba(251,188,5,.18)}` : ''}
    .footer{margin-top:1.5rem;font-size:.7rem;color:rgba(255,255,255,.25)}
    .footer a{color:rgba(255,255,255,.4);text-decoration:none}
  </style>
</head>
<body>
  <div class="card">
    <img src="${data.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'}" alt="${data.name}" class="avatar" onerror="this.style.background='#1f2937'">
    <h1 class="name">${data.name}</h1>
    <p class="meta">${data.title}<br>${data.company}${data.location ? ` · ${data.location}` : ''}</p>

    <button onclick="downloadVCard()" class="save-btn">
      <span style="font-size:1.25rem;">💾</span> Save to Phone Contacts
    </button>

    <div class="actions">
      <a href="tel:${data.phone}" class="a-btn"><span>📞</span>Call</a>
      <a href="https://wa.me/${waNumber}" target="_blank" rel="noreferrer" class="a-btn"><span>💬</span>WhatsApp</a>
      <a href="mailto:${data.email}" class="a-btn"><span>✉️</span>Email</a>
    </div>

    <button onclick="toggleLeadModal(true)" class="exchange-btn">🤝 Share Your Contact</button>
    ${data.googleReviewUrl ? `<a href="${data.googleReviewUrl}" target="_blank" rel="noreferrer" class="review-btn">⭐ Leave a Google Review</a>` : ''}
    ${data.website ? `<a href="${data.website}" target="_blank" rel="noreferrer" style="display:block;width:100%;padding:.7rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;color:rgba(255,255,255,.6);font-size:.85rem;text-decoration:none;text-align:center;">🌐 ${data.website.replace(/https?:\/\//,'')}</a>` : ''}

    <p class="footer">Sera Cards · <a href="https://${rootDomain}" target="_blank">${rootDomain}</a></p>
  </div>

  ${leadModal}

  <script>
    ${leadScript}
    ${vcardScript}
  </script>
</body>
</html>`;
}

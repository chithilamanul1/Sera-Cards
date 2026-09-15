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
  lankaQrText?: string;
  instagram?: string;
  linkedin?: string;
}

export const TEMPLATE_PRESETS = [
  {
    id: 'executive',
    name: 'Executive Lux',
    badge: 'Luxury & Corporate',
    description: 'Ultra dark luxury aesthetic with gold accents, floating quick-actions, bio sheet, vCard generation, and slide-up lead capture.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist Pro',
    badge: 'Direct Action & Payments',
    description: 'Clean modern grid with instant Call, WhatsApp, Email, direct vCard download, and integrated LankaQR payment block.',
  },
  {
    id: 'creative',
    name: 'Creative / Agency',
    badge: 'Showcase & Socials',
    description: 'Vibrant hero cover with pill social links, services showcase, portfolio showcase, and instant lead exchange.',
  },
];

export function generateTemplateHtml(presetId: string, data: TemplateData): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'serenex.lk';
  const fullDomainUrl = `https://${data.slug}.${rootDomain}`;

  // Common Lead Capture Script for all templates
  const leadCaptureScript = `
    async function submitLead(e) {
      e.preventDefault();
      const btn = document.getElementById('leadSubmitBtn');
      const name = document.getElementById('leadName').value.trim();
      const phone = document.getElementById('leadPhone').value.trim();
      const notes = document.getElementById('leadNotes') ? document.getElementById('leadNotes').value.trim() : '';
      if (!name || !phone) return;
      btn.innerText = 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: '${data.slug}', name, phone, notes })
        });
        if (res.ok) {
          document.getElementById('leadForm').innerHTML = '<div style="text-align:center;padding:1.5rem 0;color:#10b981;font-weight:600;"><p style="font-size:1.5rem;margin:0 0 0.5rem 0;">✓</p>Contact shared successfully!<br><span style="font-size:0.8rem;color:#94a3b8;font-weight:normal;">${data.name} will be in touch soon.</span></div>';
        } else {
          btn.innerText = 'Try Again';
          btn.disabled = false;
        }
      } catch (err) {
        btn.innerText = 'Try Again';
        btn.disabled = false;
      }
    }
    function toggleLeadModal(show) {
      const modal = document.getElementById('leadModal');
      if (modal) modal.style.display = show ? 'flex' : 'none';
    }
  `;

  // Common vCard Generator Script
  const vcardScript = `
    function downloadVCard() {
      const vcard = "BEGIN:VCARD\\nVERSION:3.0\\n" +
        "FN:${data.name}\\n" +
        "ORG:${data.company}\\n" +
        "TITLE:${data.title}\\n" +
        "TEL;TYPE=CELL,VOICE:${data.phone}\\n" +
        "EMAIL;TYPE=INTERNET:${data.email}\\n" +
        "URL:${fullDomainUrl}\\n" +
        "END:VCARD";
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "${data.slug || 'contact'}.vcf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  `;

  if (presetId === 'minimalist') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} — Digital Business Card</title>
  <style>
    :root {
      --bg: #090a0f;
      --card-bg: #12141c;
      --accent: #10b981;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --border: rgba(255,255,255,0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); display: flex; justify-content: center; min-height: 100vh; padding: 1rem; }
    .card-wrap { width: 100%; max-width: 420px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 28px; padding: 2rem 1.5rem; display: flex; flex-direction: column; align-items: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); position: relative; }
    .avatar { width: 104px; height: 104px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent); margin-bottom: 1rem; }
    .name { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.25rem; text-align: center; }
    .title { font-size: 0.875rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem; text-align: center; }
    .company { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.25rem; text-align: center; }
    .bio { font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; text-align: center; margin-bottom: 1.5rem; padding: 0 0.5rem; }
    
    .action-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; width: 100%; margin-bottom: 1.25rem; }
    .btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.85rem; border-radius: 14px; text-decoration: none; font-size: 0.875rem; font-weight: 600; transition: all 0.2s; border: none; cursor: pointer; }
    .btn-primary { background: var(--accent); color: #000; width: 100%; }
    .btn-secondary { background: rgba(255,255,255,0.05); color: var(--text); border: 1px solid var(--border); }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); }
    
    .lanka-card { width: 100%; background: rgba(255,255,255,0.03); border: 1px dashed var(--border); border-radius: 16px; padding: 1rem; margin-top: 1rem; text-align: center; }
    .lanka-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); margin-bottom: 0.5rem; font-weight: 700; }
    .lanka-text { font-size: 0.825rem; color: var(--text-muted); line-height: 1.4; word-break: break-all; }

    /* Lead Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: none; align-items: flex-end; justify-content: center; z-index: 100; }
    .modal-box { width: 100%; max-width: 420px; background: #161822; border-top-left-radius: 24px; border-top-right-radius: 24px; border: 1px solid var(--border); padding: 1.5rem; box-shadow: 0 -10px 30px rgba(0,0,0,0.5); }
    .modal-box input { width: 100%; padding: 0.75rem; border-radius: 10px; background: #090a0f; border: 1px solid var(--border); color: #fff; margin-bottom: 0.75rem; font-size: 0.9rem; }
    .powered { margin-top: 1.5rem; font-size: 0.7rem; color: rgba(255,255,255,0.3); text-align: center; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card-wrap">
    <img src="${data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'}" alt="${data.name}" class="avatar">
    <h1 class="name">${data.name}</h1>
    <p class="title">${data.title}</p>
    <p class="company">${data.company}</p>
    ${data.bio ? `<p class="bio">${data.bio}</p>` : ''}

    <div class="action-grid">
      <a href="tel:${data.phone}" class="btn btn-secondary">📞 Call</a>
      <a href="https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-secondary">💬 WhatsApp</a>
      <a href="mailto:${data.email}" class="btn btn-secondary">✉️ Email</a>
      <button onclick="downloadVCard()" class="btn btn-secondary">💾 Save vCard</button>
    </div>

    <button onclick="toggleLeadModal(true)" class="btn btn-primary" style="margin-bottom: 0.5rem;">
      🤝 Exchange Contact Details
    </button>

    ${data.lankaQrText ? `
      <div class="lanka-card">
        <p class="lanka-title">💳 LankaQR & Bank Details</p>
        <p class="lanka-text">${data.lankaQrText}</p>
      </div>
    ` : ''}

    <a href="https://${rootDomain}" target="_blank" class="powered">⚡ Powered by Sera Cards · ${rootDomain}</a>
  </div>

  <!-- Slide-up Contact Exchange Modal -->
  <div id="leadModal" class="modal-overlay" onclick="if(event.target===this) toggleLeadModal(false)">
    <div class="modal-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h3 style="font-size:1.1rem;font-weight:700;">Connect with ${data.name}</h3>
        <button onclick="toggleLeadModal(false)" style="background:none;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;">&times;</button>
      </div>
      <form id="leadForm" onsubmit="submitLead(event)">
        <input type="text" id="leadName" placeholder="Your Name" required />
        <input type="tel" id="leadPhone" placeholder="Your WhatsApp / Phone" required />
        <input type="text" id="leadNotes" placeholder="Note or Company (Optional)" />
        <button type="submit" id="leadSubmitBtn" class="btn btn-primary">Send Contact</button>
      </form>
    </div>
  </div>

  <script>
    ${leadCaptureScript}
    ${vcardScript}
  </script>
</body>
</html>`;
  }

  if (presetId === 'creative') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} | Portfolio & Digital Card</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #07090e; color: #f1f5f9; display: flex; justify-content: center; padding: 1.5rem 1rem; min-height: 100vh; }
    .container { width: 100%; max-width: 430px; }
    .hero { position: relative; border-radius: 24px; overflow: hidden; background: linear-gradient(135deg, #1e1b4b, #312e81); padding: 2.5rem 1.5rem 1.5rem; text-align: center; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1rem; }
    .avatar { width: 96px; height: 96px; border-radius: 20px; object-fit: cover; border: 3px solid #818cf8; margin-bottom: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    .name { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.25rem; }
    .tag { display: inline-block; padding: 0.3rem 0.8rem; background: rgba(129, 140, 248, 0.2); color: #c7d2fe; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
    
    .social-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 1.25rem; }
    .pill { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; padding: 0.5rem 0.9rem; border-radius: 999px; font-size: 0.8rem; text-decoration: none; font-weight: 500; transition: all 0.2s; }
    .pill:hover { background: rgba(255,255,255,0.15); }
    
    .section-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; font-weight: 700; margin: 1.5rem 0 0.75rem; }
    .item-card { background: #111420; border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 1.2rem; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between; text-decoration: none; color: inherit; }
    .item-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(129, 140, 248, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #a5b4fc; }
    
    .btn-main { width: 100%; padding: 1rem; background: #6366f1; color: #fff; border-radius: 16px; font-weight: 700; text-align: center; border: none; cursor: pointer; font-size: 0.95rem; margin-top: 0.5rem; transition: background 0.2s; }
    .btn-main:hover { background: #4f46e5; }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; padding: 1rem; z-index: 100; }
    .modal-box { width: 100%; max-width: 380px; background: #151824; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; }
    .modal-box input { width: 100%; padding: 0.8rem; border-radius: 10px; background: #0b0d14; border: 1px solid rgba(255,255,255,0.1); color: #fff; margin-bottom: 0.75rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <img src="${data.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'}" alt="${data.name}" class="avatar">
      <h1 class="name">${data.name}</h1>
      <span class="tag">${data.title} · ${data.company}</span>
      ${data.bio ? `<p style="font-size:0.875rem;color:#cbd5e1;line-height:1.5;">${data.bio}</p>` : ''}
    </div>

    <div class="social-pills">
      <a href="tel:${data.phone}" class="pill">📞 Phone</a>
      <a href="https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="pill">💬 WhatsApp</a>
      <a href="mailto:${data.email}" class="pill">✉️ Email</a>
      ${data.website ? `<a href="${data.website}" target="_blank" class="pill">🌐 Website</a>` : ''}
    </div>

    <p class="section-title">Quick Actions</p>
    <button onclick="downloadVCard()" class="item-card" style="width:100%;cursor:pointer;border:1px solid rgba(255,255,255,0.1);">
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <div class="item-icon">📇</div>
        <div style="text-align:left;">
          <h4 style="font-size:0.95rem;font-weight:600;">Save to Contacts</h4>
          <p style="font-size:0.75rem;color:#94a3b8;">1-tap direct address book (.vcf)</p>
        </div>
      </div>
      <span style="font-size:1.2rem;color:#a5b4fc;">&rarr;</span>
    </button>

    <button onclick="toggleLeadModal(true)" class="btn-main">🤝 Share Your Contact With Me</button>

    <p style="text-align:center;margin-top:2rem;font-size:0.75rem;color:#64748b;">
      Sera Cards Powered · <a href="https://${rootDomain}" style="color:#818cf8;text-decoration:none;">${rootDomain}</a>
    </p>
  </div>

  <div id="leadModal" class="modal-overlay" onclick="if(event.target===this) toggleLeadModal(false)">
    <div class="modal-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h3 style="font-size:1.1rem;font-weight:700;">Exchange Details</h3>
        <button onclick="toggleLeadModal(false)" style="background:none;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;">&times;</button>
      </div>
      <form id="leadForm" onsubmit="submitLead(event)">
        <input type="text" id="leadName" placeholder="Your Name" required />
        <input type="tel" id="leadPhone" placeholder="Your Phone Number" required />
        <input type="text" id="leadNotes" placeholder="Company / Short Note" />
        <button type="submit" id="leadSubmitBtn" class="btn-main">Send Info</button>
      </form>
    </div>
  </div>

  <script>
    ${leadCaptureScript}
    ${vcardScript}
  </script>
</body>
</html>`;
  }

  // Default: Executive Lux
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} — ${data.company}</title>
  <style>
    :root {
      --bg: #050506;
      --surface: #0e0e12;
      --gold: #c9a24a;
      --gold-light: #e0c274;
      --text: #ffffff;
      --muted: rgba(255,255,255,0.6);
      --border: rgba(201,162,74,0.25);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); display: flex; justify-content: center; min-height: 100vh; padding: 1.5rem 1rem; }
    .card { width: 100%; max-width: 420px; background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 2.5rem 1.75rem; text-align: center; box-shadow: 0 30px 60px rgba(0,0,0,0.8); position: relative; }
    .gold-ring { width: 108px; height: 108px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, var(--gold), transparent, var(--gold-light)); margin: 0 auto 1.25rem; }
    .avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #16161b; }
    .name { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.35rem; color: #fff; }
    .title { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--gold); margin-bottom: 0.35rem; font-weight: 600; }
    .company { font-size: 0.9rem; color: var(--muted); margin-bottom: 1.5rem; }
    .bio { font-size: 0.875rem; color: var(--muted); line-height: 1.6; margin-bottom: 2rem; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 1rem 0; }
    
    .actions { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
    .btn { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.95rem; border-radius: 14px; font-size: 0.9rem; font-weight: 600; text-decoration: none; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-gold { background: linear-gradient(135deg, var(--gold), #a8832f); color: #0a0a0c; font-weight: 700; }
    .btn-gold:hover { opacity: 0.95; transform: scale(0.99); }
    .btn-outline { background: rgba(255,255,255,0.03); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
    .btn-outline:hover { background: rgba(255,255,255,0.07); }

    .quick-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.75rem; }
    .quick-row a { padding: 0.75rem 0.25rem; font-size: 0.8rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #fff; text-decoration: none; text-align: center; }

    /* Lead Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: none; align-items: flex-end; justify-content: center; z-index: 100; }
    .modal-box { width: 100%; max-width: 420px; background: #111116; border-top-left-radius: 28px; border-top-right-radius: 28px; border: 1px solid var(--border); padding: 1.75rem; text-align: left; }
    .modal-box input { width: 100%; padding: 0.85rem; border-radius: 12px; background: #050506; border: 1px solid rgba(255,255,255,0.1); color: #fff; margin-bottom: 0.75rem; font-size: 0.9rem; }
    .footer { margin-top: 2rem; font-size: 0.72rem; color: rgba(255,255,255,0.3); }
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
    ${data.bio ? `<p class="bio">${data.bio}</p>` : ''}

    <div class="quick-row">
      <a href="tel:${data.phone}">📞 Call</a>
      <a href="https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}" target="_blank">💬 WhatsApp</a>
      <a href="mailto:${data.email}">✉️ Email</a>
    </div>

    <div class="actions">
      <button onclick="downloadVCard()" class="btn btn-gold">
        💾 Save Contact to Address Book
      </button>
      <button onclick="toggleLeadModal(true)" class="btn btn-outline">
        🤝 Exchange Details with ${data.name.split(' ')[0]}
      </button>
    </div>

    <p class="footer">
      Sera Cards · Smart NFC Profile · <a href="https://${rootDomain}" style="color:var(--gold);text-decoration:none;">${rootDomain}</a>
    </p>
  </div>

  <div id="leadModal" class="modal-overlay" onclick="if(event.target===this) toggleLeadModal(false)">
    <div class="modal-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
        <h3 style="font-size:1.15rem;font-weight:700;color:var(--gold);">Connect with ${data.name}</h3>
        <button onclick="toggleLeadModal(false)" style="background:none;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;">&times;</button>
      </div>
      <form id="leadForm" onsubmit="submitLead(event)">
        <input type="text" id="leadName" placeholder="Your Full Name" required />
        <input type="tel" id="leadPhone" placeholder="Your Phone or WhatsApp Number" required />
        <input type="text" id="leadNotes" placeholder="Your Designation / Company (Optional)" />
        <button type="submit" id="leadSubmitBtn" class="btn btn-gold" style="width:100%;">Share My Contact</button>
      </form>
    </div>
  </div>

  <script>
    ${leadCaptureScript}
    ${vcardScript}
  </script>
</body>
</html>`;
}

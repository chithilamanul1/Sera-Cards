import { saveEmailLog } from '@/lib/mailStore';

/**
 * GoSera Unified Mailing Engine
 * - Zero external dependencies (uses native fetch)
 * - Directly integrates with Resend API (https://api.resend.com/emails)
 * - Fallback to Brevo/Sendinblue API if configured
 * - Audit logging with mailStore for admin visibility
 */

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  type?: 'ACTIVATION' | 'ORDER' | 'PROVISION' | 'LEAD' | 'TEST';
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
  type = 'TEST',
}: SendEmailParams): Promise<{ success: boolean; data?: any; simulated?: boolean; error?: string }> {
  const toStr = Array.isArray(to) ? to.join(', ') : to;
  const apiKey = process.env.RESEND_API_KEY;
  const isResendConfigured = apiKey && apiKey.startsWith('re_') && !apiKey.includes('your_api_key');
  const sender = from || process.env.RESEND_FROM_EMAIL || 'Sera Cards <info@seranex.lk>';
  const preview = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);

  // 1. If Resend API Key is valid, dispatch via Resend REST API
  if (isResendConfigured) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: sender,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('[Resend Delivery Error]', data);
        saveEmailLog({
          id: `mail_${Date.now()}_err`,
          to: toStr,
          subject,
          type,
          status: 'FAILED',
          error: data?.message || 'Failed to dispatch via Resend API',
          preview,
          html,
          timestamp: new Date().toISOString(),
        });
        return { success: false, error: data?.message || 'Resend API dispatch failed' };
      }

      saveEmailLog({
        id: data?.id || `mail_${Date.now()}`,
        to: toStr,
        subject,
        type,
        status: 'SENT',
        preview,
        html,
        timestamp: new Date().toISOString(),
      });

      console.log(`[Mail Delivered via Resend] To: ${toStr} | Subject: ${subject}`);
      return { success: true, data };
    } catch (error: any) {
      console.error('[Resend Network Exception]', error);
      saveEmailLog({
        id: `mail_${Date.now()}_net_err`,
        to: toStr,
        subject,
        type,
        status: 'FAILED',
        error: error?.message || 'Network error communicating with Resend',
        preview,
        html,
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error?.message || 'Network error' };
    }
  }

  // 2. Check Brevo / Sendinblue fallback API
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey && !brevoApiKey.includes('your_')) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify({
          sender: { name: 'Sera Cards', email: 'info@seranex.lk' },
          to: (Array.isArray(to) ? to : [to]).map((e) => ({ email: e })),
          subject,
          htmlContent: html,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        saveEmailLog({
          id: data?.messageId || `mail_brevo_${Date.now()}`,
          to: toStr,
          subject,
          type,
          status: 'SENT',
          preview,
          html,
          timestamp: new Date().toISOString(),
        });
        return { success: true, data };
      }
    } catch (bErr) {
      console.warn('[Brevo Dispatch Warning]', bErr);
    }
  }

  // 3. Graceful fallback (Logged Simulation)
  // Ensures emails are logged and viewable in Admin dashboard even before production API keys are connected
  saveEmailLog({
    id: `mail_sim_${Date.now()}`,
    to: toStr,
    subject,
    type,
    status: 'SIMULATED',
    preview,
    html,
    timestamp: new Date().toISOString(),
  });

  console.log(`[Mail Logged (Simulated)] To: ${toStr} | Subject: ${subject} | Preview: ${preview}`);
  return { success: true, simulated: true };
}

/**
 * 1. Physical Card Activation Confirmation Email
 * Sent when a customer claims their card via /activate (e.g. SERA-7001)
 */
export async function sendCardActivationEmail({
  to,
  name,
  slug,
  code,
  phone,
}: {
  to: string;
  name: string;
  slug: string;
  code: string;
  phone?: string;
}) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  const profileUrl = `https://${slug}.${rootDomain}`;
  const directUrl = `https://${rootDomain}/c/${slug}`;
  const portalUrl = `https://${rootDomain}/dashboard`;
  const subject = `🎉 Your Physical Sera Card is Activated: ${slug}.${rootDomain}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #090a0f; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 36px 36px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); background: radial-gradient(circle at 50% 0%, rgba(168,85,247,0.15) 0%, transparent 70%);">
              <div style="display: inline-block; padding: 6px 16px; border-radius: 999px; background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.3); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #c084fc; margin-bottom: 16px;">
                ⚡ Hardware Activation Confirmed
              </div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
                SERA <span style="color: #a855f7;">CARDS</span>
              </h1>
              <p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8;">
                Smart NFC Business Networking Platform &middot; ${rootDomain}
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 36px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #ffffff;">
                Welcome, ${name}!
              </h2>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Your physical Sera NFC Card (<strong style="color: #fbbf24; font-family: monospace;">${code}</strong>) has been successfully activated and permanently linked to your digital identity.
              </p>

              <!-- Identity Details Card -->
              <div style="background-color: #0b0c10; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 22px; margin-bottom: 28px;">
                <p style="margin: 0 0 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #a855f7;">
                  Your Digital Identity Details
                </p>
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; color: #e2e8f0;">
                  <tr>
                    <td style="color: #64748b; width: 140px;">Live Subdomain:</td>
                    <td><a href="${profileUrl}" target="_blank" style="color: #38bdf8; font-weight: 600; text-decoration: none;">${slug}.${rootDomain} ↗</a></td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">Direct Card URL:</td>
                    <td><a href="${directUrl}" target="_blank" style="color: #fbbf24; font-weight: 600; text-decoration: none;">${directUrl} ↗</a></td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">Serial Code:</td>
                    <td style="font-family: monospace; font-weight: bold; color: #ffffff;">${code}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">Owner Email:</td>
                    <td style="color: #ffffff;">${to}</td>
                  </tr>
                  ${phone ? `<tr><td style="color: #64748b;">Linked Phone:</td><td style="color: #ffffff;">${phone}</td></tr>` : ''}
                </table>
              </div>

              <!-- Primary Action Buttons -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${profileUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); color: #ffffff; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 20px rgba(168,85,247,0.4); margin: 6px;">
                  View Live Profile ↗
                </a>
                <a href="${portalUrl}" target="_blank" style="display: inline-block; background-color: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #ffffff; font-weight: 600; font-size: 14px; padding: 14px 28px; border-radius: 12px; text-decoration: none; margin: 6px;">
                  Open Dashboard 📊
                </a>
              </div>

              <!-- NFC Instructions -->
              <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 10px; font-size: 13px; font-weight: 700; color: #f8fafc;">
                  📲 How to Tap Your Sera Card:
                </p>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #94a3b8;">
                  <li><strong>iPhone:</strong> Hold the card near the top edge near the camera. Instant notification appears — no app needed!</li>
                  <li><strong>Android:</strong> Tap the card near the center or upper back of the phone with NFC enabled.</li>
                  <li><strong>Dynamic QR:</strong> The QR code laser-etched on your card reverse opens the exact same profile on any camera.</li>
                  <li><strong>Remote Lock:</strong> If misplaced, freeze access anytime in your dashboard under Account & Security.</li>
                </ul>
              </div>

              <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin: 0;">
                Need help or custom card printing? Message our team directly on WhatsApp: 
                <a href="https://wa.me/94728382638" style="color: #22c55e; text-decoration: none; font-weight: 600;">+94 72 838 2638</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0b0c10; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                &copy; ${new Date().getFullYear()} Sera Cards by Seranex &middot; No. 20 A Amuna Rd, Seeduwa, Sri Lanka.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html, type: 'ACTIVATION' });
}

/**
 * 2. Account Provisioning Email
 * Sent when Admin provisions a dashboard login for a cardholder
 */
export async function sendAccountProvisionedEmail({
  to,
  name,
  email,
  password,
  slug,
  plan = 'PRO',
}: {
  to: string;
  name: string;
  email: string;
  password?: string;
  slug?: string;
  plan?: string;
}) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  const loginUrl = `https://${rootDomain}/login`;
  const profileUrl = slug ? `https://${slug}.${rootDomain}` : `https://${rootDomain}`;
  const subject = `🔐 Your Sera Cards Dashboard Credentials (${name})`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #090a0f; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden;">
          
          <tr>
            <td style="padding: 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <span style="font-size: 22px; font-weight: 800; color: #ffffff;">SERA <span style="color: #a855f7;">CARDS</span></span>
              <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">Cardholder Portal Access Provisioned</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; color: #ffffff;">Hello ${name},</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Your private dashboard account on Sera Cards has been created. You can now log in to review live NFC taps, update contact details, and manage card security.
              </p>

              <div style="background-color: #0b0c10; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #10b981;">
                  Your Login Credentials
                </p>
                <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #e2e8f0;">
                  <tr>
                    <td style="color: #64748b; width: 130px;">Login Portal:</td>
                    <td><a href="${loginUrl}" style="color: #38bdf8; text-decoration: none; font-weight: bold;">${loginUrl} ↗</a></td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">Username/Email:</td>
                    <td style="font-family: monospace; font-weight: bold; color: #ffffff;">${email}</td>
                  </tr>
                  ${password ? `<tr>
                    <td style="color: #64748b;">Temporary Password:</td>
                    <td style="font-family: monospace; font-weight: bold; color: #fbbf24;">${password}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="color: #64748b;">Plan Tier:</td>
                    <td><span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background: rgba(168,85,247,0.15); color: #c084fc; font-size: 12px; font-weight: bold;">${plan}</span></td>
                  </tr>
                  ${slug ? `<tr>
                    <td style="color: #64748b;">Assigned Card:</td>
                    <td><a href="${profileUrl}" style="color: #a855f7; text-decoration: none; font-weight: bold;">${slug}.${rootDomain}</a></td>
                  </tr>` : ''}
                </table>
              </div>

              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #04120c; font-weight: 700; font-size: 14px; padding: 13px 28px; border-radius: 10px; text-decoration: none;">
                  Log In to Dashboard &rarr;
                </a>
              </div>

              <p style="font-size: 12px; color: #64748b; margin: 0; text-align: center;">
                For security, please change your password upon your first login under Account & Security.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html, type: 'PROVISION' });
}

/**
 * 3. Customer Order Confirmation Email
 */
export async function sendOrderConfirmationEmail({
  to,
  name,
  orderNumber,
  totalAmount,
  finish,
  slug,
}: {
  to: string;
  name: string;
  orderNumber: string;
  totalAmount: number;
  finish: string;
  slug?: string;
}) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  const subject = `📦 Order Confirmed: GoSera Smart NFC Card #${orderNumber}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #090a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden;">
    <tr>
      <td style="padding: 32px;">
        <span style="font-size: 20px; font-weight: 800; color: #ffffff;">SERA <span style="color: #a855f7;">CARDS</span></span>
        <h2 style="font-size: 18px; margin: 20px 0 8px; color: #ffffff;">Thank you for your order, ${name}!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          We have received your order for the <strong>${finish}</strong> smart NFC card. Our production team is prepping your card.
        </p>

        <div style="background-color: #0b0c10; border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.06);">
          <p style="margin: 0 0 10px; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #a855f7;">Order Overview</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Order ID:</strong> <span style="font-family: monospace; color: #fbbf24;">${orderNumber}</span></p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Card Finish:</strong> ${finish}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Total Amount:</strong> LKR ${totalAmount.toLocaleString()}</p>
          ${slug ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Target Profile:</strong> https://${slug}.${rootDomain}</p>` : ''}
          <p style="margin: 4px 0; font-size: 14px;"><strong>Delivery:</strong> Free Island-Wide Delivery (3–5 Days)</p>
        </div>

        <p style="font-size: 13px; color: #64748b;">
          Our dispatch team will provide tracking updates via WhatsApp prior to handover to the courier.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html, type: 'ORDER' });
}

/**
 * 4. Lead Capture Alert Email
 */
export async function sendLeadNotificationEmail({
  to,
  cardOwnerName,
  leadName,
  leadPhone,
  notes,
}: {
  to: string;
  cardOwnerName: string;
  leadName: string;
  leadPhone: string;
  notes?: string | null;
}) {
  const subject = `🔔 New Lead Received from Your Digital Card: ${leadName}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 24px; background-color: #090a0f; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 28px;">
    <tr>
      <td>
        <span style="font-size: 16px; font-weight: bold; color: #c084fc;">⚡ Sera Cards Lead Alert</span>
        <h2 style="font-size: 18px; margin: 16px 0 8px; color: #fff;">New Prospect Captured!</h2>
        <p style="font-size: 14px; color: #cbd5e1;">Hi ${cardOwnerName}, a prospect just tapped your card and shared their details:</p>
        <div style="background-color: #0b0c10; border-radius: 10px; padding: 18px; margin: 16px 0; border: 1px solid rgba(255,255,255,0.06);">
          <p style="margin: 4px 0; font-size: 14px;"><strong>Prospect Name:</strong> ${leadName}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Mobile / WhatsApp:</strong> <a href="https://wa.me/${leadPhone.replace(/[^0-9]/g, '')}" style="color: #22c55e; font-weight: bold;">${leadPhone}</a></p>
          ${notes ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Note:</strong> ${notes}</p>` : ''}
        </div>
        <a href="https://wa.me/${leadPhone.replace(/[^0-9]/g, '')}" target="_blank" style="display: inline-block; background-color: #22c55e; color: #fff; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px;">
          💬 Reply on WhatsApp &rarr;
        </a>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html, type: 'LEAD' });
}

/**
 * 5. Diagnostic Test Email
 */
export async function sendTestEmail({ to }: { to: string }) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  const subject = '✅ Sera Cards Mail Delivery System Diagnostics';

  const html = `
<!DOCTYPE html>
<html>
<body style="background: #090a0f; color: #fff; font-family: sans-serif; padding: 30px;">
  <div style="max-width: 500px; margin: 0 auto; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; text-align: center;">
    <h2 style="color: #22c55e; margin-top: 0;">✓ Email System Operational</h2>
    <p style="color: #cbd5e1; font-size: 14px;">This diagnostic confirms that your Sera Cards mailing pipeline on ${rootDomain} is configured and dispatching properly.</p>
    <p style="font-size: 12px; color: #64748b;">Timestamp: ${new Date().toUTCString()}</p>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html, type: 'TEST' });
}

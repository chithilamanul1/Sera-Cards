/**
 * GoSera Mailing Service via Resend
 * Uses native fetch to connect directly to https://api.resend.com/emails
 * Zero external dependencies, ultra-fast and resilient.
 */

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailParams): Promise<{ success: boolean; data?: any; simulated?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = from || process.env.RESEND_FROM_EMAIL || 'GoSera <onboarding@resend.dev>';

  // Graceful fallback if API key is not yet set in environment
  if (!apiKey) {
    console.log('[Mailing System - Simulated Delivery]', {
      to,
      from: sender,
      subject,
      preview: html.substring(0, 150).replace(/<[^>]*>/g, '') + '...',
    });
    return { success: true, simulated: true };
  }

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
      console.error('[Resend Error]', data);
      return { success: false, error: data?.message || 'Failed to dispatch email via Resend' };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('[Resend Exception]', error);
    return { success: false, error: error?.message || 'Network error communicating with Resend' };
  }
}

/**
 * Sends customer welcome email matching the exact executive template
 */
export async function sendWelcomeEmail({
  to,
  name,
  email,
  slug,
}: {
  to: string;
  name: string;
  email: string;
  slug?: string;
}) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  const profileUrl = slug ? `https://${slug}.${rootDomain}` : `https://card.${rootDomain}`;
  const subject = 'Welcome to GoSera for Your Business All-in-One Solution';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <tr>
      <td style="padding: 36px 32px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.03em; color: #0f172a;">Go<span style="color: #10b981;">Sera</span></span>
        </div>

        <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #334155;">Hello,</p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #334155;">
          Welcome to <strong>GoSera for Your Business All-in-One Solution</strong>.
        </p>
        
        <p style="font-size: 15px; line-height: 1.6; margin-top: 24px; color: #475569;">
          Here are the details of your account:
        </p>

        <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px 24px; margin: 20px 0;">
          <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">
            Account Details:
          </p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #334155;">
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> <a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></li>
            ${slug ? `<li><strong>Profile Link:</strong> <a href="${profileUrl}" style="color: #10b981; font-weight: 600; text-decoration: none;">${slug}.${rootDomain}</a></li>` : ''}
          </ul>
        </div>

        <div style="margin: 28px 0;">
          <a href="https://card.${rootDomain}/dashboard" style="display: inline-block; background-color: #10b981; color: #04120c; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Access Your Dashboard &rarr;
          </a>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-top: 28px;">
          Thank you for choosing our service!
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 0;">
          Best regards,<br>
          <strong>GoSera for Your Business All-in-One Solution</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 18px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
          &copy; GoSera for Your Business All-in-One Solution. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html });
}

/**
 * Sends order confirmation email when a card is purchased
 */
export async function sendOrderConfirmationEmail({
  to,
  name,
  orderNumber,
  totalAmount,
  finish,
}: {
  to: string;
  name: string;
  orderNumber: string;
  totalAmount: number;
  finish: string;
}) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  const subject = `Your GoSera Smart NFC Card Order #${orderNumber} is Confirmed`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <tr>
      <td style="padding: 36px 32px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.03em; color: #0f172a;">Go<span style="color: #10b981;">Sera</span></span>
        </div>

        <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #334155;">Hello <strong>${name}</strong>,</p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #334155;">
          Thank you for ordering your GoSera Smart NFC Business Card! We have received your order and our production queue has begun processing your card.
        </p>

        <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px 24px; margin: 24px 0;">
          <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0f172a;">Order Summary:</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #334155;">
            <li><strong>Order ID:</strong> ${orderNumber}</li>
            <li><strong>Card Edition:</strong> ${finish}</li>
            <li><strong>Total Amount:</strong> LKR ${totalAmount.toLocaleString()}</li>
            <li><strong>Estimated Delivery:</strong> 3–5 Business Days (Island-Wide)</li>
          </ul>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
          Our fulfillment team will contact you via WhatsApp for physical dispatch updates.
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 0;">
          Best regards,<br>
          <strong>GoSera by Seranex</strong>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html });
}

/**
 * Sends instant email notification to cardholder when a new lead is captured
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
  const subject = `New Lead Captured: ${leadName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
    <tr>
      <td style="padding: 32px;">
        <span style="font-size: 18px; font-weight: 800; color: #0f172a;">Go<span style="color: #10b981;">Sera</span> Lead Alert</span>
        <p style="font-size: 15px; color: #334155; margin-top: 16px;">
          Hi ${cardOwnerName}, someone just exchanged their details with your GoSera card!
        </p>
        <div style="background-color: #f1f5f9; border-radius: 10px; padding: 18px; margin: 18px 0;">
          <p style="margin: 4px 0; font-size: 14px;"><strong>Prospect Name:</strong> ${leadName}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/${leadPhone.replace(/[^0-9]/g, '')}" style="color: #10b981; font-weight: bold;">${leadPhone}</a></p>
          ${notes ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Notes:</strong> ${notes}</p>` : ''}
        </div>
        <p style="font-size: 13px; color: #64748b;">Tap their number above to chat on WhatsApp instantly.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, html });
}

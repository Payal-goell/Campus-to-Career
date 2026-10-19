import nodemailer from 'nodemailer';

export type MailDelivery = {
  ok: boolean;
  configured: boolean;
  provider?: 'resend' | 'smtp';
  error?: string;
};

function normalizeRecipient(to: string): string {
  return to.trim().toLowerCase();
}

async function sendViaResend(to: string, otp: string): Promise<MailDelivery> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, configured: false };
  }

  const from =
    process.env.SMTP_FROM?.trim() ||
    process.env.RESEND_FROM?.trim() ||
    'Campus to Career <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Your Campus to Career verification code',
      text: `Your verification code is ${otp}. It expires in 10 minutes and can only be used for ${to}. If you did not request this, ignore the message.`,
      html: `<p>Your verification code for <strong>${to}</strong> is:</p><p style="font-size:28px;letter-spacing:0.35em;font-weight:700">${otp}</p><p>It expires in 10 minutes and will not work for any other email.</p>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('Resend OTP failed:', res.status, detail);
    return {
      ok: false,
      configured: true,
      provider: 'resend',
      error: `Resend rejected the message (${res.status})`,
    };
  }

  return { ok: true, configured: true, provider: 'resend' };
}

async function sendViaSmtp(to: string, otp: string): Promise<MailDelivery> {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) {
    return { ok: false, configured: false };
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS || '';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user ? { user, pass } : undefined,
  });

  // Always deliver to the account email the user registered with — never SMTP_USER.
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Campus to Career <${user || 'noreply@campustocareer.local'}>`,
    to,
    subject: 'Your Campus to Career verification code',
    text: `Your verification code is ${otp}. It expires in 10 minutes and can only be used for ${to}. If you did not request this, ignore the message.`,
    html: `<p>Your verification code for <strong>${to}</strong> is:</p><p style="font-size:28px;letter-spacing:0.35em;font-weight:700">${otp}</p><p>It expires in 10 minutes and will not work for any other email.</p>`,
  });

  return { ok: true, configured: true, provider: 'smtp' };
}

/**
 * Sends the OTP to the exact recipient email provided by the user.
 * Prefers Resend when RESEND_API_KEY is set, otherwise SMTP_HOST.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<MailDelivery> {
  const recipient = normalizeRecipient(to);
  if (!recipient || !recipient.includes('@')) {
    return { ok: false, configured: true, error: 'Invalid recipient email' };
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    return sendViaResend(recipient, otp);
  }

  if (process.env.SMTP_HOST?.trim()) {
    try {
      return await sendViaSmtp(recipient, otp);
    } catch (error) {
      console.error('SMTP OTP failed:', error);
      return {
        ok: false,
        configured: true,
        provider: 'smtp',
        error: error instanceof Error ? error.message : 'SMTP send failed',
      };
    }
  }

  return { ok: false, configured: false };
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() || process.env.SMTP_HOST?.trim());
}

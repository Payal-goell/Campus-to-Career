import nodemailer from 'nodemailer';

export async function sendOtpEmail(
  to: string,
  otp: string
): Promise<{ ok: boolean; configured: boolean }> {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) {
    return { ok: false, configured: false };
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Campus to Career <noreply@campustocareer.local>',
    to,
    subject: 'Your Campus to Career verification code',
    text: `Your verification code is ${otp}. It expires in 10 minutes and can only be used for ${to}. If you did not request this, ignore the message.`,
    html: `<p>Your verification code is <strong style="letter-spacing:0.2em">${otp}</strong>.</p><p>It expires in 10 minutes and can only be used for ${to}.</p>`,
  });

  return { ok: true, configured: true };
}

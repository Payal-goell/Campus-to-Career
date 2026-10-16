import { createHash, randomInt, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/mail';

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
export const MAX_OTP_ATTEMPTS = 5;

function pepper() {
  return process.env.JWT_SECRET || 'campus-to-career-dev-jwt-secret-key-99887766';
}

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function hashOtp(otp: string): string {
  return createHash('sha256').update(`${pepper()}:${otp}`).digest('hex');
}

export function otpMatches(otp: string, storedHash: string | null | undefined): boolean {
  if (!storedHash || !/^\d{6}$/.test(otp)) return false;
  const actual = Buffer.from(hashOtp(otp), 'utf8');
  const expected = Buffer.from(storedHash, 'utf8');
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export type IssuedOtp = {
  ok: true;
  emailSent: boolean;
  devOtp?: string;
};

export async function issueEmailOtp(userId: string, email: string): Promise<IssuedOtp | { ok: false; error: string; status: number }> {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { otpSentAt: true, isVerified: true },
  });

  if (!existing || existing.isVerified) {
    return { ok: false, error: 'This account does not need a code', status: 400 };
  }

  if (existing.otpSentAt && Date.now() - existing.otpSentAt.getTime() < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.otpSentAt.getTime())) / 1000);
    return { ok: false, error: `Wait ${wait}s before requesting another code`, status: 429 };
  }

  const otp = generateOtp();
  const now = new Date();
  await prisma.user.update({
    where: { id: userId },
    data: {
      verificationToken: hashOtp(otp),
      otpExpiresAt: new Date(now.getTime() + OTP_TTL_MS),
      otpSentAt: now,
      otpAttempts: 0,
    },
  });

  let emailSent = false;
  let configured = false;
  try {
    const delivery = await sendOtpEmail(email, otp);
    emailSent = delivery.ok;
    configured = delivery.configured;
  } catch (error) {
    console.error('OTP email failed:', error);
    configured = true;
    emailSent = false;
  }

  const exposeInDev = process.env.NODE_ENV !== 'production' && !emailSent;
  return {
    ok: true,
    emailSent,
    devOtp: exposeInDev ? otp : undefined,
  };
}

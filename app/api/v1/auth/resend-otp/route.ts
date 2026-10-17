import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOtp, hashOtp, issueEmailOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/mail';
import { isDatabaseError } from '@/lib/demo-accounts';
import { readLocalAccounts, upsertLocalAccount, writeLocalAccounts } from '@/lib/local-accounts';
import { z } from 'zod';

function resendLocal(req: NextRequest, email: string) {
  const accounts = readLocalAccounts(req);
  const account = accounts.find((item) => item.email === email);
  if (!account || account.isVerified) {
    return NextResponse.json({
      success: true,
      message: 'If this account still needs verification, a new code has been sent.',
    });
  }
  if (account.otpSentAt && Date.now() - new Date(account.otpSentAt).getTime() < 60_000) {
    const wait = Math.ceil((60_000 - (Date.now() - new Date(account.otpSentAt).getTime())) / 1000);
    return NextResponse.json(
      { success: false, error: `Wait ${wait}s before requesting another code` },
      { status: 429 }
    );
  }
  const otp = generateOtp();
  const now = new Date();
  const updated = {
    ...account,
    verificationToken: hashOtp(otp),
    otpExpiresAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(),
    otpSentAt: now.toISOString(),
    otpAttempts: 0,
  };
  return sendOtpEmail(email, otp).then((delivery) => {
    const response = NextResponse.json({
      success: true,
      message: delivery.ok ? 'A new code was sent to your email.' : 'A new verification code is ready.',
      emailSent: delivery.ok,
      devOtp: delivery.configured && delivery.ok ? undefined : otp,
    });
    writeLocalAccounts(response, upsertLocalAccount(accounts, updated));
    return response;
  });
}

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      if (!isDatabaseError(error)) throw error;
      return resendLocal(req, email);
    }

    if (!user) return resendLocal(req, email);

    if (!user || user.isVerified) {
      return NextResponse.json({
        success: true,
        message: 'If this account still needs verification, a new code has been sent.',
      });
    }

    const issued = await issueEmailOtp(user.id, user.email);
    if (!issued.ok) {
      return NextResponse.json({ success: false, error: issued.error }, { status: issued.status });
    }

    return NextResponse.json({
      success: true,
      message: issued.emailSent
        ? 'A new code was sent to your email.'
        : 'A new verification code is ready.',
      emailSent: issued.emailSent,
      devOtp: issued.devOtp,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

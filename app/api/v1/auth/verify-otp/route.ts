import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { MAX_OTP_ATTEMPTS, otpMatches } from '@/lib/otp';
import { isDatabaseError } from '@/lib/demo-accounts';
import { readLocalAccounts, upsertLocalAccount, writeLocalAccounts } from '@/lib/local-accounts';
import { clientAddress, rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

function verifyLocalAccount(req: NextRequest, email: string, otp: string) {
  const accounts = readLocalAccounts(req);
  const account = accounts.find((item) => item.email === email);
  if (!account || account.isVerified || !account.verificationToken || !account.otpExpiresAt) {
    return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 400 });
  }
  if (new Date(account.otpExpiresAt).getTime() < Date.now()) {
    return NextResponse.json(
      { success: false, error: 'That code has expired. Request a new one.' },
      { status: 400 }
    );
  }
  if (account.otpAttempts >= MAX_OTP_ATTEMPTS) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Request a new code.' },
      { status: 429 }
    );
  }
  if (!otpMatches(otp, account.verificationToken)) {
    const updated = { ...account, otpAttempts: account.otpAttempts + 1 };
    const response = NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 400 });
    writeLocalAccounts(response, upsertLocalAccount(accounts, updated));
    return response;
  }

  const verified = {
    ...account,
    isVerified: true,
    verificationToken: null,
    otpExpiresAt: null,
    otpSentAt: null,
    otpAttempts: 0,
  };
  const accessToken = signAccessToken({
    userId: verified.id,
    email: verified.email,
    role: verified.role,
  });
  const refreshToken = signRefreshToken({
    userId: verified.id,
    email: verified.email,
    role: verified.role,
  });
  const response = NextResponse.json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: verified.id,
      email: verified.email,
      role: verified.role,
      isOnboarded: verified.isOnboarded,
      name: verified.profile?.fullName || verified.name || verified.email.split('@')[0],
      avatarUrl: verified.profile?.avatarUrl || verified.avatarUrl,
    },
  });
  response.cookies.set('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  writeLocalAccounts(response, upsertLocalAccount(accounts, verified));
  return response;
}

const verifySchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const limited = rateLimit(`otp:${clientAddress(req)}:${email}`, 8, 10 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, error: `Too many code attempts. Wait ${limited.retryAfter}s and try again.` },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } }
      );
    }
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
        include: { studentProfile: true, coordinator: true },
      });
    } catch (error) {
      if (!isDatabaseError(error)) throw error;
      return verifyLocalAccount(req, email, parsed.data.otp);
    }

    if (!user) return verifyLocalAccount(req, email, parsed.data.otp);

    if (!user || user.isVerified || !user.verificationToken || !user.otpExpiresAt) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'That code has expired. Request a new one.' },
        { status: 400 }
      );
    }

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Request a new code.' },
        { status: 429 }
      );
    }

    if (!otpMatches(parsed.data.otp, user.verificationToken)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: { increment: 1 } },
      });
      return NextResponse.json(
        { success: false, error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    const verified = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        otpExpiresAt: null,
        otpSentAt: null,
        otpAttempts: 0,
      },
      include: { studentProfile: true, coordinator: true },
    });

    const accessToken = signAccessToken({
      userId: verified.id,
      email: verified.email,
      role: verified.role,
    });
    const refreshToken = signRefreshToken({
      userId: verified.id,
      email: verified.email,
      role: verified.role,
    });

    const response = NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: verified.id,
        email: verified.email,
        role: verified.role,
        isOnboarded: verified.isOnboarded,
        name:
          verified.studentProfile?.fullName ||
          verified.coordinator?.name ||
          verified.email.split('@')[0],
        avatarUrl: verified.studentProfile?.avatarUrl,
      },
    });

    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    if (isDatabaseError(error)) {
      try {
        const body = await req.clone().json();
        if (body?.email && body?.otp) return verifyLocalAccount(req, String(body.email).toLowerCase(), String(body.otp));
      } catch {
        // The local account path below still returns a normal error response.
      }
    }
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during verification' },
      { status: 500 }
    );
  }
}

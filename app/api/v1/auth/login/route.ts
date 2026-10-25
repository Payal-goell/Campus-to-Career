import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, hashPassword, signAccessToken, signRefreshToken } from '@/lib/auth';
import { emailError, loginPasswordError } from '@/lib/field-rules';
import { clientAddress, rateLimit } from '@/lib/rate-limit';
import { generateOtp, hashOtp, issueEmailOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/mail';
import { demoLoginUser, findDemoAccount, isDatabaseError } from '@/lib/demo-accounts';
import { readLocalAccounts, upsertLocalAccount, writeLocalAccounts } from '@/lib/local-accounts';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().superRefine((value, ctx) => {
    const message = emailError(value);
    if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }),
  password: z.string().superRefine((value, ctx) => {
    const message = loginPasswordError(value);
    if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }),
});

let dummyHash: Promise<string> | null = null;

async function burnPasswordTime(password: string) {
  if (!dummyHash) dummyHash = hashPassword('campus-to-career-dummy-password');
  try {
    await comparePassword(password, await dummyHash);
  } catch {
    // Timing only. A missing account still answers as a failed sign-in.
  }
}

async function loginLocalAccount(req: NextRequest, email: string, password: string) {
  const account = readLocalAccounts(req).find((item) => item.email === email);
  if (!account?.password) return null;
  let matches = false;
  try {
    matches = await comparePassword(password, account.password);
  } catch {
    matches = false;
  }
  if (!matches) return null;
  if (!account.isVerified) {
    const otp = generateOtp();
    const now = new Date();
    const updated = {
      ...account,
      verificationToken: hashOtp(otp),
      otpExpiresAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(),
      otpSentAt: now.toISOString(),
      otpAttempts: 0,
    };
    let emailSent = false;
    let configured = false;
    try {
      const delivery = await sendOtpEmail(account.email, otp);
      emailSent = delivery.ok;
      configured = delivery.configured;
    } catch (error) {
      console.error('Login local OTP email failed:', error);
    }
    const hideCode =
      (configured && emailSent) ||
      (configured && process.env.NODE_ENV === 'production' && !emailSent);
    const response = NextResponse.json({
      success: false,
      needsVerification: true,
      email: account.email,
      error: emailSent
        ? `Verify the code sent to ${account.email} before signing in.`
        : 'Enter the verification code for this account before signing in.',
      emailSent,
      devOtp: hideCode ? undefined : otp,
    });
    writeLocalAccounts(response, upsertLocalAccount(readLocalAccounts(req), updated));
    return response;
  }
  return sessionResponse({
    id: account.id,
    email: account.email,
    role: account.role,
    isOnboarded: account.isOnboarded,
    studentProfile: account.profile
      ? {
          fullName: account.profile.fullName,
          avatarUrl: account.profile.avatarUrl ?? null,
          developmentScore: account.profile.developmentScore,
        }
      : null,
    coordinator: account.role === 'COORDINATOR' ? { name: account.name || account.email.split('@')[0] } : null,
  });
}

function sessionResponse(user: {
  id: string;
  email: string;
  role: 'STUDENT' | 'ADMIN' | 'RECRUITER' | 'COORDINATOR';
  isOnboarded: boolean;
  studentProfile: { fullName: string; avatarUrl: string | null; developmentScore: number } | null;
  coordinator: { name: string } | null;
}) {
  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = signRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isOnboarded: user.isOnboarded,
      name: user.studentProfile?.fullName || user.coordinator?.name || user.email.split('@')[0],
      avatarUrl: user.studentProfile?.avatarUrl,
      developmentScore: user.studentProfile?.developmentScore,
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
}

async function readBody(req: NextRequest): Promise<unknown> {
  const text = await req.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    const params = new URLSearchParams(text);
    if (params.has('email') || params.has('password')) {
      return {
        email: params.get('email') ?? '',
        password: params.get('password') ?? '',
      };
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  let email = '';
  let password = '';
  try {
    const body = await readBody(req);
    if (body === null) {
      return NextResponse.json(
        { success: false, error: 'Invalid login request' },
        { status: 400 }
      );
    }

    if (body && typeof body === 'object' && 'email' in body && typeof body.email === 'string') {
      body.email = body.email.trim();
    }

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid login' },
        { status: 400 }
      );
    }

    email = parsed.data.email.toLowerCase();
    password = parsed.data.password;

    const limited = rateLimit(`login:${clientAddress(req)}:${email}`, 8, 10 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, error: `Too many sign-in attempts. Wait ${limited.retryAfter}s and try again.` },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } }
      );
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          studentProfile: true,
          coordinator: true,
        },
      });
    } catch (dbError) {
      const localResponse = await loginLocalAccount(req, email, password);
      if (localResponse) return localResponse;
      const demo = findDemoAccount(email, password);
      if (demo) return sessionResponse(demoLoginUser(demo));
      // DB unreachable and no cookie/demo account — friendly auth message (no infra dump)
      if (isDatabaseError(dbError)) {
        return NextResponse.json(
          {
            success: false,
            error:
              'No account found for this email on this deployment. Register first, or use a 1-click demo profile below.',
          },
          { status: 401 }
        );
      }
      throw dbError;
    }

    if (!user) {
      const localResponse = await loginLocalAccount(req, email, password);
      if (localResponse) return localResponse;
      await burnPasswordTime(password);
      return NextResponse.json(
        { success: false, error: 'That email and password do not match an account.' },
        { status: 401 }
      );
    }

    let isMatch = false;
    try {
      isMatch = await comparePassword(password, user.password);
    } catch {
      isMatch = false;
    }
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'That email and password do not match an account.' },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      let issued: Awaited<ReturnType<typeof issueEmailOtp>> | null = null;
      try {
        issued = await issueEmailOtp(user.id, user.email);
      } catch (error) {
        console.error('Login OTP error:', error);
      }
      return NextResponse.json({
        success: false,
        needsVerification: true,
        email: user.email,
        error: issued?.ok
          ? 'Verify the code sent to your email before signing in.'
          : issued?.error || 'Enter the verification code for this account before signing in.',
        emailSent: issued?.ok ? issued.emailSent : false,
        devOtp: issued?.ok ? issued.devOtp : undefined,
      });
    }

    return sessionResponse(user);
  } catch (error) {
    const localResponse = await loginLocalAccount(req, email, password);
    if (localResponse) return localResponse;
    const demo = findDemoAccount(email, password);
    if (demo) return sessionResponse(demoLoginUser(demo));

    const message = error instanceof Error ? error.message : 'Internal server error during login';
    console.error('Login error:', message);
    const databaseDown = isDatabaseError(error);
    return NextResponse.json(
      {
        success: false,
        error: databaseDown
          ? 'No account found for this email on this deployment. Register first, or use a 1-click demo profile below.'
          : process.env.NODE_ENV === 'production'
            ? 'Could not sign in. Try again or use a demo profile.'
            : message,
      },
      { status: databaseDown ? 401 : 500 }
    );
  }
}

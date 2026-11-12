import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authSessionResponse, comparePassword, hashPassword } from '@/lib/auth';
import { emailError, loginPasswordError } from '@/lib/field-rules';
import { clientAddress, rateLimit } from '@/lib/rate-limit';
import { demoLoginUser, findDemoAccount, isDatabaseError } from '@/lib/demo-accounts';
import { readLocalAccounts } from '@/lib/local-accounts';
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
  return authSessionResponse({
    id: account.id,
    email: account.email,
    role: account.role,
    isOnboarded: account.isOnboarded,
    name: account.profile?.fullName || account.name || account.email.split('@')[0],
    avatarUrl: account.profile?.avatarUrl ?? account.avatarUrl ?? null,
    developmentScore: account.profile?.developmentScore ?? account.developmentScore ?? null,
  });
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
      if (demo) {
        const demoUser = demoLoginUser(demo);
        return authSessionResponse({
          id: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
          isOnboarded: demoUser.isOnboarded,
          name: demoUser.studentProfile?.fullName || demoUser.coordinator?.name || demoUser.email.split('@')[0],
          avatarUrl: demoUser.studentProfile?.avatarUrl ?? null,
          developmentScore: demoUser.studentProfile?.developmentScore ?? null,
        });
      }
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

    return authSessionResponse({
      id: user.id,
      email: user.email,
      role: user.role,
      isOnboarded: user.isOnboarded,
      name: user.studentProfile?.fullName || user.coordinator?.name || user.email.split('@')[0],
      avatarUrl: user.studentProfile?.avatarUrl ?? null,
      developmentScore: user.studentProfile?.developmentScore ?? null,
    });
  } catch (error) {
    const localResponse = await loginLocalAccount(req, email, password);
    if (localResponse) return localResponse;
    const demo = findDemoAccount(email, password);
    if (demo) {
      const demoUser = demoLoginUser(demo);
      return authSessionResponse({
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        isOnboarded: demoUser.isOnboarded,
        name: demoUser.studentProfile?.fullName || demoUser.coordinator?.name || demoUser.email.split('@')[0],
        avatarUrl: demoUser.studentProfile?.avatarUrl ?? null,
        developmentScore: demoUser.studentProfile?.developmentScore ?? null,
      });
    }

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

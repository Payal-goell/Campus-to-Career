import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { authSessionResponse, hashPassword } from '@/lib/auth';
import { isDatabaseError } from '@/lib/demo-accounts';
import {
  LocalAccount,
  newLocalId,
  readLocalAccounts,
  upsertLocalAccount,
  writeLocalAccounts,
} from '@/lib/local-accounts';
import { emailError, newPasswordError } from '@/lib/field-rules';
import { clientAddress, rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().trim().superRefine((value, ctx) => {
    const message = emailError(value);
    if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }),
  password: z.string().superRefine((value, ctx) => {
    const message = newPasswordError(value);
    if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }),
  role: z.enum(['STUDENT']).default('STUDENT'),
});

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      const parsedBody = await req.json();
      if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
        return NextResponse.json({ success: false, error: 'Invalid registration request' }, { status: 400 });
      }
      body = parsedBody as Record<string, unknown>;
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid registration request' }, { status: 400 });
    }
    if (typeof body.email === 'string') {
      body.email = body.email.trim();
    }
    if (body && typeof body === 'object' && 'role' in body && body.role && body.role !== 'STUDENT') {
      return NextResponse.json(
        { success: false, error: 'Public registration is limited to student accounts' },
        { status: 403 }
      );
    }

    const limited = rateLimit(`register:${clientAddress(req)}`, 5, 15 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, error: `Too many registration attempts. Wait ${limited.retryAfter}s and try again.` },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } }
      );
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    let existing;
    try {
      existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (error) {
      if (!isDatabaseError(error)) throw error;
      return registerWithoutDatabase(req, normalizedEmail, password);
    }

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered. Sign in instead.' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    try {
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          role: 'STUDENT',
          isVerified: true,
          isOnboarded: false,
        },
      });
      return authSessionResponse({
        id: user.id,
        email: user.email,
        role: user.role,
        isOnboarded: user.isOnboarded,
        name: user.email.split('@')[0],
        status: 201,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'This email is already registered. Sign in instead.' },
          { status: 409 }
        );
      }
      if (isDatabaseError(error)) return registerWithoutDatabase(req, normalizedEmail, password);
      throw error;
    }
  } catch (error) {
    console.error('Register error:', error);
    const detail = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === 'production'
          ? 'Internal server error during registration'
          : `Could not create the account. ${detail}`,
      },
      { status: 500 }
    );
  }
}

async function registerWithoutDatabase(req: NextRequest, email: string, password: string) {
  const accounts = readLocalAccounts(req);
  const existing = accounts.find((account) => account.email === email);
  if (existing) {
    return NextResponse.json(
      { success: false, error: 'This email is already registered. Sign in instead.' },
      { status: 409 }
    );
  }

  const account: LocalAccount = {
    id: newLocalId(),
    email,
    password: await hashPassword(password),
    role: 'STUDENT',
    isVerified: true,
    isOnboarded: false,
    name: email.split('@')[0],
    avatarUrl: null,
    profile: null,
  };

  const response = authSessionResponse({
    id: account.id,
    email: account.email,
    role: account.role,
    isOnboarded: false,
    name: account.name,
    status: 201,
  });
  writeLocalAccounts(response, upsertLocalAccount(accounts, account));
  return response;
}

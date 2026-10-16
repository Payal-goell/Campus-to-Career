import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { issueEmailOtp } from '@/lib/otp';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT']).default('STUDENT'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body && typeof body === 'object' && typeof body.email === 'string') {
      body.email = body.email.trim();
    }
    if (body && typeof body === 'object' && 'role' in body && body.role && body.role !== 'STUDENT') {
      return NextResponse.json(
        { success: false, error: 'Public registration is limited to student accounts' },
        { status: 403 }
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

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return resumeUnverifiedAccount(existing);
    }

    const hashedPassword = await hashPassword(password);
    try {
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          role: 'STUDENT',
          isVerified: false,
          isOnboarded: false,
        },
      });
      return sendRegistrationCode(user.id, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const raced = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (raced) return resumeUnverifiedAccount(raced);
      }
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

async function resumeUnverifiedAccount(user: { id: string; email: string; isVerified: boolean }) {
  if (user.isVerified) {
    return NextResponse.json(
      { success: false, error: 'This email is already registered. Sign in instead.' },
      { status: 409 }
    );
  }

  return sendRegistrationCode(user.id, user.email, true);
}

async function sendRegistrationCode(userId: string, email: string, force = false) {
  const issued = await issueEmailOtp(userId, email, { force });
  if (!issued.ok) {
    return NextResponse.json({ success: false, error: issued.error }, { status: issued.status });
  }

  return NextResponse.json(
    {
      success: true,
      message: issued.emailSent
        ? 'Account created. Enter the code sent to your email.'
        : 'Account created. Enter the verification code to activate it.',
      email,
      emailSent: issued.emailSent,
      devOtp: issued.devOtp,
    },
    { status: 201 }
  );
}

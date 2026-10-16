import { NextRequest, NextResponse } from 'next/server';
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
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role: 'STUDENT',
        isVerified: false,
        isOnboarded: false,
      },
    });

    const issued = await issueEmailOtp(user.id, user.email);
    if (!issued.ok) {
      return NextResponse.json({ success: false, error: issued.error }, { status: issued.status });
    }

    return NextResponse.json(
      {
        success: true,
        message: issued.emailSent
          ? 'Account created. Enter the code sent to your email.'
          : 'Account created. Enter the verification code to activate it.',
        email: user.email,
        emailSent: issued.emailSent,
        devOtp: issued.devOtp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}

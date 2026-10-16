import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signAccessToken, signRefreshToken } from '@/lib/auth';
import { issueEmailOtp } from '@/lib/otp';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const { password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        coordinator: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      const issued = await issueEmailOtp(user.id, user.email);
      return NextResponse.json(
        {
          success: false,
          needsVerification: true,
          email: user.email,
          error: issued.ok
            ? 'Verify the code sent to your email before signing in.'
            : issued.error,
          emailSent: issued.ok ? issued.emailSent : false,
          devOtp: issued.ok ? issued.devOtp : undefined,
        },
        { status: 403 }
      );
    }

    return sessionResponse(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}

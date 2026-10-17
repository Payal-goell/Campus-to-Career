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

    let isMatch = false;
    try {
      isMatch = await comparePassword(password, user.password);
    } catch {
      isMatch = false;
    }
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
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
    const message = error instanceof Error ? error.message : 'Internal server error during login';
    console.error('Login error:', message);
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal server error during login' : message,
      },
      { status: 500 }
    );
  }
}

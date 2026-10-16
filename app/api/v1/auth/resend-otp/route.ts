import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { issueEmailOtp } from '@/lib/otp';
import { z } from 'zod';

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
    const user = await prisma.user.findUnique({ where: { email } });

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

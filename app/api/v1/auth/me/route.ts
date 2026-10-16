import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: true, user: null });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        studentProfile: {
          include: {
            projects: true,
            certifications: true,
          },
        },
        coordinator: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: fullUser.id,
        email: fullUser.email,
        role: fullUser.role,
        isOnboarded: fullUser.isOnboarded,
        name: fullUser.studentProfile?.fullName || fullUser.coordinator?.name || fullUser.email.split('@')[0],
        avatarUrl: fullUser.studentProfile?.avatarUrl,
        studentProfile: fullUser.studentProfile,
        coordinator: fullUser.coordinator,
      },
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

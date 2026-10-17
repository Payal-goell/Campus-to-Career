import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { demoAccountFromToken, isDatabaseError } from '@/lib/demo-accounts';
import { readLocalAccounts } from '@/lib/local-accounts';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: true, user: null });
    }

    const demo = demoAccountFromToken(session.id, session.email);
    const local = readLocalAccounts(req).find((account) => account.id === session.id);
    if (demo || local) {
      return NextResponse.json({
        success: true,
        user: {
          id: session.id,
          email: session.email,
          role: session.role,
          isOnboarded: session.isOnboarded,
          name: session.name,
          avatarUrl: session.avatarUrl ?? local?.profile?.avatarUrl ?? null,
          studentProfile: local?.profile
            ? { id: `${session.id}-profile`, userId: session.id, ...local.profile }
            : null,
          coordinator: session.role === 'COORDINATOR' ? { name: session.name, email: session.email } : null,
        },
      });
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
    if (isDatabaseError(error)) {
      return NextResponse.json({ success: true, user: null });
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isDatabaseError } from '@/lib/demo-accounts';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { resourceId, status } = body;

    if (!resourceId) {
      return NextResponse.json({ success: false, error: 'resourceId is required' }, { status: 400 });
    }

    const existing = await prisma.userSavedResource.findUnique({
      where: {
        userId_resourceId: {
          userId: session.id,
          resourceId,
        },
      },
    });

    if (existing && !status) {
      // Toggle off / remove
      await prisma.userSavedResource.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, isSaved: false, action: 'removed' });
    }

    const saved = await prisma.userSavedResource.upsert({
      where: {
        userId_resourceId: {
          userId: session.id,
          resourceId,
        },
      },
      create: {
        userId: session.id,
        resourceId,
        status: status || 'SAVED',
      },
      update: {
        status: status || 'SAVED',
      },
    });

    // Add activity log
    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: `Bookmarked resource (${saved.status})`,
      },
    });

    return NextResponse.json({
      success: true,
      isSaved: true,
      data: saved,
    });
  } catch (error) {
    console.error('Resource save error:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({ success: true, isSaved: true });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to bookmark resource' },
      { status: 500 }
    );
  }
}

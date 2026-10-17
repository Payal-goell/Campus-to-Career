import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isDatabaseError } from '@/lib/demo-accounts';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    return NextResponse.json({
      success: true,
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Notifications get error:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({
        success: true,
        notifications: [
          {
            id: 'welcome',
            title: 'Welcome to Campus to Career',
            message: 'Your roadmap, resources, and placement desk are ready.',
            type: 'info',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId } = body;

    if (notificationId) {
      await prisma.notification.updateMany({
        where: { id: notificationId, userId: session.id },
        data: { isRead: true },
      });
    } else {
      // Mark all read
      await prisma.notification.updateMany({
        where: { userId: session.id },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true, message: 'Notification marked read' });
  } catch (error) {
    console.error('Notification mark read error:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

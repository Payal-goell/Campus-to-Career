import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { coordinatorId, subject, message } = body;

    if (!coordinatorId || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Coordinator, subject, and message are all required' },
        { status: 400 }
      );
    }

    const ticketId = `tkt_${Math.floor(10000 + Math.random() * 90000)}`;

    const inquiry = await prisma.coordinatorInquiry.create({
      data: {
        ticketId,
        userId: session.id,
        coordinatorId,
        subject,
        message,
        status: 'PENDING',
      },
      include: {
        coordinator: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: session.id,
        title: `Inquiry Submitted #${ticketId}`,
        message: `Your query to ${inquiry.coordinator.name} regarding "${subject}" has been queued.`,
        type: 'INFO',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully to the coordinator.',
      ticketId,
      inquiry,
    });
  } catch (error) {
    console.error('Coordinator contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

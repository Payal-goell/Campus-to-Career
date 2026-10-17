import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isDatabaseError } from '@/lib/demo-accounts';
import {
  newLocalId,
  readLocalApplications,
  writeLocalApplications,
  type LocalApplication,
} from '@/lib/local-accounts';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await prisma.placementApplication.findMany({
      where: { userId: session.id },
      include: {
        interviews: {
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { appliedDate: 'desc' },
    });

    return NextResponse.json({
      success: true,
      applications: applications.map((app) => ({
        id: app.id,
        company: app.company,
        role: app.role,
        location: app.location,
        salary: app.salary,
        status: app.status,
        appliedDate: app.appliedDate.toISOString().split('T')[0],
        notes: app.notes,
        interviews: app.interviews.map((i) => ({
          id: i.id,
          round: i.round,
          date: i.date.toISOString().split('T')[0],
          mode: i.mode,
          feedback: i.feedback,
          status: i.status,
        })),
      })),
    });
  } catch (error) {
    console.error('Applications get error:', error);
    if (isDatabaseError(error)) {
      const session = await getSessionUser(req);
      const applications = readLocalApplications(req).filter((item) => !session || item.userId === session.id);
      return NextResponse.json({ success: true, applications });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
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
    const { company, role, location, salary, status, notes } = body;

    if (!company || !role) {
      return NextResponse.json(
        { success: false, error: 'Company and role are required' },
        { status: 400 }
      );
    }

    const draft: LocalApplication = {
      id: newLocalId('app'),
      userId: session.id,
      company,
      role,
      location: location || 'Remote / Hybrid',
      salary: salary || null,
      status: status || 'APPLIED',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: notes || null,
      interviews: [],
    };

    try {
      const application = await prisma.placementApplication.create({
        data: {
          userId: session.id,
          company,
          role,
          location: draft.location,
          salary: draft.salary,
          status: draft.status,
          notes: draft.notes,
        },
        include: { interviews: true },
      });

      await prisma.activityLog.create({
        data: {
          userId: session.id,
          action: `Added application for ${role} at ${company}`,
        },
      });

      return NextResponse.json({ success: true, application }, { status: 201 });
    } catch (error) {
      if (!isDatabaseError(error)) throw error;
      const response = NextResponse.json({ success: true, application: draft }, { status: 201 });
      writeLocalApplications(response, [...readLocalApplications(req), draft]);
      return response;
    }
  } catch (error) {
    console.error('Application create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create application' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Application ID is required' }, { status: 400 });
    }

    const updated = await prisma.placementApplication.update({
      where: {
        id,
        userId: session.id,
      },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: { interviews: true },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: `Updated application status at ${updated.company} to ${status || updated.status}`,
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error('Application update error:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Application ID is required' }, { status: 400 });
    }

    await prisma.placementApplication.delete({
      where: {
        id,
        userId: session.id,
      },
    });

    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Application delete error:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({ success: true, message: 'Application deleted successfully' });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}

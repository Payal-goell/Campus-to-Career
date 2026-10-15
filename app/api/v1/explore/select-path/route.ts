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
    const { courseId, targetRole } = body;

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'courseId is required' }, { status: 400 });
    }

    const updated = await prisma.studentProfile.updateMany({
      where: { userId: session.id },
      data: {
        selectedCourseId: courseId,
        ...(targetRole ? { targetRole } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Specialization path updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Select path error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to select path' },
      { status: 500 }
    );
  }
}

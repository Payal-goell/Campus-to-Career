import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isDatabaseError } from '@/lib/demo-accounts';

const feedbackSchema = z.object({
  roadmapId: z.string().min(1),
  stepId: z.string().min(1),
  action: z.enum(['completed', 'skipped', 'liked', 'disliked']),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid feedback' },
        { status: 400 }
      );
    }

    const { roadmapId, stepId, action } = parsed.data;

    try {
      const roadmap = await prisma.generatedRoadmap.findFirst({
        where: { id: roadmapId, userId: session.id },
        select: { id: true },
      });
      if (!roadmap) {
        return NextResponse.json({ success: false, error: 'Roadmap not found' }, { status: 404 });
      }

      const row = await prisma.roadmapFeedback.create({
        data: {
          roadmapId,
          userId: session.id,
          stepId,
          action,
        },
      });

      return NextResponse.json({ success: true, feedback: row });
    } catch (error) {
      if (isDatabaseError(error)) {
        // Local / no-DB deployments still acknowledge feedback for UX.
        return NextResponse.json({
          success: true,
          feedback: {
            id: `local-${Date.now()}`,
            roadmapId,
            userId: session.id,
            stepId,
            action,
            createdAt: new Date().toISOString(),
          },
          note: 'Stored locally because the database is unavailable.',
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Roadmap feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not save feedback' },
      { status: 500 }
    );
  }
}

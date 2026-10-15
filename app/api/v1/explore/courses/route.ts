import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch');
    const domain = searchParams.get('domain') || searchParams.get('interest');

    const where: Record<string, unknown> = {};
    if (branch && branch !== 'all') {
      where.branch = { contains: branch, mode: 'insensitive' };
    }
    if (domain && domain !== 'all') {
      where.domain = { contains: domain, mode: 'insensitive' };
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const careerPaths = await prisma.careerPath.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      courses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        domain: c.domain,
        branch: c.branch,
        description: c.description,
        typicalSkills: c.typicalSkills,
        learningPath: c.learningPath,
        alignmentScore: c.alignmentScore || '88% match',
      })),
      careerPaths,
    });
  } catch (error) {
    console.error('Explore courses error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

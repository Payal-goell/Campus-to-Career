import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDatabaseError } from '@/lib/demo-accounts';

const FALLBACK_COURSES = [
  {
    id: 'course-web',
    title: 'Full-Stack Web Development',
    domain: 'Web Development',
    branch: 'Computer Science & Engineering',
    description: 'HTML, React, and Next.js through a campus project.',
    typicalSkills: ['JavaScript', 'React.js', 'Next.js'],
    learningPath: ['HTML and CSS', 'JavaScript', 'React', 'Next.js'],
    alignmentScore: '88% match',
  },
  {
    id: 'course-aiml',
    title: 'AI and Machine Learning',
    domain: 'AI/ML',
    branch: 'Computer Science & Engineering',
    description: 'Python, data handling, and a first model you can demo.',
    typicalSkills: ['Python', 'Pandas', 'Machine Learning'],
    learningPath: ['Python', 'Pandas', 'Model training', 'Demo'],
    alignmentScore: '84% match',
  },
  {
    id: 'course-dsa',
    title: 'Data Structures and Placement Prep',
    domain: 'Software Engineering',
    branch: 'Computer Science & Engineering',
    description: 'DSA practice aligned with internship season.',
    typicalSkills: ['Data Structures & Algorithms', 'Problem Solving'],
    learningPath: ['Arrays', 'Trees and graphs', 'Mock interviews'],
    alignmentScore: '90% match',
  },
];

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
    if (isDatabaseError(error)) {
      return NextResponse.json({
        success: true,
        courses: FALLBACK_COURSES,
        careerPaths: [
          {
            id: 'path-sde',
            title: 'Software Engineer',
            domain: 'Web Development',
            description: 'Product engineering path from campus projects to internships.',
          },
        ],
      });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

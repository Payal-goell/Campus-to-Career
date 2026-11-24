import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isDatabaseError } from '@/lib/demo-accounts';

// Demo student list used when the database is unavailable
const DEMO_STUDENTS = [
  {
    id: 'demo-student-profile',
    userId: 'demo-student',
    fullName: 'Aarav Sharma',
    email: 'student@college.edu',
    branch: 'Computer Science & Engineering',
    currentYear: 2,
    cgpa: 8.7,
    targetRole: 'Full-Stack Software Engineer',
    developmentScore: 78,
    profileCompletion: 92,
    primaryGoal: 'Product company internship',
    careerGoal: 'product_company',
    skills: ['JavaScript', 'React.js', 'Node.js', 'Python', 'DSA', 'PostgreSQL'],
    isPlacementEligible: true,
    placementStatus: 'ELIGIBLE',
  },
  {
    id: 'demo-newbie-profile',
    userId: 'demo-newbie',
    fullName: 'New Student',
    email: 'newbie@college.edu',
    branch: 'Computer Science & Engineering',
    currentYear: 1,
    cgpa: null,
    targetRole: null,
    developmentScore: 0,
    profileCompletion: 0,
    primaryGoal: null,
    careerGoal: null,
    skills: [],
    isPlacementEligible: false,
    placementStatus: 'NOT_STARTED',
  },
];

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'COORDINATOR')) {
      return NextResponse.json({ success: false, error: 'Forbidden: Coordinator access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(5, Number(searchParams.get('limit') || '20')));
    const search = searchParams.get('search')?.trim() || '';
    const branch = searchParams.get('branch')?.trim() || '';
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : null;
    const skip = (page - 1) * limit;

    const where = {
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' as const } },
              { user: { email: { contains: search, mode: 'insensitive' as const } } },
              { branch: { contains: search, mode: 'insensitive' as const } },
              { targetRole: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(branch ? { branch: { contains: branch, mode: 'insensitive' as const } } : {}),
      ...(year ? { currentYear: year } : {}),
    };

    const [profiles, total] = await Promise.all([
      prisma.studentProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { developmentScore: 'desc' },
        select: {
          id: true,
          userId: true,
          fullName: true,
          branch: true,
          currentYear: true,
          cgpa: true,
          targetRole: true,
          developmentScore: true,
          profileCompletion: true,
          primaryGoal: true,
          careerGoal: true,
          skills: true,
          user: {
            select: { email: true },
          },
        },
      }),
      prisma.studentProfile.count({ where }),
    ]);

    const students = profiles.map((p) => ({
      id: p.id,
      userId: p.userId,
      fullName: p.fullName,
      email: p.user.email,
      branch: p.branch,
      currentYear: p.currentYear,
      cgpa: p.cgpa,
      targetRole: p.targetRole,
      developmentScore: p.developmentScore ?? 0,
      profileCompletion: p.profileCompletion ?? 0,
      primaryGoal: p.primaryGoal,
      careerGoal: p.careerGoal,
      skills: p.skills,
      isPlacementEligible: (p.cgpa ?? 0) >= 6.0 && p.currentYear >= 3,
      placementStatus:
        (p.cgpa ?? 0) >= 6.0 && p.currentYear >= 3
          ? 'ELIGIBLE'
          : p.currentYear < 3
            ? 'TOO_EARLY'
            : 'INELIGIBLE',
    }));

    return NextResponse.json({
      success: true,
      students,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Coordinator students error:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({
        success: true,
        students: DEMO_STUDENTS,
        total: DEMO_STUDENTS.length,
        page: 1,
        totalPages: 1,
      });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 });
  }
}

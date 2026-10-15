import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');
    const roleOverride = searchParams.get('role');
    const domainOverride = searchParams.get('domain');
    const extraOverride = searchParams.get('extracurricular');

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      include: { projects: true },
    });

    const studentYear = profile?.currentYear || 2;
    const targetYear = yearParam ? parseInt(yearParam, 10) : studentYear;

    const targetRole = roleOverride || profile?.targetRole || 'Full-Stack Software Engineer';
    const preferredDomains = domainOverride
      ? [domainOverride]
      : profile?.preferredDomains?.length
      ? profile.preferredDomains
      : ['Web Development', 'Cloud Distributed Systems'];
    const currentSkills = profile?.skills || ['JavaScript', 'React.js', 'Data Structures & Algorithms'];
    const extracurricularPreferences = extraOverride
      ? [extraOverride]
      : profile?.extracurricularPreferences?.length
      ? profile.extracurricularPreferences
      : ['Hackathons & Contests', 'Open-Source Projects', 'Technical Clubs'];

    // Fetch milestones for target year
    const allYearMilestones = await prisma.roadmapMilestone.findMany({
      where: { year: targetYear },
      orderBy: { order: 'asc' },
    });

    // Fetch user completion states
    const userMilestones = await prisma.userRoadmapMilestone.findMany({
      where: {
        userId: session.id,
      },
    });

    const userStatusMap = new Map(userMilestones.map((um) => [um.milestoneId, um]));

    // Format milestones with domain relevancy boost
    const enrichedMilestones = allYearMilestones.map((m) => {
      const userM = userStatusMap.get(m.id);
      return {
        id: m.id,
        year: m.year,
        title: m.title,
        description: m.description,
        category: m.category,
        domain: m.domain,
        difficulty: m.difficulty,
        estimatedHours: m.estimatedHours,
        skillsTargeted: m.skillsTargeted,
        actionItems: m.actionItems,
        order: m.order,
        completed: userM?.completed || false,
        status: userM?.status || 'NOT_STARTED',
      };
    });

    // Compute dynamic analytics
    const totalMilestones = enrichedMilestones.length || 1;
    const completedMilestones = enrichedMilestones.filter((m) => m.completed).length;
    const completionPercentage = Math.round((completedMilestones / totalMilestones) * 100);

    const estimatedHoursTotal = enrichedMilestones.reduce((acc, curr) => acc + (curr.estimatedHours || 20), 0);
    const estimatedHoursCompleted = enrichedMilestones
      .filter((m) => m.completed)
      .reduce((acc, curr) => acc + (curr.estimatedHours || 20), 0);

    // Dynamic Readiness Score
    const totalCompletedAllYears = userMilestones.filter((m) => m.completed).length;
    const readinessScore = Math.min(45 + totalCompletedAllYears * 5 + (profile?.cgpa ? Math.round(profile.cgpa * 3) : 20), 96);

    // Domain Category Distribution for Chart
    const categoryCount: Record<string, number> = {};
    enrichedMilestones.forEach((m) => {
      categoryCount[m.category] = (categoryCount[m.category] || 0) + 1;
    });

    const categoryColors: Record<string, string> = {
      Technical: '#6366f1',
      Foundational: '#06b6d4',
      Project: '#d946ef',
      Extracurricular: '#10b981',
      Placement: '#f59e0b',
      Professional: '#8b5cf6',
      Leadership: '#ec4899',
    };

    const domainBreakdown = Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || '#94a3b8',
    }));

    // Skill Velocity across Semesters (Sem 1 to Sem 8)
    const currentSem = (targetYear - 1) * 2 + 1;
    const skillVelocity = [
      { semester: 'Sem 1', target: 20, actual: currentSem >= 1 ? 22 : 0 },
      { semester: 'Sem 2', target: 35, actual: currentSem >= 2 ? 38 : 0 },
      { semester: 'Sem 3', target: 50, actual: currentSem >= 3 ? (targetYear >= 2 ? 54 : 0) : 0 },
      { semester: 'Sem 4', target: 65, actual: currentSem >= 4 ? (completedMilestones >= 2 ? 68 : 52) : 0 },
      { semester: 'Sem 5', target: 78, actual: currentSem >= 5 ? 79 : 0 },
      { semester: 'Sem 6', target: 88, actual: currentSem >= 6 ? 89 : 0 },
      { semester: 'Sem 7', target: 95, actual: currentSem >= 7 ? 94 : 0 },
      { semester: 'Sem 8', target: 100, actual: currentSem >= 8 ? 98 : 0 },
    ];

    // Competency Radar Data tailored to chosen Target Role
    const isAiRole = targetRole.toLowerCase().includes('ai') || targetRole.toLowerCase().includes('machine');
    const isCloudRole = targetRole.toLowerCase().includes('cloud') || targetRole.toLowerCase().includes('devops');

    const competencyRadar = [
      {
        subject: 'Algorithms & DSA',
        studentScore: totalCompletedAllYears >= 4 ? 85 : 55,
        targetRequirement: 90,
      },
      {
        subject: isAiRole ? 'PyTorch & Math' : isCloudRole ? 'Docker & K8s' : 'Full-Stack Web',
        studentScore: completedMilestones >= 1 ? 82 : 48,
        targetRequirement: 85,
      },
      {
        subject: 'System Architecture',
        studentScore: targetYear >= 3 ? 72 : 45,
        targetRequirement: 80,
      },
      {
        subject: 'Production Projects',
        studentScore: profile?.projects?.length ? 88 : 75,
        targetRequirement: 85,
      },
      {
        subject: 'Hackathons & Clubs',
        studentScore: extracurricularPreferences.length * 25,
        targetRequirement: 75,
      },
      {
        subject: 'Placement & Behavioral',
        studentScore: targetYear === 4 ? 90 : targetYear === 3 ? 70 : 50,
        targetRequirement: 85,
      },
    ];

    const theme =
      targetYear === 1
        ? 'Explore & Build Foundations'
        : targetYear === 2
        ? 'Build & Experiment'
        : targetYear === 3
        ? 'Specialize & Prepare'
        : 'Placement Readiness';

    return NextResponse.json({
      success: true,
      year: targetYear,
      theme,
      studentContext: {
        targetRole,
        preferredDomains,
        currentSkills,
        extracurricularPreferences,
        academicYear: targetYear,
      },
      milestones: enrichedMilestones,
      analytics: {
        totalMilestones,
        completedMilestones,
        completionPercentage,
        estimatedHoursTotal,
        estimatedHoursCompleted,
        readinessScore,
        domainBreakdown,
        skillVelocity,
        competencyRadar,
      },
    });
  } catch (error) {
    console.error('Roadmap error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
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

    // 1. Handle preference customization save
    if (body.action === 'update_preferences') {
      const { targetRole, preferredDomains, extracurricularPreferences, primaryGoal, currentSkills } = body;
      const updatedProfile = await prisma.studentProfile.update({
        where: { userId: session.id },
        data: {
          ...(targetRole ? { targetRole } : {}),
          ...(preferredDomains ? { preferredDomains } : {}),
          ...(extracurricularPreferences ? { extracurricularPreferences } : {}),
          ...(primaryGoal ? { primaryGoal } : {}),
          ...(currentSkills ? { skills: currentSkills } : {}),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Student preferences and roadmap customization saved successfully.',
        profile: updatedProfile,
      });
    }

    // 2. Handle milestone toggle
    const { milestoneId, completed, status } = body;

    if (!milestoneId) {
      return NextResponse.json({ success: false, error: 'milestoneId is required' }, { status: 400 });
    }

    const updated = await prisma.userRoadmapMilestone.upsert({
      where: {
        userId_milestoneId: {
          userId: session.id,
          milestoneId,
        },
      },
      create: {
        userId: session.id,
        milestoneId,
        completed: Boolean(completed),
        status: status || (completed ? 'COMPLETED' : 'IN_PROGRESS'),
        completedAt: completed ? new Date() : null,
      },
      update: {
        completed: Boolean(completed),
        status: status || (completed ? 'COMPLETED' : 'IN_PROGRESS'),
        completedAt: completed ? new Date() : null,
      },
    });

    // Recompute development score
    const allCompleted = await prisma.userRoadmapMilestone.count({
      where: { userId: session.id, completed: true },
    });

    const newScore = Math.min(50 + allCompleted * 4, 98);
    await prisma.studentProfile.updateMany({
      where: { userId: session.id },
      data: { developmentScore: newScore },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      developmentScore: newScore,
    });
  } catch (error) {
    console.error('Milestone toggle error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update milestone' },
      { status: 500 }
    );
  }
}

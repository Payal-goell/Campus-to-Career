import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const onboardingSchema = z.object({
  basicInfo: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().optional(),
    avatarUrl: z.string().optional(),
  }),
  academicDetails: z.object({
    collegeId: z.string().optional(),
    collegeName: z.string().default('University Institute of Technology, RGPV, Bhopal'),
    branch: z.string().min(2, 'Branch is required'),
    currentYear: z.number().int().min(1).max(4),
    cgpa: z.number().min(0).max(10).optional(),
  }),
  currentSkills: z.array(z.string()).default([]),
  careerPreferences: z.object({
    targetRole: z.string().min(2, 'Target role is required'),
    preferredDomains: z.array(z.string()).default([]),
  }),
  goals: z.object({
    targetPlacementYear: z.number().int().optional(),
    primaryGoal: z.string().min(2, 'Primary goal is required'),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Please log in to complete onboarding' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { basicInfo, academicDetails, currentSkills, careerPreferences, goals } = parsed.data;

    // Calculate baseline development score
    let score = 45; // base score for completing onboarding
    if (academicDetails.cgpa) {
      score += Math.min(Math.round((academicDetails.cgpa / 10) * 20), 20);
    }
    score += Math.min(currentSkills.length * 4, 20); // up to 20 pts for skills
    if (goals.primaryGoal) score += 5;
    if (careerPreferences.targetRole) score += 5;
    score = Math.min(Math.max(score, 50), 95);

    const profile = await prisma.studentProfile.upsert({
      where: { userId: session.id },
      create: {
        userId: session.id,
        fullName: basicInfo.fullName,
        phone: basicInfo.phone || null,
        avatarUrl: basicInfo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        collegeId: academicDetails.collegeId || 'clg_101',
        collegeName: academicDetails.collegeName || 'University Institute of Technology, RGPV, Bhopal',
        branch: academicDetails.branch,
        currentYear: academicDetails.currentYear,
        cgpa: academicDetails.cgpa || null,
        skills: currentSkills,
        targetRole: careerPreferences.targetRole,
        preferredDomains: careerPreferences.preferredDomains,
        targetPlacementYear: goals.targetPlacementYear || (new Date().getFullYear() + (4 - academicDetails.currentYear)),
        primaryGoal: goals.primaryGoal,
        profileCompletion: 85,
        developmentScore: score,
      },
      update: {
        fullName: basicInfo.fullName,
        phone: basicInfo.phone || null,
        avatarUrl: basicInfo.avatarUrl,
        branch: academicDetails.branch,
        currentYear: academicDetails.currentYear,
        cgpa: academicDetails.cgpa || null,
        skills: currentSkills,
        targetRole: careerPreferences.targetRole,
        preferredDomains: careerPreferences.preferredDomains,
        targetPlacementYear: goals.targetPlacementYear,
        primaryGoal: goals.primaryGoal,
        profileCompletion: 85,
        developmentScore: score,
      },
    });

    await prisma.user.update({
      where: { id: session.id },
      data: { isOnboarded: true },
    });

    // Populate user roadmap milestones if not yet linked
    const existingMilestones = await prisma.userRoadmapMilestone.findMany({
      where: { userId: session.id },
    });

    if (existingMilestones.length === 0) {
      const allMilestones = await prisma.roadmapMilestone.findMany({
        where: { year: { lte: academicDetails.currentYear } },
      });

      for (const m of allMilestones) {
        await prisma.userRoadmapMilestone.create({
          data: {
            userId: session.id,
            milestoneId: m.id,
            completed: m.year < academicDetails.currentYear,
            status: m.year < academicDetails.currentYear ? 'COMPLETED' : 'IN_PROGRESS',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding profile initialized successfully.',
      initialScore: score,
      dashboardUrl: '/dashboard',
      profile,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during onboarding' },
      { status: 500 }
    );
  }
}

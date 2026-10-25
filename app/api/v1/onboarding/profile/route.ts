import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isDatabaseError } from '@/lib/demo-accounts';
import {
  LocalAccount,
  LocalProfile,
  readLocalAccounts,
  upsertLocalAccount,
  writeLocalAccounts,
} from '@/lib/local-accounts';
import { z } from 'zod';
import { placementYearFromCurrentYear } from '@/lib/placement-year';
import type { SkillAssessmentRecord } from '@/lib/skill-assessment';
import { DEFAULT_COLLEGE, avatarError, cgpaError, normalizeIndianMobile, phoneError } from '@/lib/field-rules';

const assessmentSchema = z.object({
  name: z.string().min(1).max(80),
  kind: z.enum(['technical', 'extracurricular']),
  mode: z.enum(['basic', 'intermediate', 'advanced']),
  quizLevel: z.enum(['easy', 'medium', 'hard']).optional(),
  percent: z.number().int().min(0).max(100),
  proof: z
    .object({
      fileName: z.string().max(180),
      fileType: z.string().max(120),
      fileSize: z.number().int().nonnegative().max(80_000_000),
    })
    .optional(),
});

const onboardingSchema = z.object({
  basicInfo: z.object({
    fullName: z.string().trim().min(2, 'Full name is required').max(80),
    phone: z.string().trim().superRefine((value, ctx) => {
      const message = phoneError(value);
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }).transform((value) => normalizeIndianMobile(value) as string),
    avatarUrl: z.string().trim().max(500).optional().superRefine((value, ctx) => {
      const message = avatarError(value || '');
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }),
  }),
  academicDetails: z.object({
    collegeId: z.string().optional(),
    collegeName: z.string().trim().min(3, 'College name is required').max(160),
    branch: z.string().trim().min(2, 'Branch is required'),
    currentYear: z.number().int().min(1).max(4),
    cgpa: z.number().superRefine((value, ctx) => {
      const message = cgpaError(String(value));
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }),
  }),
  currentSkills: z.array(z.string()).default([]),
  skillAssessments: z.array(assessmentSchema).min(1, 'Add at least one skill and finish its check'),
  careerPreferences: z.object({
    targetRole: z.string().trim().min(2, 'Target role is required'),
    preferredDomains: z.array(z.string().trim().min(1)).min(1, 'Choose at least one domain'),
  }),
  goals: z.object({
    targetPlacementYear: z.number().int().optional(),
    primaryGoal: z.string().trim().min(8, 'Choose a career milestone').max(180),
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

    const { basicInfo, academicDetails, currentSkills, skillAssessments, careerPreferences, goals } = parsed.data;
    const placementYear = placementYearFromCurrentYear(academicDetails.currentYear);

    // Calculate baseline development score
    let score = 45; // base score for completing onboarding
    if (academicDetails.cgpa) {
      score += Math.min(Math.round((academicDetails.cgpa / 10) * 20), 20);
    }
    if (skillAssessments.length > 0) {
      const average = Math.round(skillAssessments.reduce((sum, item) => sum + item.percent, 0) / skillAssessments.length);
      score += Math.min(Math.round(average / 5), 20);
    } else {
      score += Math.min(currentSkills.length * 4, 20);
    }
    if (goals.primaryGoal) score += 5;
    if (careerPreferences.targetRole) score += 5;
    score = Math.min(Math.max(score, 50), 95);

    const profileData: LocalProfile = {
      fullName: basicInfo.fullName,
      phone: basicInfo.phone || null,
      avatarUrl: basicInfo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      collegeName: academicDetails.collegeName || DEFAULT_COLLEGE,
      branch: academicDetails.branch,
      currentYear: academicDetails.currentYear,
      cgpa: academicDetails.cgpa || null,
      skills: currentSkills,
      skillAssessments: skillAssessments as SkillAssessmentRecord[],
      targetPlacementYear: placementYear,
      targetRole: careerPreferences.targetRole,
      preferredDomains: careerPreferences.preferredDomains,
      primaryGoal: goals.primaryGoal,
      profileCompletion: 85,
      developmentScore: score,
    };

    const saveLocally = () => {
      const accounts = readLocalAccounts(req);
      const existing = accounts.find((account) => account.id === session.id);
      const account: LocalAccount = {
        id: session.id,
        email: session.email,
        password: existing?.password || '',
        role: session.role,
        isVerified: true,
        isOnboarded: true,
        verificationToken: null,
        otpExpiresAt: null,
        otpSentAt: null,
        otpAttempts: 0,
        name: profileData.fullName,
        avatarUrl: profileData.avatarUrl,
        developmentScore: score,
        profile: profileData,
      };
      const response = NextResponse.json({
        success: true,
        message: 'Onboarding profile initialized successfully.',
        initialScore: score,
        dashboardUrl: '/dashboard',
        profile: { id: `${session.id}-profile`, userId: session.id, ...profileData },
      });
      writeLocalAccounts(response, upsertLocalAccount(accounts, account));
      return response;
    };

    if (session.id.startsWith('local-') || session.id.startsWith('demo-')) {
      return saveLocally();
    }

    let profile;
    try {
      profile = await prisma.studentProfile.upsert({
      where: { userId: session.id },
      create: {
        userId: session.id,
        fullName: basicInfo.fullName,
        phone: basicInfo.phone || null,
        avatarUrl: basicInfo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        collegeId: academicDetails.collegeId || 'clg_101',
        collegeName: academicDetails.collegeName || DEFAULT_COLLEGE,
        branch: academicDetails.branch,
        currentYear: academicDetails.currentYear,
        cgpa: academicDetails.cgpa || null,
        skills: currentSkills,
        targetRole: careerPreferences.targetRole,
        preferredDomains: careerPreferences.preferredDomains,
        targetPlacementYear: placementYear,
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
        targetPlacementYear: placementYear,
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
      profile: { ...profile, skillAssessments, targetPlacementYear: placementYear },
    });
    } catch (error) {
      if (!isDatabaseError(error)) throw error;
      return saveLocally();
    }
  } catch (error) {
    console.error('Onboarding error:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json(
        { success: false, error: 'The site database is not reachable. Sign in and try onboarding again.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error during onboarding' },
      { status: 500 }
    );
  }
}

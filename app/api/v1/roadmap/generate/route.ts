import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isDatabaseError } from '@/lib/demo-accounts';
import {
  sanitizeProfileForStorage,
  toMlStudentProfile,
  type MapProfileInput,
  type MlStudentProfile,
} from '@/lib/roadmap/ml-profile';
import {
  rulesFallbackRoadmap,
  type UnifiedRoadmapResponse,
} from '@/lib/roadmap/rules-fallback';

const ML_TIMEOUT_MS = 8000;

function mlServiceUrl(): string | null {
  const raw = process.env.ML_SERVICE_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, '');
}

async function callMlService(profile: MlStudentProfile): Promise<UnifiedRoadmapResponse | null> {
  const base = mlServiceUrl();
  if (!base) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ML_TIMEOUT_MS);
  try {
    const res = await fetch(`${base}/api/roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as UnifiedRoadmapResponse;
    if (!data?.steps || !Array.isArray(data.steps)) return null;
    return {
      source: data.source === 'ml' ? 'ml' : 'rules',
      steps: data.steps,
      total_hours: data.total_hours ?? 0,
      hours_available: data.hours_available ?? 0,
      skipped_for_lack_of_time: data.skipped_for_lack_of_time ?? [],
      note: data.note ?? null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function persistRoadmap(
  userId: string,
  profile: MlStudentProfile,
  result: UnifiedRoadmapResponse
): Promise<string | null> {
  try {
    const row = await prisma.generatedRoadmap.create({
      data: {
        userId,
        profile: sanitizeProfileForStorage(profile) as object,
        steps: result.steps as object[],
        source: result.source,
        note: result.note ?? null,
        totalHours: result.total_hours,
        hoursAvailable: result.hours_available,
        skipped: result.skipped_for_lack_of_time as object,
      },
    });
    return row.id;
  } catch (error) {
    if (isDatabaseError(error)) return null;
    console.error('Failed to store generated roadmap', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let body: MapProfileInput = {};
    try {
      body = (await req.json()) as MapProfileInput;
    } catch {
      body = {};
    }

    // Prefer explicit body; fill gaps from stored student profile when present.
    let stored: MapProfileInput = {};
    try {
      const profile = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
      if (profile) {
        stored = {
          branch: profile.branch,
          currentYear: profile.currentYear,
          graduationYear: profile.graduationYear,
          targetRole: profile.targetRole,
          primaryGoal: profile.primaryGoal,
          careerGoal: profile.careerGoal,
          weeklyHours: profile.weeklyHours,
          readiness: profile.readiness,
          skillLevels: (profile.skillLevels as Record<string, number> | null) ?? undefined,
          skills: profile.skills,
        };
      }
    } catch (error) {
      if (!isDatabaseError(error)) throw error;
    }

    const mlProfile = toMlStudentProfile({ ...stored, ...body });
    let result = await callMlService(mlProfile);
    if (!result) {
      result = rulesFallbackRoadmap(
        mlProfile,
        mlServiceUrl()
          ? 'ML service timed out or failed, used the built-in rule engine.'
          : 'ML_SERVICE_URL is not set, used the built-in rule engine.'
      );
    }

    const roadmapId = await persistRoadmap(session.id, mlProfile, result);
    return NextResponse.json({
      success: true,
      ...result,
      roadmapId,
      profile: sanitizeProfileForStorage(mlProfile),
    });
  } catch (error) {
    console.error('Roadmap generate error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not generate roadmap' },
      { status: 500 }
    );
  }
}

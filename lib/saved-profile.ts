import type { DashboardOverview, StudentProfileData } from '@/lib/types';

const READY_KEY = 'ctc.profile-ready.v1';
const PROFILE_KEY = 'ctc.saved-profile.v1';

type Saved = { userId: string; overview: DashboardOverview };

function readReady(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(READY_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function profileMarkedReady(userId: string): boolean {
  return readReady().includes(userId);
}

export function markProfileReadyLocal(userId: string) {
  if (typeof window === 'undefined' || !userId) return;
  const ids = readReady();
  if (!ids.includes(userId)) {
    localStorage.setItem(READY_KEY, JSON.stringify([...ids, userId]));
  }
}

export function rememberSavedProfile(userId: string, overview: DashboardOverview) {
  if (typeof window === 'undefined' || !userId) return;
  markProfileReadyLocal(userId);
  const saved: Saved = { userId, overview };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(saved));
}

export function savedProfileFor(userId: string): DashboardOverview | null {
  if (typeof window === 'undefined' || !userId) return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') as Saved | null;
    if (!parsed || parsed.userId !== userId || !parsed.overview?.student?.fullName) return null;
    return parsed.overview;
  } catch {
    return null;
  }
}

export function overviewFromSavedProfile(
  userId: string,
  profile: Partial<StudentProfileData> & { fullName: string },
  score: number
): DashboardOverview {
  const year = profile.currentYear || 1;
  return {
    profileCompletion: profile.profileCompletion ?? 85,
    developmentScore: score,
    roadmapProgress: {
      currentYear: year,
      totalMilestones: 7,
      completedMilestones: Math.max(0, year - 1),
      progressPercentage: Math.min(100, year * 20),
    },
    skillGapAnalysis: [],
    recommendedActions: [
      'Open the roadmap and finish one milestone this week',
      'Save a course from NPTEL, Coursera, or Udemy that matches your target role',
    ],
    upcomingEvents: [],
    savedResourcesCount: 0,
    applicationsCount: 0,
    student: {
      id: profile.id || `${userId}-profile`,
      userId: profile.userId || userId,
      fullName: profile.fullName,
      phone: profile.phone ?? null,
      avatarUrl: profile.avatarUrl ?? null,
      collegeName: profile.collegeName || '',
      branch: profile.branch || '',
      currentYear: year,
      cgpa: profile.cgpa ?? null,
      skills: profile.skills || [],
      skillAssessments: profile.skillAssessments || [],
      targetRole: profile.targetRole ?? null,
      preferredDomains: profile.preferredDomains || [],
      targetPlacementYear: profile.targetPlacementYear ?? null,
      primaryGoal: profile.primaryGoal ?? null,
      profileCompletion: profile.profileCompletion ?? 85,
      developmentScore: score,
      projects: profile.projects || [],
      certifications: profile.certifications || [],
    },
  };
}

/**
 * TypeScript rule-based fallback when the ML service is unreachable.
 * Keeps the pictorial engine as a safety net and maps it to the ML response shape.
 */
import { generateRoadmap } from './generate';
import type { StudentProfile } from './types';
import type { MlStudentProfile } from './ml-profile';

export interface UnifiedRoadmapStep {
  step: number;
  id: string;
  title: string;
  hours: number;
  reason: string;
  added_as_prerequisite: boolean;
}

export interface UnifiedRoadmapResponse {
  source: 'ml' | 'rules';
  steps: UnifiedRoadmapStep[];
  total_hours: number;
  hours_available: number;
  skipped_for_lack_of_time: string[];
  note?: string | null;
  roadmapId?: string | null;
}

function mlRoleToTargetRole(role: MlStudentProfile['role']): string {
  switch (role) {
    case 'web_dev':
      return 'Full-Stack Software Engineer';
    case 'data_analyst':
      return 'Data Analyst / Data Scientist';
    case 'ml_engineer':
      return 'AI / Machine Learning Engineer';
    case 'cloud_devops':
      return 'Cloud & DevOps Engineer';
    default:
      return 'Backend Systems Engineer';
  }
}

function mlCourseToBranch(course: MlStudentProfile['course']): string {
  switch (course) {
    case 'CSE':
      return 'Computer Science & Engineering';
    case 'IT':
      return 'Information Technology';
    case 'ECE':
      return 'Electronics & Communication Engineering';
    case 'EE':
      return 'Electrical Engineering';
    case 'ME':
      return 'Mechanical Engineering';
    default:
      return 'B.Tech first year (RGPV common)';
  }
}

function estimateCurrentYear(monthsLeft: number): 1 | 2 | 3 | 4 {
  if (monthsLeft > 36) return 1;
  if (monthsLeft > 24) return 2;
  if (monthsLeft > 12) return 3;
  return 4;
}

function interestFromRole(role: MlStudentProfile['role']): StudentProfile['interestDomains'] {
  if (role === 'data_analyst' || role === 'ml_engineer') return ['AI/Data Science'];
  if (role === 'cloud_devops') return ['Cloud and DevOps'];
  if (role === 'web_dev') return ['Web Development'];
  return ['Web Development'];
}

export function tsProfileFromMl(ml: MlStudentProfile): Partial<StudentProfile> {
  const months = ml.months_left ?? 24;
  const skills = Object.entries(ml.skills || {}).map(([name, level]) => ({
    name,
    category: 'technical' as const,
    level: (level === 0 ? 0 : level) as 0 | 1 | 2 | 3 | 4,
  }));

  return {
    branch: mlCourseToBranch(ml.course),
    currentYear: estimateCurrentYear(months),
    skills,
    interestDomains: interestFromRole(ml.role),
    talentInterests: ['Leadership/Volunteering'],
    targetRole: mlRoleToTargetRole(ml.role),
    weeklyHours: ml.weekly_hours,
    completedNodeIds: [],
    isPersonalized: true,
  };
}

export function rulesFallbackRoadmap(ml: MlStudentProfile, note?: string): UnifiedRoadmapResponse {
  const generated = generateRoadmap(tsProfileFromMl(ml));
  const budget = Math.round(ml.weekly_hours * 4.3 * (ml.months_left ?? 24) * 0.8);

  const kept: UnifiedRoadmapStep[] = [];
  const skipped: string[] = [];
  let used = 0;

  for (const node of generated.nodes) {
    const hours = node.estimatedHours || 8;
    const reason =
      node.why?.trim() ||
      `Recommended for ${generated.profile.targetRole} based on your year and skill gaps.`;
    if (used + hours <= budget || kept.length < 3) {
      kept.push({
        step: kept.length + 1,
        id: node.id,
        title: node.title,
        hours,
        reason,
        added_as_prerequisite: false,
      });
      used += hours;
    } else {
      skipped.push(node.title);
    }
  }

  return {
    source: 'rules',
    steps: kept,
    total_hours: kept.reduce((s, n) => s + n.hours, 0),
    hours_available: budget,
    skipped_for_lack_of_time: skipped,
    note: note || 'ML service unavailable, used the built-in rule engine.',
  };
}

/**
 * Map Campus-to-Career onboarding / profile fields → ML service schema.
 *
 * Identification (name, mobile) is accepted by the API for UX but must NEVER
 * be sent as model features or stored in training exports.
 */
import { placementYearFromCurrentYear } from '@/lib/placement-year';

export type MlCourse = 'CSE' | 'IT' | 'ECE' | 'EE' | 'ME' | 'OTHER';
export type MlRole = 'sde' | 'web_dev' | 'data_analyst' | 'ml_engineer' | 'cloud_devops';
export type MlGoal = 'product_company' | 'service_company' | 'startup' | 'higher_studies';
export type MlSkillLevel = 0 | 1 | 2 | 3;

export const ML_SKILLS = [
  'programming',
  'dsa',
  'web_basics',
  'fullstack',
  'sql',
  'git',
  'statistics',
  'ml_basics',
  'system_design',
  'cloud',
  'aptitude',
  'communication',
  'projects',
  'extracurricular',
] as const;

export type MlSkillId = (typeof ML_SKILLS)[number];

export interface MlStudentProfile {
  course: MlCourse;
  role: MlRole;
  goal: MlGoal;
  weekly_hours: number;
  readiness: number;
  graduation_year: number;
  months_left?: number;
  skills: Partial<Record<MlSkillId, MlSkillLevel>>;
}

export interface MapProfileInput {
  branch?: string | null;
  currentYear?: number | null;
  graduationYear?: number | null;
  targetRole?: string | null;
  primaryGoal?: string | null;
  careerGoal?: string | null;
  weeklyHours?: number | string | null;
  readiness?: number | string | null;
  confidence?: string | null;
  skillLevels?: Record<string, number> | null;
  skills?: Array<{ name: string; level?: number }> | string[] | null;
  extracurricularLevel?: number | null;
}

const SKILL_ALIASES: Record<string, MlSkillId> = {
  programming: 'programming',
  python: 'programming',
  java: 'programming',
  'c++': 'programming',
  javascript: 'programming',
  typescript: 'programming',
  dsa: 'dsa',
  'data structures': 'dsa',
  'data structures & algorithms': 'dsa',
  algorithms: 'dsa',
  web: 'web_basics',
  'web basics': 'web_basics',
  html: 'web_basics',
  css: 'web_basics',
  react: 'web_basics',
  'react.js': 'web_basics',
  fullstack: 'fullstack',
  'full-stack': 'fullstack',
  'node.js': 'fullstack',
  node: 'fullstack',
  sql: 'sql',
  postgresql: 'sql',
  git: 'git',
  github: 'git',
  statistics: 'statistics',
  stats: 'statistics',
  ml: 'ml_basics',
  'machine learning': 'ml_basics',
  'system design': 'system_design',
  cloud: 'cloud',
  aws: 'cloud',
  docker: 'cloud',
  devops: 'cloud',
  aptitude: 'aptitude',
  communication: 'communication',
  'communication & leadership': 'communication',
  projects: 'projects',
  extracurricular: 'extracurricular',
};

/** Clamp any incoming level into the ML 0–3 scale. */
export function toMlLevel(raw: unknown): MlSkillLevel {
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n <= 1) return 1;
  if (n <= 2) return 2;
  // Legacy 1–4 scale from the pictorial roadmap: 4 → 3
  return 3;
}

export function mapBranchToCourse(branch?: string | null): MlCourse {
  const b = (branch || '').toLowerCase();
  if (b.includes('computer') || b.includes('cse') || b.includes('cs ')) return 'CSE';
  if (b.includes('information technology') || /\bit\b/.test(b) || b.includes('information tech')) return 'IT';
  if (b.includes('electronics') || b.includes('ece') || b.includes('communication eng')) return 'ECE';
  if (b.includes('electrical') || /\bee\b/.test(b)) return 'EE';
  if (b.includes('mechanical') || /\bme\b/.test(b)) return 'ME';
  return 'OTHER';
}

export function mapTargetRole(role?: string | null): MlRole {
  const r = (role || '').toLowerCase();
  if (r.includes('data analyst') || r.includes('data scientist') || r.includes('analyst')) return 'data_analyst';
  if (r.includes('machine learning') || r.includes('ml engineer') || r.includes('ai /')) return 'ml_engineer';
  if (r.includes('cloud') || r.includes('devops') || r.includes('sre')) return 'cloud_devops';
  if (r.includes('web') || r.includes('front') || r.includes('full-stack') || r.includes('fullstack')) return 'web_dev';
  if (r.includes('sde') || r.includes('software') || r.includes('backend') || r.includes('systems')) return 'sde';
  return 'sde';
}

export function mapCareerGoal(goal?: string | null, careerGoal?: string | null): MlGoal {
  if (careerGoal === 'product_company' || careerGoal === 'service_company' || careerGoal === 'startup' || careerGoal === 'higher_studies') {
    return careerGoal;
  }
  const g = (goal || '').toLowerCase();
  if (g.includes('product')) return 'product_company';
  if (g.includes('startup') || g.includes('found')) return 'startup';
  if (g.includes('gate') || g.includes('higher') || g.includes('m.tech') || g.includes('ms') || g.includes('gre')) {
    return 'higher_studies';
  }
  if (g.includes('campus') || g.includes('tcs') || g.includes('infosys') || g.includes('wipro') || g.includes('service')) {
    return 'service_company';
  }
  return 'service_company';
}

export function mapReadiness(raw?: number | string | null, confidence?: string | null): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(0, Math.min(100, Math.round(raw)));
  if (typeof raw === 'string' && raw.trim() && !Number.isNaN(Number(raw))) {
    return Math.max(0, Math.min(100, Math.round(Number(raw))));
  }
  const c = (confidence || '').toLowerCase();
  if (c.includes('interview')) return 75;
  if (c.includes('build')) return 45;
  if (c.includes('explor')) return 20;
  return 35;
}

export function mapWeeklyHours(raw?: number | string | null): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(1, Math.min(60, Math.round(raw)));
  if (!raw) return 10;
  const nums = String(raw).match(/\d+/g)?.map(Number) ?? [];
  if (!nums.length) return 10;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return Math.max(1, Math.min(60, Math.round(avg)));
}

export function mapSkillLevels(input: MapProfileInput): Partial<Record<MlSkillId, MlSkillLevel>> {
  const out: Partial<Record<MlSkillId, MlSkillLevel>> = {};

  if (input.skillLevels && typeof input.skillLevels === 'object') {
    for (const [key, value] of Object.entries(input.skillLevels)) {
      const id = (ML_SKILLS.includes(key as MlSkillId) ? key : SKILL_ALIASES[key.toLowerCase()]) as MlSkillId | undefined;
      if (id) out[id] = toMlLevel(value);
    }
  }

  if (Array.isArray(input.skills)) {
    for (const item of input.skills) {
      if (typeof item === 'string') {
        const id = SKILL_ALIASES[item.toLowerCase()];
        if (id && out[id] === undefined) out[id] = 1;
        continue;
      }
      const id = SKILL_ALIASES[item.name.toLowerCase()];
      if (id) out[id] = toMlLevel(item.level ?? 1);
    }
  }

  if (input.extracurricularLevel != null) {
    out.extracurricular = toMlLevel(input.extracurricularLevel);
  }

  return out;
}

export function monthsLeftFromGraduationYear(graduationYear: number, today = new Date()): number {
  const months = (graduationYear - today.getFullYear()) * 12 + (5 - (today.getMonth() + 1));
  return Math.max(1, Math.min(48, months));
}

/**
 * Single mapping function used by the generate API.
 * Does not include name or mobile.
 */
export function toMlStudentProfile(input: MapProfileInput): MlStudentProfile {
  const currentYear = Math.min(4, Math.max(1, Math.round(Number(input.currentYear) || 1)));
  const graduationYear =
    input.graduationYear && Number.isFinite(Number(input.graduationYear))
      ? Math.round(Number(input.graduationYear))
      : placementYearFromCurrentYear(currentYear);

  return {
    course: mapBranchToCourse(input.branch),
    role: mapTargetRole(input.targetRole),
    goal: mapCareerGoal(input.primaryGoal, input.careerGoal),
    weekly_hours: mapWeeklyHours(input.weeklyHours),
    readiness: mapReadiness(input.readiness, input.confidence),
    graduation_year: graduationYear,
    months_left: monthsLeftFromGraduationYear(graduationYear),
    skills: mapSkillLevels(input),
  };
}

/** Strip PII before DB / training export. */
export function sanitizeProfileForStorage(profile: MlStudentProfile): MlStudentProfile {
  return {
    course: profile.course,
    role: profile.role,
    goal: profile.goal,
    weekly_hours: profile.weekly_hours,
    readiness: profile.readiness,
    graduation_year: profile.graduation_year,
    months_left: profile.months_left,
    skills: { ...profile.skills },
  };
}

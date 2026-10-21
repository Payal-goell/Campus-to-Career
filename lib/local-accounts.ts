import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import type { UserRole, UserSession } from '@/lib/types';
import { knowledgePercent, type SkillAssessmentRecord } from '@/lib/skill-assessment';
import { demoAccountFromToken } from '@/lib/demo-accounts';

const ACCOUNTS_COOKIE = 'ctc_accounts';
const APPS_COOKIE = 'ctc_applications';

export interface LocalProfile {
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  collegeName: string;
  branch: string;
  currentYear: number;
  cgpa?: number | null;
  skills: string[];
  skillAssessments?: SkillAssessmentRecord[];
  targetPlacementYear?: number | null;
  targetRole?: string | null;
  preferredDomains: string[];
  primaryGoal?: string | null;
  profileCompletion: number;
  developmentScore: number;
}

export interface LocalAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  isOnboarded: boolean;
  verificationToken: string | null;
  otpExpiresAt: string | null;
  otpSentAt: string | null;
  otpAttempts: number;
  name?: string;
  avatarUrl?: string | null;
  developmentScore?: number;
  profile?: LocalProfile | null;
}

export interface LocalApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  location: string | null;
  salary: string | null;
  status: string;
  appliedDate: string;
  notes: string | null;
  interviews: Array<{
    id: string;
    round: string;
    date: string;
    mode: string;
    feedback: string | null;
    status: string;
  }>;
}

function secret() {
  return process.env.JWT_SECRET || 'campus-to-career-dev-jwt-secret-key-99887766';
}

function sign(body: string) {
  return createHmac('sha256', secret()).update(body).digest('base64url');
}

function readSigned<T>(req: NextRequest, name: string): T | null {
  const raw = req.cookies.get(name)?.value;
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot <= 0) return null;
  const body = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  const expected = sign(body);
  const actualBuf = Buffer.from(mac);
  const expectedBuf = Buffer.from(expected);
  if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

function writeSigned(response: NextResponse, name: string, value: unknown) {
  const body = Buffer.from(JSON.stringify(value)).toString('base64url');
  response.cookies.set(name, `${body}.${sign(body)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
}

export function newLocalId(prefix = 'local') {
  return `${prefix}-${randomBytes(8).toString('hex')}`;
}

export function readLocalAccounts(req: NextRequest): LocalAccount[] {
  const parsed = readSigned<LocalAccount[]>(req, ACCOUNTS_COOKIE);
  return Array.isArray(parsed) ? parsed : [];
}

export function writeLocalAccounts(response: NextResponse, accounts: LocalAccount[]) {
  let next = accounts.slice(-8);
  let encoded = Buffer.from(JSON.stringify(next)).toString('base64url');
  if (encoded.length > 2800) {
    next = next.map((account, index) =>
      index === next.length - 1 ? account : { ...account, profile: null }
    );
  }
  writeSigned(response, ACCOUNTS_COOKIE, next);
}

export function upsertLocalAccount(accounts: LocalAccount[], account: LocalAccount) {
  const index = accounts.findIndex((item) => item.email === account.email || item.id === account.id);
  if (index === -1) return [...accounts, account];
  const copy = accounts.slice();
  copy[index] = account;
  return copy;
}

export function readLocalApplications(req: NextRequest): LocalApplication[] {
  const parsed = readSigned<LocalApplication[]>(req, APPS_COOKIE);
  return Array.isArray(parsed) ? parsed : [];
}

export function writeLocalApplications(response: NextResponse, applications: LocalApplication[]) {
  writeSigned(response, APPS_COOKIE, applications.slice(-20));
}

export function sessionForPayload(
  req: NextRequest,
  payload: { userId: string; email: string }
): UserSession | null {
  const local = readLocalAccounts(req).find(
    (account) => account.id === payload.userId && account.email === payload.email.toLowerCase()
  );
  const demo = demoAccountFromToken(payload.userId, payload.email);
  if (demo) {
    return {
      id: demo.id,
      email: demo.email,
      role: demo.role,
      isOnboarded: local?.isOnboarded ?? demo.isOnboarded,
      name: local?.profile?.fullName || local?.name || demo.name,
      avatarUrl: local?.profile?.avatarUrl || demo.avatarUrl,
    };
  }
  if (!local?.isVerified) return null;
  return {
    id: local.id,
    email: local.email,
    role: local.role,
    isOnboarded: local.isOnboarded,
    name: local.profile?.fullName || local.name || local.email.split('@')[0],
    avatarUrl: local.profile?.avatarUrl || local.avatarUrl || undefined,
  };
}

export function dashboardForAccount(account: LocalAccount) {
  const profile = account.profile;
  if (!profile) return null;
  return {
    success: true,
    profileCompletion: profile.profileCompletion,
    developmentScore: profile.developmentScore,
    roadmapProgress: {
      currentYear: profile.currentYear,
      totalMilestones: 7,
      completedMilestones: Math.max(0, profile.currentYear - 1),
      progressPercentage: Math.min(100, profile.currentYear * 20),
    },
    skillGapAnalysis: [
      { skill: 'Data Structures & Algorithms', required: 90, current: knowledgePercent(profile.skillAssessments, 'Data Structures & Algorithms', profile.skills.length ? 70 : 40) },
      { skill: 'React / Next.js', required: 85, current: knowledgePercent(profile.skillAssessments, 'React / Next.js', 55) },
      { skill: 'System Design', required: 80, current: knowledgePercent(profile.skillAssessments, 'System Design', 35) },
      { skill: 'Databases & SQL', required: 85, current: knowledgePercent(profile.skillAssessments, 'Databases & SQL', 50) },
      { skill: 'Cloud & Docker', required: 75, current: knowledgePercent(profile.skillAssessments, 'Cloud & Docker', 30) },
      { skill: 'Communication & Behavioral', required: 80, current: knowledgePercent(profile.skillAssessments, 'Communication & Behavioral', 60) },
    ],
    recommendedActions: [
      'Finish one roadmap milestone this week',
      'Save a free course from the resource library',
      'Add a project that matches your target role',
      'Book a slot with the placement coordinator',
    ],
    upcomingEvents: [],
    savedResourcesCount: 0,
    applicationsCount: 0,
    student: {
      id: `${account.id}-profile`,
      userId: account.id,
      ...profile,
    },
  };
}

import type { UserRole } from '@/lib/types';

export interface DemoAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isOnboarded: boolean;
  name: string;
  avatarUrl?: string;
  developmentScore?: number;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'demo-student',
    email: 'student@college.edu',
    password: 'Password123!',
    role: 'STUDENT',
    isOnboarded: true,
    name: 'Aarav Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    developmentScore: 78,
  },
  {
    id: 'demo-newbie',
    email: 'newbie@college.edu',
    password: 'Password123!',
    role: 'STUDENT',
    isOnboarded: false,
    name: 'New Student',
  },
  {
    id: 'demo-coordinator',
    email: 'sarah.c@college.edu',
    password: 'CoordPass123!',
    role: 'COORDINATOR',
    isOnboarded: true,
    name: 'Prof. Meera Joshi',
  },
  {
    id: 'demo-admin',
    email: 'admin@college.edu',
    password: 'AdminPass123!',
    role: 'ADMIN',
    isOnboarded: true,
    name: 'Campus Admin',
  },
];

export function findDemoAccount(email: string, password: string): DemoAccount | null {
  const normalized = email.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((account) => account.email === normalized && account.password === password) ?? null;
}

export function demoAccountFromToken(userId: string, email: string): DemoAccount | null {
  const normalized = email.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((account) => account.id === userId && account.email === normalized) ?? null;
}

export function isDatabaseError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const name = 'name' in error && typeof error.name === 'string' ? error.name : '';
    if (name.startsWith('PrismaClient')) return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return /P1001|P1003|P1017|P2021|P2022|Can't reach database|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|Environment variable not found: DATABASE_URL|Query Engine|does not exist in the current database/i.test(
    message
  );
}

export function demoLoginUser(account: DemoAccount) {
  return {
    id: account.id,
    email: account.email,
    role: account.role,
    isOnboarded: account.isOnboarded,
    studentProfile:
      account.role === 'STUDENT' && account.isOnboarded
        ? {
            fullName: account.name,
            avatarUrl: account.avatarUrl ?? null,
            developmentScore: account.developmentScore ?? 0,
          }
        : null,
    coordinator: account.role === 'COORDINATOR' ? { name: account.name } : null,
  };
}

export function demoStudentDashboard() {
  const account = DEMO_ACCOUNTS[0];
  return {
    success: true,
    profileCompletion: 92,
    developmentScore: 78,
    roadmapProgress: {
      currentYear: 2,
      totalMilestones: 7,
      completedMilestones: 6,
      progressPercentage: 86,
    },
    skillGapAnalysis: [
      { skill: 'Data Structures & Algorithms', required: 90, current: 85 },
      { skill: 'React / Next.js', required: 85, current: 80 },
      { skill: 'System Design', required: 80, current: 40 },
      { skill: 'Databases & SQL', required: 85, current: 80 },
      { skill: 'Cloud & Docker', required: 75, current: 30 },
      { skill: 'Communication & Behavioral', required: 80, current: 75 },
    ],
    recommendedActions: [
      'Practice 3 System Design problems on the interactive portal',
      'Attend the upcoming BotWars Annual Showcase & Spring Challenge',
      'Upload and run ATS scan on your updated technical resume',
      'Schedule a 1-on-1 guidance slot with Lead Coordinator Prof. Meera Joshi',
    ],
    upcomingEvents: [
      {
        id: 'demo-event-robotics',
        title: 'Robotics Annual Showcase & Spring Challenge',
        date: '2026-11-12',
        location: 'Main Auditorium & Innovation Lab',
        category: 'Hackathon',
        clubName: 'Apex Robotics & IoT Innovation Club',
      },
      {
        id: 'demo-event-source',
        title: 'Source Annual Showcase & Spring Challenge',
        date: '2026-11-18',
        location: 'Main Auditorium & Innovation Lab',
        category: 'Workshop',
        clubName: 'Open Source & Web Development Cell',
      },
    ],
    savedResourcesCount: 4,
    applicationsCount: 2,
    student: {
      id: 'demo-student-profile',
      userId: account.id,
      fullName: account.name,
      avatarUrl: account.avatarUrl,
      collegeName: 'University Institute of Technology, RGPV, Bhopal',
      branch: 'Computer Science & Engineering',
      currentYear: 2,
      cgpa: 8.7,
      skills: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Python', 'Data Structures & Algorithms', 'PostgreSQL'],
      targetRole: 'Full-Stack Software Engineer',
      preferredDomains: ['Web Development', 'Cloud Systems', 'AI/ML'],
      primaryGoal: 'Secure a product SDE internship in Bengaluru/Hyderabad or TCS Digital / GATE CS',
      profileCompletion: 92,
      developmentScore: 78,
    },
  };
}

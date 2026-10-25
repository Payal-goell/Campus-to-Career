export type UserRole = 'STUDENT' | 'ADMIN' | 'RECRUITER' | 'COORDINATOR';

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  isOnboarded: boolean;
  name?: string;
  avatarUrl?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StudentProfileData {
  id: string;
  userId: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  collegeId?: string | null;
  collegeName: string;
  branch: string;
  currentYear: number;
  cgpa?: number | null;
  skills: string[];
  skillAssessments?: Array<{
    name: string;
    kind: 'technical' | 'extracurricular';
    mode: 'basic' | 'intermediate' | 'advanced';
    quizLevel?: 'easy' | 'medium' | 'hard';
    percent: number;
    proof?: { fileName: string; fileType: string; fileSize: number };
  }>;
  targetRole?: string | null;
  preferredDomains: string[];
  targetPlacementYear?: number | null;
  primaryGoal?: string | null;
  profileCompletion: number;
  developmentScore: number;
  selectedCourseId?: string | null;
  extracurricularPreferences?: string[];
  targetCompanyTier?: string | null;
  projects?: Array<{
    id: string;
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string | null;
    liveUrl?: string | null;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    isVerified: boolean;
    credentialUrl?: string | null;
  }>;
}

export interface RoadmapMilestoneItem {
  id: string;
  year: number;
  title: string;
  description: string;
  category: string;
  domain: string;
  difficulty: string;
  estimatedHours: number;
  skillsTargeted: string[];
  actionItems: string[];
  order: number;
  completed: boolean;
  status: string;
}

export interface DynamicRoadmapSystemData {
  year: number;
  theme: string;
  studentContext: {
    targetRole: string;
    preferredDomains: string[];
    currentSkills: string[];
    extracurricularPreferences: string[];
    academicYear: number;
  };
  milestones: RoadmapMilestoneItem[];
  analytics: {
    totalMilestones: number;
    completedMilestones: number;
    completionPercentage: number;
    estimatedHoursTotal: number;
    estimatedHoursCompleted: number;
    readinessScore: number;
    domainBreakdown: Array<{ name: string; value: number; color: string }>;
    skillVelocity: Array<{ semester: string; target: number; actual: number }>;
    competencyRadar: Array<{ subject: string; studentScore: number; targetRequirement: number }>;
  };
}

export interface RoadmapYearData {
  year: number;
  theme: string;
  milestones: RoadmapMilestoneItem[];
}

export interface SkillGapItem {
  skill: string;
  required: number;
  current: number;
  /** True when current comes from a quiz score or a stated level with proof. */
  measured?: boolean;
  /** How the current percentage was set. */
  basis?: string;
  /** Where the student stands against the role bar. */
  standing?: string;
  /** The single next piece of work for this skill. */
  next?: string;
  /** In-app path or an external practice link. */
  href?: string;
}

export interface DashboardOverview {
  profileCompletion: number;
  developmentScore: number;
  roadmapProgress: {
    currentYear: number;
    totalMilestones: number;
    completedMilestones: number;
    progressPercentage: number;
  };
  skillGapAnalysis: SkillGapItem[];
  recommendedActions: string[];
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    category: string;
    clubName?: string;
  }>;
  savedResourcesCount: number;
  applicationsCount: number;
  student: StudentProfileData;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'course' | 'youtube' | 'doc' | 'book' | 'practice' | string;
  category: string;
  provider: string;
  url: string;
  isPaid: boolean;
  level: string;
  rating: number;
  description: string;
  academicYear?: number | null;
  isSaved?: boolean;
  userStatus?: string;
}

export interface ClubCommitteeItem {
  id: string;
  name: string;
  category: string;
  description: string;
  purpose: string;
  responsibilities: string;
  skillsGained: string[];
  leadCoordinator: string;
  joinUrl?: string | null;
  recentEventRecap?: string | null;
  imageUrl?: string | null;
  events?: Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    description: string;
    recap?: string | null;
    registrationUrl?: string | null;
    imageUrl?: string | null;
  }>;
}

export interface PlacementModuleCategory {
  category: string;
  topics: string[];
  icon?: string;
  description?: string;
}

export interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  salary?: string | null;
  status: 'SAVED' | 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';
  appliedDate: string;
  notes?: string | null;
  interviews?: Array<{
    id: string;
    round: string;
    date: string;
    mode: string;
    feedback?: string | null;
    status: string;
  }>;
}

export interface CoordinatorItem {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string;
  phone?: string | null;
  availableHours: string;
}

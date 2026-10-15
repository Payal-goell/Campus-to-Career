export type SkillCategory = 'technical' | 'talent' | 'soft';
export type SkillLevel = 0 | 1 | 2 | 3 | 4;

export type RoadmapPillar =
  | 'subjects'
  | 'skills'
  | 'certification'
  | 'project'
  | 'extracurricular'
  | 'personality'
  | 'placement';

export type NodeStatus = 'locked' | 'available' | 'in-progress' | 'completed' | 'skipped';
export type ResourceCost = 'free' | 'paid';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type PeriodSlot = 'M1-2' | 'M3-4' | 'M5-6' | 'M7-9' | 'M10-12';
export type AcademicYear = 1 | 2 | 3 | 4;

export type InterestDomain =
  | 'Web Development'
  | 'AI/Data Science'
  | 'App Development'
  | 'Cloud and DevOps'
  | 'Cybersecurity'
  | 'Core Engineering/Electronics'
  | 'Entrepreneurship';

export type TalentInterest =
  | 'Dance'
  | 'Singing/Music'
  | 'Sports and Fitness'
  | 'Drama/Theatre'
  | 'Art/Design/Photography'
  | 'Public Speaking/Debate'
  | 'Writing/Blogging'
  | 'Leadership/Volunteering';

export interface StudentSkill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export interface StudentProfile {
  branch: string;
  currentYear: AcademicYear;
  skills: StudentSkill[];
  interestDomains: InterestDomain[];
  talentInterests: TalentInterest[];
  targetRole: string;
  weeklyHours: number;
  completedNodeIds: string[];
  inProgressNodeIds?: string[];
  skippedNodeIds?: string[];
  snoozedNodeIds?: string[];
  notes?: Record<string, string>;
  checklistProgress?: Record<string, string[]>;
  customNodes?: RoadmapNode[];
  isPersonalized?: boolean;
  personaId?: string;
}

export interface RoadmapResource {
  title: string;
  type: 'course' | 'doc' | 'video' | 'practice' | 'tool' | 'community';
  cost: ResourceCost;
  url: string;
}

export interface SkillGain {
  skill: string;
  levels: number;
}

export interface RoadmapTemplate {
  templateId: string;
  domain: InterestDomain | 'Generic';
  talentTrack?: TalentInterest | 'Personality';
  year: AcademicYear;
  period: PeriodSlot;
  pillar: RoadmapPillar;
  title: string;
  why: string;
  deliverables: string[];
  checklist: string[];
  resources: RoadmapResource[];
  estimatedHours: number;
  difficulty: Difficulty;
  prerequisiteTemplateIds: string[];
  unlocksTemplateIds: string[];
  synergyTemplateIds: string[];
  skillGain: SkillGain[];
  teachesLevel: number;
  teachesSkill: string;
  isLandmark?: boolean;
  landmarkKind?: 'quarter' | 'year-end';
}

export interface RoadmapNode {
  id: string;
  templateId: string;
  year: AcademicYear;
  period: PeriodSlot;
  pillar: RoadmapPillar;
  title: string;
  why: string;
  deliverables: string[];
  checklist: string[];
  resources: RoadmapResource[];
  estimatedHours: number;
  difficulty: Difficulty;
  prerequisites: string[];
  unlocks: string[];
  synergyWith: string[];
  status: NodeStatus;
  skillGain: SkillGain[];
  isStartHere?: boolean;
  isLandmark?: boolean;
  landmarkKind?: 'quarter' | 'year-end';
  domain: InterestDomain | 'Generic';
  talentTrack?: TalentInterest | 'Personality';
  xp: number;
}

export interface YearSummary {
  year: AcademicYear;
  theme: string;
  completionPct: number;
  xp: number;
  totalXp: number;
  nodeCount: number;
  completedCount: number;
  locked: boolean;
}

export interface RoadmapDiffItem {
  id: string;
  title: string;
  year: AcademicYear;
  kind: 'added' | 'removed' | 'moved';
  reason: string;
  fromPeriod?: PeriodSlot;
  toPeriod?: PeriodSlot;
}

export interface RoadmapDiff {
  added: RoadmapDiffItem[];
  removed: RoadmapDiffItem[];
  moved: RoadmapDiffItem[];
  summary: string;
}

export interface GeneratedRoadmap {
  profile: StudentProfile;
  nodes: RoadmapNode[];
  usedFallback: boolean;
  startHereId: string | null;
  yearSummaries: YearSummary[];
  wholePerson: { technicalPct: number; talentPct: number };
  skillsBefore: Record<string, number>;
  skillsAfter: Record<string, number>;
}

export type PillarFilterId =
  | 'all'
  | 'subjects-skills'
  | 'certifications'
  | 'projects'
  | 'extracurricular-talent'
  | 'personality'
  | 'placement';

import type {
  AcademicYear,
  InterestDomain,
  PeriodSlot,
  PillarFilterId,
  RoadmapPillar,
  TalentInterest,
} from './types';

export const YEAR_THEMES: Record<AcademicYear, string> = {
  1: 'Explore and Build Foundation',
  2: 'Build and Experiment',
  3: 'Specialize and Prepare',
  4: 'Placement Readiness',
};

export const PERIODS: PeriodSlot[] = ['M1-2', 'M3-4', 'M5-6', 'M7-9', 'M10-12'];

export const PERIOD_MONTHS: Record<PeriodSlot, number> = {
  'M1-2': 2,
  'M3-4': 2,
  'M5-6': 2,
  'M7-9': 3,
  'M10-12': 3,
};

export const PERIOD_LABELS: Record<PeriodSlot, string> = {
  'M1-2': 'Months 1–2',
  'M3-4': 'Months 3–4',
  'M5-6': 'Months 5–6',
  'M7-9': 'Months 7–9',
  'M10-12': 'Months 10–12',
};

export const TECHNICAL_PILLARS: RoadmapPillar[] = [
  'subjects',
  'skills',
  'certification',
  'project',
];

export const TALENT_PILLARS: RoadmapPillar[] = ['extracurricular', 'personality'];

export const ALL_PILLARS: RoadmapPillar[] = [
  'subjects',
  'skills',
  'certification',
  'project',
  'extracurricular',
  'personality',
  'placement',
];

export const PILLAR_FILTERS: Array<{
  id: PillarFilterId;
  label: string;
  pillars: RoadmapPillar[] | 'all';
}> = [
  { id: 'all', label: 'All', pillars: 'all' },
  { id: 'subjects-skills', label: 'Subjects and Skills', pillars: ['subjects', 'skills'] },
  { id: 'certifications', label: 'Certifications', pillars: ['certification'] },
  { id: 'projects', label: 'Projects', pillars: ['project'] },
  { id: 'extracurricular-talent', label: 'Extracurricular and Talent', pillars: ['extracurricular'] },
  { id: 'personality', label: 'Personality', pillars: ['personality'] },
  { id: 'placement', label: 'Placement', pillars: ['placement'] },
];

export const DOMAINS: InterestDomain[] = [
  'Web Development',
  'AI/Data Science',
  'App Development',
  'Cloud and DevOps',
  'Cybersecurity',
  'Core Engineering/Electronics',
  'Entrepreneurship',
];

export const TALENT_INTERESTS: TalentInterest[] = [
  'Dance',
  'Singing/Music',
  'Sports and Fitness',
  'Drama/Theatre',
  'Art/Design/Photography',
  'Public Speaking/Debate',
  'Writing/Blogging',
  'Leadership/Volunteering',
];

export const TALENT_TOKEN: Record<TalentInterest | 'Personality', string> = {
  Dance: 'dance',
  'Singing/Music': 'music',
  'Sports and Fitness': 'sports',
  'Drama/Theatre': 'drama',
  'Art/Design/Photography': 'creative',
  'Public Speaking/Debate': 'communication',
  'Writing/Blogging': 'creative',
  'Leadership/Volunteering': 'leadership',
  Personality: 'communication',
};

export const PILLAR_LANE: Record<RoadmapPillar, 'technical' | 'talent' | 'placement'> = {
  subjects: 'technical',
  skills: 'technical',
  certification: 'technical',
  project: 'technical',
  extracurricular: 'talent',
  personality: 'talent',
  placement: 'placement',
};

export const SKILL_LEVEL_LABELS = ['None', 'Basics', 'Working', 'Intermediate', 'Advanced'] as const;

export const STORAGE_KEY = 'ctc.roadmap.v1';
export const REVEAL_KEY = 'ctc.roadmap.reveal';

export const EXPLORER_PROFILE_LABEL = 'Explorer';

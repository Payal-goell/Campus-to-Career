import type {
  AcademicYear,
  Difficulty,
  InterestDomain,
  PeriodSlot,
  RoadmapPillar,
  RoadmapResource,
  RoadmapTemplate,
  SkillGain,
  TalentInterest,
} from '@/lib/roadmap/types';

export function tpl(partial: {
  id: string;
  domain?: InterestDomain | 'Generic';
  talentTrack?: TalentInterest | 'Personality';
  year: AcademicYear;
  period: PeriodSlot;
  pillar: RoadmapPillar;
  title: string;
  why: string;
  deliverables: string[];
  checklist: string[];
  resources?: RoadmapResource[];
  hours: number;
  difficulty?: Difficulty;
  prereqs?: string[];
  unlocks?: string[];
  synergy?: string[];
  skill: string;
  gain?: number;
  teachesLevel?: number;
  landmark?: 'quarter' | 'year-end';
}): RoadmapTemplate {
  const gain: SkillGain[] = [{ skill: partial.skill, levels: partial.gain ?? 1 }];
  return {
    templateId: partial.id,
    domain: partial.domain ?? 'Generic',
    talentTrack: partial.talentTrack,
    year: partial.year,
    period: partial.period,
    pillar: partial.pillar,
    title: partial.title,
    why: partial.why,
    deliverables: partial.deliverables,
    checklist: partial.checklist,
    resources: partial.resources ?? [],
    estimatedHours: partial.hours,
    difficulty: partial.difficulty ?? 'Beginner',
    prerequisiteTemplateIds: partial.prereqs ?? [],
    unlocksTemplateIds: partial.unlocks ?? [],
    synergyTemplateIds: partial.synergy ?? [],
    skillGain: gain,
    teachesLevel: partial.teachesLevel ?? (partial.year === 1 ? 1 : partial.year === 2 ? 2 : 3),
    teachesSkill: partial.skill,
    isLandmark: Boolean(partial.landmark),
    landmarkKind: partial.landmark,
  };
}

export const free = (title: string, url: string, type: RoadmapResource['type'] = 'course'): RoadmapResource => ({
  title,
  url,
  type,
  cost: 'free',
});

export const paid = (title: string, url: string, type: RoadmapResource['type'] = 'course'): RoadmapResource => ({
  title,
  url,
  type,
  cost: 'paid',
});

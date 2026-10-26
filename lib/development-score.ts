import type { SkillAssessmentRecord } from '@/lib/skill-assessment';

/**
 * Development score after onboarding.
 * The skill check is most of the number. CGPA is a smaller share.
 * Filling the form does not add a large base score.
 */
export function developmentScoreFromProfile(input: {
  cgpa?: number | null;
  assessments?: Array<Pick<SkillAssessmentRecord, 'kind' | 'percent'>>;
}): number {
  const assessments = input.assessments ?? [];
  const technical = assessments.filter((item) => item.kind === 'technical');
  const extra = assessments.filter((item) => item.kind === 'extracurricular');
  const average = (rows: Array<{ percent: number }>) =>
    rows.reduce((sum, row) => sum + Math.max(0, Math.min(100, row.percent)), 0) / rows.length;

  const technicalAverage = technical.length ? average(technical) : 0;
  const extraAverage = extra.length ? average(extra) : 0;

  let skill: number;
  if (technical.length && extra.length) {
    skill = technicalAverage * 0.95 + extraAverage * 0.05;
  } else if (technical.length) {
    skill = technicalAverage;
  } else if (extra.length) {
    skill = extraAverage * 0.35;
  } else {
    skill = 8;
  }

  const cgpa = input.cgpa == null || Number.isNaN(input.cgpa) ? 0 : Math.max(0, Math.min(10, input.cgpa));
  const academic = (cgpa / 10) * 100;
  const raw = skill * 0.92 + academic * 0.08;

  return Math.max(8, Math.min(92, Math.round(raw)));
}

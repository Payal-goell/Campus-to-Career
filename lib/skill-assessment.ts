import type { SkillCategory, SkillLevel, StudentSkill } from '@/lib/roadmap/types';

export type SkillKind = 'technical' | 'extracurricular';
export type SkillMode = 'basic' | 'intermediate' | 'advanced';
export type QuizLevel = 'easy' | 'medium' | 'hard';

export interface SkillProof {
  fileName: string;
  fileType: string;
  fileSize: number;
}

/** What we keep after onboarding. File bytes stay in the browser. */
export interface SkillAssessmentRecord {
  name: string;
  kind: SkillKind;
  mode: SkillMode;
  quizLevel?: QuizLevel;
  percent: number;
  proof?: SkillProof;
}

export const SKILL_ASSESSMENTS_KEY = 'ctc.skill-assessments.v1';

export const MODE_PERCENT: Record<SkillMode, number> = {
  basic: 40,
  intermediate: 70,
  advanced: 90,
};

const EXTRA_HINT =
  /communic|leader|dance|music|sing|sport|fitness|drama|theatre|theater|art|design|photo|debate|writ|blog|volunteer|cricket|football/;

export function defaultKind(name: string): SkillKind {
  return EXTRA_HINT.test(name.toLowerCase()) ? 'extracurricular' : 'technical';
}

export function levelFromPercent(percent: number): SkillLevel {
  if (percent >= 81) return 4;
  if (percent >= 56) return 3;
  if (percent >= 31) return 2;
  return 1;
}

export function categoryForAssessment(record: SkillAssessmentRecord): SkillCategory {
  if (record.kind === 'technical') return 'technical';
  const name = record.name.toLowerCase();
  if (name.includes('communic') || name.includes('leader')) return 'soft';
  return 'talent';
}

export function skillsFromAssessments(records: SkillAssessmentRecord[]): StudentSkill[] {
  return records.map((record) => ({
    name: record.name,
    category: categoryForAssessment(record),
    level: levelFromPercent(record.percent),
  }));
}

export function averageKnowledge(records: SkillAssessmentRecord[]): number {
  if (records.length === 0) return 0;
  return Math.round(records.reduce((sum, record) => sum + record.percent, 0) / records.length);
}

function sameSkill(name: string, label: string): boolean {
  if (name === 'java' && label.includes('javascript')) return false;
  if ((label.includes(name) || name.includes(label)) && name.length > 1) return true;
  const pairs: Array<[RegExp, RegExp]> = [
    [/react/, /react/],
    [/sql|postgres/, /sql|postgres|database/],
    [/docker/, /docker/],
    [/data structure|dsa/, /data structure|dsa/],
    [/communic|leader/, /communic|behavior/],
    [/system design/, /system design/],
    [/machine learning|\bml\b/, /machine learning|\bml\b/],
    [/cloud|aws/, /cloud|aws/],
  ];
  return pairs.some(([a, b]) => a.test(name) && b.test(label));
}

export function findAssessment(records: SkillAssessmentRecord[] | undefined, skillLabel: string) {
  if (!records?.length) return undefined;
  const label = skillLabel.toLowerCase();
  return records.find((record) => sameSkill(record.name.toLowerCase(), label));
}

export function knowledgePercent(records: SkillAssessmentRecord[] | undefined, skillLabel: string, fallback: number): number {
  const hit = findAssessment(records, skillLabel);
  return hit ? hit.percent : fallback;
}

/** One sentence a student can read: where the percentage came from. */
export function howWeKnow(record: SkillAssessmentRecord): string {
  if (record.kind === 'extracurricular') {
    const proof = record.proof ? ` Certificate on file: ${record.proof.fileName}.` : '';
    return `You marked ${record.mode}.${proof} That stated level counts as ${record.percent}% of this skill.`;
  }
  const level = record.quizLevel ?? 'easy';
  return `You scored ${record.percent}% on the ${level} quiz you chose, after marking this skill ${record.mode}.`;
}

export function readStoredAssessments(): SkillAssessmentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SKILL_ASSESSMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SkillAssessmentRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function storeAssessments(records: SkillAssessmentRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SKILL_ASSESSMENTS_KEY, JSON.stringify(records));
}

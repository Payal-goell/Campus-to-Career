import {
  MODE_PERCENT,
  defaultKind,
  type QuizLevel,
  type SkillAssessmentRecord,
  type SkillKind,
  type SkillMode,
  type SkillProof,
} from '@/lib/skill-assessment';

export interface SkillDraft {
  name: string;
  kind: SkillKind;
  mode: SkillMode;
  quizLevel: QuizLevel;
  answers: number[];
  submitted: boolean;
  percent: number;
  proof?: SkillProof;
}

export function blankDraft(name: string): SkillDraft {
  return {
    name,
    kind: defaultKind(name),
    mode: 'basic',
    quizLevel: 'easy',
    answers: [-1, -1, -1],
    submitted: false,
    percent: 0,
  };
}

export function draftReady(draft: SkillDraft): boolean {
  if (draft.kind === 'extracurricular') return Boolean(draft.proof?.fileName);
  return draft.submitted;
}

export function toRecord(draft: SkillDraft): SkillAssessmentRecord {
  if (draft.kind === 'extracurricular') {
    return {
      name: draft.name,
      kind: draft.kind,
      mode: draft.mode,
      percent: MODE_PERCENT[draft.mode],
      proof: draft.proof,
    };
  }
  return {
    name: draft.name,
    kind: draft.kind,
    mode: draft.mode,
    quizLevel: draft.quizLevel,
    percent: draft.percent,
  };
}

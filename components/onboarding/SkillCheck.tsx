'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { questionsFor } from '@/data/skill-quizzes';
import { blankDraft, QUIZ_LENGTH, type SkillDraft } from '@/lib/skill-draft';
import {
  MODE_PERCENT,
  type QuizLevel,
  type SkillKind,
  type SkillMode,
} from '@/lib/skill-assessment';

/** Maps the student's self-rated level to the matching quiz difficulty. */
const MODE_TO_LEVEL: Record<SkillMode, QuizLevel> = {
  basic: 'easy',
  intermediate: 'medium',
  advanced: 'hard',
};

const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React.js',
  'Node.js',
  'Python',
  'C++',
  'Java',
  'Data Structures & Algorithms',
  'SQL',
  'PostgreSQL',
  'Docker',
  'System Design',
  'Git',
  'Machine Learning',
  'Cloud / AWS',
  'Communication & Leadership',
];

const MODES: { id: SkillMode; label: string; desc: string }[] = [
  { id: 'basic',        label: 'Basic',        desc: 'You can complete small guided tasks with a reference.' },
  { id: 'intermediate', label: 'Intermediate', desc: 'You can build features without a step-by-step guide.' },
  { id: 'advanced',     label: 'Advanced',     desc: 'You can design, debug, and explain trade-offs on your own.' },
];

function ChoiceRow({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; desc?: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            value === option.id
              ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]'
              : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-brand-primary)]/50'
          }`}
          title={option.desc}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function SkillCheck({
  drafts,
  onChange,
}: {
  drafts: SkillDraft[];
  onChange: (next: SkillDraft[]) => void;
}) {
  const [customSkill, setCustomSkill] = useState('');
  const [openName, setOpenName] = useState<string | null>(null);
  const draftsRef = useRef(drafts);
  const onChangeRef = useRef(onChange);
  draftsRef.current = drafts;
  onChangeRef.current = onChange;
  const selected = useMemo(() => new Set(drafts.map((draft) => draft.name)), [drafts]);

  const patch = useCallback((name: string, partial: Partial<SkillDraft>) => {
    onChangeRef.current(
      draftsRef.current.map((draft) => (draft.name === name ? { ...draft, ...partial } : draft))
    );
  }, []);

  const upsert = (name: string) => {
    if (selected.has(name)) {
      const next = drafts.filter((draft) => draft.name !== name);
      onChange(next);
      if (openName === name) setOpenName(next[0]?.name ?? null);
      return;
    }
    onChange([...drafts, blankDraft(name)]);
    setOpenName(name);
  };

  const addCustom = (event: React.FormEvent) => {
    event.preventDefault();
    const name = customSkill.trim();
    if (!name || selected.has(name)) return;
    onChange([...drafts, blankDraft(name)]);
    setOpenName(name);
    setCustomSkill('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Pick a skill, then show what you can do with it ({drafts.length} selected)
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_SKILLS.map((skill) => {
            const on = selected.has(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => upsert(skill)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                  on
                    ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]'
                    : 'bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]'
                }`}
              >
                {on ? '✓ ' : '+ '}
                {skill}
              </button>
            );
          })}
        </div>
        <form onSubmit={addCustom} className="flex gap-2 pt-1">
          <input
            value={customSkill}
            onChange={(event) => setCustomSkill(event.target.value)}
            placeholder="Add another skill, then check it below"
            className="flex-1 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] outline-none"
          />
          <button type="submit" className="px-3 rounded-xl text-xs font-semibold border border-[var(--color-border-subtle)]">
            Add
          </button>
        </form>
      </div>

      {drafts.map((draft) => (
        <SkillCard
          key={draft.name}
          draft={draft}
          open={openName === draft.name}
          onOpen={setOpenName}
          onPatch={patch}
        />
      ))}
    </div>
  );
}

const SkillCard = React.memo(function SkillCard({
  draft,
  open,
  onOpen,
  onPatch,
}: {
  draft: SkillDraft;
  open: boolean;
  onOpen: (name: string) => void;
  onPatch: (name: string, partial: Partial<SkillDraft>) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(QUIZ_LENGTH).fill(-1));
  const questions = useMemo(
    () => (open && draft.kind === 'technical' ? questionsFor(draft.name, draft.quizLevel) : []),
    [open, draft.kind, draft.name, draft.quizLevel]
  );
  const modeHelp =
    draft.kind === 'technical'
      ? 'Basic means you can finish small tasks with a reference. Advanced means you can design and debug this on your own.'
      : 'Basic means you practice. Advanced means you have performed, led, or competed.';

  const status =
    draft.kind === 'technical'
      ? draft.submitted
        ? `${draft.percent}% · ${draft.mode}`
        : 'Quiz not scored'
      : draft.proof
        ? `${MODE_PERCENT[draft.mode]}% · ${draft.proof.fileName}`
        : 'Proof needed';

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => onOpen(draft.name)}
        className="w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-4 py-3 flex items-center justify-between gap-3 text-left"
      >
        <span className="text-sm font-bold text-[var(--color-text-primary)]">{draft.name}</span>
        <span className="text-[11px] text-[var(--color-text-secondary)]">{status}</span>
      </button>
    );
  }

  const update = (partial: Partial<SkillDraft>) => onPatch(draft.name, partial);

  const setKind = (kind: SkillKind) => {
    setQuestionIndex(0);
    setAnswers(Array(QUIZ_LENGTH).fill(-1));
    update({
      kind,
      submitted: false,
      percent: 0,
      answers: Array(QUIZ_LENGTH).fill(-1),
      proof: kind === 'technical' ? undefined : draft.proof,
    });
  };

  // When mode changes, auto-derive quiz level and reset the quiz
  const setMode = (mode: SkillMode) => {
    setQuestionIndex(0);
    setAnswers(Array(QUIZ_LENGTH).fill(-1));
    update({ mode, quizLevel: MODE_TO_LEVEL[mode], submitted: false, percent: 0, answers: Array(QUIZ_LENGTH).fill(-1) });
  };

  const answer = (choice: number) => {
    setAnswers((current) => {
      const next = current.slice();
      next[questionIndex] = choice;
      return next;
    });
    if (draft.submitted) update({ submitted: false, percent: 0 });
    if (questionIndex < questions.length - 1 && (answers[questionIndex + 1] ?? -1) < 0) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const submitQuiz = () => {
    const correct = questions.filter((question, index) => answers[index] === question.answer).length;
    const percent = Math.round((correct / questions.length) * 100);
    update({ answers, submitted: true, percent });
  };

  const onProof = (file: File | undefined) => {
    if (!file) {
      update({ proof: undefined });
      return;
    }
    update({
      proof: { fileName: file.name, fileType: file.type || 'application/octet-stream', fileSize: file.size },
    });
  };

  const question = questions[questionIndex];

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{draft.name}</h3>
        {draft.kind === 'technical' && draft.submitted && (
          <span className="text-xs font-bold text-[var(--color-brand-primary)]">{draft.percent}% measured</span>
        )}
        {draft.kind === 'extracurricular' && draft.proof && (
          <span className="text-xs font-bold text-[var(--color-brand-primary)]">{MODE_PERCENT[draft.mode]}% from level</span>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">This skill is</p>
        <ChoiceRow
          options={[
            { id: 'technical', label: 'Technical' },
            { id: 'extracurricular', label: 'Extracurricular' },
          ]}
          value={draft.kind}
          onChange={(id) => setKind(id as SkillKind)}
        />
      </div>

      {draft.kind === 'technical' ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Your level in {draft.name}
            </p>
            <ChoiceRow options={MODES} value={draft.mode} onChange={(id) => setMode(id as SkillMode)} />
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              {MODES.find(m => m.id === draft.mode)?.desc ?? modeHelp}
              {' '}The quiz difficulty is set automatically from this level.
            </p>
          </div>
          {question && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Question {questionIndex + 1} of {questions.length}
                </p>
                {questionIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setQuestionIndex(questionIndex - 1)}
                    className="text-[11px] font-semibold text-[var(--color-text-secondary)]"
                  >
                    Previous
                  </button>
                )}
              </div>
              <p className="text-xs font-semibold text-[var(--color-text-primary)]">{question.prompt}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {question.choices.map((choice, choiceIndex) => {
                  const picked = answers[questionIndex] === choiceIndex;
                  const reveal = draft.submitted;
                  const right = question.answer === choiceIndex;
                  const tone = reveal
                    ? right
                      ? 'border-emerald-500 text-emerald-600'
                      : picked
                        ? 'border-red-400 text-red-500'
                        : 'border-[var(--color-border-subtle)] text-[var(--color-text-muted)]'
                    : picked
                      ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                      : 'border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]';
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => answer(choiceIndex)}
                      className={`text-left px-2.5 py-2 rounded-lg border text-[11px] ${tone}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={submitQuiz}
            disabled={questions.some((_, index) => answers[index] === undefined || answers[index] < 0)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--color-brand-primary)] text-white disabled:opacity-40"
          >
            {draft.submitted ? `Score saved · ${draft.percent}%` : 'Score this quiz'}
          </button>
          {draft.submitted && (
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Score saved — you answered at the <strong>{draft.mode}</strong> level and got <strong className="text-[var(--color-brand-primary)]">{draft.percent}%</strong>.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Your level in {draft.name}
            </p>
            <ChoiceRow options={MODES} value={draft.mode} onChange={(id) => update({ mode: id as SkillMode })} />
            <p className="text-[11px] text-[var(--color-text-secondary)]">{modeHelp}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Proof — performance video or winning certificate
            </p>
          <input
            type="file"
            accept="video/*,image/*,.pdf,application/pdf"
            onChange={(event) => onProof(event.target.files?.[0])}
            className="block w-full text-xs text-[var(--color-text-secondary)]"
          />
          {draft.proof ? (
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Attached {draft.proof.fileName}. Stated level {draft.mode} counts as {MODE_PERCENT[draft.mode]}% until a coordinator looks at the proof.
            </p>
          ) : (
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Add a clip of the performance or a photo or PDF of the certificate.
            </p>
          )}
        </div>
        </div>
      )}
    </div>
  );
});

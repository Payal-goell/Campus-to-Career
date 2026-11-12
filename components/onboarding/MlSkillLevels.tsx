'use client';

import React from 'react';
import { ML_SKILLS, type MlSkillId, type MlSkillLevel } from '@/lib/roadmap/ml-profile';

const LABELS: Record<MlSkillId, string> = {
  programming: 'Programming',
  dsa: 'DSA',
  web_basics: 'Web basics',
  fullstack: 'Full-stack',
  sql: 'SQL',
  git: 'Git',
  statistics: 'Statistics',
  ml_basics: 'Machine learning',
  system_design: 'System design',
  cloud: 'Cloud',
  aptitude: 'Aptitude',
  communication: 'Communication',
  projects: 'Projects',
  extracurricular: 'Extracurricular',
};

const LEVEL_OPTIONS: { value: MlSkillLevel; label: string }[] = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Basic' },
  { value: 2, label: 'Good' },
  { value: 3, label: 'Strong' },
];

export function MlSkillLevels({
  values,
  onChange,
}: {
  values: Partial<Record<MlSkillId, MlSkillLevel>>;
  onChange: (next: Partial<Record<MlSkillId, MlSkillLevel>>) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--color-text-secondary)]">
        Rate each skill from None to Strong. Extracurricular counts as a skill (club → hackathons → leadership).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ML_SKILLS.map((skill) => (
          <label key={skill} className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{LABELS[skill]}</span>
            <select
              value={values[skill] ?? 0}
              onChange={(e) =>
                onChange({ ...values, [skill]: Number(e.target.value) as MlSkillLevel })
              }
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-focus)]"
            >
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}

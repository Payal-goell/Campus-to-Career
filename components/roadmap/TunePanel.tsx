'use client';

import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DOMAINS, SKILL_LEVEL_LABELS, TALENT_INTERESTS } from '@/lib/roadmap/constants';
import type { InterestDomain, RoadmapDiff, StudentProfile, TalentInterest } from '@/lib/roadmap/types';
import { cn } from '@/lib/cn';

export function TunePanel({
  open,
  profile,
  onClose,
  preview,
  onApply,
}: {
  open: boolean;
  profile: StudentProfile;
  onClose: () => void;
  preview: (next: Partial<StudentProfile>) => { diff: RoadmapDiff };
  onApply: (next: StudentProfile) => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [showDiff, setShowDiff] = useState(false);
  const diff = useMemo(() => (showDiff ? preview(draft).diff : null), [draft, preview, showDiff]);

  React.useEffect(() => {
    if (open) {
      setDraft(profile);
      setShowDiff(false);
    }
  }, [open, profile]);

  if (!open) return null;

  const toggleDomain = (d: InterestDomain) => {
    setDraft((p) => ({
      ...p,
      interestDomains: p.interestDomains.includes(d)
        ? p.interestDomains.filter((x) => x !== d)
        : [...p.interestDomains, d],
    }));
  };
  const toggleTalent = (t: TalentInterest) => {
    setDraft((p) => ({
      ...p,
      talentInterests: p.talentInterests.includes(t)
        ? p.talentInterests.filter((x) => x !== t)
        : [...p.talentInterests, t],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" className="absolute inset-0 bg-[var(--overlay)]" aria-label="Close panel" onClick={onClose} />
      <aside className="relative w-full max-w-lg h-full overflow-y-auto overscroll-contain bg-[var(--surface)] border-l border-[var(--border)] p-4 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">Tune my roadmap</h2>
          <button type="button" onClick={onClose} className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-[var(--surface-inset)]" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <label className="block text-xs font-semibold text-[var(--text-muted)]">
          Target role
          <input
            value={draft.targetRole}
            onChange={(e) => setDraft({ ...draft, targetRole: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 py-2.5 text-sm text-[var(--text-primary)]"
          />
        </label>
        <label className="block text-xs font-semibold text-[var(--text-muted)]">
          Weekly free hours: {draft.weeklyHours}
          <input
            type="range"
            min={4}
            max={30}
            value={draft.weeklyHours}
            onChange={(e) => setDraft({ ...draft, weeklyHours: Number(e.target.value) })}
            className="mt-2 w-full"
          />
        </label>

        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Interest domains</p>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDomain(d)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-semibold border min-h-11',
                  draft.interestDomains.includes(d)
                    ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)]'
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Talent interests</p>
          <div className="flex flex-wrap gap-2">
            {TALENT_INTERESTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTalent(t)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-semibold border min-h-11',
                  draft.talentInterests.includes(t)
                    ? 'bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)]'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--text-muted)]">Skills (0–4)</p>
          {draft.skills.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-xs w-28 truncate text-[var(--text-primary)]">{s.name}</span>
              <input
                type="range"
                min={0}
                max={4}
                value={s.level}
                onChange={(e) => {
                  const skills = draft.skills.map((sk, idx) =>
                    idx === i ? { ...sk, level: Number(e.target.value) as 0 | 1 | 2 | 3 | 4 } : sk
                  );
                  setDraft({ ...draft, skills });
                }}
                className="flex-1"
              />
              <span className="text-[10px] text-[var(--text-muted)] w-16">{SKILL_LEVEL_LABELS[s.level]}</span>
            </div>
          ))}
        </div>

        {showDiff && diff && (
          <div className="rounded-xl border border-[var(--primary-border)] bg-[var(--primary-subtle)] p-3 text-xs space-y-1">
            <p className="font-semibold text-[var(--text-primary)]">{diff.summary}</p>
            {diff.added.slice(0, 4).map((d) => (
              <p key={d.id} className="text-[var(--success)]">+ {d.title}</p>
            ))}
            {diff.removed.slice(0, 4).map((d) => (
              <p key={d.id} className="text-[var(--danger)]">− {d.title}</p>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowDiff(true)}>
            Preview diff
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onApply({ ...draft, isPersonalized: true });
              onClose();
            }}
          >
            Apply
          </Button>
        </div>
      </aside>
    </div>
  );
}

'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import type { GeneratedRoadmap, AcademicYear, RoadmapNode } from '@/lib/roadmap/types';
import { cn } from '@/lib/cn';

export function SummaryStrip({
  roadmap,
  year,
  nextActions,
}: {
  roadmap: GeneratedRoadmap;
  year: AcademicYear;
  nextActions: RoadmapNode[];
}) {
  const summary = roadmap.yearSummaries.find((y) => y.year === year);
  const radarKeys = Object.keys({ ...roadmap.skillsBefore, ...roadmap.skillsAfter }).slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      <Card variant="raised" padding="md" className="lg:col-span-3 flex items-center gap-4">
        <div
          className="relative w-16 h-16 shrink-0"
          aria-label={`Year ${year} progress ${summary?.completionPct ?? 0} percent`}
        >
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${((summary?.completionPct ?? 0) / 100) * 97.4} 97.4`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
            {summary?.completionPct ?? 0}%
          </span>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Current year</p>
          <p className="font-display font-bold text-[var(--text-primary)]">Year {year}</p>
          <p className="text-xs text-[var(--text-secondary)]">
            {summary?.xp ?? 0} / {summary?.totalXp ?? 0} XP
          </p>
        </div>
      </Card>

      <Card variant="raised" padding="md" className="lg:col-span-4 space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Next 3 actions</p>
        <ol className="space-y-1.5">
          {nextActions.slice(0, 3).map((n, i) => (
            <li key={n.id} className="text-xs text-[var(--text-primary)] flex gap-2">
              <span className="font-mono text-[var(--primary)]">{i + 1}.</span>
              <span className="line-clamp-1">{n.title}</span>
            </li>
          ))}
          {nextActions.length === 0 && (
            <p className="text-xs text-[var(--text-muted)]">All caught up in this year.</p>
          )}
        </ol>
      </Card>

      <Card variant="raised" padding="md" className="lg:col-span-3 space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
          Whole-Person balance
        </p>
        <div className="h-3 rounded-full overflow-hidden flex bg-[var(--surface-inset)]">
          <div
            className="h-full bg-[var(--talent-technical)]"
            style={{ width: `${roadmap.wholePerson.technicalPct}%` }}
          />
          <div
            className="h-full bg-[var(--talent-communication)]"
            style={{ width: `${roadmap.wholePerson.talentPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
          <span>Technical {roadmap.wholePerson.technicalPct}%</span>
          <span>Talent {roadmap.wholePerson.talentPct}%</span>
        </div>
      </Card>

      <Card variant="raised" padding="md" className="lg:col-span-2 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Skills before → after</p>
        {radarKeys.length === 0 && <p className="text-xs text-[var(--text-muted)]">Complete nodes to grow the radar.</p>}
        {radarKeys.map((k) => (
          <div key={k} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="truncate text-[var(--text-secondary)]">{k}</span>
            <Badge variant="primary" size="sm">
              {roadmap.skillsBefore[k] ?? 0}→{roadmap.skillsAfter[k] ?? 0}
            </Badge>
          </div>
        ))}
        <ProgressBar
          value={Object.values(roadmap.skillsAfter).reduce((a, b) => a + b, 0)}
          max={Math.max(8, Object.keys(roadmap.skillsAfter).length * 4)}
          size="xs"
          color="primary"
          className={cn('mt-2')}
        />
      </Card>
    </div>
  );
}

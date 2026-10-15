'use client';

import Link from 'next/link';
import { Clock, Map, Play } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Progress';
import { useRoadmapOptional } from '@/context/RoadmapContext';
import { PERIOD_LABELS } from '@/lib/roadmap/constants';
import type { PeriodSlot } from '@/lib/roadmap/types';

export function TodayPlan() {
  const ctx = useRoadmapOptional();
  if (!ctx?.ready) return null;

  const { roadmap, profile, lastOpenedId } = ctx;
  const yearNodes = roadmap.nodes.filter((n) => n.year === profile.currentYear);
  const done = yearNodes.filter((n) => n.status === 'completed').length;
  const resume =
    yearNodes.find((n) => n.id === lastOpenedId) ||
    yearNodes.find((n) => n.status === 'in-progress') ||
    yearNodes.find((n) => n.isStartHere) ||
    yearNodes.find((n) => n.status === 'available');

  const today = yearNodes
    .filter((n) => n.status === 'available' || n.status === 'in-progress')
    .slice(0, 3);

  const weekday = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <Card variant="raised" className="p-6 sm:p-7 space-y-5 border-[var(--primary-border)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Badge variant="primary" size="sm">
            Today · {weekday}
          </Badge>
          <h2 className="text-xl font-black mt-2">Pick up where you left</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Year {profile.currentYear} · {done}/{yearNodes.length} milestones done
          </p>
        </div>
        <div className="w-full sm:w-48">
          <ProgressBar value={yearNodes.length ? (done / yearNodes.length) * 100 : 0} size="sm" />
        </div>
      </div>

      {resume && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-inset)] p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Last open
            </p>
            <p className="font-bold text-sm mt-1">{resume.title}</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              {PERIOD_LABELS[resume.period as PeriodSlot]} · {resume.status.replace('-', ' ')}
            </p>
          </div>
          <Button size="sm" variant="gradient" href="/roadmap" leftIcon={<Play className="w-3.5 h-3.5" />}>
            Continue
          </Button>
        </div>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Do these today</p>
        <ul className="space-y-2">
          {today.length === 0 ? (
            <li className="text-xs text-[var(--text-secondary)]">All caught up for now — open the roadmap to preview next year.</li>
          ) : (
            today.map((n, i) => (
              <li key={n.id}>
                <Link
                  href="/roadmap"
                  className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3 hover:border-[var(--primary)] transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg bg-[var(--primary-subtle)] text-[var(--primary)] text-xs font-bold inline-flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug">{n.title}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {PERIOD_LABELS[n.period as PeriodSlot]} · ~{n.estimatedHours} hrs
                    </span>
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>

      <Button size="sm" variant="outline" href="/roadmap" leftIcon={<Map className="w-3.5 h-3.5" />}>
        Open full map
      </Button>
    </Card>
  );
}

'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Lock, Check, Medal, Flag, Sparkles } from 'lucide-react';
import { PERIOD_LABELS, PERIODS, PILLAR_LANE } from '@/lib/roadmap/constants';
import type { AcademicYear, PeriodSlot, RoadmapNode } from '@/lib/roadmap/types';
import { cn } from '@/lib/cn';
import { laneVar, pillarLabel } from './pillarStyle';

interface JourneyMapProps {
  nodes: RoadmapNode[];
  year: AcademicYear;
  focusedId: string | null;
  onFocus: (id: string) => void;
  onOpen: (node: RoadmapNode) => void;
  expandLanes: boolean;
  zoom: number;
  previewFuture: boolean;
  yearLocked: boolean;
}

const LANES = [
  { id: 0, label: 'Skills & subjects' },
  { id: 1, label: 'Talent & campus' },
  { id: 2, label: 'Placement' },
] as const;

function nodeLane(node: RoadmapNode) {
  return PILLAR_LANE[node.pillar] === 'talent' ? 1 : PILLAR_LANE[node.pillar] === 'placement' ? 2 : 0;
}

export function JourneyMap({
  nodes,
  year,
  focusedId,
  onFocus,
  onOpen,
  expandLanes,
  zoom,
  previewFuture,
  yearLocked,
}: JourneyMapProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => {
    return PERIODS.map((period) => {
      const inPeriod = nodes.filter((n) => n.period === period);
      const byLane = LANES.map((lane) => ({
        ...lane,
        nodes: inPeriod.filter((n) => nodeLane(n) === lane.id),
      })).filter((l) => expandLanes || l.nodes.length > 0);
      return { period, byLane, count: inPeriod.length };
    }).filter((g) => g.count > 0);
  }, [expandLanes, nodes]);

  const orderedIds = useMemo(
    () => grouped.flatMap((g) => g.byLane.flatMap((l) => l.nodes.map((n) => n.id))),
    [grouped]
  );

  const completedRatio =
    nodes.length === 0 ? 0 : nodes.filter((n) => n.status === 'completed').length / nodes.length;

  useEffect(() => {
    const start = nodes.find((n) => n.isStartHere);
    if (!start || !scroller.current) return;
    const el = scroller.current.querySelector(`[data-node-id="${start.id}"]`);
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, [nodes, year]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!orderedIds.length) return;
    const idx = Math.max(0, orderedIds.indexOf(focusedId ?? orderedIds[0]));
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      onFocus(orderedIds[Math.min(orderedIds.length - 1, idx + 1)]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      onFocus(orderedIds[Math.max(0, idx - 1)]);
    } else if (e.key === 'Enter' && focusedId) {
      const n = nodes.find((x) => x.id === focusedId);
      if (n) onOpen(n);
    }
  };

  return (
    <div className="space-y-2">
      <div
        ref={scroller}
        className="relative overflow-x-auto overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
        role="application"
        aria-label={`Year ${year} journey map`}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div
          className={cn('p-4 sm:p-5 min-w-min', yearLocked && !previewFuture && 'opacity-70')}
          style={{ zoom }}
        >
          <div className="mb-4 h-1.5 rounded-full bg-[var(--surface-inset)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{ width: `${Math.round(completedRatio * 100)}%` }}
            />
          </div>

          <div className="flex md:grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(1, grouped.length)}, minmax(240px, 1fr))` }}>
            {grouped.map((g) => (
              <section
                key={g.period}
                className="flex flex-col gap-3 min-w-[240px] rounded-2xl border border-[var(--border)] bg-[var(--surface-inset)]/40 p-3"
              >
                <header className="sticky top-0 z-[1] rounded-xl bg-[var(--surface)] border border-[var(--border)] px-3 py-2">
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">{g.period}</p>
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    {PERIOD_LABELS[g.period as PeriodSlot]}
                  </p>
                </header>

                {g.byLane.map((lane) => (
                  <div key={lane.id} className="flex flex-col gap-2.5">
                    {expandLanes && lane.nodes.length > 0 && (
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] px-1">
                        {lane.label}
                      </p>
                    )}
                    {lane.nodes.map((node) => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        focused={focusedId === node.id}
                        dimmed={Boolean(focusedId) && focusedId !== node.id}
                        onFocus={() => onFocus(node.id)}
                        onOpen={() => onOpen(node)}
                      />
                    ))}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {grouped.map((g) => {
          const done = nodes.filter((n) => n.period === g.period && n.status === 'completed').length;
          return (
            <button
              key={g.period}
              type="button"
              onClick={() => {
                const first = g.byLane.flatMap((l) => l.nodes)[0];
                if (first) onFocus(first.id);
                const el = scroller.current?.querySelector(`[data-node-id="${first?.id}"]`);
                if (el instanceof HTMLElement) el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
              }}
              className="h-8 min-w-[88px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] text-[10px] text-[var(--text-muted)]"
            >
              {g.period} {done}/{g.count}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NodeCard({
  node,
  focused,
  dimmed,
  onFocus,
  onOpen,
}: {
  node: RoadmapNode;
  focused: boolean;
  dimmed: boolean;
  onFocus: () => void;
  onOpen: () => void;
}) {
  const colors = laneVar(node);
  const isCompleted = node.status === 'completed';
  const isLocked = node.status === 'locked';
  const isSkipped = node.status === 'skipped';

  return (
    <button
      type="button"
      data-node-id={node.id}
      onClick={() => {
        onFocus();
        onOpen();
      }}
      onFocus={onFocus}
      aria-current={node.isStartHere ? 'step' : undefined}
      aria-label={`${node.title}, ${pillarLabel(node.pillar)}, ${node.status}`}
      className={cn(
        'relative w-full min-h-[88px] p-3 rounded-2xl text-left',
        'border transition-shadow duration-fast',
        'focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
        focused && 'ring-2 ring-[var(--ring)]',
        dimmed && 'opacity-50',
        isSkipped && 'border-dashed',
        node.status === 'available' && 'shadow-[var(--glow-primary)]'
      )}
      style={{
        background: colors.subtle,
        borderColor: isCompleted ? 'var(--success)' : colors.color,
        opacity: isLocked ? 0.55 : 1,
      }}
    >
      <div className="flex items-start gap-2">
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: colors.color, color: colors.fg }}
        >
          {isLocked ? (
            <Lock className="w-3.5 h-3.5" />
          ) : isCompleted ? (
            <Check className="w-3.5 h-3.5" />
          ) : node.pillar === 'certification' ? (
            <Medal className="w-3.5 h-3.5" />
          ) : node.isLandmark ? (
            <Flag className="w-3.5 h-3.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-mono text-[var(--text-muted)]">
            {PERIOD_LABELS[node.period as PeriodSlot]} · {pillarLabel(node.pillar)}
          </p>
          <p className="text-xs font-bold text-[var(--text-primary)] line-clamp-3">{node.title}</p>
          {node.pillar === 'certification' && (
            <span className="mt-1 inline-flex gap-1">
              {node.resources.some((r) => r.cost === 'free') && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--success-subtle)] text-[var(--success)] border border-[var(--success-border)]">
                  Free
                </span>
              )}
              {node.resources.some((r) => r.cost === 'paid') && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--warning-subtle)] text-[var(--warning)] border border-[var(--warning-border)]">
                  Paid
                </span>
              )}
            </span>
          )}
          {node.talentTrack && node.talentTrack !== 'Personality' && (
            <span className="text-[9px] mt-1 inline-block px-1.5 py-0.5 rounded-md border border-[var(--border)] text-[var(--text-secondary)]">
              {node.talentTrack}
            </span>
          )}
        </div>
      </div>
      {node.isStartHere && (
        <span className="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--primary)] text-[var(--primary-fg)]">
          Start here
        </span>
      )}
    </button>
  );
}

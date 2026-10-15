'use client';

import React, { useEffect, useState } from 'react';
import { X, Clock, Link2, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { RoadmapNode } from '@/lib/roadmap/types';
import { PERIOD_LABELS } from '@/lib/roadmap/constants';
import { pillarLabel } from './pillarStyle';
import { cn } from '@/lib/cn';

export function NodeDrawer({
  node,
  checklistDone,
  note,
  onClose,
  onStatus,
  onToggleCheck,
  onNote,
}: {
  node: RoadmapNode | null;
  checklistDone: string[];
  note: string;
  onClose: () => void;
  onStatus: (status: RoadmapNode['status']) => void;
  onToggleCheck: (item: string, checked: boolean) => void;
  onNote: (note: string) => void;
}) {
  const [tab, setTab] = useState<'overview' | 'checklist' | 'resources'>('overview');
  const [resourceCost, setResourceCost] = useState<'all' | 'free' | 'paid'>('all');
  const [draft, setDraft] = useState(note);

  useEffect(() => {
    setDraft(note);
    setTab('overview');
  }, [node?.id, note]);

  useEffect(() => {
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [node, onClose]);

  if (!node) return null;

  const resources = node.resources.filter((r) => resourceCost === 'all' || r.cost === resourceCost);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" className="absolute inset-0 bg-[var(--overlay)]" aria-label="Close drawer" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal
        aria-labelledby="node-drawer-title"
        className="relative w-full max-w-xl h-full overflow-y-auto bg-[var(--surface)] border-l border-[var(--border)] shadow-[var(--shadow-xl)] p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-inset)]"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pr-12 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary" size="sm">
              Year {node.year} · {PERIOD_LABELS[node.period]}
            </Badge>
            <Badge variant="outline" size="sm">
              {pillarLabel(node.pillar)}
            </Badge>
            <Badge variant="accent" size="sm">
              {node.difficulty}
            </Badge>
            <span className="text-xs text-[var(--text-muted)] inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {node.estimatedHours} hrs
            </span>
          </div>
          <h2 id="node-drawer-title" className="text-xl font-display font-bold text-[var(--text-primary)]">
            {node.title}
          </h2>

          <div className="flex gap-1 p-1 rounded-xl bg-[var(--surface-inset)]">
            {(['overview', 'checklist', 'resources'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 capitalize text-xs font-semibold py-2 rounded-lg',
                  tab === t
                    ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="space-y-4">
              <section>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Why this is in your roadmap</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{node.why}</p>
              </section>
              <section>
                <h3 className="text-sm font-bold mb-1">Deliverables</h3>
                <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1">
                  {node.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </section>
              {node.skillGain.length > 0 && (
                <p className="text-xs text-[var(--text-muted)]">
                  Skill gain: {node.skillGain.map((g) => `${g.skill} +${g.levels}`).join(', ')}
                </p>
              )}
              {(node.prerequisites.length > 0 || node.unlocks.length > 0) && (
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5" />
                  Prereqs {node.prerequisites.length || 'none'} · Unlocks {node.unlocks.length || 'none'}
                </p>
              )}
            </div>
          )}

          {tab === 'checklist' && (
            <ul className="space-y-2">
              {node.checklist.map((item) => {
                const done = checklistDone.includes(item);
                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => onToggleCheck(item, !done)}
                      className="w-full min-h-11 flex items-center gap-2 text-left text-sm px-3 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-inset)]"
                    >
                      {done ? (
                        <CheckSquare className="w-4 h-4 text-[var(--success)]" />
                      ) : (
                        <Square className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                      <span className={done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}>
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {tab === 'resources' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {(['all', 'free', 'paid'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setResourceCost(c)}
                    className={cn(
                      'px-3 py-2 rounded-xl text-xs font-semibold capitalize min-h-11',
                      resourceCost === c
                        ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                        : 'border border-[var(--border)] text-[var(--text-secondary)]'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {resources.length === 0 && <p className="text-sm text-[var(--text-muted)]">No resources in this filter.</p>}
              {resources.map((r) => (
                <a
                  key={r.title}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 rounded-xl border border-[var(--border)] hover:border-[var(--primary-border)]"
                >
                  <div className="flex justify-between gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{r.title}</span>
                    <Badge variant={r.cost === 'free' ? 'success' : 'warning'} size="sm">
                      {r.cost === 'free' ? 'Free' : 'Paid'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">{r.type}</p>
                </a>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="secondary" onClick={() => onStatus('in-progress')}>
              Mark in-progress
            </Button>
            <Button variant="primary" onClick={() => onStatus('completed')}>
              Complete
            </Button>
            <Button variant="outline" onClick={() => onStatus('skipped')}>
              Skip
            </Button>
            <Button variant="ghost" onClick={() => onStatus('available')}>
              Snooze / reset
            </Button>
          </div>

          <label className="block text-xs font-semibold text-[var(--text-muted)]">
            Add note
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => onNote(draft)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3 text-sm text-[var(--text-primary)]"
            />
          </label>
        </div>
      </aside>
    </div>
  );
}

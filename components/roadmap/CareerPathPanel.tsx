'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Check, ChevronDown, ChevronRight, ThumbsDown, ThumbsUp, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';
import type { UnifiedRoadmapResponse, UnifiedRoadmapStep } from '@/lib/roadmap/rules-fallback';
import type { MapProfileInput } from '@/lib/roadmap/ml-profile';

type CareerPathPayload = UnifiedRoadmapResponse & {
  success?: boolean;
  roadmapId?: string | null;
  error?: string;
};

export function CareerPathPanel({ profileInput }: { profileInput: MapProfileInput }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CareerPathPayload | null>(null);
  const [laterOpen, setLaterOpen] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [votes, setVotes] = useState<Record<string, 'liked' | 'disliked'>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileInput),
      });
      const json = (await res.json()) as CareerPathPayload;
      if (!res.ok || json.success === false) {
        throw new Error(json.error || 'Could not generate career path');
      }
      setData(json);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Could not generate career path');
    } finally {
      setLoading(false);
    }
  }, [profileInput]);

  useEffect(() => {
    void load();
  }, [load]);

  const sendFeedback = async (stepId: string, action: 'completed' | 'skipped' | 'liked' | 'disliked') => {
    if (!data?.roadmapId) {
      toast.info('Feedback saved on this device for now.');
      return;
    }
    try {
      const res = await fetch('/api/v1/roadmap/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roadmapId: data.roadmapId, stepId, action }),
      });
      if (!res.ok) throw new Error('Failed');
    } catch {
      toast.error('Could not save feedback. Try again.');
    }
  };

  const markDone = (step: UnifiedRoadmapStep) => {
    setDone((prev) => new Set(prev).add(step.id));
    void sendFeedback(step.id, 'completed');
    toast.success('Marked as done');
  };

  const vote = (step: UnifiedRoadmapStep, action: 'liked' | 'disliked') => {
    setVotes((prev) => ({ ...prev, [step.id]: action }));
    void sendFeedback(step.id, action);
  };

  if (loading) {
    return (
      <div className="space-y-3 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Career path unavailable"
        description={error}
        action={{ label: 'Retry', onClick: () => void load() }}
      />
    );
  }

  if (!data?.steps?.length) {
    return (
      <EmptyState
        title="No steps yet"
        description="Tune your profile or try again to build a career path."
        action={{ label: 'Generate again', onClick: () => void load() }}
      />
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Career path</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {data.total_hours} h planned of {data.hours_available} h available
            {data.source ? ` · source: ${data.source}` : ''}
          </p>
          {data.note ? <p className="mt-1 text-xs text-[var(--color-text-muted)]">{data.note}</p> : null}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void load()} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      <ol className="space-y-3">
        {data.steps.map((step) => {
          const isDone = done.has(step.id);
          return (
            <li
              key={step.id}
              className={`rounded-xl border border-[var(--color-border-subtle)] p-3 sm:p-4 ${
                isDone ? 'opacity-70' : ''
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">Step {step.step}</span>
                {step.added_as_prerequisite ? <Badge variant="primary">Prerequisite</Badge> : null}
                <span className="text-xs text-[var(--color-text-muted)]">{step.hours} h</span>
              </div>
              <h3 className="mt-1 text-base font-medium text-[var(--color-text-primary)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text-primary)]">Why: </span>
                {step.reason}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={isDone ? 'secondary' : 'primary'}
                  disabled={isDone}
                  onClick={() => markDone(step)}
                  className="gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  {isDone ? 'Done' : 'Mark as done'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={votes[step.id] === 'liked' ? 'primary' : 'outline'}
                  onClick={() => vote(step, 'liked')}
                  aria-label="This step was useful"
                  className="gap-1.5"
                >
                  <ThumbsUp className="h-3.5 w-3.5" /> Useful
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={votes[step.id] === 'disliked' ? 'primary' : 'outline'}
                  onClick={() => vote(step, 'disliked')}
                  aria-label="This step was not useful"
                  className="gap-1.5"
                >
                  <ThumbsDown className="h-3.5 w-3.5" /> Not useful
                </Button>
              </div>
            </li>
          );
        })}
      </ol>

      {data.skipped_for_lack_of_time?.length ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border-subtle)]">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-[var(--color-text-secondary)]"
            onClick={() => setLaterOpen((v) => !v)}
          >
            {laterOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Do later ({data.skipped_for_lack_of_time.length})
          </button>
          {laterOpen ? (
            <ul className="space-y-1 border-t border-[var(--color-border-subtle)] px-3 py-2 text-sm text-[var(--color-text-muted)]">
              {data.skipped_for_lack_of_time.map((title) => (
                <li key={title}>· {title}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

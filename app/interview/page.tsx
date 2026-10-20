'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar } from '@/components/ui/Progress';
import { INTERVIEW_ROUNDS, INTERVIEW_WEEK_PLAN } from '@/data/interview-bank';
import { cn } from '@/lib/cn';

const kinds = ['All', 'Technical', 'HR', 'OA'] as const;
const STORAGE_KEY = 'ctc.interview.progress.v1';

type ProgressState = {
  doneIds: string[];
  weekDone: string[];
};

function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return { doneIds: [], weekDone: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { doneIds: [], weekDone: [] };
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      doneIds: Array.isArray(parsed.doneIds) ? parsed.doneIds : [],
      weekDone: Array.isArray(parsed.weekDone) ? parsed.weekDone : [],
    };
  } catch {
    return { doneIds: [], weekDone: [] };
  }
}

function drillSeconds(drill: string): number {
  const m = drill.match(/(\d+)\s*min/i);
  if (m) return Math.min(45, Math.max(5, Number(m[1]))) * 60;
  if (/70\s*seconds/i.test(drill)) return 70;
  return 10 * 60;
}

export default function InterviewPage() {
  const [kind, setKind] = useState<(typeof kinds)[number]>('All');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({ doneIds: [], weekDone: [] });
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (!timerOn || secondsLeft <= 0) {
      if (secondsLeft <= 0) setTimerOn(false);
      return;
    }
    const id = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [timerOn, secondsLeft]);

  const rounds = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTERVIEW_ROUNDS.filter((r) => {
      if (kind !== 'All' && r.kind !== kind) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.prompt.toLowerCase().includes(q) ||
        r.kind.toLowerCase().includes(q)
      );
    });
  }, [kind, query]);

  const active = INTERVIEW_ROUNDS.find((r) => r.id === activeId) ?? null;
  const doneCount = progress.doneIds.filter((id) => INTERVIEW_ROUNDS.some((r) => r.id === id)).length;
  const pct = Math.round((doneCount / INTERVIEW_ROUNDS.length) * 100);
  const weekPct = Math.round((progress.weekDone.length / INTERVIEW_WEEK_PLAN.length) * 100);

  const startPractice = (id: string) => {
    const round = INTERVIEW_ROUNDS.find((r) => r.id === id);
    if (!round) return;
    setActiveId(id);
    setShowSample(false);
    setSecondsLeft(drillSeconds(round.drill));
    setTimerOn(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markDone = (id: string) => {
    setProgress((p) => ({
      ...p,
      doneIds: p.doneIds.includes(id) ? p.doneIds : [...p.doneIds, id],
    }));
    setTimerOn(false);
  };

  const toggleWeek = (day: string) => {
    setProgress((p) => ({
      ...p,
      weekDone: p.weekDone.includes(day)
        ? p.weekDone.filter((d) => d !== day)
        : [...p.weekDone, day],
    }));
  };

  const resetProgress = () => {
    setProgress({ doneIds: [], weekDone: [] });
    setActiveId(null);
    setTimerOn(false);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="space-y-6 sm:space-y-8 py-6">
      <PageHeader
        badge="Interview Preparation"
        title="Practice one prompt at a time"
        description="Pick a round, start the timer, answer out loud, then reveal the sample. Your progress stays on this device."
      />

      {/* Progress strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 space-y-2">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Bank progress</p>
          <p className="text-2xl font-black text-emerald-600">
            {doneCount}/{INTERVIEW_ROUNDS.length}
          </p>
          <ProgressBar value={pct} size="sm" />
        </Card>
        <Card className="p-4 space-y-2">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">This week</p>
          <p className="text-2xl font-black text-[var(--text-primary)]">
            {progress.weekDone.length}/{INTERVIEW_WEEK_PLAN.length}
          </p>
          <ProgressBar value={weekPct} size="sm" />
        </Card>
        <Card className="p-4 space-y-2 flex flex-col justify-between">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Quick links</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" href="/training">
              Training
            </Button>
            <Button size="sm" variant="outline" href="/coordinators">
              Book mock
            </Button>
            <Button size="sm" variant="ghost" onClick={resetProgress} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset
            </Button>
          </div>
        </Card>
      </div>

      {/* Active practice stage */}
      {active && (
        <Card className="p-5 sm:p-6 space-y-4 border-emerald-500/30 ring-1 ring-emerald-500/20 bg-[var(--surface-raised)] animate-in fade-in duration-300">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Practice mode
                </Badge>
                <Badge
                  variant={active.kind === 'HR' ? 'warning' : active.kind === 'OA' ? 'success' : 'primary'}
                  size="sm"
                >
                  {active.kind}
                </Badge>
                {progress.doneIds.includes(active.id) && (
                  <Badge variant="outline" size="sm">
                    Completed
                  </Badge>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)]">{active.title}</h2>
            </div>
            <div
              className={cn(
                'font-mono text-2xl font-black tabular-nums px-4 py-2 rounded-2xl border',
                secondsLeft <= 30 && timerOn
                  ? 'border-amber-500/50 text-amber-600 bg-amber-500/10'
                  : 'border-[var(--border)] text-[var(--text-primary)] bg-[var(--surface)]'
              )}
            >
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] mr-2">
                <Clock className="w-4 h-4" />
              </span>
              {mm}:{ss}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] flex items-center gap-1">
              <Target className="w-3 h-3" /> Your prompt
            </p>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed">{active.prompt}</p>
          </div>

          <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Drill</p>
            <p className="text-xs text-[var(--text-secondary)]">{active.drill}</p>
          </div>

          {showSample && (
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-2 animate-in fade-in">
              <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> Sample answer
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{active.sample}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={timerOn ? 'secondary' : 'gradient'}
              onClick={() => {
                if (secondsLeft <= 0) setSecondsLeft(drillSeconds(active.drill));
                setTimerOn((v) => !v);
              }}
            >
              {timerOn ? 'Pause timer' : 'Resume timer'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowSample((v) => !v)}>
              {showSample ? 'Hide sample' : 'Reveal sample'}
            </Button>
            <Button
              size="sm"
              variant="gradient"
              onClick={() => markDone(active.id)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Mark complete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setActiveId(null); setTimerOn(false); }}>
              Close practice
            </Button>
          </div>
        </Card>
      )}

      {/* Weekly plan checklist */}
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">This week’s plan</h2>
            <p className="text-xs text-[var(--text-secondary)]">Tap a day when you finish it</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {INTERVIEW_WEEK_PLAN.map((d) => {
            const done = progress.weekDone.includes(d.day);
            return (
              <Card
                key={d.day}
                className={cn(
                  'p-3 space-y-2 transition-colors',
                  done && 'border-emerald-500/40 bg-emerald-500/5'
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleWeek(d.day)}
                  className="flex items-center gap-1.5 text-left w-full"
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  )}
                  <Badge variant="primary" size="sm">
                    {d.day}
                  </Badge>
                </button>
                <p className="text-[11px] text-[var(--text-secondary)] leading-snug min-h-[2.5rem]">{d.focus}</p>
                <Button
                  size="sm"
                  variant="outline"
                  href={d.link}
                  target={d.link.startsWith('http') ? '_blank' : undefined}
                  className="w-full"
                >
                  Open
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts (DSA, STAR, TCS…)"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {kinds.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                'h-9 px-3 rounded-xl text-xs font-bold transition-colors',
                kind === k
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                  : 'border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-inset)]'
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Question bank */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {rounds.map((r) => {
          const done = progress.doneIds.includes(r.id);
          const isActive = activeId === r.id;
          return (
            <Card
              key={r.id}
              className={cn(
                'p-4 sm:p-5 space-y-3 transition-all',
                isActive && 'ring-1 ring-emerald-500/40',
                done && 'opacity-95'
              )}
            >
              <div className="flex justify-between gap-2 items-start">
                <h3 className="font-bold text-sm leading-snug text-[var(--text-primary)]">{r.title}</h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  {done && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  <Badge
                    variant={r.kind === 'HR' ? 'warning' : r.kind === 'OA' ? 'success' : 'primary'}
                    size="sm"
                  >
                    {r.kind}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">{r.prompt}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={isActive ? 'secondary' : 'gradient'}
                  onClick={() => startPractice(r.id)}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  {isActive ? 'Practicing…' : 'Start practice'}
                </Button>
                {done ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setProgress((p) => ({
                        ...p,
                        doneIds: p.doneIds.filter((id) => id !== r.id),
                      }))
                    }
                  >
                    Undo done
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => markDone(r.id)}>
                    Mark done
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {rounds.length === 0 && (
        <Card className="p-8 text-center space-y-2">
          <p className="text-sm font-bold">No prompts match</p>
          <p className="text-xs text-[var(--text-secondary)]">Clear search or pick another filter.</p>
          <Button size="sm" variant="outline" onClick={() => { setQuery(''); setKind('All'); }}>
            Reset filters
          </Button>
        </Card>
      )}

      <Card className="p-4 text-xs text-[var(--text-secondary)] leading-relaxed">
        Tip: answer out loud before revealing the sample. After 5 completed drills, book a coordinator mock from Coordinators.
      </Card>
    </div>
  );
}

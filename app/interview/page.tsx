'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { INTERVIEW_ROUNDS, INTERVIEW_WEEK_PLAN } from '@/data/interview-bank';

const kinds = ['All', 'Technical', 'HR', 'OA'] as const;

export default function InterviewPage() {
  const [kind, setKind] = useState<(typeof kinds)[number]>('All');
  const [openId, setOpenId] = useState<string | null>(INTERVIEW_ROUNDS[0]?.id ?? null);

  const rounds = useMemo(
    () => INTERVIEW_ROUNDS.filter((r) => kind === 'All' || r.kind === kind),
    [kind]
  );

  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="Interview Preparation"
        title="Question bank, samples, and a weekly drill"
        description="Technical, HR, and OA prompts used in SISTec TCS / product screens — plus a sample answer and a timed drill for each."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 space-y-2">
          <h3 className="font-bold text-sm">Mocks</h3>
          <p className="text-xs text-[var(--text-secondary)]">Timed technical, HR, and behavioral drills.</p>
          <Button size="sm" variant="gradient" href="/training">Training modules</Button>
        </Card>
        <Card className="p-4 space-y-2">
          <h3 className="font-bold text-sm">AI feedback</h3>
          <p className="text-xs text-[var(--text-secondary)]">Draft answers, then refine with a coordinator.</p>
          <Button size="sm" variant="outline" href="/ai-tools">AI tools</Button>
        </Card>
        <Card className="p-4 space-y-2">
          <h3 className="font-bold text-sm">STAR stories</h3>
          <p className="text-xs text-[var(--text-secondary)]">Club and hackathon stories, not generic TED lines.</p>
          <Button size="sm" variant="outline" href="/personality">Personality</Button>
        </Card>
        <Card className="p-4 space-y-2">
          <h3 className="font-bold text-sm">Book a mock</h3>
          <p className="text-xs text-[var(--text-secondary)]">Coordinator slot after you finish 5 drills.</p>
          <Button size="sm" variant="outline" href="/coordinators">Coordinators</Button>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-bold mb-3">This week</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {INTERVIEW_WEEK_PLAN.map((d) => (
            <Card key={d.day} className="p-3 space-y-2">
              <Badge variant="primary" size="sm">{d.day}</Badge>
              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{d.focus}</p>
              <Button size="sm" variant="outline" href={d.link} target={d.link.startsWith('http') ? '_blank' : undefined}>
                Open
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {kinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`h-9 px-3 rounded-xl text-xs font-bold ${
              kind === k ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'border border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rounds.map((r) => {
          const open = openId === r.id;
          return (
            <Card key={r.id} className="p-5 space-y-3">
              <div className="flex justify-between gap-2">
                <h3 className="font-bold text-sm">{r.title}</h3>
                <Badge variant={r.kind === 'HR' ? 'warning' : r.kind === 'OA' ? 'success' : 'primary'} size="sm">
                  {r.kind}
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{r.prompt}</p>
              {open && (
                <div className="space-y-2 rounded-xl border border-[var(--border)] p-3 bg-[var(--surface-raised)]">
                  <p className="text-[11px] font-bold uppercase text-[var(--text-muted)]">Sample</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{r.sample}</p>
                  <p className="text-[11px] font-bold uppercase text-[var(--text-muted)] pt-1">Drill</p>
                  <p className="text-xs text-[var(--text-secondary)]">{r.drill}</p>
                </div>
              )}
              <Button size="sm" variant={open ? 'secondary' : 'outline'} onClick={() => setOpenId(open ? null : r.id)}>
                {open ? 'Hide sample' : 'Show sample + drill'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

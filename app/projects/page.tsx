'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Clock, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { stagger, staggerItem } from '@/lib/motion';
import type { FeasibleProject } from '@/data/feasible-projects';
import { useAuth } from '@/context/AuthContext';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [catalog, setCatalog] = useState<FeasibleProject[]>([]);
  const [mine, setMine] = useState<Array<{ id: string; title: string; description: string; techStack: string[] }>>([]);
  const [year, setYear] = useState<number | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/projects/catalog')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setCatalog(j.projects || []);
      })
      .catch(console.error);
    if (user) {
      fetch('/api/v1/dashboard/student')
        .then((r) => r.json())
        .then((j) => {
          if (j.success) setMine(j.student?.projects ?? []);
        })
        .catch(() => undefined);
    }
  }, [user]);

  const shown = year === 'all' ? catalog : catalog.filter((p) => p.year === year);

  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="Projects"
        title="Feasible builds with working notes"
        description="Each project is sized for a SISTec semester — stack, how it works, and the exact steps to ship a demo."
        actions={
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
            {(['all', 1, 2, 3, 4] as const).map((y) => (
              <button
                key={String(y)}
                type="button"
                onClick={() => setYear(y)}
                className={`h-9 px-3 rounded-xl text-xs font-bold ${
                  year === y ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {y === 'all' ? 'All years' : `Year ${y}`}
              </button>
            ))}
          </div>
        }
      />

      {mine.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold">On your profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mine.map((p) => (
              <Card key={p.id} className="p-5 space-y-2">
                <FolderKanban className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="font-bold text-sm">{p.title}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{p.description}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      <motion.div variants={stagger(0.05)} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {shown.map((p) => {
          const open = openId === p.id;
          return (
            <motion.div key={p.id} variants={staggerItem}>
              <Card variant="interactive" className="p-5 sm:p-6 h-full flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-base leading-snug">{p.title}</h3>
                  <Badge variant="outline" size="sm">Y{p.year}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{p.weeks} weeks · {p.hours}</span>
                  <Badge variant="primary" size="sm">{p.difficulty}</Badge>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{p.working}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Badge key={s} variant="outline" size="sm">{s}</Badge>
                  ))}
                </div>
                {open && (
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs text-[var(--text-secondary)]">
                    {p.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                )}
                {open && (
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Demo: {p.demoHint} · Repo: {p.repoHint}
                  </p>
                )}
                <div className="mt-auto pt-2">
                  <Button
                    size="sm"
                    variant={open ? 'secondary' : 'gradient'}
                    leftIcon={<Wrench className="w-3.5 h-3.5" />}
                    onClick={() => setOpenId(open ? null : p.id)}
                  >
                    {open ? 'Hide steps' : 'How it works'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

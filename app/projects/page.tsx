'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Clock, Wrench, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { stagger, staggerItem } from '@/lib/motion';
import type { FeasibleProject } from '@/data/feasible-projects';
import { claimBrief, loadBriefs, savePostedBrief, type FacultyBrief } from '@/data/faculty-briefs';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [catalog, setCatalog] = useState<FeasibleProject[]>([]);
  const [mine, setMine] = useState<Array<{ id: string; title: string; description: string; techStack: string[] }>>([]);
  const [year, setYear] = useState<number | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<'builds' | 'briefs'>('builds');
  const [briefs, setBriefs] = useState<FacultyBrief[]>([]);
  const [facultyName, setFacultyName] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [skills, setSkills] = useState('');

  useEffect(() => {
    setBriefs(loadBriefs());
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
  const canPost = true;

  const postBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName.trim() || !department.trim() || !title.trim() || !problem.trim()) {
      toast.error('Fill the brief', 'Name, department, title, and the problem are required.');
      return;
    }
    const brief: FacultyBrief = {
      id: `brief-${Date.now()}`,
      facultyName: facultyName.trim(),
      department: department.trim(),
      title: title.trim(),
      problem: problem.trim(),
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      postedAt: new Date().toISOString().slice(0, 10),
    };
    savePostedBrief(brief);
    setBriefs(loadBriefs());
    setTitle('');
    setProblem('');
    setSkills('');
    toast.success('Brief on the board', 'Students will see this under Department briefs.');
  };

  const takeBrief = (id: string) => {
    const name = user?.name || 'A SISTec student';
    claimBrief(id, name);
    setBriefs(loadBriefs());
    toast.success('You picked this up', 'Message the faculty from Coordinators if you need the lab slot.');
  };

  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="Projects"
        title="Feasible builds and department briefs"
        description="Catalog builds sit beside live problems faculty drop in. Pick a brief, ship a demo, and take it to the lab."
        actions={
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
            <button
              type="button"
              onClick={() => setTab('builds')}
              className={`h-9 px-3 rounded-xl text-xs font-bold ${
                tab === 'builds' ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'text-[var(--text-muted)]'
              }`}
            >
              Catalog
            </button>
            <button
              type="button"
              onClick={() => setTab('briefs')}
              className={`h-9 px-3 rounded-xl text-xs font-bold ${
                tab === 'briefs' ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'text-[var(--text-muted)]'
              }`}
            >
              Department briefs
            </button>
          </div>
        }
      />

      {tab === 'briefs' ? (
        <div className="space-y-6">
          {canPost && (
            <Card className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="font-bold text-sm">Faculty: drop a department problem</h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Name the lab pain in one paragraph. Students pick it up from this board and can call you from Coordinators.
              </p>
              <form onSubmit={postBrief} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Faculty name *"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="Ruchi Jain"
                  required
                />
                <Input
                  label="Department or club *"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="AIDS · Kaggle Koders"
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Problem title *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Lab attendance that assistants can trust"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                    What students should build *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="What is broken today, who uses it, and what a working demo looks like."
                    className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Skills (comma separated)"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Next.js, SQL, QR"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" variant="gradient" size="sm">
                    Post for students
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {briefs.map((brief) => (
              <Card key={brief.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-sm leading-snug">{brief.title}</h3>
                  <Badge variant="outline" size="sm">
                    {brief.department}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--primary)] font-semibold">{brief.facultyName}</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{brief.problem}</p>
                <div className="flex flex-wrap gap-1.5">
                  {brief.skills.map((skill) => (
                    <Badge key={skill} variant="outline" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {brief.claimedBy ? (
                  <p className="text-[11px] text-[var(--text-muted)]">Picked up by {brief.claimedBy}</p>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => takeBrief(brief.id)}>
                    I will build this
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] w-fit">
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
        </>
      )}
    </div>
  );
}

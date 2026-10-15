'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FileText, Printer, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { ResumeAnalyzerModal } from '@/components/ResumeAnalyzerModal';
import { toast } from '@/components/ui/Toast';

const STORAGE = 'ctc.resume.draft.v1';

type Draft = {
  name: string;
  email: string;
  phone: string;
  github: string;
  branch: string;
  year: string;
  cgpa: string;
  skills: string;
  projectTitle: string;
  bullets: string;
  target: string;
};

const sample: Draft = {
  name: 'Aarav Sharma',
  email: 'aarav@sistec.ac.in',
  phone: '+91 98765 43210',
  github: 'github.com/aarav',
  branch: 'CSE',
  year: '3',
  cgpa: '8.4',
  skills: 'Java, JavaScript, SQL, Git, React',
  projectTitle: 'QR attendance for SAC',
  bullets:
    'Built a QR check-in used at one SAC event.\nCut manual roll-call from 12 min to 3 min on 80 students.\nStored sessions in PostgreSQL with a simple admin login.',
  target: 'SDE intern',
};

const CHECKS = [
  { id: 'one', label: 'Fits one page' },
  { id: 'metric', label: 'Every project bullet has a number' },
  { id: 'github', label: 'GitHub or live link present' },
  { id: 'skills', label: 'Skills match the target role' },
  { id: 'contact', label: 'Email + phone on line 1' },
];

export default function ResumePage() {
  const [draft, setDraft] = useState<Draft>(sample);
  const [scanOpen, setScanOpen] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setDraft({ ...sample, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(draft));
  }, [draft]);

  const skills = draft.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const plain = useMemo(() => {
    const bullets = draft.bullets
      .split('\n')
      .map((b) => b.replace(/^•\s*/, '').trim())
      .filter(Boolean)
      .map((b) => `• ${b}`)
      .join('\n');
    return `${draft.name}
${draft.target} | B.Tech ${draft.branch}, Year ${draft.year}, SISTec | CGPA ${draft.cgpa}
${draft.email} | ${draft.phone} | ${draft.github}

SKILLS
${skills.join(' · ')}

PROJECT — ${draft.projectTitle}
${bullets}`;
  }, [draft, skills]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const addSkill = () => {
    const t = skillInput.trim();
    if (!t) return;
    set('skills', skills.concat(t).join(', '));
    setSkillInput('');
  };

  return (
    <div className="space-y-6 py-6">
      <PageHeader
        badge="Resume"
        title="Fill the left. Watch the one-pager on the right."
        description="Campus-drive layout. Tick the checklist, then scan for ATS keywords."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setDraft(sample)}>
              Load sample
            </Button>
            <Button size="sm" variant="outline" href="/projects">
              Projects
            </Button>
            <Button size="sm" variant="gradient" onClick={() => setScanOpen(true)} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              ATS scan
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        <div className="space-y-4">
          <Card className="p-5 space-y-3">
            <p className="text-xs font-bold">You</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Name" value={draft.name} onChange={(e) => set('name', e.target.value)} />
              <Input label="Target role" value={draft.target} onChange={(e) => set('target', e.target.value)} />
              <Input label="Email" value={draft.email} onChange={(e) => set('email', e.target.value)} />
              <Input label="Phone" value={draft.phone} onChange={(e) => set('phone', e.target.value)} />
              <Input label="GitHub" value={draft.github} onChange={(e) => set('github', e.target.value)} />
              <Input label="Branch" value={draft.branch} onChange={(e) => set('branch', e.target.value)} />
              <Input label="Year" value={draft.year} onChange={(e) => set('year', e.target.value)} />
              <Input label="CGPA" value={draft.cgpa} onChange={(e) => set('cgpa', e.target.value)} />
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <p className="text-xs font-bold">Skills (comma or add)</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="text-[11px] font-bold px-2 py-1 rounded-lg border border-[var(--border)]"
                  onClick={() => set('skills', skills.filter((x) => x !== s).join(', '))}
                  title="Remove"
                >
                  {s} ×
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add skill" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <Button size="sm" variant="outline" onClick={addSkill}>
                Add
              </Button>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <p className="text-xs font-bold">One project · one line = action + number</p>
            <Input label="Project name" value={draft.projectTitle} onChange={(e) => set('projectTitle', e.target.value)} />
            <textarea
              rows={5}
              value={draft.bullets}
              onChange={(e) => set('bullets', e.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-transparent p-3 text-xs leading-relaxed"
              placeholder={'Built …\nCut … by 40%\nStored …'}
            />
          </Card>

          <Card className="p-5 space-y-2">
            <p className="text-xs font-bold">Before you export</p>
            {CHECKS.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!checks[c.id]}
                  onChange={() => setChecks((x) => ({ ...x, [c.id]: !x[c.id] }))}
                />
                {c.label}
              </label>
            ))}
          </Card>
        </div>

        <div className="xl:sticky xl:top-24 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(plain);
                toast.success('Copied plain text');
              }}
            >
              Copy text
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => {
                window.print();
                toast.info('Save as PDF', 'Choose Save as PDF in the print dialog.');
              }}
            >
              Print / PDF
            </Button>
            <Badge variant={Object.values(checks).filter(Boolean).length === CHECKS.length ? 'success' : 'outline'} size="sm">
              {Object.values(checks).filter(Boolean).length}/{CHECKS.length} checks
            </Badge>
          </div>
          <Card className="p-6 print:shadow-none print:border-0" id="resume-preview">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">{draft.name || 'Your name'}</h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  {draft.target} · B.Tech {draft.branch} Y{draft.year} · SISTec · CGPA {draft.cgpa}
                </p>
              </div>
              <FileText className="w-5 h-5 text-[var(--primary)] shrink-0" />
            </div>
            <p className="text-[11px] mt-2 text-[var(--text-muted)]">
              {draft.email} · {draft.phone} · {draft.github}
            </p>
            <h3 className="text-[10px] font-black uppercase tracking-wider mt-4 mb-1">Skills</h3>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <Badge key={s} variant="outline" size="sm">
                  {s}
                </Badge>
              ))}
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-wider mt-4 mb-1">Project</h3>
            <p className="text-xs font-bold">{draft.projectTitle}</p>
            <ul className="mt-1 space-y-1">
              {draft.bullets
                .split('\n')
                .map((b) => b.replace(/^•\s*/, '').trim())
                .filter(Boolean)
                .map((b) => (
                  <li key={b} className="text-xs text-[var(--text-secondary)] flex gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </div>

      <ResumeAnalyzerModal isOpen={scanOpen} onClose={() => setScanOpen(false)} />
    </div>
  );
}

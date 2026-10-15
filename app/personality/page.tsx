'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Mic, Timer, Copy } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar } from '@/components/ui/Progress';
import { toast } from '@/components/ui/Toast';

const STORAGE = 'ctc.personality.v1';

type Tab = 'speak' | 'lead' | 'habits' | 'presence';

const HABITS = [
  { id: 'dsa', label: '2 DSA problems' },
  { id: 'speak', label: 'Read intro out loud once' },
  { id: 'mail', label: 'One professional message' },
  { id: 'sleep', label: 'Sleep before 12:30' },
  { id: 'club', label: '30 min club / NSS / gym' },
];

const LEAD_MOVES = [
  { id: 'sac', label: 'Help at one SAC stall (Fiesta / Jalsa)' },
  { id: 'hack', label: 'Volunteer at a hackathon registration desk' },
  { id: 'nss', label: 'One NSS / Yoga Day hour' },
  { id: 'mentor', label: 'Explain a lab to a first-year for 20 min' },
  { id: 'lead-meet', label: 'Run a 15-min stand-up for a project pair' },
];

const PRESENCE = [
  { id: 'eye', label: 'Look at the camera / panel, not your notes' },
  { id: 'pause', label: 'Pause 1 second before answering' },
  { id: 'phone', label: 'Phone face-down in meetings' },
  { id: 'thanks', label: 'Send a 5-line thank-you after a PPT' },
  { id: 'name', label: 'Use the interviewer’s name once' },
];

type Store = {
  habits: Record<string, boolean>;
  lead: Record<string, boolean>;
  presence: Record<string, boolean>;
  intro: { name: string; branch: string; year: string; project: string; ask: string };
  star: { s: string; t: string; a: string; r: string };
};

const empty: Store = {
  habits: {},
  lead: {},
  presence: {},
  intro: { name: '', branch: 'CSE', year: '3', project: '', ask: 'a backend internship' },
  star: { s: '', t: '', a: '', r: '' },
};

export default function PersonalityPage() {
  const [tab, setTab] = useState<Tab>('speak');
  const [data, setData] = useState<Store>(empty);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setData({ ...empty, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const introText = useMemo(() => {
    const { name, branch, year, project, ask } = data.intro;
    const who = name || 'I';
    return `${who === 'I' ? 'I am' : `I am ${name},`} B.Tech ${branch} Year ${year} at SISTec. I built ${project || 'a campus project'}. I want ${ask || 'a campus internship'}.`;
  }, [data.intro]);

  const starText = `Situation: ${data.star.s || '—'}\nTask: ${data.star.t || '—'}\nAction: ${data.star.a || '—'}\nResult: ${data.star.r || '—'}`;

  const doneCount =
    Object.values(data.habits).filter(Boolean).length +
    Object.values(data.lead).filter(Boolean).length +
    Object.values(data.presence).filter(Boolean).length;
  const total = HABITS.length + LEAD_MOVES.length + PRESENCE.length;
  const pct = Math.round((doneCount / total) * 100);

  const toggle = (bucket: 'habits' | 'lead' | 'presence', id: string) => {
    setData((d) => ({ ...d, [bucket]: { ...d[bucket], [id]: !d[bucket][id] } }));
  };

  return (
    <div className="space-y-6 py-6">
      <PageHeader
        badge="Personality"
        title="Practice in 10 minutes, not theory"
        description="Build a 60-second intro, one STAR story, and today’s habits. Progress stays on this device."
      />

      <Card className="p-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="font-bold">This week’s checks</span>
          <span className="text-[var(--text-muted)]">
            {doneCount}/{total}
          </span>
        </div>
        <ProgressBar value={pct} size="sm" color="success" />
      </Card>

      <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] w-fit">
        {(
          [
            ['speak', '60s intro'],
            ['lead', 'Leadership'],
            ['habits', 'Today'],
            ['presence', 'Presence'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`h-9 px-3 rounded-xl text-xs font-bold ${
              tab === id ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'text-[var(--text-muted)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'speak' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5 space-y-3">
            <p className="text-xs font-bold">Fill five fields. That’s the whole intro.</p>
            <Input label="Name" value={data.intro.name} onChange={(e) => setData((d) => ({ ...d, intro: { ...d.intro, name: e.target.value } }))} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Branch" value={data.intro.branch} onChange={(e) => setData((d) => ({ ...d, intro: { ...d.intro, branch: e.target.value } }))} />
              <Input label="Year" value={data.intro.year} onChange={(e) => setData((d) => ({ ...d, intro: { ...d.intro, year: e.target.value } }))} />
            </div>
            <Input label="One project" value={data.intro.project} onChange={(e) => setData((d) => ({ ...d, intro: { ...d.intro, project: e.target.value } }))} placeholder="QR attendance for SAC" />
            <Input label="What you want" value={data.intro.ask} onChange={(e) => setData((d) => ({ ...d, intro: { ...d.intro, ask: e.target.value } }))} placeholder="ship backend APIs" />
          </Card>
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="sm">
                <Mic className="w-3 h-3 mr-1 inline" />
                Speak this
              </Badge>
              <span className={`text-sm font-mono ${seconds > 70 ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>
                <Timer className="w-3.5 h-3.5 inline mr-1" />
                {seconds}s {seconds > 70 ? '— cut it' : '/ 60s'}
              </span>
            </div>
            <p className="text-sm leading-relaxed bg-[var(--surface-raised)] rounded-2xl p-4 border border-[var(--border)]">{introText}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="gradient"
                onClick={() => {
                  setSeconds(0);
                  setRunning(true);
                }}
              >
                Start 60s
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setRunning(false);
                }}
              >
                Stop
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => {
                  navigator.clipboard.writeText(introText);
                  toast.success('Copied', 'Paste into Interview drills');
                }}
              >
                Copy
              </Button>
              <Button size="sm" variant="outline" href="/interview">
                More drills
              </Button>
            </div>
          </Card>
        </div>
      )}

      {tab === 'lead' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5 space-y-3">
            <p className="text-xs font-bold">Tick campus moves you already did</p>
            {LEAD_MOVES.map((m) => (
              <label key={m.id} className="flex items-start gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="mt-1" checked={!!data.lead[m.id]} onChange={() => toggle('lead', m.id)} />
                <span>{m.label}</span>
              </label>
            ))}
            <Button size="sm" variant="outline" href="/campus-life">
              Find a club event
            </Button>
          </Card>
          <Card className="p-5 space-y-3">
            <p className="text-xs font-bold">STAR story (8 lines max)</p>
            <Input label="Situation" value={data.star.s} onChange={(e) => setData((d) => ({ ...d, star: { ...d.star, s: e.target.value } }))} placeholder="Fiesta stall clash" />
            <Input label="Task" value={data.star.t} onChange={(e) => setData((d) => ({ ...d, star: { ...d.star, t: e.target.value } }))} placeholder="Both stalls open on time" />
            <Input label="Action" value={data.star.a} onChange={(e) => setData((d) => ({ ...d, star: { ...d.star, a: e.target.value } }))} placeholder="Split inventory sheet" />
            <Input label="Result" value={data.star.r} onChange={(e) => setData((d) => ({ ...d, star: { ...d.star, r: e.target.value } }))} placeholder="Opened on time, no leftover stock fight" />
            <Button
              size="sm"
              variant="gradient"
              onClick={() => {
                navigator.clipboard.writeText(starText);
                toast.success('STAR copied');
              }}
            >
              Copy STAR
            </Button>
          </Card>
        </div>
      )}

      {tab === 'habits' && (
        <Card className="p-5 space-y-3">
          <p className="text-xs font-bold">Today only. Reset tomorrow by unticking.</p>
          {HABITS.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => toggle('habits', h.id)}
              className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm ${
                data.habits[h.id] ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-[var(--border)]'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${data.habits[h.id] ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`} />
              {h.label}
            </button>
          ))}
        </Card>
      )}

      {tab === 'presence' && (
        <div className="space-y-4">
          <Card className="p-5 space-y-3">
            {PRESENCE.map((p) => (
              <label key={p.id} className="flex items-start gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="mt-1" checked={!!data.presence[p.id]} onChange={() => toggle('presence', p.id)} />
                <span>{p.label}</span>
              </label>
            ))}
          </Card>
          <Card className="p-5 space-y-2">
            <p className="text-xs font-bold">Thank-you mail after TCS PPT</p>
            <pre className="text-xs whitespace-pre-wrap bg-[var(--surface-raised)] p-4 rounded-2xl border border-[var(--border)]">{`Subject: Thank you — TCS pre-placement talk, SISTec

Sir/Ma’am,
Thank you for the SISTec PPT today. I am B.Tech CSE Year 3 and will sit the NQT coding pair this week.
Grateful for the role brief.
Regards,
[Name] | [Branch] | [Phone]`}</pre>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  'Subject: Thank you — TCS pre-placement talk, SISTec\n\nSir/Ma’am,\nThank you for the SISTec PPT today. I am B.Tech CSE Year 3 and will sit the NQT coding pair this week.\nGrateful for the role brief.\nRegards,\n[Name] | [Branch] | [Phone]'
                );
                toast.success('Template copied');
              }}
            >
              Copy template
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

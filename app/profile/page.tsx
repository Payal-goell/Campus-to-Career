'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { useStudentHub } from '@/hooks/useStudentHub';

export default function ProfilePage() {
  const { data, loading } = useStudentHub();
  if (loading) return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Loading profile…</p>;
  if (!data) return null;
  const s = data.student;

  return (
    <div className="space-y-6 py-6">
      <Card variant="raised" className="p-6 sm:p-8 flex flex-col md:flex-row gap-6">
        <Avatar src={s.avatarUrl || undefined} name={s.fullName} size="xl" />
        <div className="flex-1 space-y-2">
          <Badge variant="primary" size="sm">Profile</Badge>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">{s.fullName}</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            {s.branch} · Year {s.currentYear} · {s.collegeName}
          </p>
          <p className="text-xs text-[var(--primary)] font-semibold">Target: {s.targetRole || 'Not set'}</p>
          <div className="max-w-sm pt-2">
            <p className="text-[10px] text-[var(--text-muted)] mb-1">Profile completion {data.profileCompletion}%</p>
            <ProgressBar value={data.profileCompletion} size="sm" />
          </div>
        </div>
        <Link href="/onboarding">
          <Button variant="outline" size="sm">Edit via onboarding</Button>
        </Link>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <h2 className="text-sm font-bold">Academic info</h2>
          <p className="text-xs text-[var(--text-secondary)]">CGPA {s.cgpa ?? '—'} · Placement year {s.targetPlacementYear ?? '—'}</p>
        </Card>
        <Card className="p-5 space-y-2">
          <h2 className="text-sm font-bold">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {s.skills.slice(0, 8).map((sk) => (
              <Badge key={sk} variant="outline" size="sm">{sk}</Badge>
            ))}
          </div>
          <Link href="/skills" className="text-xs text-[var(--primary)] font-semibold inline-flex items-center gap-1">
            Skill gap <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>
        <Card className="p-5 space-y-2">
          <h2 className="text-sm font-bold">Interests & achievements</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Domains: {s.preferredDomains.join(', ') || '—'}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {s.projects?.length ?? 0} projects · {s.certifications?.length ?? 0} certifications
          </p>
        </Card>
      </div>
    </div>
  );
}

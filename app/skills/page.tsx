'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkillGapChart } from '@/components/SkillGapChart';
import { useStudentHub } from '@/hooks/useStudentHub';

export default function SkillsPage() {
  const { data, loading } = useStudentHub();
  if (loading) return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Loading skills…</p>;
  if (!data) return null;

  return (
    <div className="space-y-6 py-6">
      <div>
        <Badge variant="primary" size="sm">Skills</Badge>
        <h1 className="text-2xl font-black mt-2 text-[var(--text-primary)]">Skill categories & gap</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Evidence from your profile, history vs target role, and recommended next actions.
        </p>
      </div>
      <SkillGapChart data={data.skillGapAnalysis} />
      <Card className="p-5 space-y-2">
        <h2 className="text-sm font-bold">Current skills on file</h2>
        <div className="flex flex-wrap gap-1.5">
          {data.student.skills.map((sk) => (
            <Badge key={sk} variant="outline" size="sm">{sk}</Badge>
          ))}
        </div>
        <Link href="/resources" className="text-xs text-[var(--primary)] font-semibold">Add evidence via Resources →</Link>
      </Card>
    </div>
  );
}

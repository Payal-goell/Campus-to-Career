'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkillGapChart } from '@/components/SkillGapChart';
import { GuestPreviewBanner } from '@/components/ModuleAuthGate';
import { DownloadAnalysisReport } from '@/components/DownloadAnalysisReport';
import { useStudentHub } from '@/hooks/useStudentHub';
import { knowledgePercent } from '@/lib/skill-assessment';
import { SkillKnowledgeList, useSkillRecords } from '@/components/skills/SkillKnowledgeList';

export default function SkillsPage() {
  const { data, loading, isGuest } = useStudentHub({ requireAuth: false });
  const skillRecords = useSkillRecords(data?.student.skillAssessments);

  if (loading) {
    return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Loading skill gap…</p>;
  }
  if (!data) {
    return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Could not load skill data.</p>;
  }
  const gap = data.skillGapAnalysis.map((item) => ({
    ...item,
    current: knowledgePercent(skillRecords, item.skill, item.current),
  }));

  return (
    <div className="space-y-6 py-6">
      <div>
        <Badge variant="primary" size="sm">Skill Gap Radar</Badge>
        <h1 className="text-2xl font-black mt-2 text-[var(--text-primary)]">Skill categories & gap</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Compare your strengths against Tier-1 role requirements before application season.
        </p>
      </div>

      {isGuest && <GuestPreviewBanner nextPath="/skills" />}

      <DownloadAnalysisReport data={data} />

      <SkillGapChart data={gap} />

      <Card className="p-5 space-y-2">
        <h2 className="text-sm font-bold">Current skills on file</h2>
        <SkillKnowledgeList records={skillRecords} names={data.student.skills} />
        <Link href="/resources" className="text-xs text-[var(--primary)] font-semibold">
          Add evidence via Resources →
        </Link>
      </Card>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScoreMeter } from '@/components/ScoreMeter';
import { SkillGapChart } from '@/components/SkillGapChart';
import { ProgressBar } from '@/components/ui/Progress';
import { PageHeader } from '@/components/ui/PageHeader';
import { GuestPreviewBanner } from '@/components/ModuleAuthGate';
import { DownloadAnalysisReport } from '@/components/DownloadAnalysisReport';
import { useStudentHub } from '@/hooks/useStudentHub';
import { useSkillRecords } from '@/components/skills/SkillKnowledgeList';
import { actionsFromGaps, buildSkillGap } from '@/lib/skill-standing';

export default function AnalyticsPage() {
  const { data, loading, isGuest } = useStudentHub({ requireAuth: false });
  const skillRecords = useSkillRecords(data?.student.skillAssessments);

  if (loading) {
    return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Loading analytics…</p>;
  }
  if (!data) {
    return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Could not load analytics.</p>;
  }

  const gap = buildSkillGap(skillRecords, data.skillGapAnalysis);
  const reportData = {
    ...data,
    skillGapAnalysis: gap,
    recommendedActions: actionsFromGaps(gap, data.recommendedActions),
  };
  const priorityGaps = gap
    .filter((g) => g.required - g.current > 15)
    .sort((a, b) => b.required - b.current - (a.required - a.current));

  return (
    <div className="space-y-6 py-6">
      <PageHeader
        badge="Analytics & Reports"
        title="Score, skill growth, year-wise progress"
        description="Track your development score and skill gaps — then download a shareable analysis report for mentors or self-review."
      />

      {isGuest && <GuestPreviewBanner nextPath="/analytics" />}

      <DownloadAnalysisReport data={reportData} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <ScoreMeter score={data.developmentScore} profileCompletion={data.profileCompletion} />
        </div>
        <div className="lg:col-span-8">
          <SkillGapChart data={gap} />
        </div>
      </div>

      <Card className="p-5 space-y-2">
        <p className="text-xs text-[var(--text-muted)]">Roadmap progress</p>
        <ProgressBar value={data.roadmapProgress.progressPercentage} size="md" />
        <p className="text-xs text-[var(--text-secondary)]">
          {data.roadmapProgress.completedMilestones}/{data.roadmapProgress.totalMilestones} milestones ·{' '}
          {data.applicationsCount} applications · {data.savedResourcesCount} saved resources
        </p>
      </Card>

      {priorityGaps.length > 0 && (
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold">Priority gaps to close</h2>
            <Badge variant="warning" size="sm">
              {priorityGaps.length} focus area{priorityGaps.length === 1 ? '' : 's'}
            </Badge>
          </div>
          <ul className="space-y-2">
            {priorityGaps.map((g) => (
              <li
                key={g.skill}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs rounded-xl border border-[var(--border)] px-3 py-2.5"
              >
                <div className="space-y-1">
                  <span className="font-semibold text-[var(--text-primary)]">{g.skill}</span>
                  <p className="text-[var(--text-secondary)]">{g.standing}</p>
                  <p className="text-[var(--text-secondary)]">{g.basis}</p>
                  <p className="text-[var(--text-primary)]">{g.next}</p>
                </div>
                <span className="text-[var(--text-secondary)] font-mono shrink-0">
                  {g.current} → {g.required} (gap {g.required - g.current})
                </span>
              </li>
            ))}
          </ul>
          <Button size="sm" variant="outline" href="/skills">
            Open skill gap radar
          </Button>
        </Card>
      )}

      {data.recommendedActions?.length > 0 && (
        <Card className="p-5 space-y-2">
          <h2 className="text-sm font-bold">Recommended next actions</h2>
          <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
            {reportData.recommendedActions.map((action) => (
              <li key={action} className="flex gap-2">
                <span className="text-emerald-600 shrink-0">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

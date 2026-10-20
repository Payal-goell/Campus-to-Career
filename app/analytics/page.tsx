'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreMeter } from '@/components/ScoreMeter';
import { SkillGapChart } from '@/components/SkillGapChart';
import { ProgressBar } from '@/components/ui/Progress';
import { GuestPreviewBanner } from '@/components/ModuleAuthGate';
import { useStudentHub } from '@/hooks/useStudentHub';

export default function AnalyticsPage() {
  const { data, loading, isGuest } = useStudentHub({ requireAuth: false });

  if (loading) {
    return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Loading analytics…</p>;
  }
  if (!data) {
    return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Could not load analytics.</p>;
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <Badge variant="primary" size="sm">Analytics & Reports</Badge>
        <h1 className="text-2xl font-black mt-2 text-[var(--text-primary)]">
          Score, skill growth, year-wise progress
        </h1>
      </div>

      {isGuest && <GuestPreviewBanner nextPath="/analytics" />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <ScoreMeter score={data.developmentScore} profileCompletion={data.profileCompletion} />
        </div>
        <div className="lg:col-span-8">
          <SkillGapChart data={data.skillGapAnalysis} />
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
    </div>
  );
}

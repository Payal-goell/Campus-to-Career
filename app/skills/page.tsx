'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkillGapChart } from '@/components/SkillGapChart';
import { GuestPreviewBanner, BuildProfilePrompt } from '@/components/ModuleAuthGate';
import { DownloadAnalysisReport } from '@/components/DownloadAnalysisReport';
import { useStudentHub } from '@/hooks/useStudentHub';
import { SkillKnowledgeList, useSkillRecords } from '@/components/skills/SkillKnowledgeList';
import { actionsFromGaps, buildSkillGap } from '@/lib/skill-standing';
import { useAuth } from '@/context/AuthContext';
import { hasStudentProfile } from '@/lib/profile-access';

export default function SkillsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const profileReady = !authLoading && hasStudentProfile(user);
  const { data, loading, isGuest } = useStudentHub({ requireAuth: false });
  const skillRecords = useSkillRecords(data?.student.skillAssessments);

  if (authLoading || (profileReady && loading)) {
    return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Loading skill gap…</p>;
  }
  if (!profileReady) {
    return (
      <BuildProfilePrompt
        title="Build your profile"
        description="Your skill gap uses the quiz scores and certificates from your profile. Build that profile to see where you are and what to do next."
      />
    );
  }
  if (!data) {
    return <p className="py-20 text-center text-xs text-[var(--text-muted)]">Could not load skill data.</p>;
  }
  const gap = buildSkillGap(skillRecords, data.skillGapAnalysis);
  const reportData = {
    ...data,
    skillGapAnalysis: gap,
    recommendedActions: actionsFromGaps(gap, data.recommendedActions),
  };

  return (
    <div className="space-y-6 py-6">
      <div>
        <Badge variant="primary" size="sm">Skill Gap Radar</Badge>
        <h1 className="text-2xl font-black mt-2 text-[var(--text-primary)]">Skill categories & gap</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Each bar is the quiz you scored or the level you proved. Under it is the role target and the one thing to do next.
        </p>
      </div>

      {isGuest && <GuestPreviewBanner nextPath="/skills" />}

      <DownloadAnalysisReport data={reportData} />

      <SkillGapChart data={gap} />

      <Card className="p-5 space-y-2">
        <h2 className="text-sm font-bold">Where the numbers come from</h2>
        <p className="text-xs text-[var(--text-secondary)]">
          A technical skill uses the quiz difficulty you picked. An extracurricular skill uses the level you marked and the certificate or clip you attached. The file stays on your device. The name and the percentage stay on your profile.
        </p>
        <SkillKnowledgeList records={skillRecords} names={data.student.skills} />
        <Link href="/onboarding" className="text-xs text-[var(--primary)] font-semibold">
          Update a skill check →
        </Link>
      </Card>
    </div>
  );
}

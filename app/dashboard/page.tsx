"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import {
  Compass,
  Map,
  BookOpen,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  UserCheck,
  Target,
  FileText,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { Avatar } from "@/components/ui/Avatar";
import { ScoreMeter } from "@/components/ScoreMeter";
import { TodayPlan } from "@/components/dashboard/TodayPlan";
import { DashboardOverview } from "@/lib/types";
import { ModuleAuthGate } from "@/components/ModuleAuthGate";

const SkillGapChart = dynamic(
  () => import("@/components/SkillGapChart").then((m) => m.SkillGapChart),
  {
    ssr: false,
    loading: () => <div className="h-72 rounded-2xl skeleton" aria-hidden />,
  }
);

const ResumeAnalyzerModal = dynamic(
  () => import("@/components/ResumeAnalyzerModal").then((m) => m.ResumeAnalyzerModal),
  { ssr: false }
);

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    if (!user.isOnboarded) {
      router.replace("/onboarding");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/v1/dashboard/student");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, authLoading, router]);

  if (!authLoading && !user) {
    return (
      <ModuleAuthGate
        title="Student dashboard"
        description="Sign in to open your development score, skill gap, roadmap progress, and today’s plan."
        nextPath="/dashboard"
      />
    );
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-[var(--color-brand-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[var(--color-text-secondary)]">Loading your student dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">No Profile Found</h2>
        <p className="text-xs text-[var(--color-text-secondary)]">Please complete the student onboarding flow.</p>
        <Button variant="primary" href="/onboarding">Start Onboarding</Button>
      </div>
    );
  }

  const { student, roadmapProgress, skillGapAnalysis, recommendedActions, upcomingEvents } = data;

  return (
    <div className="space-y-8 py-6">
      {/* Top Banner / Welcome Header */}
      <Card variant="raised" className="p-5 sm:p-8 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <Avatar
            src={student.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
            name={student.fullName}
            size="xl"
            online
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5 min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)] tracking-tight break-words">{student.fullName}</h1>
              <Badge variant="primary" size="sm">
                Year {student.currentYear}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {student.branch} • {student.collegeName}
            </p>
            <p className="text-xs text-[var(--color-brand-primary)] font-semibold flex items-center gap-1.5 pt-0.5">
              <Target className="w-3.5 h-3.5" /> Target: {student.targetRole || "Software Engineer"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResumeModal(true)}
            leftIcon={<FileText className="w-4 h-4 text-fuchsia-500" />}
          >
            Scan Resume ATS
          </Button>
          <Button
            variant="gradient"
            size="sm"
            href="/roadmap"
            leftIcon={<Map className="w-4 h-4" />}
          >
            Continue Roadmap
          </Button>
        </div>
      </Card>

      <TodayPlan />

      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: '/profile', label: 'Profile completion', value: `${data.profileCompletion}%`, icon: Target },
          { href: '/analytics', label: 'Development score', value: String(data.developmentScore), icon: Award },
          { href: '/roadmap', label: 'Roadmap progress', value: `${roadmapProgress.progressPercentage}%`, icon: Map },
          { href: '/notifications', label: 'Notifications', value: 'Inbox', icon: Sparkles },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="p-4 h-full hover:border-[var(--primary)] transition-colors">
                <Icon className="w-4 h-4 text-[var(--primary)] mb-2" />
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{item.label}</p>
                <p className="text-lg font-black text-[var(--text-primary)]">{item.value}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Row 1: Development Score Meter + Skill Gap Radar/Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <ScoreMeter
            score={data.developmentScore}
            profileCompletion={data.profileCompletion}
          />
        </div>
        <div className="lg:col-span-8">
          <SkillGapChart data={skillGapAnalysis} />
        </div>
      </div>

      {/* Row 2: Roadmap Progress & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Roadmap Progress Overview */}
        <Card variant="default" className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Year {roadmapProgress.currentYear} Roadmap Milestones</h3>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    {roadmapProgress.completedMilestones} of {roadmapProgress.totalMilestones} Milestones Completed
                  </p>
                </div>
              </div>
              <Link
                href="/roadmap"
                className="text-xs text-[var(--color-brand-primary)] hover:underline font-semibold flex items-center gap-0.5"
              >
                View Full Track <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Progress bar */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                <span className="font-medium">Annual Track Completion</span>
                <span className="font-bold text-[var(--color-text-primary)]">{roadmapProgress.progressPercentage}%</span>
              </div>
              <ProgressBar value={roadmapProgress.progressPercentage} size="md" />
            </div>

            {/* Primary Goal Banner */}
            <div className="p-3.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Current Academic Goal
              </span>
              <p className="text-xs text-[var(--color-text-primary)] font-medium">
                &ldquo;{student.primaryGoal || "Maintain high academic and placement readiness"}&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>Saved Resources: <strong className="text-[var(--color-text-primary)]">{data.savedResourcesCount}</strong></span>
            <span>Active Job Tracks: <strong className="text-emerald-500">{data.applicationsCount}</strong></span>
          </div>
        </Card>

        {/* Recommended Actions */}
        <Card variant="default" className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Recommended Next Steps</h3>
                <p className="text-[11px] text-[var(--color-text-muted)]">Smart tasks prioritized for Year {student.currentYear}</p>
              </div>
            </div>

            <div className="space-y-2.5 my-3">
              {recommendedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] flex items-start gap-2.5 hover:border-[var(--color-border-focus)] transition-colors"
                >
                  <div className="w-4 h-4 rounded-full border border-[var(--color-brand-primary)]/50 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-[var(--color-brand-primary)] font-mono font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-snug">{action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-right">
            <Link href="/placement" className="text-xs font-semibold text-[var(--color-brand-primary)] hover:underline">
              Go to Placement Training →
            </Link>
          </div>
        </Card>
      </div>

      {/* Row 3: Upcoming Campus Events & Quick Coordinator Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Events */}
        <Card variant="default" className="lg:col-span-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Upcoming Campus Events & Hackathons</h3>
                <p className="text-[11px] text-[var(--color-text-muted)]">Approved university competitions & workshops</p>
              </div>
            </div>
            <Link href="/campus-life" className="text-xs text-[var(--color-brand-primary)] hover:underline">
              View All Clubs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] space-y-1.5 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="success" size="sm">
                    {evt.category}
                  </Badge>
                  <span className="text-[11px] text-[var(--color-text-muted)]">{evt.date}</span>
                </div>
                <h4 className="text-xs font-bold text-[var(--color-text-primary)] line-clamp-1">{evt.title}</h4>
                <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                  📍 {evt.location} {evt.clubName ? `• ${evt.clubName}` : ""}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Placement Desk Banner */}
        <Card variant="default" className="lg:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Student Coordinator Desk</h3>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
              Need assistance with on-campus drives, club join requests, or internship approvals?
            </p>
            <div className="p-3.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] text-xs space-y-1">
              <span className="text-[10px] font-bold text-[var(--color-brand-primary)] uppercase tracking-wider block">
                Lead Coordinator Available
              </span>
              <p className="font-bold text-[var(--color-text-primary)]">Sarah Connor</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">Placement Cell • Mon-Fri 2-5 PM</p>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/coordinators" className="w-full">
              <Button variant="secondary" size="sm" className="w-full">
                Submit Coordinator Query
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Resume Analyzer Modal */}
      {showResumeModal && (
        <ResumeAnalyzerModal
          isOpen={showResumeModal}
          onClose={() => setShowResumeModal(false)}
        />
      )}
    </div>
  );
}

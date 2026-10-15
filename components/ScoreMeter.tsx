"use client";

import React from "react";
import { Award, Info, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";

interface ScoreMeterProps {
  score: number;
  profileCompletion: number;
}

export function ScoreMeter({ score, profileCompletion }: ScoreMeterProps) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 80) return { stroke: "#10b981", badgeVariant: "success" as const, badge: "Tier-1 Competitive", textColor: "text-emerald-500" };
    if (val >= 65) return { stroke: "var(--color-brand-primary)", badgeVariant: "primary" as const, badge: "Strong Development", textColor: "text-[var(--color-brand-primary)]" };
    return { stroke: "#f59e0b", badgeVariant: "warning" as const, badge: "Foundational Growth", textColor: "text-amber-500" };
  };

  const status = getScoreColor(score);

  return (
    <Card variant="default" className="p-6 relative overflow-hidden flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Development Score</h3>
            <p className="text-[11px] text-[var(--color-text-muted)]">Holistic campus growth index</p>
          </div>
        </div>
        <Badge variant={status.badgeVariant} size="sm">
          {status.badge}
        </Badge>
      </div>

      {/* Radial Gauge */}
      <div className="flex items-center justify-center my-3 relative">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="var(--color-surface-overlay)"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={status.stroke}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${status.textColor}`}>
            {score}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-mono">
            / 100 PTS
          </span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-[var(--color-border-subtle)]">
        <div className="p-2.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] mb-1.5">
            <span>Profile Completion</span>
            <span className="text-[var(--color-text-primary)] font-semibold">{profileCompletion}%</span>
          </div>
          <ProgressBar value={profileCompletion} size="xs" />
        </div>

        <div className="p-2.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
            <span>Momentum</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              Active
            </span>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] truncate mt-1">Calculated via milestones</p>
        </div>
      </div>

      <div className="mt-3.5 flex items-start gap-2 text-[11px] text-[var(--color-text-secondary)] bg-[var(--color-brand-primary)]/5 p-3 rounded-xl border border-[var(--color-brand-primary)]/15">
        <Info className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
        <span>
          Transparent index derived from academic year milestones, technical project deliverables, and placement preparation.
        </span>
      </div>
    </Card>
  );
}

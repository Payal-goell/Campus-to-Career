"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface SkillGapItem {
  skill: string;
  required: number;
  current: number;
}

interface SkillGapChartProps {
  data: SkillGapItem[];
}

export function SkillGapChart({ data }: SkillGapChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card variant="default" className="p-6 h-80 flex items-center justify-center text-[var(--color-text-muted)]">
        Loading Skill Gap Chart...
      </Card>
    );
  }

  return (
    <Card variant="default" className="p-6 flex flex-col justify-between h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-fuchsia-500/10 text-fuchsia-500">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Skill Gap Analysis</h3>
            <p className="text-[11px] text-[var(--color-text-muted)]">Current Standing vs Target Role Benchmark</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <span className="w-2.5 h-2.5 rounded bg-[var(--color-brand-primary)]" /> Current
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <span className="w-2.5 h-2.5 rounded bg-fuchsia-500" /> Target
          </span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-56 sm:h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
            <XAxis
              dataKey="skill"
              stroke="var(--color-text-muted)"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="var(--color-text-muted)"
              fontSize={11}
              tickLine={false}
              domain={[0, 100]}
              ticks={[25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface-raised)",
                borderColor: "var(--color-border-subtle)",
                borderRadius: "0.75rem",
                fontSize: "12px",
                color: "var(--color-text-primary)",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
              }}
              formatter={(val: number) => [`${val}%`, ""]}
            />
            <Bar
              dataKey="current"
              name="Current Skill"
              fill="var(--color-brand-primary)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="required"
              name="Required for Role"
              fill="#d946ef"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--color-text-secondary)] bg-[var(--color-surface-raised)] p-3 rounded-xl border border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Priority Gap: <strong>System Design</strong> & <strong>Cloud Docker</strong></span>
        </div>
        <Link href="/resources" className="text-[var(--color-brand-primary)] font-semibold hover:underline">
          View recommended resources →
        </Link>
      </div>
    </Card>
  );
}

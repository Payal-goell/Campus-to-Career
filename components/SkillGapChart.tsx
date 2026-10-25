"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { presentSkillGap } from "@/lib/skill-standing";
import type { SkillGapItem } from "@/lib/types";

interface SkillGapChartProps {
  data: SkillGapItem[];
}

function GapTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: SkillGapItem }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="max-w-xs rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs text-[var(--color-text-primary)] shadow-lg">
      <p className="font-bold">{row.skill}</p>
      <p className="mt-1 text-[var(--color-text-secondary)]">
        You {row.current}% · Role bar {row.required}%
      </p>
      {row.basis && <p className="mt-1 leading-snug">{row.basis}</p>}
    </div>
  );
}

export function SkillGapChart({ data }: SkillGapChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const rows = useMemo(() => data.map(presentSkillGap), [data]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const focus = [...rows].sort(
    (a, b) => b.required - b.current - (a.required - a.current)
  )[0];
  const hasOpen = rows.some((row) => !row.measured && row.current === 0);

  if (!isMounted) {
    return (
      <Card variant="default" className="p-6 h-80 flex items-center justify-center text-[var(--color-text-muted)]">
        Loading Skill Gap Chart...
      </Card>
    );
  }

  return (
    <Card variant="default" className="p-6 flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-fuchsia-500/10 text-fuchsia-500">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Skill Gap Analysis</h3>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Your quiz score or certificate sets the bar. Fuchsia is the role target.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <span className="w-2.5 h-2.5 rounded bg-[var(--color-brand-primary)]" /> Checked
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <span className="w-2.5 h-2.5 rounded bg-slate-400" /> {hasOpen ? "Waiting for your check" : "Preview"}
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <span className="w-2.5 h-2.5 rounded bg-fuchsia-500" /> Role bar
          </span>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
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
            <Tooltip content={<GapTooltip />} />
            <Bar dataKey="current" name="Where you are" radius={[4, 4, 0, 0]}>
              {rows.map((row) => (
                <Cell
                  key={row.skill}
                  fill={row.measured ? "var(--color-brand-primary)" : "#94a3b8"}
                />
              ))}
            </Bar>
            <Bar
              dataKey="required"
              name="Role bar"
              fill="#d946ef"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {focus && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[var(--color-text-secondary)] bg-[var(--color-surface-raised)] p-3 rounded-xl border border-[var(--color-border-subtle)]">
          <div className="flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-[var(--color-text-primary)]">{focus.skill}.</strong> {focus.next}
            </span>
          </div>
          <StepLink href={focus.href} />
        </div>
      )}

      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.skill}
            className="rounded-xl border border-[var(--color-border-subtle)] px-3 py-2.5 space-y-1"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-bold text-[var(--color-text-primary)]">{row.skill}</span>
              <span className="text-[11px] font-mono text-[var(--color-text-secondary)] shrink-0">
                {row.measured ? `${row.current}%` : row.current > 0 ? `${row.current}% preview` : "Waiting"} · role {row.required}%
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-primary)]">{row.standing}</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-snug">
              <span className="font-semibold">How this number is set. </span>
              {row.basis}
            </p>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-snug">
              <span className="font-semibold text-[var(--color-text-primary)]">Do this. </span>
              {row.next}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function StepLink({ href }: { href?: string }) {
  if (!href) return null;
  const label = href.startsWith("http") ? "Open this step" : "Open the skill check";
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-[var(--color-brand-primary)] font-semibold hover:underline shrink-0"
      >
        {label} →
      </a>
    );
  }
  return (
    <Link href={href} className="text-[var(--color-brand-primary)] font-semibold hover:underline shrink-0">
      {label} →
    </Link>
  );
}

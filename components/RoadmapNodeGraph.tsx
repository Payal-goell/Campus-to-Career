'use client';

import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  Cpu,
  Layers,
  ArrowDown,
  Info,
} from 'lucide-react';
import { RoadmapMilestoneItem } from '@/lib/types';

interface RoadmapNodeGraphProps {
  milestones: RoadmapMilestoneItem[];
  updatingId: string | null;
  onToggleMilestone: (milestoneId: string, completed: boolean) => void;
  onSelectMilestone: (milestone: RoadmapMilestoneItem) => void;
}

export function RoadmapNodeGraph({
  milestones,
  updatingId,
  onToggleMilestone,
  onSelectMilestone,
}: RoadmapNodeGraphProps) {
  if (milestones.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center text-slate-500">
        No milestones found for this filter criteria.
      </div>
    );
  }

  const difficultyColors: Record<string, string> = {
    Beginner: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    Intermediate: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    Advanced: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20',
  };

  return (
    <div className="relative space-y-6">
      {/* Central Connecting Timeline Line */}
      <div className="hidden md:block absolute left-[31px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-fuchsia-500/20 -z-0" />

      {milestones.map((m, idx) => {
        const isCompleted = m.completed;
        const isUpdating = updatingId === m.id;

        return (
          <div
            key={m.id}
            className="relative flex flex-col md:flex-row items-start gap-4 z-10 group"
          >
            {/* Left Node Indicator (Step circle) */}
            <div className="hidden md:flex flex-col items-center shrink-0">
              <button
                type="button"
                onClick={() => onToggleMilestone(m.id, m.completed)}
                disabled={isUpdating}
                className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-400 shadow-glow'
                    : 'bg-slate-900 border-white/20 text-slate-400 group-hover:border-indigo-400 group-hover:text-white'
                }`}
                title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-bold">0{idx + 1}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Step</span>
                  </div>
                )}
              </button>
            </div>

            {/* Main Interactive Node Card */}
            <div
              className={`flex-1 glass-card rounded-3xl p-6 border transition-all ${
                isCompleted
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-white/10 hover:border-indigo-500/40 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                    {m.category}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                    {m.domain}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                      difficultyColors[m.difficulty] || difficultyColors.Intermediate
                    }`}
                  >
                    {m.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    ~{m.estimatedHours} hrs
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      ✓ Achieved
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-3">
                <h4
                  onClick={() => onSelectMilestone(m)}
                  className={`text-base font-extrabold cursor-pointer hover:text-indigo-300 transition-colors ${
                    isCompleted ? 'text-slate-200 line-through' : 'text-white'
                  }`}
                >
                  {m.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.description}
                </p>
              </div>

              {/* Targeted Skills Tags */}
              {m.skillsTargeted && m.skillsTargeted.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.skillsTargeted.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-white/5"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}

              {/* Node Card Actions */}
              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Mobile direct toggle */}
                <button
                  type="button"
                  onClick={() => onToggleMilestone(m.id, m.completed)}
                  disabled={isUpdating}
                  className="md:hidden flex items-center gap-1.5 text-xs text-indigo-400 hover:text-white"
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                  <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {m.actionItems?.length ? `${m.actionItems.length} Sub-Tasks` : 'Milestone Objective'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectMilestone(m)}
                  className="px-3.5 py-1.5 rounded-xl glass-panel hover:bg-white/10 text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/10"
                >
                  <span>Explore Deliverables & Checklist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

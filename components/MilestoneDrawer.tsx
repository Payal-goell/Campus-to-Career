'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  Award,
  Users,
  CheckSquare,
  Square,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { RoadmapMilestoneItem } from '@/lib/types';

interface MilestoneDrawerProps {
  milestone: RoadmapMilestoneItem | null;
  onClose: () => void;
  onToggleStatus: (milestoneId: string, completed: boolean) => void;
}

export function MilestoneDrawer({
  milestone,
  onClose,
  onToggleStatus,
}: MilestoneDrawerProps) {
  if (!milestone) return null;

  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (item: string) => {
    setCheckedActions((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const difficultyColors: Record<string, string> = {
    Beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Intermediate: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Advanced: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md animate-fadeIn flex justify-end">
      <div className="w-full max-w-xl glass-panel border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-white/5">
                Year 0{milestone.year} • {milestone.category}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                  difficultyColors[milestone.difficulty] || difficultyColors.Intermediate
                }`}
              >
                {milestone.difficulty} Level
              </span>
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                ~{milestone.estimatedHours} hrs
              </span>
            </div>

            <h2 className="text-xl font-black text-white leading-snug">
              {milestone.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {milestone.description}
            </p>
          </div>

          {/* Targeted Competencies */}
          {milestone.skillsTargeted && milestone.skillsTargeted.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Target Skills & Proficiency Boost:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {milestone.skillsTargeted.map((sk) => (
                  <span
                    key={sk}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
                  >
                    + {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Checklist */}
          {milestone.actionItems && milestone.actionItems.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Deliverables & Sub-Task Checklist:
              </span>
              <div className="space-y-2">
                {milestone.actionItems.map((action, idx) => {
                  const isChecked = checkedActions[action] || milestone.completed;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleAction(action)}
                      className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </span>
                      <span className={isChecked ? 'line-through text-slate-400' : ''}>
                        {action}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Curated Resource Quick Links */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Recommended Vetted Learning Material:
            </span>
            <div className="space-y-2">
              <a
                href="https://github.com/donnemartin/system-design-primer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 text-xs flex items-center justify-between transition-colors text-slate-200"
              >
                <div>
                  <span className="font-semibold block text-[11px] text-white">Interactive GitHub / Open Source Repositories</span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Free Open Source</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="https://freecodecamp.org"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 text-xs flex items-center justify-between transition-colors text-slate-200"
              >
                <div>
                  <span className="font-semibold block text-[11px] text-white">Full-Length Step-by-Step Curriculum</span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Free Tutorials</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Toggle Button */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Status:{' '}
            <strong className={milestone.completed ? 'text-emerald-400' : 'text-amber-400'}>
              {milestone.completed ? 'Completed' : 'In Progress'}
            </strong>
          </div>

          <button
            type="button"
            onClick={() => onToggleStatus(milestone.id, milestone.completed)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              milestone.completed
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'glow-btn text-white shadow-glow'
            }`}
          >
            {milestone.completed ? (
              <>
                <Circle className="w-4 h-4" />
                Mark Incomplete
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Mark Milestone Completed
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

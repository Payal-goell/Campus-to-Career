'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { TrendingUp, Target, PieChart as PieIcon, Activity, Sparkles } from 'lucide-react';

interface RoadmapChartsProps {
  analytics: {
    totalMilestones: number;
    completedMilestones: number;
    completionPercentage: number;
    estimatedHoursTotal: number;
    estimatedHoursCompleted: number;
    readinessScore: number;
    domainBreakdown: Array<{ name: string; value: number; color: string }>;
    skillVelocity: Array<{ semester: string; target: number; actual: number }>;
    competencyRadar: Array<{ subject: string; studentScore: number; targetRequirement: number }>;
  };
  studentRole: string;
}

export function RoadmapCharts({ analytics, studentRole }: RoadmapChartsProps) {
  const [activeTab, setActiveTab] = useState<'radar' | 'velocity' | 'distribution'>('radar');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="glass-card rounded-3xl p-6 h-80 flex items-center justify-center text-slate-500">
        Loading interactive charts...
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
      {/* Chart Switcher Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Development Analytics & Forecasting</h3>
            <p className="text-xs text-slate-400">
              Visual competency benchmarking calibrated for <strong className="text-indigo-300">{studentRole}</strong>
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-2xl glass-panel p-1 border border-white/10 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'radar'
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Competency Radar
          </button>
          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'velocity'
                ? 'bg-fuchsia-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Semester Velocity
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'distribution'
                ? 'bg-emerald-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Milestone Mix
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        {activeTab === 'radar' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={analytics.competencyRadar}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
              <Radar
                name="Your Current Mastery"
                dataKey="studentScore"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.45}
              />
              <Radar
                name="Target Role Benchmark"
                dataKey="targetRequirement"
                stroke="#d946ef"
                fill="#d946ef"
                fillOpacity={0.2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'velocity' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.skillVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="velocityActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="velocityTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="semester" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(val: number) => [`${val}% Readiness`, '']}
              />
              <Area
                type="monotone"
                dataKey="target"
                name="Target Pace"
                stroke="#d946ef"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#velocityTarget)"
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Your Progression Pace"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#velocityActual)"
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.domainBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {analytics.domainBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: number) => [`${val} Milestones`, '']}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Roadmap Category Balance:
              </span>
              {analytics.domainBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analytics KPI Footer Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block mb-0.5">Estimated Time Invested</span>
          <span className="font-bold text-white text-sm font-mono">
            {analytics.estimatedHoursCompleted}h / {analytics.estimatedHoursTotal}h
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block mb-0.5">Readiness Forecast</span>
          <span className="font-bold text-emerald-400 text-sm font-mono">
            {analytics.readinessScore}% Indexed
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block mb-0.5">Completed Milestones</span>
          <span className="font-bold text-indigo-400 text-sm font-mono">
            {analytics.completedMilestones} of {analytics.totalMilestones}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
          <span className="text-[10px] text-slate-400 block mb-0.5">Annual Pace Status</span>
          <span className="font-bold text-fuchsia-400 text-sm font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> On Target
          </span>
        </div>
      </div>
    </div>
  );
}

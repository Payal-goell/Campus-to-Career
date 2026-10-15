'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Target,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Globe,
  Cloud,
  Code2,
  Award,
  Zap,
} from 'lucide-react';

interface RoadmapPersonalizerProps {
  currentContext: {
    targetRole: string;
    preferredDomains: string[];
    currentSkills: string[];
    extracurricularPreferences: string[];
    academicYear: number;
  };
  onSimulate: (params: { role: string; domain: string; extracurricular: string }) => void;
  onSavePreferences: (params: {
    targetRole: string;
    preferredDomains: string[];
    extracurricularPreferences: string[];
  }) => Promise<void>;
}

const ROLES = [
  'Full-Stack Software Engineer',
  'AI / Machine Learning Engineer',
  'Cloud & DevOps Engineer',
  'Systems & Low-Level Engineer',
  'Data Scientist / Analytics',
  'Competitive Programmer',
];

const DOMAIN_OPTIONS = [
  { id: 'Full-Stack Web', label: 'Full-Stack Web', icon: Globe },
  { id: 'AI / Machine Learning', label: 'AI & Deep Learning', icon: Cpu },
  { id: 'Cloud Systems', label: 'Cloud & Infrastructure', icon: Cloud },
  { id: 'Core CS', label: 'Algorithms & Systems', icon: Code2 },
  { id: 'Competitive Programming', label: 'Competitive Coding', icon: Award },
];

const EXTRA_OPTIONS = [
  'Hackathons & Contests',
  'Open-Source Projects',
  'Technical Clubs',
  'Research & Papers',
  'Campus Leadership',
];

export function RoadmapPersonalizer({
  currentContext,
  onSimulate,
  onSavePreferences,
}: RoadmapPersonalizerProps) {
  const [selectedRole, setSelectedRole] = useState(currentContext.targetRole);
  const [selectedDomain, setSelectedDomain] = useState(
    currentContext.preferredDomains[0] || 'Full-Stack Web'
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>(
    currentContext.extracurricularPreferences || ['Hackathons & Contests', 'Technical Clubs']
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    onSimulate({
      role,
      domain: selectedDomain,
      extracurricular: selectedExtras[0] || 'Hackathons & Contests',
    });
  };

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    onSimulate({
      role: selectedRole,
      domain,
      extracurricular: selectedExtras[0] || 'Hackathons & Contests',
    });
  };

  const toggleExtra = (extra: string) => {
    let next: string[];
    if (selectedExtras.includes(extra)) {
      next = selectedExtras.filter((e) => e !== extra);
    } else {
      next = [...selectedExtras, extra];
    }
    setSelectedExtras(next);
    onSimulate({
      role: selectedRole,
      domain: selectedDomain,
      extracurricular: next[0] || 'Hackathons & Contests',
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSavePreferences({
        targetRole: selectedRole,
        preferredDomains: [selectedDomain],
        extracurricularPreferences: selectedExtras,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedRole(currentContext.targetRole);
    setSelectedDomain(currentContext.preferredDomains[0] || 'Full-Stack Web');
    setSelectedExtras(currentContext.extracurricularPreferences);
    onSimulate({
      role: currentContext.targetRole,
      domain: currentContext.preferredDomains[0] || 'Full-Stack Web',
      extracurricular: currentContext.extracurricularPreferences[0] || 'Hackathons & Contests',
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
      {/* Header with toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">
                Interactive Track Personalizer & Simulator
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live Dynamic Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Morph your roadmap, milestone targets, and radar charts in real-time based on your evolving interests
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-xl glass-panel border border-white/10"
        >
          {isOpen ? 'Collapse Controls ▲' : 'Customize Track ▼'}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Your roadmap customization has been saved permanently to your student profile!</span>
        </div>
      )}

      {/* Control Body (Collapsible or open) */}
      {isOpen && (
        <div className="pt-4 border-t border-white/10 space-y-5 animate-fadeIn">
          {/* Target Role Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Target className="w-4 h-4 text-indigo-400" />
              1. Simulated Target Career Role:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`p-2.5 rounded-2xl text-left text-xs font-semibold border transition-all ${
                    selectedRole === role
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-glow'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <span className="block truncate">{role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Domain Specialization Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Globe className="w-4 h-4 text-fuchsia-400" />
              2. Primary Technical Domain Focus:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {DOMAIN_OPTIONS.map((dom) => {
                const Icon = dom.icon;
                const isSelected = selectedDomain.includes(dom.id);
                return (
                  <button
                    key={dom.id}
                    type="button"
                    onClick={() => handleDomainChange(dom.id)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 border transition-all ${
                      isSelected
                        ? 'bg-fuchsia-600/30 border-fuchsia-500 text-white shadow-glow'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-fuchsia-400" />
                    <span className="text-[11px] font-semibold">{dom.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extracurricular Preferences */}
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              3. Extracurricular & Leadership Interests (Multi-Select):
            </label>
            <div className="flex flex-wrap gap-2">
              {EXTRA_OPTIONS.map((opt) => {
                const isSelected = selectedExtras.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleExtra(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Saved Profile
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="glow-btn px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-glow"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Persisting...' : 'Save As My Active Track'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

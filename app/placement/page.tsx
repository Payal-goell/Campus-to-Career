"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  FileText,
  Award,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Cpu,
  MessageSquare,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ResumeAnalyzerModal } from "@/components/ResumeAnalyzerModal";
import { ApplicationItem, PlacementModuleCategory } from "@/lib/types";

export default function PlacementPage() {
  const [categories, setCategories] = useState<PlacementModuleCategory[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [modulesRes, appsRes] = await Promise.all([
        fetch("/api/v1/placement-training/modules"),
        fetch("/api/v1/placement-training/applications"),
      ]);

      if (modulesRes.ok) {
        const json = await modulesRes.json();
        if (json.success) setCategories(json.categories || []);
      }

      if (appsRes.ok) {
        const json = await appsRes.json();
        if (json.success) setApplications(json.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (name: string) => {
    if (name.includes("Technical")) return Cpu;
    if (name.includes("Soft")) return MessageSquare;
    return Calculator;
  };

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <Card variant="raised" className="p-6 sm:p-8 border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="accent" size="sm">
              Placement Cell & Career Readiness
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            Placement Training & Recruitment Hub
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Prepare for top-tier software engineering screens, corporate behavioral interviews, aptitude filters, and track every stage of your job applications.
          </p>
        </div>

        {/* ATS Scanner Launch Button */}
        <Button
          variant="gradient"
          size="lg"
          onClick={() => setShowResumeModal(true)}
          className="shrink-0 shadow-lg shadow-[var(--color-brand-primary)]/20"
        >
          <FileText className="w-4 h-4 mr-2" />
          Launch AI Resume ATS Scanner
        </Button>
      </Card>

      {/* Training Categories Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Core Interview Curriculum</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">Master the three vital pillars of campus recruitment drives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.category);
            return (
              <Card
                key={cat.category}
                variant="interactive"
                animate
                className="p-6 border border-[var(--color-border-subtle)] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-[var(--color-text-primary)] text-base mb-1">{cat.category}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">{cat.description}</p>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
                      Target Subject Topics:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                      {cat.topics.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-muted)] font-mono">Curated Practice Module</span>
                  <Button size="sm" variant="gradient" href="/training" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Start prep
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Application Tracker Kanban Board */}
      <div className="pt-4">
        {loading ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">Loading recruitment tracker...</div>
        ) : (
          <KanbanBoard
            initialApplications={applications}
            onRefresh={fetchData}
          />
        )}
      </div>

      {/* Resume Analyzer Modal */}
      <ResumeAnalyzerModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </div>
  );
}

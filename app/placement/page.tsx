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
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CoverImage } from "@/components/ui/CoverImage";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ResumeAnalyzerModal } from "@/components/ResumeAnalyzerModal";
import { ApplicationItem, PlacementModuleCategory } from "@/lib/types";
import {
  SISTEC_CERT_PARTNERS,
  SISTEC_COMPANIES,
  SISTEC_DREAM_OFFER_GALLERY,
  SISTEC_PLACEMENT_STATS,
  SISTEC_TRAINING_PROGRAMS,
} from "@/data/sistec-placement";

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
            Training, the application board, and the resume scan are for any RGPV college. The figures below are one affiliated campus (SISTec): {SISTEC_PLACEMENT_STATS.jobOffersBatch2025} offers,
            {' '}{SISTEC_PLACEMENT_STATS.averagePackageLpa} average, {SISTEC_PLACEMENT_STATS.highestPackage}. Use your own T&P bulletin for eligibility.
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Job offers (batch)', value: SISTEC_PLACEMENT_STATS.jobOffersBatch2025 },
          { label: 'Average package', value: SISTEC_PLACEMENT_STATS.averagePackageLpa },
          { label: 'Highest package', value: SISTEC_PLACEMENT_STATS.highestPackage },
          { label: 'Placement rate', value: SISTEC_PLACEMENT_STATS.campusPlacementRate },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-bold">{stat.label}</p>
            <p className="text-sm sm:text-base font-black text-emerald-600 mt-1.5 leading-snug">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">SISTec campus recruiters</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Companies and CoE partners named on sistec.ac.in Training & Placement / CSE pages
            </p>
          </div>
          <Button size="sm" variant="outline" href="/explore">
            Explore by branch
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {SISTEC_COMPANIES.filter((c) => c.category !== 'CoE partner').slice(0, 9).map((company) => (
            <Card key={company.name} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm leading-snug">{company.name}</h3>
                <Badge variant="outline" size="sm">
                  {company.category}
                </Badge>
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-2">{company.note}</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Roles: {company.roles.slice(0, 2).join(' · ')}
              </p>
            </Card>
          ))}
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)]">
          Full list with CoE partners (Netlink, Zarthi, Gaia, Bosch, UltraTech, Eicher, Renault Nissan) is on{' '}
          <Link href="/explore" className="text-[var(--color-brand-primary)] font-semibold hover:underline">
            Explore → Companies
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">T&P programs on campus</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">Pod AI, Headstart, Sagar Manthan, Glory, and cert partners from the official T&P page</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {SISTEC_TRAINING_PROGRAMS.slice(0, 4).map((program) => (
            <Card key={program.id} className="p-4 space-y-2 flex flex-col h-full">
              <Badge variant="primary" size="sm" className="w-fit">
                {program.kind}
              </Badge>
              <h3 className="font-bold text-sm leading-snug text-[var(--color-text-primary)]">
                {program.name}
              </h3>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed flex-1">
                {program.blurb}
              </p>
              <Button size="sm" variant="outline" href={program.url} target="_blank" className="mt-1 w-fit">
                Open on sistec.ac.in
              </Button>
            </Card>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {SISTEC_CERT_PARTNERS.map((partner) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={partner.name}
              src={partner.logo}
              alt={partner.name}
              title={`${partner.name}: ${partner.focus}`}
              className="h-10 w-auto max-w-[88px] object-contain rounded-lg bg-white border border-[var(--color-border-subtle)] px-2 py-1"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Dream offer gallery</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">Official dream-offer photos from the SISTec Training & Placement page</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-0 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)]">
          {SISTEC_DREAM_OFFER_GALLERY.map((item) => (
            <CoverImage key={item.id} src={item.image} alt="" className="aspect-square w-full" />
          ))}
        </div>
      </div>

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

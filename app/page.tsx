"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  GraduationCap,
  Sparkles,
  Map,
  BookOpen,
  Users,
  Briefcase,
  Shield,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  ChevronRight,
  Target,
  Layers,
  Code2,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { AnimatedCount } from "@/components/ui/Progress";

export default function HomePage() {
  const journeyYears = [
    {
      year: "Year 1",
      title: "Explore & Build Foundations",
      description: "Discover software engineering disciplines, learn coding fundamentals in C++/Python, and join technical campus clubs.",
      badge: "Curiosity & Basics",
      icon: Compass,
      color: "from-blue-500 to-cyan-500",
    },
    {
      year: "Year 2",
      title: "Build & Experiment",
      description: "Master data structures & algorithms, complete full-stack web applications, join 24h hackathons, and earn cloud certifications.",
      badge: "Core Competence",
      icon: Layers,
      color: "from-indigo-500 to-purple-500",
    },
    {
      year: "Year 3",
      title: "Specialize & Prepare",
      description: "Study system design, optimize technical resumes with ATS keywords, practice quantitative aptitude, and secure summer internships.",
      badge: "Industry Alignment",
      icon: Sparkles,
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      year: "Year 4",
      title: "Placement Readiness",
      description: "Simulate mock technical interviews, track active company recruitment pipelines, and negotiate full-time placement offers.",
      badge: "Career Transition",
      icon: Briefcase,
      color: "from-fuchsia-500 to-rose-500",
    },
  ];

  const features = [
    {
      title: "Year-Wise Dynamic Roadmaps",
      desc: "Milestones uniquely tailored to your academic year and target job roles with real-time progress syncing.",
      icon: Map,
      link: "/roadmap",
      accent: "var(--color-brand-primary)",
    },
    {
      title: "Skill Gap Radar Analysis",
      desc: "Compare your verified proficiencies against Tier-1 tech company requirements before application season.",
      icon: TrendingUp,
      link: "/skills",
      accent: "var(--color-accent)",
    },
    {
      title: "Centralized Resource Manager",
      desc: "Filtered repository of vetted courses, YouTube playlists, docs, and books with clear Free vs Paid labels.",
      icon: BookOpen,
      link: "/resources",
      accent: "var(--color-brand-secondary)",
    },
    {
      title: "Campus Life & Club Recaps",
      desc: "Discover active college committees, past hackathon recaps, and connect directly with lead student coordinators.",
      icon: Users,
      link: "/campus-life",
      accent: "var(--color-success)",
    },
    {
      title: "Placement & ATS Analyzer",
      desc: "Simulate mock aptitude tests, analyze your resume ATS match score, and manage applications in a visual Kanban board.",
      icon: Award,
      link: "/placement",
      accent: "var(--color-warning)",
    },
    {
      title: "Verified Coordinator Desk",
      desc: "Direct communication directory to reach designated student and faculty placement coordinators with ticket tracking.",
      icon: Shield,
      link: "/coordinators",
      accent: "var(--color-info)",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      <section className="relative text-center pt-4 sm:pt-8 pb-8 sm:pb-12 space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/10 text-xs font-semibold text-[var(--color-brand-primary)] shadow-sm max-w-full">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="text-left">The Unified Student Development & Placement Operating System</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-text-primary)] leading-[1.12] text-balance">
          From Campus Ambition to <br className="hidden sm:block" />
          <span className="gradient-text">
            Dream Career Trajectory.
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed px-1">
          No more fragmented WhatsApp groups or disjointed websites. Campus to Career consolidates academic roadmaps, vetted learning resources, club recaps, and placement interview tracking into one elegant hub.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
          <Button variant="gradient" size="lg" href="/register" className="w-full sm:w-auto">
            Get started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="secondary" size="lg" href="/explore" className="w-full sm:w-auto">
            Explore (public)
            <ChevronRight className="w-4 h-4 ml-1 opacity-70" />
          </Button>
          <Button variant="outline" size="lg" href="/login" className="w-full sm:w-auto">
            Login / Sign up
          </Button>
        </div>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 text-left">
          <Card variant="stat" className="p-4">
            <span className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] block">
              <AnimatedCount value={1250} suffix="+" />
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">Active Students</span>
          </Card>
          <Card variant="stat" className="p-4">
            <span className="text-2xl sm:text-3xl font-black text-emerald-500 block">
              <AnimatedCount value={76.4} decimals={1} suffix="%" />
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">Avg Development Score</span>
          </Card>
          <Card variant="stat" className="p-4">
            <span className="text-2xl sm:text-3xl font-black text-[var(--color-brand-primary)] block">
              100%
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">Free / Paid Tag Clarity</span>
          </Card>
          <Card variant="stat" className="p-4">
            <span className="text-2xl sm:text-3xl font-black text-purple-500 block">
              <AnimatedCount value={71.1} decimals={1} suffix="%" />
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">Placement Offer Rate</span>
          </Card>
        </div>
      </section>

      {/* 4-Year Journey Showcase */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">
            A Structured 4-Year Growth Arc
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
            Tailored Milestones For Every Stage
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Progress through an adaptable roadmap that aligns foundational curiosity with final job offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {journeyYears.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.year}
                variant="interactive"
                animate
                className="flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-surface-overlay)] text-[var(--color-brand-primary)] font-mono border border-[var(--color-border-subtle)]">
                      {item.year}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                      {item.badge}
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} p-3 flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-[var(--color-text-primary)] text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs font-medium text-[var(--color-brand-primary)]">
                  <Link href="/roadmap" className="flex items-center gap-1.5 hover:underline">
                    View Roadmap Track <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-secondary)]">
            Core Modules
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
            Everything A College Student Needs
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Built from scratch to resolve confusion and eliminate blind spots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link key={feat.title} href={feat.link} className="block group">
                <Card variant="interactive" animate className="h-full flex flex-col justify-between">
                  <div>
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: "var(--color-surface-overlay)",
                        color: feat.accent,
                        border: "1px solid var(--color-border-subtle)",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-[var(--color-border-subtle)] flex items-center text-xs font-semibold text-[var(--color-brand-primary)]">
                    Explore module <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Transparent Development Score Explainer */}
      <section className="rounded-3xl p-5 sm:p-12 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] relative overflow-hidden shadow-lg">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Honest & Transparent Progress Metrics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
            What is the Development Score?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            The platform never makes empty promises or guarantees placements. Instead, our transparent Development Score aggregates your verified progress across:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)]" />
              Completed academic-year roadmap milestones
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-secondary)]" />
              Hands-on production projects & live demos
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              Verified industry certifications & credentials
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Extracurricular leadership & hackathon participation
            </li>
          </ul>
          <div className="pt-4">
            <Button variant="primary" href="/dashboard" className="w-full sm:w-auto">
                Check Your Baseline Score Now
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

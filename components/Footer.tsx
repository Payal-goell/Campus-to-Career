import React from "react";
import Link from "next/link";
import { GraduationCap, Github, Linkedin, Mail, Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 backdrop-blur-xl mt-24 pt-16 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[var(--color-border-subtle)]">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] p-2 flex items-center justify-center shadow-md shadow-[var(--color-brand-primary)]/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base bg-gradient-to-r from-[var(--color-brand-primary)] via-[var(--color-brand-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                Campus to Career
              </span>
            </Link>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Empowering students with structured roadmaps, vetted learning resources, verified campus activities, and placement tracking from Day 1 to Graduation.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-brand-primary)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Placement & Skill Acceleration Suite</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-4">
              Core Modules
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--color-text-secondary)]">
              <li>
                <Link href="/dashboard" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Year-Wise Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Explore (public)
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Student Profile
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Skills & gap
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Centralized Resources
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Design System Spec
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus & Placement */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-4">
              Campus & Career
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--color-text-secondary)]">
              <li>
                <Link href="/campus-life" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Clubs, Committees & Recaps
                </Link>
              </li>
              <li>
                <Link href="/placement" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Placement Training & Kanban
                </Link>
              </li>
              <li>
                <Link href="/coordinators" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  Coordinator Contact Desk
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[var(--color-brand-primary)] transition-colors">
                  College Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Quick Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-4">
              College Support
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-relaxed">
              Questions regarding campus placement drives or roadmap milestones? Connect directly with your coordinator desk.
            </p>
            <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] flex items-center justify-center hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] flex items-center justify-center hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@campustocareer.edu"
                aria-label="Email Support"
                className="w-8 h-8 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] flex items-center justify-center hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-text-muted)] gap-3">
          <p>© {new Date().getFullYear()} Campus to Career. Built for university academic and career excellence.</p>
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for ambitious students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

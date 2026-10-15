'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { GeneratedRoadmap } from '@/lib/roadmap/types';
import { fadeUp } from '@/lib/motion';

export function RevealOverlay({
  roadmap,
  onStart,
}: {
  roadmap: GeneratedRoadmap;
  onStart: () => void;
}) {
  const thisMonth = roadmap.nodes.filter(
    (n) => n.year === roadmap.profile.currentYear && (n.period === 'M1-2' || n.period === 'M3-4') && n.status !== 'locked'
  ).length;
  const years = new Set(roadmap.nodes.map((n) => n.year)).size;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--overlay)] p-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-lg w-full rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-xl)] p-8 text-center space-y-5"
        role="dialog"
        aria-labelledby="reveal-title"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Your roadmap is ready</p>
        <h2 id="reveal-title" className="font-display text-2xl font-bold text-[var(--text-primary)]">
          {roadmap.nodes.length} milestones across {years} years
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          starting with {thisMonth} this season · Year {roadmap.profile.currentYear} · {roadmap.profile.targetRole}
        </p>
        <svg viewBox="0 0 320 64" className="w-full h-16" aria-hidden>
          <defs>
            <linearGradient id="reveal-grad" x1="0" x2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <path
            d="M 8 40 Q 80 8 160 32 T 312 24"
            fill="none"
            stroke="url(#reveal-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength={1}
            className="motion-safe:[stroke-dasharray:1] motion-safe:animate-[pathDraw_1.2s_ease_forwards] motion-reduce:[stroke-dasharray:1]"
            style={{ strokeDashoffset: 0 }}
          />
        </svg>
        <Button variant="gradient" size="lg" onClick={onStart}>
          Start Year {roadmap.profile.currentYear}
        </Button>
      </motion.div>
    </div>
  );
}

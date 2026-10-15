'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { fadeUp } from '@/lib/motion';

/* ─── Empty State ─────────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { icon: 'w-10 h-10', wrapper: 'py-8', title: 'text-base', desc: 'text-xs' },
  md: { icon: 'w-14 h-14', wrapper: 'py-12', title: 'text-lg',  desc: 'text-sm' },
  lg: { icon: 'w-20 h-20', wrapper: 'py-16', title: 'text-xl',  desc: 'text-sm' },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className,
}: EmptyStateProps) {
  const sz = sizeMap[size];

  return (
    <AnimatePresence>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className={cn('flex flex-col items-center justify-center text-center', sz.wrapper, className)}
      >
        {/* Illustration container */}
        <div className="relative mb-5">
          <div className={cn(
            'rounded-2xl bg-[var(--surface-inset)] border border-[var(--border)] flex items-center justify-center',
            'text-[var(--text-muted)]',
            sz.icon
          )}>
            {icon ?? <GraduationCap className="w-1/2 h-1/2" />}
          </div>
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-2xl bg-[var(--primary-subtle)] -z-10 scale-110 blur-sm opacity-50" />
        </div>

        <h3 className={cn('font-display font-bold text-[var(--text-primary)] mb-2', sz.title)}>
          {title}
        </h3>
        {description && (
          <p className={cn('text-[var(--text-muted)] max-w-xs leading-relaxed mb-5', sz.desc)}>
            {description}
          </p>
        )}

        {(action || secondaryAction) && (
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {action && (
              action.href ? (
                <a
                  href={action.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-[var(--glow-primary)] hover:-translate-y-0.5 transition-transform"
                >
                  {action.label}
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <button
                  onClick={action.onClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-[var(--glow-primary)] hover:-translate-y-0.5 transition-transform"
                >
                  {action.label}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--surface-inset)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Search Empty State ─────────────────────────────────────── */
export function SearchEmptyState({ query, onClear }: { query: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="w-1/2 h-1/2" />}
      title={`No results for "${query}"`}
      description="Try adjusting your search or filters to find what you're looking for."
      action={onClear ? { label: 'Clear search', onClick: onClear } : undefined}
      size="md"
    />
  );
}

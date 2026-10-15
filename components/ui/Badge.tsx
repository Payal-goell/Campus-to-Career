'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/* ─── Variants ────────────────────────────────────────────────── */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-semibold whitespace-nowrap rounded-full border transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-[var(--surface-raised)] text-[var(--text-secondary)] border-[var(--border)]',
        primary:     'bg-[var(--primary-subtle)] text-[var(--primary)] border-[var(--primary-border)]',
        accent:      'bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-border)]',
        success:     'bg-[var(--success-subtle)] text-[var(--success)] border-[var(--success-border)]',
        warning:     'bg-[var(--warning-subtle)] text-[var(--warning)] border-[var(--warning-border)]',
        danger:      'bg-[var(--danger-subtle)] text-[var(--danger)] border-[var(--danger-border)]',
        info:        'bg-[var(--info-subtle)] text-[var(--info)] border-[var(--info-border)]',
        gradient:    'gradient-brand text-white border-transparent',
        free:        'bg-[var(--success-subtle)] text-[var(--success)] border-[var(--success-border)]',
        paid:        'bg-[var(--warning-subtle)] text-[var(--warning)] border-[var(--warning-border)]',
        outline:     'bg-transparent text-[var(--text-primary)] border-[var(--border)]',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/* ─── Props ───────────────────────────────────────────────────── */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

/* ─── Component ───────────────────────────────────────────────── */
export function Badge({
  className,
  variant,
  size,
  dot,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor ?? 'currentColor' }}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

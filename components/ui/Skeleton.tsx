'use client';

import React from 'react';
import { cn } from '@/lib/cn';

/* ─── Skeleton ────────────────────────────────────────────────── */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Skeleton({
  className,
  width,
  height,
  rounded = 'lg',
  style,
  ...props
}: SkeletonProps) {
  const roundedMap = {
    sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
    xl: 'rounded-xl', '2xl': 'rounded-2xl', full: 'rounded-full',
  };

  return (
    <div
      className={cn('skeleton', roundedMap[rounded], className)}
      style={{ width, height, ...style }}
      aria-hidden
      role="presentation"
      {...props}
    />
  );
}

/* ─── Skeleton presets ────────────────────────────────────────── */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? '65%' : '100%'}
          rounded="md"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} rounded="xl" />
        <div className="flex-1 space-y-2">
          <Skeleton height={14} width="60%" rounded="md" />
          <Skeleton height={12} width="40%" rounded="md" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex gap-2">
        <Skeleton height={30} width={80} rounded="xl" />
        <Skeleton height={30} width={60} rounded="xl" />
      </div>
    </div>
  );
}

export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn('bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5', className)}>
      <Skeleton height={12} width="50%" rounded="md" className="mb-3" />
      <Skeleton height={32} width="70%" rounded="lg" className="mb-2" />
      <Skeleton height={10} width="40%" rounded="md" />
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return <Skeleton width={size} height={size} rounded="full" className={className} />;
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="bg-[var(--surface-inset)] border-b border-[var(--border)] p-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height={12} rounded="md" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="border-b border-[var(--border)] last:border-0 p-4 grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} height={12} width={`${70 + Math.random() * 30}%`} rounded="md" />
          ))}
        </div>
      ))}
    </div>
  );
}

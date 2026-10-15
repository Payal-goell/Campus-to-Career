'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { motion, useInView } from 'framer-motion';

/* ─── Progress Bar ────────────────────────────────────────────── */
interface ProgressBarProps {
  value: number;          // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  className?: string;
}

const colorMap = {
  primary: 'var(--gradient-brand)',
  accent:  'linear-gradient(135deg, var(--accent), var(--primary))',
  success: 'linear-gradient(135deg, #10b981, #34d399)',
  warning: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  danger:  'linear-gradient(135deg, #f43f5e, #fb7185)',
};

const sizeMap = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'primary',
  animated = true,
  className,
}: ProgressBarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)} role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-label={label}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>}
          {showValue && <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{Math.round(pct)}%</span>}
        </div>
      )}
      <div ref={ref} className={cn('w-full bg-[var(--surface-inset)] rounded-full overflow-hidden', sizeMap[size])}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: colorMap[color] }}
          initial={{ width: 0 }}
          animate={inView && animated ? { width: `${pct}%` } : { width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1], delay: 0.1 }}
        />
      </div>
    </div>
  );
}

/* ─── Progress Ring ───────────────────────────────────────────── */
interface ProgressRingProps {
  value: number;          // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showValue?: boolean;
  label?: string;
  children?: React.ReactNode;
  animated?: boolean;
  className?: string;
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  color = 'var(--primary)',
  trackColor = 'var(--surface-inset)',
  showValue = true,
  label,
  children,
  animated = true,
  className,
}: ProgressRingProps) {
  const ref = React.useRef<SVGCircleElement>(null);
  const inView = useInView({ current: ref.current ? ref.current.closest('svg') : null } as React.RefObject<Element>, { once: true });
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          ref={ref}
          cx={size / 2} cy={size / 2} r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={animated ? { strokeDashoffset: offset } : { strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.2, 0, 0, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ?? (
          showValue && (
            <span className="text-sm font-bold font-mono text-[var(--text-primary)]">
              {Math.round(value)}%
            </span>
          )
        )}
      </div>
      {label && (
        <span className="sr-only">{label}: {value}%</span>
      )}
    </div>
  );
}

/* ─── Animated Count ─────────────────────────────────────────── */
interface AnimatedCountProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCount({
  value,
  duration: dur = 1.5,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCountProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const increment = value / steps;
    const interval = (dur * 1000) / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [inView, value, dur]);

  return (
    <span ref={ref} className={cn('tabular', className)}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}

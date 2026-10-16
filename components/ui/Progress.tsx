import React from 'react';
import { cn } from '@/lib/cn';

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
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)} role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-label={label}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>}
          {showValue && <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-[var(--surface-inset)] rounded-full overflow-hidden', sizeMap[size])}>
        <div
          className={cn('h-full rounded-full', animated && 'transition-[width] duration-500 ease-out')}
          style={{ background: colorMap[color], width: `${pct}%` }}
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
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={animated ? 'transition-[stroke-dashoffset] duration-500 ease-out' : undefined}
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
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCountProps) {
  return (
    <span className={cn('tabular', className)}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}

'use client';

import { cn } from '@/lib/cn';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { faviconColorsFor } from '@/lib/favicon-mark';

/** Matching dual-C pathway mark used in the live favicon. */
export function BrandMark({ className, size = 36 }: { className?: string; size?: number }) {
  const { palette, resolvedTheme } = useTheme();
  const colors = faviconColorsFor(palette, resolvedTheme);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn('shrink-0 rounded-[22%] shadow-[var(--glow-primary)] transition-transform duration-150 group-hover:scale-105', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="ctc-ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.inkTop} />
          <stop offset="100%" stopColor={colors.inkBottom} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#ctc-ink)" />
      <path
        d="M26 16a16 16 0 1 0 0 32"
        fill="none"
        stroke={colors.mint}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M38 16a16 16 0 1 1 0 32"
        fill="none"
        stroke={colors.amber}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M16 46 Q32 34 46 18"
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="origin-center animate-pulse"
      />
      <path d="M46 18 L40 20 L44 26 Z" fill={colors.amber} />
    </svg>
  );
}

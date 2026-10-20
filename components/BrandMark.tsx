import { cn } from '@/lib/cn';
import { FAVICON_THEME } from '@/lib/favicon-mark';

/** Static dual-C mark — same colors as the favicon; does not follow theme. */
export function BrandMark({ className, size = 36 }: { className?: string; size?: number }) {
  const { inkTop, inkBottom, mint, amber } = FAVICON_THEME;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn(
        'shrink-0 rounded-[22%] shadow-[var(--glow-primary)] transition-transform duration-150 group-hover:scale-105',
        className
      )}
      aria-hidden
    >
      <defs>
        <linearGradient id="ctc-brand-ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={inkTop} />
          <stop offset="100%" stopColor={inkBottom} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#ctc-brand-ink)" />
      <path
        d="M26 16a16 16 0 1 0 0 32"
        fill="none"
        stroke={mint}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M38 16a16 16 0 1 1 0 32"
        fill="none"
        stroke={amber}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M16 46 Q32 34 46 18"
        fill="none"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M46 18 L40 20 L44 26 Z" fill={amber} />
    </svg>
  );
}

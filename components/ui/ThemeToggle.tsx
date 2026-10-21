'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { ThemePreference } from '@/lib/theme/types';

const themeOrder: ThemePreference[] = ['system', 'light', 'dark'];

const icons: Record<ThemePreference, React.ReactNode> = {
  light:  <Sun  className="w-4 h-4" aria-hidden />,
  dark:   <Moon className="w-4 h-4" aria-hidden />,
  system: <Monitor className="w-4 h-4" aria-hidden />,
};

const labels: Record<ThemePreference, string> = {
  light:  'Light mode',
  dark:   'Dark mode',
  system: 'System theme',
};

interface ThemeToggleProps {
  variant?: 'icon' | 'segmented';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { preference, setTheme } = useTheme();

  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'flex items-center gap-0.5 p-1 rounded-xl',
          'bg-inset border border-border',
          className
        )}
        role="group"
        aria-label="Theme selector"
      >
        {themeOrder.map((t) => (
          <button
            key={t}
            onClick={(e) => {
              window.dispatchEvent(new Event('ctc-close-demo'));
              setTheme(t, e);
            }}
            aria-label={labels[t]}
            aria-pressed={preference === t}
            className={cn(
              'relative w-8 h-7 rounded-lg flex items-center justify-center',
              'transition-colors duration-[150ms] ease-standard',
              'focus-visible:outline-2 focus-visible:outline-ring',
              preference === t
                ? 'text-primary bg-surface shadow-sm'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            <span className="relative z-10">{icons[t]}</span>
          </button>
        ))}
      </div>
    );
  }

  /* Default: 3-way cycle icon button with View Transition */
  const currentIdx = themeOrder.indexOf(preference);
  const next = themeOrder[(currentIdx + 1) % themeOrder.length];

  return (
    <button
      onClick={(e) => {
        window.dispatchEvent(new Event('ctc-close-demo'));
        setTheme(next, e);
      }}
      aria-label={`Switch to ${labels[next]}`}
      title={`Current: ${labels[preference]}. Click to switch to ${labels[next]}`}
      className={cn(
        'relative w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center',
        'bg-inset border border-border',
        'text-text-muted hover:text-text-primary',
        'hover:bg-raised hover:border-border-strong',
        'transition-colors duration-[150ms] ease-standard',
        'focus-visible:outline-2 focus-visible:outline-ring',
        'active:scale-95 touch-manipulation',
        className
      )}
    >
      {icons[preference]}
    </button>
  );
}

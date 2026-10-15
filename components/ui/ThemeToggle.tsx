'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            onClick={(e) => setTheme(t, e)}
            aria-label={labels[t]}
            aria-pressed={preference === t}
            className={cn(
              'relative w-8 h-7 rounded-lg flex items-center justify-center',
              'transition-colors duration-[150ms] ease-standard',
              'focus-visible:outline-2 focus-visible:outline-ring',
              preference === t
                ? 'text-primary'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            {preference === t && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 bg-surface rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
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
    <motion.button
      onClick={(e) => setTheme(next, e)}
      aria-label={`Switch to ${labels[next]}`}
      title={`Current: ${labels[preference]}. Click to switch to ${labels[next]}`}
      className={cn(
        'relative w-9 h-9 rounded-xl flex items-center justify-center',
        'bg-inset border border-border',
        'text-text-muted hover:text-text-primary',
        'hover:bg-raised hover:border-border-strong',
        'transition-colors duration-[150ms] ease-standard',
        'focus-visible:outline-2 focus-visible:outline-ring',
        className
      )}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={preference}
          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0,   opacity: 1, scale: 1   }}
          exit={{    rotate: 30,  opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
          className="absolute"
        >
          {icons[preference]}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
